import MyDatePicker from '@/components/MyDatePicker';
import UploadFile from '@/components/Upload/UploadFile';
import SelectNhanSuDebounce from '@/pages/ToChucNhanSu/NhanSu/Select';
import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import { EApprovalStatus, EparticipantRole, EParticipantScope } from '@/services/CCT/constant';
import { buildUpLoadFile, handleSingleFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { buildDisabledDateTime, resetFieldsForm } from '@/utils/utils';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Form, Image, Input, Radio, Row, Space, Tag } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import SelectActivitiesManagement from '../../DanhMuc/Activities/Select';
import SelectActivitiesTypeDomain from '../../DanhMuc/CCD/Select';
import SelectLevelsManagement from '../../DanhMuc/Levels/Select';
import SelectRolesManagement from '../../DanhMuc/Roles/Select';
import SelectTrack from '../../DanhMuc/Track/Select';
import CardNoteActivity from './CardNote';
import FormCompetencyEvidence from './FormCompetencyEvidence';

const uploadFilesOfCompetency = async (files: any[] = []) => {
	if (!files.length) return [];
	const urls = await Promise.all(files?.map((f) => handleSingleFile(f).catch(() => null)));
	return urls.filter(Boolean) as string[];
};

const FormPerstionActivityOutCome = (props: any) => {
	const { getData } = props;
	const intl = useIntl();
	const [form] = Form.useForm();

	const { record, setVisibleForm, edit, isView, postModel, putModel, formSubmiting, visibleForm, setFormSubmiting } =
		useModel('cct.activityoutcome');

	const { danhSach: dsActivityType } = useModel('cct.activities');

	const startDate: Date = Form.useWatch('startDate', form);
	const activitiesTypeDomainId: string = Form.useWatch('activitiesTypeDomainId', form);
	const checkbox: boolean = Form.useWatch('checkbox', form);
	const listAchievedCompetencies: string[] = Form.useWatch('listAchievedCompetencies', form);
	const onUni: boolean = Form.useWatch('onUni', form);
	const activitiesTypeId: string = Form.useWatch('activitiesTypeId', form);

	const [isSubmit, setIsSubmit] = useState<boolean>(false);

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);

		if (record?._id) {
			form.setFieldsValue({
				...record,
				activitiesTypeDomainId: record?.activitiesType?.activitiesTypeDomainId,
				listAchievedCompetencies: record?.listAchievedCompetencies?.map((item) => item?.competencyId),
				onUni: record?.supervisorSsoId ? true : false,
				banner: record?.banner ?? '/images/cct/background.png',
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
				banner: '/images/cct/background.png',
			});
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: ActivityOutCome.IRecord, submitted: boolean) => {
		setFormSubmiting(true);
		const banner = await buildUpLoadFile(values, 'banner');
		values.banner = banner;
		setFormSubmiting(false);

		const evidenceFile = await Promise.all(
			(values.evidenceFile || []).map(async (item: any) => ({
				name: item.name,
				file: await uploadFilesOfCompetency(item?.file?.fileList),
			})),
		);

		values.evidenceFile = evidenceFile;

		values.listAchievedCompetencies = values.listAchievedCompetencies?.map((id) => ({
			competencyId: id,
		})) as any;

		values.workflow = submitted ? EApprovalStatus.SUBMITTED : EApprovalStatus.DRAFT;

		if (edit) {
			putModel(
				`me/${record?._id}`,
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
			<Form form={form} layout='vertical' onFinish={(values) => onFinish(values, isSubmit)}>
				{!!record?.revisionNote && <CardNoteActivity />}
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
											isWidescreen
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
														trackId: rawData?.trackId,
													});
												}}
											/>
										</Form.Item>
									</Col>
									{activitiesTypeId && (
										<Col span={24}>
											Attributes:{' '}
											<Space wrap>
												{dsActivityType
													?.find((i) => i._id === activitiesTypeId)
													?.attributes?.map((item) => (
														<Tag key={item?._id} color={item?.color}>
															{item?.name}
														</Tag>
													))}
											</Space>
										</Col>
									)}
									<Col span={24} md={24}>
										<Form.Item name='trackId' label='Track' rules={[...rules.required]}>
											<SelectTrack disabled={isView} />
										</Form.Item>
									</Col>
									<Col span={24} md={24}>
										<Form.Item name='activitiesOutcomeName' label='Activity Name' rules={[...rules.required]}>
											<Input placeholder='Enter Activity Name' disabled={isView} />
										</Form.Item>
									</Col>
								</Row>
							</Col>
						</Row>
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
								...rules.sauThoiDiem(dayjs(startDate), intl.formatMessage({ id: 'activity.perstion.startDate' })),
							]}
						>
							<MyDatePicker
								showTime={{ showHour: true, showMinute: true }}
								format='HH:mm DD/MM/YYYY'
								disabled={isView}
								{...buildDisabledDateTime({
									min: startDate ? dayjs(startDate) : undefined,
								})}
								placeholder={intl.formatMessage({ id: 'activity.perstion.endDate.place' })}
							/>
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
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
						<Col span={24} md={12}>
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
						<Col span={24} md={12}>
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
					<Col span={24}>
						<div className='fw500' style={{ marginBottom: 6 }}>
							List Evidence
						</div>
						<div style={{ marginBottom: 10 }}>
							<i className='text-info'>
								(Suggestion Evidence:{' '}
								{dsActivityType
									?.find((i) => i._id === activitiesTypeId)
									?.requiredEvidenceList?.map((item) => item)
									.filter(Boolean)
									.join(', ')}
								)
							</i>
						</div>
						<div style={{ marginBottom: 10 }}>
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
											Update Evidence
										</Button>
									</>
								)}
							</Form.List>
						</div>
					</Col>
					<Col span={24}>
						<Form.Item name='listAchievedCompetencies' label='List Competency'>
							<FormCompetencyEvidence listAchievedCompetencies={listAchievedCompetencies} form={form} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name='reflection' label='Reflection'>
							<Input.TextArea rows={3} disabled={isView} placeholder='Enter reflection' />
						</Form.Item>
					</Col>
					{!isView && (
						<Col span={24}>
							<Form.Item name='checkbox' valuePropName='checked'>
								<Checkbox>I hereby declare that the information provided is accurate.</Checkbox>
							</Form.Item>
						</Col>
					)}
				</Row>

				<div className='form-footer'>
					{!isView && (
						<>
							<Button
								type='primary'
								htmlType='submit'
								loading={formSubmiting}
								disabled={!checkbox || listAchievedCompetencies?.length > 3}
								onClick={() => setIsSubmit(true)}
							>
								Submit
							</Button>

							<Button
								htmlType='submit'
								loading={formSubmiting}
								disabled={listAchievedCompetencies?.length > 3}
								onClick={() => setIsSubmit(false)}
							>
								Save Draft
							</Button>
						</>
					)}
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
				</div>
			</Form>
		</>
	);
};

export default FormPerstionActivityOutCome;
