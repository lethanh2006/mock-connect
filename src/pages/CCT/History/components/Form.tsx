import UploadFile from '@/components/Upload/UploadFile';
import { Activity } from '@/services/CCT/Activity/typing';
import { EApprovalStatus } from '@/services/CCT/constant';
import { handleSingleFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Collapse, Divider, Form, Input, message, Row } from 'antd';
import { uniqBy } from 'lodash';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import CardChiTietSuKien from '../../Activity/components/CardChiTietSuKien';
import SelectLevelsManagement from '../../DanhMuc/Levels/Select';
import SelectTrack from '../../DanhMuc/Track/Select';
import CardNoteActivity from './CardNote';
import FormCompetencyEvidence from './FormCompetencyEvidence';
import FormRoleEvidence from './FormRoleEvidence';

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

	return (
		<Form form={form} layout='vertical' onFinish={onFinish}>
			{(record?.workflow === EApprovalStatus.CHANGES_REQUIRED || record?.workflow === EApprovalStatus.REJECTED) && (
				<CardNoteActivity />
			)}
			<Row gutter={[12, 12]}>
				<Col span={24}>
					<Divider className='divider-big-title' orientation='left'>
						Role
					</Divider>
				</Col>

				<Col span={24}>
					<Form.Item name='rolesId'>
						<FormRoleEvidence select rolesId={record?.rolesId} form={form} />
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
						<FormCompetencyEvidence competencyList={competencyList} form={form} />
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

				<Col span={24}>
					<Collapse>
						<Collapse.Panel key={0} header={'Detail Activity'}>
							<CardChiTietSuKien record={record?.activities ?? ({} as Activity.IRecord)} />
						</Collapse.Panel>
					</Collapse>
				</Col>
			</Row>

			<div className='form-footer'>
				<Button onClick={() => setVisibleForm(false)}>Close</Button>
				{!isView && (
					<Button type='primary' htmlType='submit' loading={formSubmiting} disabled={!checkbox}>
						Save
					</Button>
				)}
			</div>
		</Form>
	);
};

export default FormActivityOutCome;
