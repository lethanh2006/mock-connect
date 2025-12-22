import type { GiaoDich } from '@/services/TaiChinh/GiaoDich/typing';
import { ETransactionPaymentType } from '@/services/TaiChinh/constant';
import { inputFormat, inputParse, resetFieldsForm } from '@/utils/utils';
import { Alert, Button, Card, Col, Form, InputNumber, Popconfirm, Row } from 'antd';
import { useIntl, useModel } from 'umi';
import HuongDanThanhToan from '../../HoaDon/ThanhToan/HuongDanThanhToan';
import TableUuDaiHienHanh from '../../UuDaiThanhToan/TableUuDaiHienHanh';

/** Form đóng trước học phí */
const FormDongTruocHocPhi = (props: { getData?: () => void; [key: string]: any }) => {
	const intl = useIntl();
	const { getData } = props;
	const [form] = Form.useForm();
	const {
		dongTruocHocPhiModel,
		formSubmiting,
		setVisibleForm,
		paymentType,
		setVisibleHuongDan,
		thanhToanMomoModel,
		setRecord,
	} = useModel('taichinh.giaodich');
	const { record: recDotThu, getByIdModel: getDotThu } = useModel('taichinh.dotthu');
	const amount: number = Form.useWatch('amount', form) ?? 0;

	const handleShowModalThanhToan = async (tran: GiaoDich.IRecord) => {
		// Get đợt thu trước khi hiển thị modal để lấy thông tin kênh thanh toán
		if (recDotThu?._id !== tran.idDotThu || (!!recDotThu.kenhThanhToanId && !recDotThu.kenhThanhToan?._id))
			await getDotThu(tran.idDotThu);
		// Set record để hiển thị thông tin thanh toán
		setRecord(tran);
		setVisibleHuongDan(true);
	};

	const onFinish = (values: GiaoDich.TDongTruocHocPhi) => {
		dongTruocHocPhiModel({ ...values, paymentType })
			.then((rec) => {
				if (getData) getData();
				setVisibleForm(false);
				resetFieldsForm(form);

				if (rec.paymentType === ETransactionPaymentType.BANK) {
					handleShowModalThanhToan(rec);
				} else if (rec.paymentType === ETransactionPaymentType.MOMO_WALLET && rec.identityCode)
					thanhToanMomoModel(rec.identityCode);
			})
			.catch((err) => console.log(err));
	};

	return (
		<>
			<Card title={intl.formatMessage({ id: 'uudaithanhtoan.noptruochocphi.title' })}>
				<Form layout='vertical' form={form} onFinish={onFinish}>
					<Row gutter={[12, 12]}>
						<Col span={24}>
							<Alert showIcon description={intl.formatMessage({ id: 'uudaithanhtoan.noptruochocphi.alert' })} />
						</Col>
						<Col span={24}>
							<div className='fw500'>{intl.formatMessage({ id: 'uudaithanhtoan.noptruochocphi.ds' })}</div>
						</Col>
						<Col span={24}>
							<TableUuDaiHienHanh onCellClick={(rec) => form.setFieldsValue({ amount: rec.mucPhiApDung })} />
						</Col>

						<Col span={24} md={8}>
							<Form.Item
								name='amount'
								label={intl.formatMessage({ id: 'uudaithanhtoan.noptruochocphi.sotien' })}
								extra={intl.formatMessage({ id: 'uudaithanhtoan.noptruochocphi.sotien.extra' })}
							>
								<InputNumber
									placeholder={intl.formatMessage({ id: 'uudaithanhtoan.noptruochocphi.sotien.place' })}
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
							<div className='fw500'>{intl.formatMessage({ id: 'uudaithanhtoan.noptruochocphi.hinhthuc' })}</div>
						</Col>
						<Col span={24}>
							<HuongDanThanhToan amount={amount} isRequired />
						</Col>
					</Row>

					<div className='form-footer'>
						<Popconfirm
							title={intl.formatMessage({ id: 'uudaithanhtoan.noptruochocphi.xacnhan' })}
							disabled={!amount}
							onConfirm={() => form.submit()}
						>
							<Button loading={formSubmiting} type='primary' htmlType='submit' disabled={!amount}>
								{intl.formatMessage({ id: 'uudaithanhtoan.noptruochocphi.thanhtoan' })}
							</Button>
						</Popconfirm>

						<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
					</div>
				</Form>
			</Card>
		</>
	);
};

export default FormDongTruocHocPhi;
