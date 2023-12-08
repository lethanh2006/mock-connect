import type { GiaoDich } from '@/services/TaiChinh/GiaoDich/typing';
import { ETransactionPaymentType } from '@/services/TaiChinh/constant';
import { inputFormat, inputParse } from '@/utils/utils';
import { Alert, Button, Card, Col, Form, InputNumber, Popconfirm, Row } from 'antd';
import { useModel } from 'umi';
import HuongDanThanhToan from '../../HoaDon/ThanhToan/HuongDanThanhToan';
import TableUuDaiHienHanh from '../../UuDaiThanhToan/TableUuDaiHienHanh';

/** Form đóng trước học phí */
const FormDongTruocHocPhi = (props: any) => {
	const { getData } = props;
	const [form] = Form.useForm();
	const { dongTruocHocPhiModel, loading, setVisibleForm } = useModel('taichinh.giaodich');
	const { paymentType, setVisibleHuongDan, infoMomo } = useModel('taichinh.hoadon');
	const amount: number = Form.useWatch('amount', form) ?? 0;

	const onFinish = (values: GiaoDich.TDongTruocHocPhi) => {
		dongTruocHocPhiModel(values)
			.then(() => {
				getData();
				setVisibleForm(false);
				if (paymentType === ETransactionPaymentType.BANK) setVisibleHuongDan(true);
				else if (paymentType === ETransactionPaymentType.MOMO_WALLET && !!infoMomo?.payUrl)
					window.location.href = infoMomo.payUrl;
			})
			.catch((err) => console.log(err));
	};

	return (
		<>
			<Card title='Đóng trước học phí'>
				<Form layout='vertical' form={form} onFinish={onFinish}>
					<Row gutter={[12, 12]}>
						<Col span={24}>
							<Alert showIcon description='Đóng trước học phí cả năm để được hưởng những ưu đãi hấp dẫn !' />
						</Col>
						<Col span={24}>
							<div className='fw500'>Danh sách ưu đãi có hiệu lực</div>
						</Col>
						<Col span={24}>
							<TableUuDaiHienHanh onCellClick={(rec) => form.setFieldsValue({ amount: rec.mucPhiApDung })} />
						</Col>

						<Col span={24} md={8}>
							<Form.Item name='amount' label='Số tiền nộp trước' extra='Nộp tối thiểu Ngưỡng hưởng để nhận được ưu đãi'>
								<InputNumber
									placeholder='Nhập số tiền nộp'
									addonAfter='VND'
									formatter={inputFormat}
									parser={inputParse}
									style={{ width: '100%' }}
									step={1000}
									min={0}
								/>
							</Form.Item>
						</Col>

						<Col span={24}>
							<div className='fw500'>Hình thức thanh toán</div>
						</Col>
						<Col span={24}>
							<HuongDanThanhToan amount={amount} isRequired />
						</Col>
					</Row>

					<div className='form-footer'>
						<Popconfirm title='Xác nhận thanh toán?' disabled={!amount} onConfirm={() => form.submit()}>
							<Button loading={loading} type='primary' htmlType='submit' disabled={!amount}>
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

export default FormDongTruocHocPhi;
