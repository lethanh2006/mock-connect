import MyDatePicker from '@/components/MyDatePicker';
import UploadFile from '@/components/Upload/UploadFile';
import SelectNhanSuDebounce from '@/pages/ToChucNhanSu/NhanSu/Select';
import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import { EApprovalStatus, EparticipantRole, EParticipantScope } from '@/services/CCT/constant';
import { handleSingleFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Divider, Form, Image, Input, message, Radio, Row } from 'antd';
import dayjs from 'dayjs';
import { uniqBy } from 'lodash';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import SelectActivitiesManagement from '../../DanhMuc/Activities/Select';
import SelectActivitiesTypeDomain from '../../DanhMuc/CCD/Select';
import SelectLevelsManagement from '../../DanhMuc/Levels/Select';
import SelectRolesManagement from '../../DanhMuc/Roles/Select';
import CardNoteActivity from './CardNote';
import FormCompetencyEvidence from './FormCompetencyEvidence';

const uploadFilesOfCompetency = async (files: any[] = []) => {
	if (!files.length) return [];
	const urls = await Promise.all(files?.map((f) => handleSingleFile(f).catch(() => null)));
	return urls.filter(Boolean) as string[];
};

const hasAtLeastOneEvidenceFile = (evidenceFile: any[] = []) => evidenceFile.some((i) => i?.file?.length);

