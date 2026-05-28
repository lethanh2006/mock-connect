import background from '@/assets/cct/background.png';
import AuthImage from '@/components/Image/AuthImage';
import MyDatePicker from '@/components/MyDatePicker';
import UploadFile from '@/components/Upload/UploadFile';
import SelectNhanSuDebounce from '@/pages/ToChucNhanSu/NhanSu/Select';
import { ESettingKey } from '@/services/base/constant';
import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import {
	EApprovalStatus,
	EparticipantRole,
	EParticipantScope,
	EScopeAward,
	mapNameScopeAward,
} from '@/services/CCT/constant';
import { buildUpLoadFile, handleSingleFile } from '@/services/uploadFile';
import { ipCCT } from '@/utils/ip';
import rules from '@/utils/rules';
import { buildDisabledDateTime, resetFieldsForm } from '@/utils/utils';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Form, Input, Radio, Row, Select, Space, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import SelectActivitiesManagement from '../../DanhMuc/Activities/Select';
import SelectActivitiesTypeDomain from '../../DanhMuc/CCD/Select';
import SelectLevelsManagement from '../../DanhMuc/Levels/Select';
import SelectRolesManagement from '../../DanhMuc/Roles/Select';
import CardNoteActivity from './CardNote';
import FormCompetencyEvidence from './FormCompetencyEvidence';

const { Paragraph } = Typography;

const uploadFilesOfCompetency = async (files: any[] = []) => {
	if (!files.length) return [];
	const urls = await Promise.all(files?.map((f) => handleSingleFile(f, undefined, ipCCT).catch(() => null)));
	return urls.filter(Boolean) as string[];
};

