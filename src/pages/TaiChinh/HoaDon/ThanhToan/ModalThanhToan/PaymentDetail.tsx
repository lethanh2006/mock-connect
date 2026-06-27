import { postTransactionMePayment } from '@/services/TaiChinh/KenhThanhToan';
import { inputFormat } from '@/utils/utils';
import { Button, Descriptions, InputNumber, message } from 'antd';
import { useMemo, useState } from 'react';
import { useIntl, useModel } from 'umi';
import './style.less';
import type { PaymentDetailProps } from './typing';

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
	const [soTienMuonThanhToan, setSoTienMuonThanhToan] = useState<number | null>(null);

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
	const isAmountValid =
		soTienMuonThanhToan !== null && soTienMuonThanhToan > 0 && soTienMuonThanhToan <= totalThanhToan;
	const handlePayment = async () => {
		setLoadingOnePay(true);
		const currentUrl = window.location.href;
		try {
			const res = await postTransactionMePayment({
				againLink: window.location.href,
				billIdentityCode: invoiceCode,
				kenhThanhToanId: method._id,
				soTienThanhToan: soTienThanhToan,

				webUrlCallBack: currentUrl,
			});

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
					size='large'
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
					disabled={!isAmountValid}
				>
					{intl.formatMessage({ id: 'taichinh.thanhtoan.modal.thanhtoanngay' })}
				</Button>
			</div>
		</div>
	);
};

export default PaymentDetail;
