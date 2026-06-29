import { postTransactionMePayment } from '@/services/TaiChinh/KenhThanhToan';
import rules from '@/utils/rules';
import { inputFormat } from '@/utils/utils';
import { Button, Checkbox, Col, Descriptions, Form, Input, InputNumber, message, Row } from 'antd';
import { useMemo, useState } from 'react';
import { useIntl, useModel } from 'umi';
import './style.less';
import type { PaymentDetailProps } from './typing';

type ThongTinHoaDon = {
	tenToChuc?: string;
	maSoThue?: string;
	diaChi?: string;
	emailNhanHoaDonDienTu?: string;
	userSoDienThoai?: string;
};

const PaymentDetail: React.FC<PaymentDetailProps> = ({
	bill,
	method,
	transactions,
	invoiceCode,
	totalAmount,
	transactionFee,
	loading,
}) => {
	const intl = useIntl();
	const { initialState } = useModel('@@initialState');
	const [loadingOnePay, setLoadingOnePay] = useState(false);
	const [soTienMuonThanhToan, setSoTienMuonThanhToan] = useState<number | null>(bill?.soTienConLai ?? null);
	const [guiThongTinHoaDon, setGuiThongTinHoaDon] = useState(false);
	const [invoiceForm] = Form.useForm<ThongTinHoaDon>();
	const userFullname =
		bill?.userFullname ??
		(initialState?.currentUser?.family_name
			? `${initialState.currentUser.family_name} ${initialState.currentUser?.given_name ?? ''}`
			: initialState?.currentUser?.name);
	const userCode = bill?.userCode ?? initialState?.currentUser?.preferred_username ?? '';
	// nội dung chuyển khoản
	const addInfo = bill?.dotThu?.tenDot;

	const totalThanhToan = bill?.soTienConLai ?? 0;

	// const totalAmountFinal = totalThanhToan + phiThanhToan;

	const soTienThanhToan = soTienMuonThanhToan ?? 0;
	const phiThanhToan = useMemo(() => {
		return method.activeLePhiThanhToan
			? method.loaiLePhiThanhToanMacDinh === 'TIEN'
				? Number(method.giaTriLePhiThanhToanMacDinh ?? 0)
				: method?.mucPhiDichVuToiDa != null
					? Math.min(
							(soTienThanhToan * (Number(method?.giaTriLePhiThanhToanMacDinh) ?? 0)) / 100,
							Number(method.mucPhiDichVuToiDa),
						)
					: (soTienThanhToan * (Number(method?.giaTriLePhiThanhToanMacDinh) ?? 0)) / 100
			: 0;
	}, [soTienThanhToan, method]);

	const finalAmount = soTienThanhToan > 0 ? soTienThanhToan + phiThanhToan : 0;
	const thongTinHoaDon = Form.useWatch([], invoiceForm) ?? {};
	const isAmountValid =
		soTienMuonThanhToan !== null && soTienMuonThanhToan > 0 && soTienMuonThanhToan <= totalThanhToan;
	const isInvoiceValid =
		!guiThongTinHoaDon ||
		Boolean(thongTinHoaDon.tenToChuc?.trim() && thongTinHoaDon.maSoThue?.trim() && thongTinHoaDon.diaChi?.trim());
	const handlePayment = async () => {
		setLoadingOnePay(true);
		const currentUrl = window.location.href;
		try {
			const body: Parameters<typeof postTransactionMePayment>[0] = {
				againLink: window.location.href,
				billIdentityCode: invoiceCode,
				kenhThanhToanId: method._id,
				soTienThanhToan: soTienThanhToan,
				webUrlCallBack: currentUrl,
			};
			if (guiThongTinHoaDon) {
				const invoiceValues = await invoiceForm.validateFields();
				body.guiThongTinHoaDon = true;
				body.thongTinHoaDon = invoiceValues;
			}
			const res = await postTransactionMePayment(body);

			const paymentUrl = res?.data?.data?.payUrl;

			if (paymentUrl) {
				window.location.href = paymentUrl;
			} else {
				message.error(intl.formatMessage({ id: 'taichinh.thanhtoan.modal.error.noPaymentUrl' }));
			}
		} catch (er) {
			console.log(er);
		} finally {
			setLoadingOnePay(false);
		}
	};

	return (
		<div className='payment-detail'>
			<div className='payment-detail__header'>
				<div className='payment-detail__title'>{intl.formatMessage({ id: 'taichinh.thanhtoan.modal.title' })}</div>
				<div className='payment-detail__subtitle'>
					{intl.formatMessage({ id: 'taichinh.thanhtoan.modal.subtitle' })}
				</div>
			</div>

			<div className='payment-detail__provider-card'>
				<div className='payment-detail__provider-name'>{method.tenNganHang || method.code}</div>
				{method.huongDanThanhToan && <div className='payment-detail__provider-desc'>{method.huongDanThanhToan}</div>}
				<Descriptions column={1} size='small' style={{ marginTop: 12 }}>
					<Descriptions.Item label={intl.formatMessage({ id: 'taichinh.thanhtoan.modal.magd' })}>
						#{invoiceCode}
					</Descriptions.Item>

					<Descriptions.Item label={intl.formatMessage({ id: 'taichinh.thanhtoan.modal.noidung' })}>
						{addInfo}
					</Descriptions.Item>
				</Descriptions>
			</div>

			{/* Nhập số tiền muốn thanh toán*/}
			<div className='payment-detail__amount-input'>
				<div className='payment-detail__amount-input-label'>
					{intl.formatMessage({ id: 'taichinh.thanhtoan.modal.sotienmuonthanhtoan' })}
				</div>
				<InputNumber
					style={{ width: '100%' }}
					placeholder={intl.formatMessage({ id: 'taichinh.thanhtoan.modal.nhapsotienthanhtoan' })}
					value={soTienMuonThanhToan}
					onChange={(value) => setSoTienMuonThanhToan(value)}
					min={1}
					// max={totalThanhToan}
					step={1}
					precision={0}
					formatter={(value) => `${value}`.replace(/[^0-9]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
					parser={(value) => value?.replace(/,/g, '') as any}
					status={
						soTienMuonThanhToan !== null && (soTienMuonThanhToan <= 0 || soTienMuonThanhToan > totalThanhToan)
							? 'error'
							: undefined
					}
				/>

				{soTienMuonThanhToan !== null && soTienMuonThanhToan > totalThanhToan ? (
					<div className='payment-detail__amount-error'>
						{intl.formatMessage(
							{ id: 'taichinh.thanhtoan.modal.vuotquasotien' },
							{ soTien: inputFormat(totalThanhToan) },
						)}
					</div>
				) : (
					<div className='payment-detail__amount-input-hint'>
						{intl.formatMessage({ id: 'taichinh.thanhtoan.modal.sotienconlai' })}:{' '}
						{inputFormat(totalThanhToan - (soTienMuonThanhToan ?? 0))}đ
					</div>
				)}
			</div>

			<div className='payment-detail__invoice-toggle'>
				<Checkbox checked={guiThongTinHoaDon} onChange={(event) => setGuiThongTinHoaDon(event.target.checked)}>
					Xuất hóa đơn
				</Checkbox>
			</div>

			{guiThongTinHoaDon && (
				<Form form={invoiceForm} layout='vertical' className='payment-detail__invoice-form' requiredMark={false}>
					<div className='payment-detail__invoice-form-title'>Thông tin hóa đơn</div>
					<Row gutter={[12, 12]}>
						<Col xs={24} md={12}>
							<Form.Item label={<span className='payment-detail__invoice-form-label'>Họ tên sinh viên</span>}>
								<Input value={userFullname} disabled />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item label={<span className='payment-detail__invoice-form-label'>Mã sinh viên</span>}>
								<Input value={userCode} disabled />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item
								name='tenToChuc'
								label={<span className='payment-detail__invoice-form-label'>Tên của tổ chức</span>}
								rules={[...rules.required]}
							>
								<Input placeholder='Nhập tên của tổ chức' />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item
								name='maSoThue'
								label={<span className='payment-detail__invoice-form-label'>Mã số thuế của tổ chức</span>}
								rules={[...rules.required]}
							>
								<Input placeholder='Nhập mã số thuế của tổ chức' />
							</Form.Item>
						</Col>
						<Col xs={24}>
							<Form.Item
								name='diaChi'
								label={<span className='payment-detail__invoice-form-label'>Địa chỉ tổ chức</span>}
								rules={[...rules.required]}
							>
								<Input placeholder='Nhập địa chỉ' />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item
								name='emailNhanHoaDonDienTu'
								label={<span className='payment-detail__invoice-form-label'>Email nhận hóa đơn điện tử</span>}
								rules={[{ type: 'email', message: 'Email không hợp lệ' }]}
							>
								<Input placeholder='Nhập email' />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item
								name='userSoDienThoai'
								rules={[...rules.soDienThoai]}
								label={<span className='payment-detail__invoice-form-label'>Số điện thoại liên hệ</span>}
							>
								<Input placeholder='Nhập số điện thoại' />
							</Form.Item>
						</Col>
					</Row>
				</Form>
			)}

			<div className='payment-detail__summary'>
				<div className='payment-detail__summary-row'>
					<span>{intl.formatMessage({ id: 'taichinh.thanhtoan.modal.tamtinh' })}</span>
					<span>{inputFormat(soTienMuonThanhToan ?? 0)}đ</span>
				</div>

				{/* {phiThanhToan > 0 && ( */}
				<div className='payment-detail__summary-row'>
					<span>{intl.formatMessage({ id: 'taichinh.thanhtoan.modal.phigiaodich' })}</span>
					<span>{inputFormat(phiThanhToan)}đ</span>
				</div>
				{/* )} */}

				<div className='payment-detail__total'>
					<span>{intl.formatMessage({ id: 'taichinh.thanhtoan.modal.tongcong' })}</span>
					<span>{inputFormat(finalAmount)}đ</span>
				</div>
			</div>

			<div className='payment-detail__footer'>
				<Button
					type='primary'
					block
					size='large'
					onClick={handlePayment}
					loading={loading || loadingOnePay}
					disabled={!isAmountValid || !isInvoiceValid}
				>
					{intl.formatMessage({ id: 'taichinh.thanhtoan.modal.thanhtoanngay' })}
				</Button>
			</div>
		</div>
	);
};

export default PaymentDetail;
