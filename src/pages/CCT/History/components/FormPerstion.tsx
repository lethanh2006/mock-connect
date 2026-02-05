import ExpandText from '@/components/ExpandText';
import MyDatePicker from '@/components/MyDatePicker';
import TableStaticData from '@/components/Table/TableStaticData';
import { IColumn } from '@/components/Table/typing';
import UploadFile from '@/components/Upload/UploadFile';
import SelectNhanSuDebounce from '@/pages/ToChucNhanSu/NhanSu/Select';
import { primaryColor } from '@/services/base/constant';
import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import { EparticipantRole, EParticipantScope } from '@/services/CCT/constant';
import { handleSingleFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Col, Divider, Form, Input, message, Modal, Row, Space, Tag } from 'antd';
import dayjs from 'dayjs';
import { uniqBy } from 'lodash';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import SelectActivitiesManagement from '../../Activities/Select';
import SelectActivitiesTypeDomain from '../../CCD/Select';
import SelectLevelsManagement from '../../Levels/Select';
import SelectRolesManagement from '../../Roles/Select';

const MAX_SELECT = 3;

const uploadFilesOfCompetency = async (files: any[] = []) => {
	if (!files.length) return [];
	const urls = await Promise.all(files.map((f) => handleSingleFile(f).catch(() => null)));
	return urls.filter(Boolean) as string[];
};

const hasAtLeastOneEvidenceFile = (evidenceFile: any[] = []) => evidenceFile.some((i) => i?.file?.length);

