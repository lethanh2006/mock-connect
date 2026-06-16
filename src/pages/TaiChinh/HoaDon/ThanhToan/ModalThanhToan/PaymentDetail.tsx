import { postTransactionMePayment } from '@/services/TaiChinh/KenhThanhToan';
import { inputFormat } from '@/utils/utils';
import { Button, Descriptions, message } from 'antd';
import { useState } from 'react';
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

	const userFullname =
		bill?.userFullname ??
		(initialState?.currentUser?.family_name
			? `${initialState.currentUser.family_name} ${initialState.currentUser?.given_name ?? ''}`
			: initialState?.currentUser?.name);
	const userCode = bill?.userCode ?? initialState?.currentUser?.preferred_username ?? '';
	/** Nội dung chuyển khoản */
	const addInfo = bill?.dotThu?.tenDot;

	const sumCharge = transactions
		.filter((item) => item.type === 'CHARGE')
		.reduce((sum, item) => sum + (item.amount ?? 0) * (item.quantity ?? 1), 0);

	const sumDiscount = transactions
		.filter((item) => item.type === 'DISCOUNT')
		.reduce((sum, item) => sum + (item.amount ?? 0) * (item.quantity ?? 1), 0);

	const totalThanhToan = sumCharge - sumDiscount;

	const phiThanhToan = method.activeLePhiThanhToan
		? method.loaiLePhiThanhToanMacDinh === 'TIEN'
			? method.giaTriLePhiThanhToanMacDinh
			: (totalThanhToan * method.giaTriLePhiThanhToanMacDinh) / 100
		: 0;

	const totalAmountFinal = totalThanhToan + phiThanhToan;

	const handlePayment = async () => {
		// if (method.phuongThucThanhToan === 'ONEPAY') {
		setLoadingOnePay(true);
		try {
			const res = await postTransactionMePayment({
				againLink: window.location.href,
				billIdentityCode: invoiceCode,
				kenhThanhToanId: method._id,
				// loaiLePhiThanhToan: method.loaiLePhiThanhToanMacDinh,
				// phanTramLePhiThanhToan:
				// 	method.loaiLePhiThanhToanMacDinh === 'PHAN_TRAM' ? method.giaTriLePhiThanhToanMacDinh : 0,
				// soTienLePhiThanhToan: method.loaiLePhiThanhToanMacDinh === 'TIEN' ? method.giaTriLePhiThanhToanMacDinh : 0,
			});

			const paymentUrl = res?.data?.data?.payUrl;

			if (paymentUrl) {
				window.location.href = paymentUrl;
			} else {
				message.error('Không nhận được URL thanh toán từ ONEPAY');
			}
		} catch (er) {
			console.log(er);
			message.error('Lỗi khi tạo thanh toán ONEPAY');
		} finally {
			setLoadingOnePay(false);
		}
		// } else {
		// 	//todo: update cho các phương thức khác
		// }
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

			<div className='payment-detail__summary'>
				<div className='payment-detail__summary-row'>
					<span>{intl.formatMessage({ id: 'taichinh.thanhtoan.modal.tongtienphainop' })}</span>
					<span>{inputFormat(sumCharge)}đ</span>
				</div>

				{/* {phiThanhToan > 0 && ( */}
				<div className='payment-detail__summary-row'>
					<span>{intl.formatMessage({ id: 'taichinh.thanhtoan.modal.phigiaodich' })}</span>
					<span>{inputFormat(phiThanhToan)}đ</span>
				</div>
				{/* )} */}

				<div className='payment-detail__total'>
					<span>{intl.formatMessage({ id: 'taichinh.thanhtoan.modal.tongcong' })}</span>
					<span>{inputFormat(totalAmountFinal)}đ</span>
				</div>
			</div>

			<div className='payment-detail__footer'>
				<Button type='primary' block size='large' onClick={handlePayment} loading={loading || loadingOnePay}>
					{intl.formatMessage({ id: 'taichinh.thanhtoan.modal.thanhtoanngay' })}
				</Button>
			</div>
		</div>
	);
};

export default PaymentDetail;
