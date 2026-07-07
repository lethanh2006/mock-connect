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
						name='hoTen'
						label='Parent/Guardian Name'
						rules={[{ required: true, message: 'Vui lòng nhập họ tên người thân' }]}
					>
						<Input placeholder='Nhập họ tên người thân' />
					</Form.Item>
				</Col>

				<Col span={24}>
					<Form.Item
						name='moiQuanHe'
						label='Relationship'
						rules={[{ required: true, message: 'Vui lòng chọn mối quan hệ' }]}
					>
						<Select
							placeholder='Chọn mối quan hệ'
							options={[
								{ label: 'Father', value: 'Father' },
								{ label: 'Mother', value: 'Mother' },
								{ label: 'Guardian', value: 'Guardian' },
								{ label: 'Other', value: 'Other' },
							]}
						/>
					</Form.Item>
				</Col>

				<Col span={24}>
					<Form.Item
						name='sdtChinh'
						label='Primary Contact Number'
						rules={[{ required: true, message: 'Vui lòng nhập số điện thoại chính' }]}
					>
						<Input placeholder='Nhập số điện thoại chính' />
					</Form.Item>
				</Col>

				<Col span={24}>
					<Form.Item name='sdtPhu' label='Secondary Contact Number'>
						<Input placeholder='Nhập số điện thoại phụ' />
					</Form.Item>
				</Col>

				<Col span={24}>
					<Form.Item name='email' label='Email' rules={[{ type: 'email', message: 'Email không hợp lệ' }]}>
						<Input placeholder='Nhập email' />
					</Form.Item>
				</Col>

				<Col span={24}>
					<Form.Item name='diaChi' label='Address'>
						<Input.TextArea rows={3} placeholder='Nhập địa chỉ' />
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
