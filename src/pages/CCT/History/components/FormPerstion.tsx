import MyDatePicker from '@/components/MyDatePicker';
import UploadFile from '@/components/Upload/UploadFile';
import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import { EparticipantRole, EParticipantScope } from '@/services/CCT/constant';
import { buildUpLoadMultiFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row, Select } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import SelectActivitiesManagement from '../../Activities/Select';
import SelectRolesManagement from '../../Roles/Select';

const FormPerstionActivityOutCome = (props: any) => {
	const { getData } = props;
	const intl = useIntl();
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, isView, postModel, putModel, formSubmiting, visibleForm, setFormSubmiting } =
		useModel('cct.activityoutcome');
	const { danhSach: dsActivitiType } = useModel('cct.activities');
	const { danhSach: dsRoles } = useModel('cct.roles');

	const startDate: Date = Form.useWatch('startDate', form);
	const activitiesTypeId: string = Form.useWatch('activitiesTypeId', form);
	const rolesId: string = Form.useWatch('rolesId', form);

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);

		if (!record?._id) {
			form.setFieldsValue({
				participantScope: EParticipantScope.UNIVERSITY,
				participantRole: EparticipantRole.ALL,
				cct: true,
				allowPostEventResultsUpdate: false,
				onCampus: true,
			});
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: ActivityOutCome.IRecord) => {
		setFormSubmiting(true);
		const file = await buildUpLoadMultiFile(values, 'file');
		values.file = file;
		setFormSubmiting(false);

		if (edit) {
			putModel(record?._id ?? '', values, getData)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel(values, getData)
				.then()
				.catch((er) => console.log(er));
	};

	return (
		<Card title={intl.formatMessage({ id: 'activity.perstion.title' })}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={24}>
						<Form.Item
							name='activitiesOutcomeName'
							label={intl.formatMessage({ id: 'activity.perstion.activitiesOutcomeName' })}
							rules={[...rules.required]}
						>
							<Input
								placeholder={intl.formatMessage({ id: 'activity.perstion.activitiesOutcomeName.place' })}
								disabled={isView}
							/>
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item
							name='activitiesTypeId'
							label={intl.formatMessage({ id: 'activity.perstion.activitiesTypeId' })}
							rules={[...rules.required]}
						>
							<SelectActivitiesManagement disabled={isView} />
						</Form.Item>
					</Col>
					<Col span={24} md={12}>
						<Form.Item label={intl.formatMessage({ id: 'activity.perstion.activitiesTypeId.mapping' })}>
							<Input
								disabled
								value={
									dsActivitiType?.find((item) => item?._id === activitiesTypeId)?.attributes?.name ??
									intl.formatMessage({ id: 'activity.perstion.activitiesTypeId.select' })
								}
							/>
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
							rules={[...rules.required, ...rules.sauNgay(dayjs(startDate))]}
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
					<Col span={24}>
						<Form.Item
							name='organizer'
							label={intl.formatMessage({ id: 'activity.perstion.organizer' })}
							rules={[...rules.required]}
						>
							<Input placeholder={intl.formatMessage({ id: 'activity.perstion.organizer.place' })} disabled={isView} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							name='location'
							label={intl.formatMessage({ id: 'activity.perstion.location' })}
							rules={[...rules.required]}
						>
							<Input placeholder='Enter location' disabled={isView} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name='description' label={intl.formatMessage({ id: 'activity.perstion.description' })}>
							<Input.TextArea
								rows={3}
								placeholder={intl.formatMessage({ id: 'activity.perstion.description.place' })}
								disabled={isView}
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
						<Form.Item label='Level'>
							<Input
								disabled
								value={
									dsRoles?.find((item) => item?._id === rolesId)?.level?.name ??
									intl.formatMessage({ id: 'activity.perstion.rolesId.select' })
								}
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name='learningOutcomes' label={intl.formatMessage({ id: 'activity.perstion.learningOutcomes' })}>
							<Input.TextArea
								rows={3}
								placeholder={intl.formatMessage({ id: 'activity.perstion.learningOutcomes.place' })}
								disabled={isView}
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name='file' label={intl.formatMessage({ id: 'activity.perstion.file' })}>
							<UploadFile maxCount={5} disabled={isView} />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							name='studentDeclarationApproverSsoId'
							label={intl.formatMessage({ id: 'activity.perstion.studentDeclarationApproverSsoId' })}
							rules={[...rules.required]}
						>
							<Select
								placeholder={intl.formatMessage({
									id: 'activity.perstion.studentDeclarationApproverSsoId.select',
								})}
								options={dsActivitiType
									?.find((item) => item?._id === activitiesTypeId)
									?.studentDeclarationApproverList?.map((item) => ({
										value: item.ssoId,
										label: item.name,
										rawData: item,
									}))}
								onChange={(val, option: any) => {
									const nhanSu = option?.rawData;
									form.setFieldsValue({
										studentDeclarationApproverName: nhanSu?.name,
									});
								}}
								disabled={isView}
							/>
						</Form.Item>
						<Form.Item name='studentDeclarationApproverName' hidden />
					</Col>
				</Row>

				<div className='form-footer'>
					{!isView && (
						<Button loading={formSubmiting} htmlType='submit' type='primary'>
							{!edit
								? intl.formatMessage({ id: 'global.button.themmoi' })
								: intl.formatMessage({ id: 'global.button.chinhsua' })}
						</Button>
					)}
					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.dong' })}</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormPerstionActivityOutCome;
