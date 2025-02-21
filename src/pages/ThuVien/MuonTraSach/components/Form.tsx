import MyDatePicker from '@/components/MyDatePicker';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormMuonTra = (props: any) => {
	const { getData } = props;
	const [form] = Form.useForm();
	const { record, chinhSuaMuonTraMeModel, setVisibleForm, formSubmiting, visibleForm } = useModel('thuvien.muonsach');

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else {
			form.setFieldsValue(record);
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		chinhSuaMuonTraMeModel(record?._id ?? '', values, getData)
			.then(() => {
				setVisibleForm(false);
			})
			.catch((er) => console.log(er));
	};

	return (
		<Card title='Chỉnh sửa mượn trả'>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col xs={24} md={12}>
						<Form.Item name='thoiGianMuonDuKien' label='Thời gian dự kiến mượn' rules={[...rules.required]}>
							<MyDatePicker />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name='thoiGianTraDuKien' label='Thời gian dự kiến trả' rules={[...rules.required]}>
							<MyDatePicker />
						</Form.Item>
					</Col>
					<Col xs={24} md={24}>
						<Form.Item name='ghiChuDangKy' label='Ghi chú'>
							<Input.TextArea rows={3} placeholder='Nhập ghi chú' />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						Xác nhận
					</Button>
					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormMuonTra;