const FormPerstionActivityOutCome = (props: any) => {
	const { getData } = props;
	const intl = useIntl();
	const [form] = Form.useForm();

	const { record, setVisibleForm, edit, isView, postModel, putModel, formSubmiting, visibleForm } =
		useModel('cct.activityoutcome');

	const { danhSach: dsLevels } = useModel('cct.levels');
	const { danhSach: dsRoles } = useModel('cct.roles');

	const startDate: Date = Form.useWatch('startDate', form);
	const rolesId: string = Form.useWatch('rolesId', form);
	const levelsId: string = Form.useWatch('levelsId', form);
	const activitiesTypeDomainId: string = Form.useWatch('activitiesTypeDomainId', form);
	const checkbox: boolean = Form.useWatch('checkbox', form);
	const competencyList: string[] = Form.useWatch('competencyList', form);
	const onUni: boolean = Form.useWatch('onUni', form);

	const autoLevel = dsLevels?.find((i) => i?._id === levelsId)?.autoApproval;
	const autoRole = dsRoles?.find((i) => i?._id === rolesId)?.autoApproval;

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);

		if (record?._id) {
			form.setFieldsValue({
				...record,
				activitiesTypeDomainId: record?.activitiesType?.activitiesTypeDomainId,
				competencyList: record?.competencyList?.map((item) => item?.competencyId),
				onUni: record?.supervisorSsoId ? true : false,
			});
		}

		if (!record?._id) {
			form.setFieldsValue({
				participantScope: EParticipantScope.UNIVERSITY,
				participantRole: EparticipantRole.ALL,
				cct: true,
				allowPostEventResultsUpdate: false,
				onCampus: true,
				checkbox: false,
				listAchievedCompetencies: null,
				onUni: true,
			});
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: ActivityOutCome.IRecord) => {
		const evidenceFile = await Promise.all(
			(values.evidenceFile || []).map(async (item: any) => ({
				name: item.name,
				file: await uploadFilesOfCompetency(item?.file?.fileList),
			})),
		);

		if (autoLevel && autoRole && !hasAtLeastOneEvidenceFile(evidenceFile)) {
			message.warning('You must upload at least one evidence file for auto approval.');
			return;
		}

		values.evidenceFile = evidenceFile;

		const listAchievedCompetencies: any = [];

		values.listAchievedCompetencies?.map((item: any) =>
			item?.competencieId?.forEach((element: any) => {
				listAchievedCompetencies.push({
					competencieId: element,
					attributesId: item?.attributesId,
				});
			}),
		);

		values.listAchievedCompetencies = listAchievedCompetencies;

		values.competencyList = values.competencyList?.map((id) => ({
			competencyId: id,
		})) as any;

		if (edit) {
			putModel(
				record?._id ?? '',
				values,
				getData,
				undefined,
				undefined,
				intl.formatMessage({ id: 'global.message.luuthanhcong' }),
			);
		} else {
			postModel(values, getData, undefined, intl.formatMessage({ id: 'global.message.themmoithanhcong' }));
		}
	};

	return (
		<>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				{(record?.workflow === EApprovalStatus.CHANGES_REQUIRED || record?.workflow === EApprovalStatus.REJECTED) && (
					<CardNoteActivity />
				)}
				<Row gutter={[12, 0]}>
					<Col span={24}>
						<Row gutter={[12, 0]}>
							{isView ? (
								<Col span={24} md={9}>
									<Image
										src={record?.banner ?? '/images/cct/background.png'}
										alt={record?.activitiesOutcomeName}
										className='activity-image'
									/>
								</Col>
							) : (
								<Col span={24} md={9}>
									<Form.Item name='banner' label='Banner'>
										<UploadFile
											isLandscapeAvatar
											accept='.png,.jpg,.jpeg'
											buttonDescription='Add Banner'
											extra='Only .png, .jpeg, and .jpg files are allowed'
										/>
									</Form.Item>
								</Col>
							)}

							<Col span={24} md={15}>
								<Row gutter={[12, 0]}>
									<Col span={24} md={12}>
										<Form.Item name='activitiesTypeDomainId' label='Activity Group' rules={[...rules.required]}>
											<SelectActivitiesTypeDomain
												disabled={isView}
												onChange={() => form.resetFields(['activitiesTypeId'])}
											/>
										</Form.Item>
									</Col>
									<Col span={24} md={12}>
										<Form.Item
											name='activitiesTypeId'
											label={intl.formatMessage({ id: 'activity.perstion.activitiesTypeId' })}
											rules={[...rules.required]}
										>
											<SelectActivitiesManagement
												condition={{ activitiesTypeDomainId: activitiesTypeDomainId }}
												disabled={isView}
												onChange={(val, option) => {
													const rawData = option?.rawData;
													if (!rawData) return;

													form.setFieldsValue({
														listAchievedCompetencies: (rawData.attributes || []).map((attr: any) => ({
															attributesId: attr._id,
															attributes: attr,
														})),
														evidenceFile: uniqBy(
															rawData?.requiredEvidenceList?.map((i: any) => ({ name: i })) || [],
															'name',
														)?.map((competency) => {
															const matched = record?.evidenceFile?.find((e: any) => e.name === competency);
															return {
																...competency,
																file: matched?.file || [],
																isSystem: true,
															};
														}),
													});
												}}
											/>
										</Form.Item>
									</Col>
									<Col span={24}>
										<Form.Item name='activitiesOutcomeName' label='Activity Name' rules={[...rules.required]}>
											<Input placeholder='Enter Activity Name' disabled={isView} />
										</Form.Item>
									</Col>
									<Col span={24} md={12}>
										<Form.Item
											name='startDate'
											label={intl.formatMessage({ id: 'activity.perstion.startDate' })}
											rules={[...rules.required]}
										>
											<MyDatePicker
												showTime={{ showHour: true, showMinute: true }}
												format='HH:mm DD/MM/YYYY'
												disabled={isView}
												placeholder={intl.formatMessage({ id: 'activity.perstion.startDate.place' })}
												disabledDate={(current) => {
													return !!(current && current < dayjs().startOf('day'));
												}}
												onChange={() => form.resetFields(['endDate'])}
											/>
										</Form.Item>
									</Col>
									<Col span={24} md={12}>
										<Form.Item
											name='endDate'
											label={intl.formatMessage({ id: 'activity.perstion.endDate' })}
											rules={[
												...rules.required,
												...rules.sauNgay(dayjs(startDate), intl.formatMessage({ id: 'activity.perstion.startDate' })),
											]}
										>
											<MyDatePicker
												showTime={{ showHour: true, showMinute: true }}
												format='HH:mm DD/MM/YYYY'
												disabled={isView}
												disabledDate={(current) =>
													!!(
														dayjs(current).isBefore(dayjs().startOf('day')) ||
														(startDate && dayjs(current).isBefore(startDate))
													)
												}
												placeholder={intl.formatMessage({ id: 'activity.perstion.endDate.place' })}
											/>
										</Form.Item>
									</Col>
								</Row>
							</Col>
						</Row>
					</Col>

					<Col span={24} md={9}>
						<Form.Item name='onUni' label='Mentor/Supervisor' rules={[...rules.required]}>
							<Radio.Group
								disabled={isView}
								options={[
									{ value: true, label: 'In university' },
									{ value: false, label: 'Outside of university' },
								]}
							/>
						</Form.Item>
					</Col>
					{onUni ? (
						<Col span={24} md={15}>
							<Form.Item name='supervisorSsoId' label='Mentor/Supervisor' rules={[...rules.required]}>
								<SelectNhanSuDebounce
									onChange={(val, option) => {
										const nhanSu = option?.rawData;
										form.setFieldsValue({
											supervisorName: nhanSu?.hoTen
												? nhanSu?.hoTen
												: [nhanSu?.hoDem, nhanSu?.ten].filter(Boolean).join(' '),
											supervisorCode: nhanSu?.maCanBo,
										});
									}}
									disabled={isView}
								/>
							</Form.Item>
							<Form.Item name='supervisorName' hidden />
							<Form.Item name='supervisorCode' hidden />
						</Col>
					) : (
						<Col span={24} md={15}>
							<Form.Item name='supervisorName' label='Mentor/Supervisor' rules={[...rules.required]}>
								<Input placeholder='Enter Mentor/Supervisor' disabled={isView} />
							</Form.Item>
						</Col>
					)}
					<Col span={24} md={12}>
						<Form.Item
							name='organizer'
							label={intl.formatMessage({ id: 'activity.perstion.organizer' })}
							rules={[...rules.required]}
						>
							<Input placeholder={intl.formatMessage({ id: 'activity.perstion.organizer.place' })} disabled={isView} />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='location'
							label={intl.formatMessage({ id: 'activity.perstion.location' })}
							rules={[...rules.required]}
						>
							<Input placeholder='Enter location' disabled={isView} />
						</Form.Item>
					</Col>

					<Col span={24} md={12}>
						<Form.Item
							name='rolesId'
							label={intl.formatMessage({ id: 'activity.perstion.rolesId' })}
							rules={[...rules.required]}
						>
							<SelectRolesManagement disabled={isView} />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item name='levelsId' label='Level' rules={[...rules.required]}>
							<SelectLevelsManagement disabled={isView} />
						</Form.Item>
					</Col>

					{/* <Col span={24}>
							<Divider className='divider-big-title' orientation='left'>
								Competency Mapping
							</Divider>
						</Col>
						<Col span={24}>
							{record?._id ? (
								<CompetencyMappingModelPage disabled={isView} />
							) : (
								<Form.Item name='listAchievedCompetencies'>
									<FormItemCompetencyMapping disabled={isView} />
								</Form.Item>
							)}
						</Col> */}

					<Col span={24}>
						<Divider className='divider-big-title' orientation='left'>
							List Evidence
						</Divider>
					</Col>

					<Col span={24}>
						<div style={{ marginBottom: 10 }}>
							<i className='text-info'>(Suggestion Evidence: Supervisor confirmation, Research log)</i>
						</div>

						<Form.List name='evidenceFile'>
							{(fields, { add, remove }, { errors }) => (
								<>
									{fields.map((field, index) => (
										<Row gutter={[12, 0]} key={field.key}>
											<Col span={24} md={12}>
												<Form.Item label='Evidence File Name' name={[index, 'name']} rules={[...rules.required]}>
													<Input placeholder='Enter Name' disabled={isView} />
												</Form.Item>
											</Col>
											<Col span={22} md={10}>
												<Form.Item label='File' name={[index, 'file']} rules={[...rules.required]}>
													<UploadFile maxCount={5} disabled={isView} />
												</Form.Item>
											</Col>
											<Col span={2}>
												<div
													style={{
														height: '100%',
														display: 'flex',
														alignItems: 'center',
														justifyContent: 'center',
													}}
												>
													<Button
														danger
														type='link'
														title='Xóa'
														icon={<DeleteOutlined />}
														onClick={() => remove(field.name)}
														disabled={isView}
													/>
												</div>
											</Col>
											<Form.ErrorList errors={errors} />
										</Row>
									))}

									<Button onClick={() => add()} icon={<PlusOutlined />} type='dashed' size='small' disabled={isView}>
										Add Evidence
									</Button>
								</>
							)}
						</Form.List>
					</Col>

					<Col span={24}>
						<Divider className='divider-big-title' orientation='left'>
							List competency
						</Divider>
					</Col>

					<Col span={24}>
						<Form.Item name='competencyList'>
							<FormCompetencyEvidence competencyList={competencyList} form={form} />
						</Form.Item>
					</Col>

					<Col span={24}>
						<Form.Item name='reflection' label='Reflection'>
							<Input.TextArea rows={3} disabled={isView} placeholder='Enter reflection' />
						</Form.Item>
					</Col>
					{/* <Col span={24}>
							<Form.Item name='description' label={intl.formatMessage({ id: 'activity.perstion.description' })}>
								<Input.TextArea
									rows={3}
									placeholder={intl.formatMessage({ id: 'activity.perstion.description.place' })}
									disabled={isView}
								/>
							</Form.Item>
						</Col>
						<Col span={24}>
							<Form.Item
								name='learningOutcomes'
								label={intl.formatMessage({ id: 'activity.perstion.learningOutcomes' })}
							>
								<Input.TextArea
									rows={3}
									placeholder={intl.formatMessage({ id: 'activity.perstion.learningOutcomes.place' })}
									disabled={isView}
								/>
							</Form.Item>
						</Col> */}

					{!isView && (
						<Col span={24}>
							<Form.Item name='checkbox' valuePropName='checked'>
								<Checkbox>I hereby declare that the information provided is accurate.</Checkbox>
							</Form.Item>
						</Col>
					)}
				</Row>

				<div className='form-footer'>
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
					{!isView && (
						<Button
							loading={formSubmiting}
							htmlType='submit'
							type='primary'
							disabled={!checkbox || competencyList?.length > 3}
						>
							{intl.formatMessage({ id: 'global.button.luulai' })}
						</Button>
					)}
				</div>
			</Form>
		</>
	);
};

export default FormPerstionActivityOutCome;
