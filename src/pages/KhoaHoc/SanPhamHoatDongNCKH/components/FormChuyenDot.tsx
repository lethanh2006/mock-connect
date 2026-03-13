/* eslint-disable no-underscore-dangle */
import rules from '@/utils/rules';
import { Button, Card, Form } from 'antd';
import { useModel } from 'umi';
import SelectNamHoc from '../../components/SelectNamHoc';

const FormChuyenDot = (props: { onCancel: any; getData: any }) => {
	const [form] = Form.useForm();
	const { record } = useModel('khoahoc.danhmuc.namhoc');
	const { record: recSanPham } = useModel('khoahoc.sanphamnckh');
	const { chuyenDotSanPhamModel } = useModel('khoahoc.sanphamnckh');

	return (
		<Card title='Chọn năm học/học kỳ muốn chuyển'>
			<Form
				onFinish={async (values) => {
					await chuyenDotSanPhamModel(recSanPham?._id ?? '', values?.idNamHoc, props.getData);
					props?.onCancel();
				}}
				form={form}
				labelCol={{ span: 24 }}
			>
				<Form.Item initialValue={recSanPham?.dotId} label='Học kỳ/năm học hiện tại của sản phẩm/hoạt động'>
					<SelectNamHoc disabled style={{ width: '100%' }} key={'1'} allowClear={false} />
				</Form.Item>
				<Form.Item
					initialValue={record?._id}
					rules={[...rules.required]}
					name='idNamHoc'
					label='Bạn muốn chuyển sản phẩm/hoạt động tới Học kỳ/năm học nào?'
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

export default FormChuyenDot;
