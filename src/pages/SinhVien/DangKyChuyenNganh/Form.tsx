import SelectChuyenNganh from '@/pages/DaoTao/Nganh/SelectChuyenNganh';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormSinhVienDotDangKy = (props: { title?: string; getData?: () => void; [key: string]: any }) => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postDangKyModel, formSubmiting, visibleForm, dotHienHanh } = useModel(
		'sinhvien.dangkychuyennganh.sinhvien',
	);
	const { record: recSinhVien } = useModel('sinhvien.sinhvien');
	const { title = '', getData } = props;

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) form.setFieldsValue(record);
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		if (dotHienHanh?._id)
			postDangKyModel({ ...values, dotDangKyChuyenNganhId: dotHienHanh?._id ?? '' }, getData)
				.then(() => setVisibleForm(false))
				.catch((er) => console.log(er));
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col xs={24}>
						<Form.Item label='Đợt đăng ký chuyên ngành'>
							<Input value={dotHienHanh?.ten} disabled />
						</Form.Item>
					</Col>

					<Col xs={24}>
						<Form.Item label='Sinh viên'>
							<Input value={`${recSinhVien?.ten} - ${recSinhVien?.ma}`} disabled />
						</Form.Item>
					</Col>

					<Col xs={24}>
						<Form.Item name='maChuyenNganh' label='Chuyên ngành đăng ký' rules={[...rules.required]}>
							<SelectChuyenNganh selectMa maNganh={recSinhVien?.maNganh} disabled={!recSinhVien?.maNganh} />
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

export default FormSinhVienDotDangKy;