const FormPerstionActivityOutCome = (props: any) => {
	const { getData } = props;
	const intl = useIntl();
	const [form] = Form.useForm();
	const [addEvidenceForm] = Form.useForm();

	const { record, setVisibleForm, edit, isView, postModel, putModel, formSubmiting, visibleForm } =
		useModel('cct.activityoutcome');

	const { danhSach: dscompetency, loading, getAllModel: getAllAttriCompetency } = useModel('cct.competency');
	const { danhSach: dsLevels } = useModel('cct.levels');
	const { danhSach: dsRoles } = useModel('cct.roles');

	const startDate: Date = Form.useWatch('startDate', form);
	const rolesId: string = Form.useWatch('rolesId', form);
	const levelsId: string = Form.useWatch('levelsId', form);
	const activitiesTypeDomainId: string = Form.useWatch('activitiesTypeDomainId', form);
	const checkbox: boolean = Form.useWatch('checkbox', form);
	const competencyList: string[] = Form.useWatch('competencyList', form);

	const [openAddEvidence, setOpenAddEvidence] = useState(false);

	const autoLevel = dsLevels?.find((i) => i?._id === levelsId)?.autoApproval;
	const autoRole = dsRoles?.find((i) => i?._id === rolesId)?.autoApproval;

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);

		if (record?._id) {
			form.setFieldsValue({
				...record,
				activitiesTypeDomainId: record?.activitiesType?.activitiesTypeDomainId,
				competencyList: record?.competencyList?.map((item) => item?.competencyId),
			});
		}

		if (!record?._id) {
			form.setFieldsValue({
				participantScope: EParticipantScope.UNIVERSITY,
				participantRole: EparticipantRole.ALL,
				cct: true,
				allowPostEventResultsUpdate: false,
				onCampus: true,
				evidenceFile: [],
				checkbox: false,
				listAchievedCompetencies: null,
			});
		}

		getAllAttriCompetency();
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

	const onFinishAddEvidence = (values: any) => {
		const current = form.getFieldValue('evidenceFile') || [];

		if (current.some((i: any) => i.name === values.newEvidenceName)) {
			message.warning('Evidence name already exists');
			return;
		}

		form.setFieldsValue({
			evidenceFile: [
				...current,
				{
					name: values.newEvidenceName,
					file: values.newEvidenceFiles || [],
					isSystem: false,
				},
			],
		});

		setOpenAddEvidence(false);
		addEvidenceForm.resetFields();
	};

	const columns: IColumn<any>[] = [
		{
			title: 'Evidence',
			width: 220,
			render: (_, field) => (
				<>
					<Form.Item name={[field.name, 'name']} noStyle>
						<Input hidden />
					</Form.Item>

					<Form.Item name={[field.name, 'isSystem']} noStyle>
						<Input hidden />
					</Form.Item>

					<span>{form.getFieldValue(['evidenceFile', field.name, 'name'])}</span>
				</>
			),
		},
		{
			title: 'File',
			width: 250,
			render: (_, field) =>
				isView ? (
					<Form.Item shouldUpdate noStyle>
						{() => {
							const files = form.getFieldValue(['evidenceFile', field.name, 'file']) || [];
							return (
								<Space wrap>
									{files.map((item: string) => (
										<Tag
											key={item}
											color={primaryColor}
											style={{ cursor: 'pointer' }}
											onClick={() => window.open(item)}
										>
											Chi tiết
										</Tag>
									))}
								</Space>
							);
						}}
					</Form.Item>
				) : (
					<Form.Item name={[field.name, 'file']}>
						<UploadFile maxCount={5} />
					</Form.Item>
				),
		},
		{
			title: 'Action',
			width: 90,
			render: (_, field) => {
				const item = form.getFieldValue(['evidenceFile', field.name]);
				if (isView || item?.isSystem) return null;

				return (
					<Button
						danger
						size='small'
						icon={<DeleteOutlined />}
						onClick={() => {
							const current = form.getFieldValue('evidenceFile') || [];
							form.setFieldsValue({
								evidenceFile: current.filter((_: any, i: number) => i !== field.name),
							});
						}}
					/>
				);
			},
		},
	];

	const columnsCompetency: IColumn<Competency.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'competency.column.name' }),
			dataIndex: 'name',
			width: 170,
			filterType: 'string',
		},
		{
			title: 'Description',
			dataIndex: 'description',
			width: 250,
			render: (val, rec) => val && <ExpandText>{val}</ExpandText>,
		},
	];

	return (
		<>
			<Card
				title={
					edit
						? 'Edit Personal Co-curricular Activity'
						: isView
							? 'Detail Personal Co-curricular Activity'
							: 'Add new Personal Co-curricular Activity'
				}
			>
				<Form onFinish={onFinish} form={form} layout='vertical'>
					<Row gutter={[12, 0]}>
						<Col span={24} md={12}>
							<Form.Item name='activitiesTypeDomainId' label='Activity Group' rules={[...rules.required]}>
								<SelectActivitiesTypeDomain disabled={isView} />
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
						<Col span={24} md={12}>
							<Form.Item name='activitiesOutcomeName' label='Activity Name' rules={[...rules.required]}>
								<Input placeholder='Enter Activity Name' disabled={isView} />
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Col span={24}>
								<Form.Item name='supervisorSsoId' label='Mentor/Supervisor'>
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
									/>
								</Form.Item>
								<Form.Item name='supervisorName' hidden />
								<Form.Item name='supervisorCode' hidden />
							</Col>
						</Col>
						<Col span={24} md={12}>
							<Form.Item
								name='organizer'
								label={intl.formatMessage({ id: 'activity.perstion.organizer' })}
								rules={[...rules.required]}
							>
								<Input
									placeholder={intl.formatMessage({ id: 'activity.perstion.organizer.place' })}
									disabled={isView}
								/>
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
								name='startDate'
								label={intl.formatMessage({ id: 'activity.perstion.startDate' })}
								rules={[...rules.required]}
							>
								<MyDatePicker
									showTime={{ showHour: true, showMinute: true }}
									format='HH:mm DD/MM/YYYY'
									disabled={isView}
									placeholder={intl.formatMessage({ id: 'activity.perstion.startDate.place' })}
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
									disabledDate={(cur) => (startDate ? dayjs(cur).isBefore(startDate) : false)}
									placeholder={intl.formatMessage({ id: 'activity.perstion.endDate.place' })}
								/>
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
								Evidence Required
							</Divider>
						</Col>
						<Col span={24}>
							<Form.List name='evidenceFile'>
								{(fields) => (
									<TableStaticData
										columns={columns}
										data={fields}
										otherProps={{ pagination: false, scroll: { y: 400 } }}
										otherButtons={[
											<Button type='primary' onClick={() => setOpenAddEvidence(true)} size='small'>
												Add new
											</Button>,
										]}
									/>
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
								<i className='text-info'>An activity allows a maximum of 3 competencies</i>

								<TableStaticData
									columns={columnsCompetency}
									data={dscompetency}
									loading={loading}
									size='small'
									hasTotal
									onReload={getAllAttriCompetency}
									otherProps={{
										pagination: false,
										scroll: { y: 350 },
										rowKey: '_id',
										rowSelection: {
											type: 'checkbox',
											columnWidth: 40,
											selectedRowKeys: competencyList ?? [],
											onChange: (selectedRowKeys: React.Key[]) => {
												if (isView) return;
												form.setFieldsValue({
													competencyList: selectedRowKeys,
												});
											},
											getCheckboxProps: (record: any) => ({
												disabled:
													isView ||
													((competencyList?.length ?? 0) >= MAX_SELECT && !competencyList?.includes(record._id)),
											}),
											hideSelectAll: true,
										},
									}}
								/>
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
						{!isView && (
							<Button
								loading={formSubmiting}
								htmlType='submit'
								type='primary'
								disabled={!checkbox || competencyList?.length > 3}
							>
								{!edit
									? intl.formatMessage({ id: 'global.button.themmoi' })
									: intl.formatMessage({ id: 'global.button.chinhsua' })}
							</Button>
						)}
						<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
					</div>
				</Form>
			</Card>

			<Modal open={openAddEvidence} title='Add Evidence' footer={null} onCancel={() => setOpenAddEvidence(false)}>
				<Form form={addEvidenceForm} layout='vertical' onFinish={onFinishAddEvidence}>
					<Form.Item name='newEvidenceName' label='Name' rules={[...rules.required]}>
						<Input placeholder='Enter name' />
					</Form.Item>
					<Form.Item name='newEvidenceFiles' label='File' rules={[...rules.required]}>
						<UploadFile maxCount={5} />
					</Form.Item>

					<div className='form-footer'>
						<Button htmlType='submit' type='primary'>
							Add new
						</Button>

						<Button onClick={() => setOpenAddEvidence(false)}>
							{intl.formatMessage({ id: 'global.button.dong' })}
						</Button>
					</div>
				</Form>
			</Modal>
		</>
	);
};

export default FormPerstionActivityOutCome;
