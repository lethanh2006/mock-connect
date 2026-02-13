import ExpandText from '@/components/ExpandText';
import TableStaticData from '@/components/Table/TableStaticData';
import { IColumn } from '@/components/Table/typing';
import UploadFile from '@/components/Upload/UploadFile';
import { Activity } from '@/services/CCT/Activity/typing';
import { handleSingleFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Collapse, Divider, Form, Input, message, Row, Space, Tag } from 'antd';
import { uniqBy } from 'lodash';
import { useEffect, useMemo } from 'react';
import { useIntl, useModel } from 'umi';
import CardChiTietSuKien from '../../Activity/components/CardChiTietSuKien';
import SelectLevelsManagement from '../../DanhMuc/Levels/Select';
import SelectTrack from '../../DanhMuc/Track/Select';

const MAX_SELECT = 3;

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

	const { record, setVisibleForm, isView, edit, formSubmiting, visibleForm, postActivityOutComeModel } =
		useModel('cct.activityoutcome');
	const { danhSach: dsLevels } = useModel('cct.levels');
	const { danhSach: dscompetency, loading, getAllModel: getAllAttriCompetency } = useModel('cct.competency');

	const dsRoles = uniqBy(record?.activities?.coCurricularActivityEquivalency ?? [], 'rolesId');

	const rolesId: string = Form.useWatch('rolesId', form);
	const levelsId: string = Form.useWatch('levelsId', form);
	const checkbox: boolean = Form.useWatch('checkbox', form);
	const competencyList: string[] = Form.useWatch('competencyList', form);

	const autoLevel = dsLevels?.find((i) => i?._id === levelsId)?.autoApproval;
	const autoRole = dsRoles?.find((i) => i?.rolesId === rolesId)?.roles?.autoApproval;

	useEffect(() => {
		if (!visibleForm) {
			form.resetFields();
			return;
		}

		form.setFieldsValue({
			rolesId: record?.rolesId ?? dsRoles?.[0]?.rolesId,
			levelsId: record?.levelsId,
			reflection: record?.reflection,
			competencyList: record?.competencyList
				? record?.competencyList?.map((item) => item?.competencyId)
				: edit
					? record?.activities?.competencyList?.map((item) => item?.competencyId)
					: [],
		});

		getAllAttriCompetency();
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

	const columns: IColumn<Competency.IRecord>[] = [
		{
			title: 'Name',
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
			<Form form={form} layout='vertical' onFinish={onFinish}>
				<Row gutter={[12, 12]}>
					<Col span={24}>
						<Divider className='divider-big-title' orientation='left'>
							Role
						</Divider>
					</Col>

					<Col span={24}>
						<Form.Item name='rolesId'>
							<TableStaticData
								columns={columnsRoles}
								data={groupedEquivalency}
								otherProps={{
									pagination: false,
									scroll: { y: 250 },
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
						<Form.Item name='trackId' label='Track' rules={[...rules.required]}>
							<SelectTrack disabled={isView} />
						</Form.Item>
					</Col>

					<Col span={12}>
						<Form.Item name='levelsId' label='Level' rules={[...rules.required]}>
							<SelectLevelsManagement disabled={isView} />
						</Form.Item>
					</Col>

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
							Competency
						</Divider>
					</Col>

					<Col span={24}>
						<Form.Item name='competencyList'>
							<TableStaticData
								columns={columns}
								data={dscompetency}
								loading={loading}
								hasTotal
								onReload={getAllAttriCompetency}
								otherProps={{
									pagination: false,
									scroll: { y: 250 },
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
								otherButtons={[<i className='text-info'>An activity allows a maximum of 3 competencies</i>]}
							/>
						</Form.Item>
					</Col>

					{!isView && (
						<Col span={24}>
							<Form.Item name='checkbox' valuePropName='checked'>
								<Checkbox>I hereby declare that the information provided is accurate.</Checkbox>
							</Form.Item>
						</Col>
					)}

					<Col span={24}>
						<Collapse>
							<Collapse.Panel key={0} header={'Detail Activity'}>
								<CardChiTietSuKien record={record?.activities ?? ({} as Activity.IRecord)} />
							</Collapse.Panel>
						</Collapse>
					</Col>
				</Row>

				<div className='form-footer'>
					{!isView && (
						<Button type='primary' htmlType='submit' loading={formSubmiting} disabled={!checkbox}>
							Save Evidence
						</Button>
					)}
					<Button onClick={() => setVisibleForm(false)}>Close</Button>
				</div>
			</Form>
		</>
	);
};

export default FormActivityOutCome;
