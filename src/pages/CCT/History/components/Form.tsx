import UploadFile from '@/components/Upload/UploadFile';
import { Activity } from '@/services/CCT/Activity/typing';
import { handleSingleFile } from '@/services/uploadFile';
import { ipCCT } from '@/utils/ip';
import rules from '@/utils/rules';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Collapse, Form, Input, message, Row } from 'antd';
import dayjs from 'dayjs';
import { uniqBy } from 'lodash';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import CardChiTietSuKien from '../../Activity/components/CardChiTietSuKien';
import SelectLevelsManagement from '../../DanhMuc/Levels/Select';
import CardNoteActivity from './CardNote';
import FormCompetencyEvidence from './FormCompetencyEvidence';
import FormRoleEvidence from './FormRoleEvidence';

const uploadFilesOfCompetency = async (files: any[] = []) => {
	if (!files.length) return [];
	const urls = await Promise.all(files.map((f) => handleSingleFile(f, undefined, ipCCT).catch(() => null)));
	return urls.filter(Boolean) as string[];
};

const hasAtLeastOneEvidenceFile = (evidenceFile: any[] = []) => evidenceFile.some((i) => i?.file?.length);

const FormActivityOutCome = (props: any) => {
	const { getData } = props;
	const intl = useIntl();
	const [form] = Form.useForm();

	const { record, setVisibleForm, isView, formSubmiting, visibleForm, postActivityOutComeModel } =
		useModel('cct.activityoutcome');
	const { danhSach: dsLevels } = useModel('cct.levels');

	const dsRoles = uniqBy(record?.activities?.coCurricularActivityEquivalency ?? [], 'rolesId');

	const rolesId: string = Form.useWatch('rolesId', form);
	const levelsId: string = Form.useWatch('levelsId', form);
	const checkbox: boolean = Form.useWatch('checkbox', form);
	const listAchievedCompetencies: string[] = Form.useWatch('listAchievedCompetencies', form);

	const autoLevel = dsLevels?.find((i) => i?._id === levelsId)?.autoApproval;
	const autoRole = dsRoles?.find((i) => i?.rolesId === rolesId)?.roles?.autoApproval;

	const [isSubmit, setIsSubmit] = useState<boolean>(false);

	useEffect(() => {
		if (!visibleForm) {
			form.resetFields();
			return;
		} else {
			form.setFieldsValue({
				rolesId: record?.rolesId ?? dsRoles?.[0]?.rolesId,
				trackId: record?.trackId ?? record?.activities?.activitiesType?.trackId,
				levelsId: record?.levelsId,
				reflection: record?.reflection,
				listAchievedCompetencies: record?.listAchievedCompetencies?.length
					? record?.listAchievedCompetencies?.map((item) => item?.competencyId)
					: record?.activities?.competencyList?.map((item) => item?.competencyId),
				evidenceFile: record?.evidenceFile?.map((item: any) => ({
					name: item.name,
					file: item.file,
				})),
			});
		}
	}, [visibleForm, record?._id]);

	const onFinish = async (values: any, submitted: boolean) => {
		const evidenceFile = await Promise.all(
			(values.evidenceFile || []).map(async (item: any) => ({
				name: item.name,
				file: await uploadFilesOfCompetency(item?.file?.fileList),
			})),
		);

		if (autoLevel && autoRole && !hasAtLeastOneEvidenceFile(evidenceFile)) {
			message.warning(intl.formatMessage({ id: 'activity.outcome.warning' }));
			return;
		}

		const payload = {
			rolesId: values.rolesId,
			levelsId: values.levelsId,
			trackId: values.trackId,
			evidenceFile,
			reflection: values.reflection,
			listAchievedCompetencies: values.listAchievedCompetencies?.map((id: any) => ({
				competencyId: id,
			})),
			submitted,
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
		<Form form={form} layout='vertical' onFinish={(values) => onFinish(values, isSubmit)}>
			{!!record?.revisionNote && <CardNoteActivity />}
			<Row gutter={[12, 12]}>
				<Col span={24}>
					<Form.Item name='rolesId' label={intl.formatMessage({ id: 'activity.outcome.role' })}>
						<FormRoleEvidence
							equivalency={record?.activities?.coCurricularActivityEquivalency ?? []}
							select
							rolesId={rolesId}
							form={form}
						/>
					</Form.Item>
				</Col>

				{/* <Col span={12}>
					<Form.Item name='trackId' label='Track' rules={[...rules.required]}>
						<SelectTrack disabled={isView} />
					</Form.Item>
				</Col> */}

				<Col span={24} md={24}>
					<Form.Item
						name='levelsId'
						label={intl.formatMessage({ id: 'activity.outcome.level' })}
						rules={[...rules.required]}
					>
						<SelectLevelsManagement disabled={isView} />
					</Form.Item>
				</Col>

				<Col span={24}>
					<div className='fw500' style={{ marginBottom: 6 }}>
						{intl.formatMessage({ id: 'activity.outcome.evidence' })}
					</div>

					<div style={{ marginBottom: 10 }}>
						<i className='text-info'>
							({intl.formatMessage({ id: 'activity.outcome.suggest' })}:{' '}
							{record?.activities?.activitiesType?.requiredEvidenceList
								?.map((item) => item)
								.filter(Boolean)
								.join(', ')}
							)
						</i>
					</div>

					<Form.List name='evidenceFile'>
						{(fields, { add, remove }, { errors }) => (
							<>
								{fields.map((field, index) => (
									<Row gutter={[12, 0]} key={field.key}>
										<Col span={24} md={12}>
											<Form.Item
												label={intl.formatMessage({ id: 'activity.outcome.evidence.name' })}
												name={[index, 'name']}
												rules={[...rules.required]}
											>
												<Input
													placeholder={intl.formatMessage({ id: 'activity.outcome.evidence.name.placeholder' })}
													disabled={isView}
												/>
											</Form.Item>
										</Col>
										<Col span={22} md={10}>
											<Form.Item
												label={intl.formatMessage({ id: 'activity.outcome.evidence.file' })}
												name={[index, 'file']}
												rules={[...rules.required]}
											>
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
													title={intl.formatMessage({ id: 'activity.outcome.delete' })}
													icon={<DeleteOutlined />}
													onClick={() => remove(field.name)}
												/>
											</div>
										</Col>
										<Form.ErrorList errors={errors} />
									</Row>
								))}

								<Button onClick={() => add()} icon={<PlusOutlined />} type='dashed' size='small' disabled={isView}>
									{intl.formatMessage({ id: 'activity.outcome.evidence.update' })}
								</Button>
							</>
						)}
					</Form.List>
				</Col>

				<Col span={24}>
					<Form.Item name='listAchievedCompetencies' label={intl.formatMessage({ id: 'activity.outcome.competency' })}>
						<FormCompetencyEvidence listAchievedCompetencies={listAchievedCompetencies} form={form} />
					</Form.Item>
				</Col>

				<Col span={24}>
					<Form.Item
						name='reflection'
						label={intl.formatMessage({ id: 'activity.outcome.reflection' })}
						rules={[...rules.required, ...rules.text, ...rules.length(300)]}
					>
						<Input.TextArea
							rows={3}
							disabled={isView}
							placeholder={intl.formatMessage({ id: 'activity.outcome.reflection.placeholder' })}
							showCount
						/>
					</Form.Item>
				</Col>

				<Col span={24}>
					<Collapse>
						<Collapse.Panel key={0} header={intl.formatMessage({ id: 'activity.outcome.activity.detail' })}>
							<CardChiTietSuKien
								record={
									{
										...record?.activities,
										activityOutcome: record,
									} as Activity.IRecord
								}
								evidenceDeadline={record?.dueDate ? dayjs(record?.dueDate).format('HH:mm DD/MM/YYYY') : '--'}
							/>
						</Collapse.Panel>
					</Collapse>
				</Col>

				{!isView && (
					<Col span={24}>
						<Form.Item name='checkbox' valuePropName='checked'>
							<Checkbox>{intl.formatMessage({ id: 'activity.outcome.confirm' })}</Checkbox>
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
							{intl.formatMessage({ id: 'activity.outcome.submit' })}
						</Button>

						<Button
							htmlType='submit'
							loading={formSubmiting}
							disabled={listAchievedCompetencies?.length > 3}
							onClick={() => setIsSubmit(false)}
						>
							{intl.formatMessage({ id: 'activity.outcome.save' })}
						</Button>
					</>
				)}
				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'activity.outcome.close' })}</Button>
			</div>
		</Form>
	);
};

export default FormActivityOutCome;