const FormPerstionActivityOutCome = (props: any) => {
	const { getData } = props;
	const intl = useIntl();
	const [form] = Form.useForm();

	const msg = (id: string) => intl.formatMessage({ id: `activity.formpersion.${id}` });
	const globalMsg = (id: string) => intl.formatMessage({ id: `global.${id}` });

	const { record, setVisibleForm, edit, isView, postModel, putModel, formSubmiting, visibleForm, setFormSubmiting } =
		useModel('cct.activityoutcome');
	const { danhSach: dsActivityType } = useModel('cct.activities');
	const { getByKeyModel, settings } = useModel('tienich.caidat');

	const startDate: Date = Form.useWatch('startDate', form);
	const endDate: Date = Form.useWatch('endDate', form);
	const activitiesTypeDomainId: string = Form.useWatch('activitiesTypeDomainId', form);
	const checkbox: boolean = Form.useWatch('checkbox', form);
	const listAchievedCompetencies: string[] = Form.useWatch('listAchievedCompetencies', form);
	const onUni: boolean = Form.useWatch('onUni', form);
	const activitiesTypeId: string = Form.useWatch('activitiesTypeId', form);

	const [isSubmit, setIsSubmit] = useState<boolean>(false);

	useEffect(() => {
		if (visibleForm) {
			getByKeyModel(ESettingKey.CCT_TRANSCRIPT, ipCCT);
		} else {
			resetFieldsForm(form);
		}
	}, [visibleForm]);

	const awardTypeDomainIds = settings?.CCT_TRANSCRIPT?.listTypeAwardAndRecognition ?? [];
	const firstAwardTypeDomainId = awardTypeDomainIds?.[0];
	const isAward = isView || edit ? record?.isAwardRecognition : awardTypeDomainIds?.includes(activitiesTypeDomainId);

	useEffect(() => {
		if (!visibleForm) return;

		if (record?._id) {
			form.setFieldsValue({
				...record,
				activitiesTypeDomainId: record?.isAwardRecognition
					? firstAwardTypeDomainId
					: record?.activitiesType?.activitiesTypeDomainId,
				listAchievedCompetencies: record?.listAchievedCompetencies?.map((item) => item?.competencyId),
				onUni: record?.supervisorSsoId ? true : false,
				banner: record?.banner ?? background,
			});

			return;
		}

		form.setFieldsValue({
			participantScope: EParticipantScope.UNIVERSITY,
			participantRole: EparticipantRole.ALL,
			cct: true,
			allowPostEventResultsUpdate: false,
			onCampus: true,
			checkbox: false,
			listAchievedCompetencies: null,
			onUni: true,
			banner: background,
		});
	}, [visibleForm, record?._id, firstAwardTypeDomainId]);

	const onFinish = async (values: ActivityOutCome.IRecord, submitted: boolean) => {
		setFormSubmiting(true);
		let banner = await buildUpLoadFile(values, 'banner', undefined, ipCCT);
		if (!banner || !banner.includes('http')) {
			banner = null;
		}
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
		values.isAwardRecognition = isAward ? true : false;

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
				{(!!record?.revisionNote || !!record?.isAwardRecognition) && <CardNoteActivity />}
				<Row gutter={[12, 0]}>
					<Col span={24}>
						<Row gutter={[12, 0]}>
							{isView ? (
								<Col span={24} md={9}>
									<AuthImage
										src={record?.banner ?? background}
										fallback={background}
										className='activity-image'
										isDetail
									/>
								</Col>
							) : (
								<Col span={24} md={9}>
									<Form.Item name='banner' label={msg('banner')}>
										<UploadFile
											isPrivate
											isWidescreen
											accept='.png,.jpg,.jpeg'
											buttonDescription={msg('addBanner')}
											extra={msg('bannerExtra')}
										/>
									</Form.Item>
								</Col>
							)}

							<Col span={24} md={15}>
								<Row gutter={[12, 0]}>
									<Col span={24} md={12}>
										<Form.Item name='activitiesTypeDomainId' label={msg('activityGroup')} rules={[...rules.required]}>
											<SelectActivitiesTypeDomain
												disabled={isView}
												onChange={() => form.resetFields(['activitiesTypeId'])}
											/>
										</Form.Item>
									</Col>
									{isAward ? (
										<>
											<Col span={24} md={12}>
												<Form.Item name='scope' label={msg('scope')} rules={[...rules.required]}>
													<Select
														placeholder={msg('selectScope')}
														options={Object.values(EScopeAward).map((value) => ({
															value,
															label: mapNameScopeAward[value],
														}))}
														allowClear
														disabled={isView}
													/>
												</Form.Item>
											</Col>
											<Col span={24} md={24}>
												<Form.Item name='competition' label={msg('competition')} rules={[...rules.required]}>
													<Input placeholder={msg('enterCompetition')} disabled={isView} />
												</Form.Item>
											</Col>
											<Col span={24} md={12}>
												<Form.Item name='startDate' label={msg('startDate')} rules={[...rules.required]}>
													<MyDatePicker
														showTime={{ showHour: true, showMinute: true }}
														format='HH:mm DD/MM/YYYY'
														disabled={isView}
														placeholder={msg('startDate.place')}
														onChange={() => form.resetFields(['endDate'])}
													/>
												</Form.Item>
											</Col>
											<Col span={24} md={12}>
												<Form.Item
													name='endDate'
													label={msg('endDate')}
													rules={[...rules.required, ...rules.sauThoiDiem(dayjs(startDate), msg('startDate'))]}
												>
													<MyDatePicker
														showTime={{ showHour: true, showMinute: true }}
														format='HH:mm DD/MM/YYYY'
														disabled={isView}
														{...buildDisabledDateTime({
															min: startDate ? dayjs(startDate) : undefined,
														})}
														placeholder={msg('endDate.place')}
													/>
												</Form.Item>
											</Col>
										</>
									) : (
										<>
											<Col span={24} md={12}>
												<Form.Item name='activitiesTypeId' label={msg('activitiesTypeId')} rules={[...rules.required]}>
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
											{/* <Col span={24} md={24}>
												<Form.Item name='trackId' label='Track' rules={[...rules.required]}>
													<SelectTrack disabled={isView} />
												</Form.Item>
											</Col> */}
											<Col span={24} md={24}>
												<Form.Item name='activitiesOutcomeName' label={msg('activityName')} rules={[...rules.required]}>
													<Input placeholder={msg('enterActivityName')} disabled={isView} />
												</Form.Item>
											</Col>
											<Col span={24} md={12}>
												<Form.Item name='startDate' label={msg('startDate')} rules={[...rules.required]}>
													<MyDatePicker
														showTime={{ showHour: true, showMinute: true }}
														format='HH:mm DD/MM/YYYY'
														disabled={isView}
														placeholder={msg('startDate.place')}
														onChange={() => form.resetFields(['endDate'])}
													/>
												</Form.Item>
											</Col>
											<Col span={24} md={12}>
												<Form.Item
													name='endDate'
													label={msg('endDate')}
													rules={[...rules.required, ...rules.sauThoiDiem(dayjs(startDate), msg('startDate'))]}
												>
													<MyDatePicker
														showTime={{ showHour: true, showMinute: true }}
														format='HH:mm DD/MM/YYYY'
														disabled={isView}
														{...buildDisabledDateTime({
															min: startDate ? dayjs(startDate) : undefined,
														})}
														placeholder={msg('endDate.place')}
													/>
												</Form.Item>
											</Col>
										</>
									)}
								</Row>
							</Col>
						</Row>
					</Col>
					{isAward ? (
						<>
							<Col span={24} md={8}>
								<Form.Item
									name='dateOfAchievement'
									label={msg('dateOfAchievement')}
									rules={[
										...rules.required,
										...rules.sauThoiDiem(dayjs(startDate), msg('startDate')),
										...rules.truocThoiDiem(dayjs(endDate), msg('endDate')),
									]}
								>
									<MyDatePicker
										showTime={{ showHour: true, showMinute: true }}
										format='HH:mm DD/MM/YYYY'
										disabled={isView}
										placeholder={msg('chooseDateOfAchievement')}
										{...buildDisabledDateTime({
											min: startDate ? dayjs(startDate) : undefined,
											max: endDate ? dayjs(endDate) : undefined,
										})}
										allowClear
									/>
								</Form.Item>
							</Col>
							<Col span={24} md={8}>
								<Form.Item name='rank' label={msg('rank')} rules={[...rules.required]}>
									<Input disabled={isView} placeholder={msg('enterRank')} />
								</Form.Item>
							</Col>
							<Col span={24} md={8}>
								<Form.Item name='link' label={msg('link')} rules={[...rules.httpLink]}>
									<Input disabled={isView} placeholder={msg('enterLink')} />
								</Form.Item>
							</Col>
							<Col span={24}>
								<Row gutter={[12, 0]}>
									<Col span={24} md={12}>
										<Form.Item label={msg('fileName')} name={['evidenceFile', 0, 'name']} rules={[...rules.required]}>
											<Input placeholder={msg('enterName')} disabled={isView} />
										</Form.Item>
									</Col>

									<Col span={22} md={12}>
										<Form.Item label={msg('file')} name={['evidenceFile', 0, 'file']} rules={[...rules.required]}>
											<UploadFile
												maxCount={1}
												disabled={isView}
												isPrivate
												accept='.pdf, .doc, .docx, .xls, .xlsx, .png, .jpg, .jpeg'
											/>
										</Form.Item>
									</Col>
								</Row>
							</Col>
							<Col span={24}>
								<Form.Item
									name='description'
									label={msg('description')}
									rules={[...rules.required, ...rules.length(250)]}
								>
									<Input.TextArea rows={3} disabled={isView} placeholder={msg('enterDescription')} />
								</Form.Item>
							</Col>
						</>
					) : (
						<>
							<Col span={24} md={12}>
								<Form.Item name='onUni' label={msg('mentor')} rules={[...rules.required]}>
									<Radio.Group
										disabled={isView}
										options={[
											{ value: true, label: msg('inUni') },
											{ value: false, label: msg('outUni') },
										]}
									/>
								</Form.Item>
							</Col>
							{onUni ? (
								<Col span={24} md={12}>
									<Form.Item name='supervisorSsoId' label={msg('mentor')} rules={[...rules.required]}>
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
									<Form.Item name='supervisorName' label={msg('mentor')} rules={[...rules.required]}>
										<Input placeholder={msg('enterMentor')} disabled={isView} />
									</Form.Item>
								</Col>
							)}
							<Col span={24} md={12}>
								<Form.Item name='organizer' label={msg('organizer')} rules={[...rules.required]}>
									<Input placeholder={msg('organizer.place')} disabled={isView} />
								</Form.Item>
							</Col>
							<Col span={24} md={12}>
								<Form.Item name='location' label={msg('location')} rules={[...rules.required]}>
									<Input placeholder={msg('enterLocation')} disabled={isView} />
								</Form.Item>
							</Col>
							<Col span={24} md={12}>
								<Form.Item name='rolesId' label={msg('rolesId')} rules={[...rules.required]}>
									<SelectRolesManagement disabled={isView} />
								</Form.Item>
							</Col>
							<Col span={24} md={12}>
								<Form.Item name='levelsId' label={msg('level')} rules={[...rules.required]}>
									<SelectLevelsManagement disabled={isView} />
								</Form.Item>
							</Col>
							<Col span={24}>
								<div className='fw500' style={{ marginBottom: 6 }}>
									{msg('listEvidence')}
								</div>
								<div style={{ marginBottom: 10 }}>
									<i className='text-info'>
										({msg('suggestionEvidence')}:{' '}
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
															<Form.Item
																label={msg('evidenceFileName')}
																name={[index, 'name']}
																rules={[...rules.required]}
															>
																<Input placeholder={msg('enterName')} disabled={isView} />
															</Form.Item>
														</Col>
														<Col span={22} md={10}>
															<Form.Item label={msg('file')} name={[index, 'file']} rules={[...rules.required]}>
																<UploadFile maxCount={5} disabled={isView} isPrivate />
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

												<Button
													onClick={() => add()}
													icon={<PlusOutlined />}
													type='dashed'
													size='small'
													disabled={isView}
												>
													{msg('addEvidence')}
												</Button>
											</>
										)}
									</Form.List>
								</div>
							</Col>
							<Col span={24}>
								<Form.Item name='listAchievedCompetencies' label={msg('listCompetency')}>
									<FormCompetencyEvidence listAchievedCompetencies={listAchievedCompetencies} form={form} />
								</Form.Item>
							</Col>
							<Col span={24}>
								<Form.Item
									name='reflection'
									label={msg('reflection')}
									rules={[...rules.required, ...rules.text, ...rules.length(300)]}
									extra={
										<div style={{ marginTop: 6 }}>
											<Paragraph className='text-info' style={{ fontSize: 12, marginBottom: 6, color: '#595959' }}>
												Format: Led / Contributed to <b>[activity/project]</b>, resulting in <b>[measurable impact]</b>,
												demonstrating <b>[key competency]</b>.
											</Paragraph>

											<Paragraph className='text-info' style={{ fontSize: 12, marginBottom: 0, color: '#8c8c8c' }}>
												Example: Organized a charity initiative for Ha Nau Secondary School, reaching 150+ students and
												mobilizing X VND in resources, demonstrating strong community engagement and execution
												capability.
											</Paragraph>
										</div>
									}
								>
									<Input.TextArea rows={3} disabled={isView} placeholder={msg('enterReflection')} showCount />
								</Form.Item>
							</Col>
						</>
					)}
					{!isView && (
						<Col span={24}>
							<Form.Item name='checkbox' valuePropName='checked'>
								<Checkbox>{msg('declaration')}</Checkbox>
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
								{msg('submit')}
							</Button>

							<Button
								htmlType='submit'
								loading={formSubmiting}
								disabled={listAchievedCompetencies?.length > 3}
								onClick={() => setIsSubmit(false)}
							>
								{msg('saveDraft')}
							</Button>
						</>
					)}
					<Button onClick={() => setVisibleForm(false)}>{globalMsg('button.dong')}</Button>
				</div>
			</Form>
		</>
	);
};

export default FormPerstionActivityOutCome;
