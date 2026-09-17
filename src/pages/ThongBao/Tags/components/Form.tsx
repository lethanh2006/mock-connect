import { Button } from '@/components/Icons';
import Input from '@/components/MyInput';
import { Card } from '@/components/PageCard';
import rules from '@/utils/rules';
import { Col, Form, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const { TextArea } = Input;

const FormTags = () => {
	const { setVisibleForm, edit, record, postModel, putModel, formSubmiting } = useModel('thongbao.tags');
	const [form] = Form.useForm();

	const handleFinish = async (values: any) => {
		try {
			if (edit) {
				putModel(record?._id, { ...values });
			} else {
				postModel({ ...values });
			}
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		if (edit) {
			form.setFieldsValue({ ...record });
		}
	}, [record, edit]);

	return (
		<Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
			<Form onFinish={handleFinish} form={form} layout='vertical'>
				<Row gutter={16}>
					<Col span={24}>
						<Form.Item label='Tên nhãn dán' name='ten' rules={[...rules.required]}>
							<Input placeholder='Nhập tên nhãn' />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item label='Mô tả' name='moTa' rules={[...rules.required]}>
							<TextArea placeholder='Nhập mô tả' rows={3} />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button type='submit' variant='default' loading={formSubmiting}>
						Lưu
					</Button>
					<Button
						type='button'
						variant='outline'
						onClick={() => {
							setVisibleForm(false);
						}}
					>
						Đóng
					</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormTags;
