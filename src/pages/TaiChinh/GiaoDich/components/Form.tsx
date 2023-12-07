import type { GiaoDich } from '@/services/TaiChinh/GiaoDich/typing';
import { inputFormat } from '@/utils/utils';
import { Button, Card, Col, Form, InputNumber, Popconfirm, Row } from 'antd';
import { useModel } from 'umi';
import HuongDanThanhToan from '../../HoaDon/ThanhToan/HuongDanThanhToan';

const FormGiaoDich = (props: any) => {
	const { getData } = props;
	const [form] = Form.useForm();
	const { dongTruocHocPhiModel, loading, setVisibleForm } = useModel('taichinh.giaodich');
	const amountPay: number = Form.useWatch('amount', form) ?? 0;

	const onFinish = (values: GiaoDich.TDongTruocHocPhi) => {
		dongTruocHocPhiModel(values)
			.then(() => (getData(), setVisibleForm(false)))
			.catch((err) => console.log(err));
	};
	return (
		<>
			<Card title='Đóng trước học phí'>
				<Form layout='vertical' form={form} onFinish={onFinish}>
					<Row gutter={[12, 0]}>
						<Col span={24}>
							<Col md={8}>
								<Form.Item name='amount' label='Số điền đóng'>
									<InputNumber
										placeholder='Nhập số tiền đóng'
										addonAfter='VND'
										formatter={inputFormat}
										style={{ width: '100%' }}
									/>
								</Form.Item>
							</Col>
						</Col>

						<Col span={24}>
							<div className='fw500'>Hình thức thanh toán</div>
						</Col>
						<Col span={24}>
							<HuongDanThanhToan isDongTruoc amountPay={amountPay} />
						</Col>
					</Row>
					<div className='form-footer'>
						<Popconfirm title='			Xác nhận thanh toán?' onConfirm={() => form.submit()}>
							<Button loading={loading} type='primary'>
								Thanh toán
							</Button>
						</Popconfirm>

						<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
					</div>
				</Form>
			</Card>
		</>
	);
};

export default FormGiaoDich;
