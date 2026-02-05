import ExpandText from '@/components/ExpandText';
import TableStaticData from '@/components/Table/TableStaticData';
import { IColumn } from '@/components/Table/typing';
import UploadFile from '@/components/Upload/UploadFile';
import { primaryColor } from '@/services/base/constant';
import { EApprovalStatus, Evalidation, mapEvalidation } from '@/services/CCT/constant';
import { handleSingleFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Col, Descriptions, Divider, Form, Input, message, Modal, Row, Space, Tag } from 'antd';
import dayjs from 'dayjs';
import { uniqBy } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useIntl, useModel } from 'umi';
import SelectLevelsManagement from '../../Levels/Select';

const uploadFilesOfCompetency = async (files: any[] = []) => {
	if (!files.length) return [];
	const urls = await Promise.all(files.map((f) => handleSingleFile(f).catch(() => null)));
	return urls.filter(Boolean) as string[];
};

const hasAtLeastOneEvidenceFile = (evidenceFile: any[] = []) => evidenceFile.some((i) => i?.file?.length);

const FormActivityOutCome = (props: any) => {
	const { getData } = props;
	const intl = useIntl();
	const [form] = Form.useForm();
	const [addEvidenceForm] = Form.useForm();

	const { record, setVisibleForm, isView, formSubmiting, visibleForm, postActivityOutComeModel } =
		useModel('cct.activityoutcome');
	const { danhSach: dsLevels } = useModel('cct.levels');
	const [openAddEvidence, setOpenAddEvidence] = useState(false);

	const dsRoles = uniqBy(record?.activities?.coCurricularActivityEquivalency ?? [], 'rolesId');

	const rolesId: string = Form.useWatch('rolesId', form);
	const levelsId: string = Form.useWatch('levelsId', form);
	const checkbox: boolean = Form.useWatch('checkbox', form);

	const autoLevel = dsLevels?.find((i) => i?._id === levelsId)?.autoApproval;
	const autoRole = dsRoles?.find((i) => i?.rolesId === rolesId)?.roles?.autoApproval;

	useEffect(() => {
		if (!visibleForm) {
			form.resetFields();
			return;
		}

		const systemEvidence =
			record?.activities?.activitiesType?.requiredEvidenceList?.map((name: string) => {
				const matched = record?.evidenceFile?.find((e: any) => e.name === name);
				return {
					name,
					file: matched?.file || [],
					isSystem: true,
				};
			}) || [];

		form.setFieldsValue({
			rolesId: record?.rolesId ?? dsRoles?.[0]?.rolesId,
			levelsId: record?.levelsId,
			reflection: record?.reflection,
			evidenceFile: uniqBy(systemEvidence, 'name'),
		});
	}, [visibleForm, record?._id]);

	const onFinish = async (values: any) => {
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

		const payload = {
			rolesId: values.rolesId,
			levelsId: values.levelsId,
			evidenceFile,
			reflection: values.reflection,
		};

		await postActivityOutComeModel(
			record?.activitiesId ?? '',
			payload,
			getData,
			intl.formatMessage({ id: 'global.message.luuthanhcong' }),
		);

		setVisibleForm(false);
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

	const groupedEquivalency = useMemo(() => {
		const map = new Map<
			string,
			{
				_id: string;
				roleName: string;
				desRole: string;
				levelName?: string;
				attributes: { name: string; color?: string }[];
				autoApprove: boolean;
			}
		>();

		record?.activities?.coCurricularActivityEquivalency?.forEach((item) => {
			const roleId = item.roles?._id;
			if (!roleId) return;

			if (!map.has(roleId)) {
				map.set(roleId, {
					_id: roleId,
					roleName: item.roles?.name ?? '',
					desRole: item.roles?.description ?? '',
					levelName: item.roles?.level?.name ?? '',
					attributes: [],
					autoApprove: item?.autoApprove ?? false,
				});
			}

			if (item.attributes?.name) {
				map.get(roleId)!.attributes.push({
					name: item.attributes.name,
					color: item.attributes.color,
				});
			}
		});

		return Array.from(map.values());
	}, [record]);

	const columnsRoles: IColumn<any>[] = [
		{
			title: intl.formatMessage({ id: 'activity.detail.role' }),
			width: 150,
			dataIndex: 'roleName',
		},
		{
			title: intl.formatMessage({ id: 'activity.detail.des' }),
			width: 220,
			dataIndex: 'desRole',
			render: (val) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: intl.formatMessage({ id: 'activity.detail.attributes' }),
			width: 200,
			render: (_, rec) => (
				<Space size={[4, 4]} wrap>
					{rec.attributes?.map((attr: any, idx: number) => (
						<Tag key={idx} color={attr.color}>
							{attr.name}
						</Tag>
					))}
				</Space>
			),
		},
	];

	return (
		<>
			<Card title='Activity Outcome'>
				<Divider className='divider-big-title' orientation='left'>
					Activity Information
				</Divider>
				<Descriptions column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }} style={{ marginBottom: 12 }}>
					<Descriptions.Item label='Activity name' span={24}>
						{record?.activities?.name}
					</Descriptions.Item>
					<Descriptions.Item label='Activity type' span={24}>
						{record?.activities?.activitiesType?.name}
					</Descriptions.Item>
					<Descriptions.Item label='Organizer'>{record?.activities?.organizer}</Descriptions.Item>
					<Descriptions.Item label='Facility'>{record?.activities?.facilityName}</Descriptions.Item>
					<Descriptions.Item label='Start Date'>
						{record?.activities?.startDate ? dayjs(record.activities.startDate).format('HH:mm DD/MM/YYYY') : '-'}
					</Descriptions.Item>
					<Descriptions.Item label='End Date'>
						{record?.activities?.endDate ? dayjs(record.activities.endDate).format('HH:mm DD/MM/YYYY') : '-'}
					</Descriptions.Item>
					<Descriptions.Item label='Workflow'>
						<Tag
							color={
								record?.workflow === EApprovalStatus.APPROVED
									? 'green'
									: record?.workflow === EApprovalStatus.REJECTED
										? 'red'
										: 'orange'
							}
						>
							{record?.workflow}
						</Tag>
					</Descriptions.Item>

					<Descriptions.Item label='Impact'>
						<Tag color={mapEvalidation[record?.validation as Evalidation]}>{record?.validation}</Tag>
					</Descriptions.Item>
					<Descriptions.Item label='Declaration approvers'>{record?.studentDeclarationApproverName}</Descriptions.Item>
					<Descriptions.Item label='Reflection'>{record?.reflection}</Descriptions.Item>
					<Descriptions.Item label='Rejection Note'>{record?.activityRejectionNote}</Descriptions.Item>
					<Descriptions.Item label='Revision Note'>{record?.revisionNote}</Descriptions.Item>
				</Descriptions>

				<Form form={form} layout='vertical' onFinish={onFinish}>
					<Row gutter={[12, 12]}>
						<Col span={24}>
							<Divider className='divider-big-title' orientation='left'>
								General Information
							</Divider>
						</Col>

						<Col span={24}>
							<Form.Item name='rolesId' label='Role' rules={[...rules.required]} style={{ marginBottom: 0 }}>
								<Input type='hidden' />
								<TableStaticData
									columns={columnsRoles}
									data={groupedEquivalency}
									size='small'
									otherProps={{
										pagination: false,
										scroll: { y: 350 },
										rowKey: '_id',
										rowSelection: {
											type: 'radio',
											selectedRowKeys: rolesId ? [rolesId] : [],
											onChange: (selectedRowKeys: React.Key[]) => {
												if (isView) return;

												if (selectedRowKeys.length > 0) {
													const selectedId = selectedRowKeys[0] as string;
													form.setFieldValue('rolesId', selectedId);
												} else {
													form.setFieldValue('rolesId', undefined);
												}
											},
											getCheckboxProps: (record: any) => ({
												disabled: isView,
											}),
										},
									}}
								/>
							</Form.Item>
						</Col>

						<Col span={12}>
							<Form.Item name='levelsId' label='Level' rules={[...rules.required]}>
								<SelectLevelsManagement disabled={isView} />
							</Form.Item>
						</Col>

						<Col span={24}>
							<Form.List name='evidenceFile'>
								{(fields) => (
									<TableStaticData
										columns={columns}
										data={fields}
										otherProps={{ pagination: false, scroll: { y: 400 } }}
										otherButtons={[
											!isView ? (
												<Button type='primary' onClick={() => setOpenAddEvidence(true)} size='small'>
													Add new
												</Button>
											) : (
												<></>
											),
										]}
									/>
								)}
							</Form.List>
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
							<Button type='primary' htmlType='submit' loading={formSubmiting} disabled={!checkbox}>
								Complete
							</Button>
						)}
						<Button onClick={() => setVisibleForm(false)}>Close</Button>
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
					<Button type='primary' htmlType='submit'>
						Add
					</Button>
				</Form>
			</Modal>
		</>
	);
};

export default FormActivityOutCome;
