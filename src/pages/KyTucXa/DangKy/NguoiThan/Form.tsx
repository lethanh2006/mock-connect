import { PhieuDangKyKTX } from '@/services/KyTucXa/PhieuDangKy/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const FormNguoiThanKTX = (props: { onOk: (val: PhieuDangKyKTX.INguoiThan) => void }) => {
	const intl = useIntl();
	const [form] = Form.useForm();
	const { onOk } = props;
	const { setVisibleForm, visibleForm, record, edit, isView } = useModel('kytucxa.nguoithan');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?.index) form.setFieldsValue(record);
	}, [visibleForm, record?.index]);

	const onFinish = async (values: PhieuDangKyKTX.INguoiThan) => {
		onOk({ ...values });
	};

	return (
		<Form onFinish={onFinish} form={form} layout='vertical' disabled={isView}>
			<Row gutter={[12, 0]}>
				<Col span={24}>
					<Form.Item
						name='emergencyContactName'
						label={intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.field.name' })}
						rules={rules.required}
					>
						<Input placeholder={intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.field.name.placeholder' })} />
					</Form.Item>
				</Col>

				<Col span={24}>
					<Form.Item
						name='emergencyRelationship'
						label={intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.field.relationship' })}
						rules={rules.required}
					>
						<Select
							placeholder={intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.field.relationship.placeholder' })}
							options={[
								{
									label: intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.relationship.father' }),
									value: 'Father',
								},
								{
									label: intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.relationship.mother' }),
									value: 'Mother',
								},
								{
									label: intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.relationship.guardian' }),
									value: 'Guardian',
								},
								{
									label: intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.relationship.other' }),
									value: 'Other',
								},
							]}
						/>
					</Form.Item>
				</Col>

				<Col span={24}>
					<Form.Item
						name='emergencyContactNumber'
						label={intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.field.primaryPhone' })}
						rules={[...rules.required, ...rules.soDienThoai]}
					>
						<Input
							placeholder={intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.field.primaryPhone.placeholder' })}
						/>
					</Form.Item>
				</Col>

				<Col span={24}>
					<Form.Item
						name='secondaryContactNumber'
						label={intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.field.secondaryPhone' })}
					>
						<Input
							placeholder={intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.field.secondaryPhone.placeholder' })}
						/>
					</Form.Item>
				</Col>

				<Col span={24}>
					<Form.Item
						name='emergencyEmail'
						label={intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.field.email' })}
						rules={rules.email}
					>
						<Input placeholder={intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.field.email.placeholder' })} />
					</Form.Item>
				</Col>

				<Col span={24}>
					<Form.Item
						name='address'
						label={intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.field.address' })}
						rules={rules.required}
					>
						<Input.TextArea
							rows={3}
							placeholder={intl.formatMessage({ id: 'kytucxa.dangky.nguoithan.field.address.placeholder' })}
						/>
					</Form.Item>
				</Col>
			</Row>

			<div className='form-footer'>
				{!isView ? (
					<Button htmlType='submit' type='primary'>
						{!edit
							? intl.formatMessage({ id: 'global.button.themmoi' })
							: intl.formatMessage({ id: 'global.button.luulai' })}
					</Button>
				) : null}

				<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
			</div>
		</Form>
	);
};

export default FormNguoiThanKTX;
