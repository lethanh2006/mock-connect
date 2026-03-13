/* eslint-disable no-underscore-dangle */
import rules from '@/utils/rules';
import { Button, Card, Form } from 'antd';
import { useModel } from 'umi';
import SelectNamHoc from '../../components/SelectNamHoc';

const FormChonDot = (props: { onCancel: any; title?: string }) => {
	const [form] = Form.useForm();
	const { record } = useModel('khoahoc.danhmuc.namhoc');
	const {
		setRecord: setRecordSanPham,
		setEdit,
		setIsView,
		setVisibleForm,
		setQuyDoiDiem,
		setQuyDoiGio,
	} = useModel('khoahoc.sanphamnckh');

	const { danhSach, setRecord } = useModel('khoahoc.danhmuc.namhoc');

	return (
		<Card title='Chọn năm học/học kỳ muốn thêm mới'>
			<Form
				onFinish={async (values) => {
					setRecordSanPham(undefined);
					setEdit(false);
					setIsView(false);
					setVisibleForm(true);
					setQuyDoiDiem({});
					setQuyDoiGio({});
					setRecord(danhSach.find((item) => item._id === values?.idNamHoc));
					props?.onCancel();
				}}
				form={form}
				labelCol={{ span: 24 }}
			>
				<Form.Item
					initialValue={record?._id}
					rules={[...rules.required]}
					name='idNamHoc'
					label={`Giảng viên/cán bộ thực hiện ${props?.title ?? 'sản phẩm/hoạt động'} trong Học kỳ/năm học nào?`}
				>
					<SelectNamHoc style={{ width: '100%' }} key={'1'} allowClear={false} />
				</Form.Item>

				<Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
					<Button style={{ marginRight: 8 }} htmlType='submit' type='primary'>
						OK
					</Button>
					<Button
						onClick={() => {
							props?.onCancel();
						}}
					>
						Đóng
					</Button>
				</Form.Item>
			</Form>
		</Card>
	);
};

export default FormChonDot;
