import rules from '@/utils/rules';
import { useModel } from '@umijs/max';
import { Button, Card, Col, Form, Input, Row, Spin } from 'antd';
import { useEffect } from 'react';

const FormTag = () => {
	const [form] = Form.useForm();
	const { record, edit, postModel, putModel, setVisibleForm, loading } = useModel('quytrinh.tags');
	const onFinish = async (values: any) => {
		try {
			const payload = {
				...values,
			};
			if (edit) {
				putModel(record?._id, payload);
			} else {
				postModel(payload);
			}
		} catch (e) {
			console.log(e);
		}
	};
	useEffect(() => {
		if (record && edit) {
			form.setFieldsValue(record);
		}
	}, [record, edit]);
	return (
		<Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
			<Spin spinning={loading}>
				<Form onFinish={onFinish} layout={'vertical'} form={form}>
					<Row gutter={[16, 16]}>
						<Col span={24}>
							<Form.Item label={'Tên nhãn'} name={'ten'} rules={[...rules.required, ...rules.length(100)]}>
								<Input placeholder={'Nhập tên nhãn'} autoFocus />
							</Form.Item>
						</Col>

						<Col span={24}>
							<Form.Item>
								<div style={{ display: 'flex', justifyContent: 'center' }}>
									<Button style={{ marginRight: 8 }} type={'primary'} htmlType={'submit'}>
										{edit ? 'Lưu' : 'Thêm mới'}
									</Button>
									<Button
										onClick={() => {
											setVisibleForm(false);
										}}
									>
										Đóng
									</Button>
								</div>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Spin>
		</Card>
	);
};
export default FormTag;
