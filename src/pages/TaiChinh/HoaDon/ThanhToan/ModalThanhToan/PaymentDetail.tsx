import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { getThongTinHoaDonMe } from '@/services/TaiChinh/HoaDon';
import type { HoaDon } from '@/services/TaiChinh/HoaDon/typing';
import { postTransactionMePayment } from '@/services/TaiChinh/KenhThanhToan';
import { inputFormat } from '@/utils/utils';
import { Button, Checkbox, Descriptions, Form, InputNumber, message } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useIntl, useModel } from 'umi';
import InvoiceForm from './InvoiceForm';
import PaymentCollectView from './PaymentCollectView';
import './style.less';
import type { IPaymentCollect, PaymentDetailProps } from './typing';

type ThongTinHoaDon = {
	tenToChuc?: string;
	maSoThue?: string;
	diaChi?: string;
	emailNhanHoaDonDienTu?: string;
	userSoDienThoai?: string;
};

type PaymentBillRecord = HoaDon.IRecord & { children?: HoaDon.IRecord[] };

const PaymentDetail: React.FC<PaymentDetailProps> = ({
	bill,
	method,
	transactions,
	invoiceCode,
	totalAmount,
	transactionFee,
	loading,
	mode,
	bills,
	initialAmount,
	lockAmount,
}) => {
	const intl = useIntl();
	const { initialState } = useModel('@@initialState');
	const [loadingOnePay, setLoadingOnePay] = useState(false);
	const isKtxDeposit = transactions.some((transaction) => transaction.isKtxDeposit === true);
	const flatBills = useMemo<HoaDon.IRecord[]>(
		() =>
			(bills ?? []).map((bill) => {
				const flatBill: PaymentBillRecord = { ...bill };
				delete flatBill.children;
				delete flatBill.virtualBill;
				return flatBill;
			}),
		[bills],
	);
	const [paymentCollectData, setPaymentCollectData] = useState<IPaymentCollect | null>(null);
	const [transactionIdentityCodes, setTransactionIdentityCodes] = useState<string[]>([]);

	useEffect(() => {
		const fetchThongTinHoaDon = async () => {
			try {
				const res = await getThongTinHoaDonMe();
				if (res?.data?.data) {
					const data = res.data.data;
					invoiceForm.setFieldsValue({
						tenToChuc: data.tenToChuc,
						maSoThue: data.maSoThue,
						diaChi: data.diaChi,
						emailNhanHoaDonDienTu: data.emailNhanHoaDonDienTu,
						userSoDienThoai: data.userSoDienThoai,
					});
				}
			} catch (error) {
				console.log(error);
			}
		};
		fetchThongTinHoaDon();
	}, [invoiceCode]);
	const [soTienMuonThanhToan, setSoTienMuonThanhToan] = useState<number | null>(
		initialAmount ?? bill?.soTienConLai ?? null,
	);
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

	const totalThanhToan =
		mode === 'multi' ? (bills ?? []).reduce((sum, b) => sum + (b.soTienConLai ?? 0), 0) : (bill?.soTienConLai ?? 0);

	// const totalAmountFinal = totalThanhToan + phiThanhToan;

	const soTienThanhToan = mode === 'multi' ? totalThanhToan : (soTienMuonThanhToan ?? 0);

	const soTienThanhToanTong = soTienThanhToan;

	const phiThanhToan = useMemo(() => {
		return method.activeLePhiThanhToan
			? method.loaiLePhiThanhToanMacDinh === 'TIEN'
				? Number(method.giaTriLePhiThanhToanMacDinh ?? 0)
				: method?.mucPhiDichVuToiDa != null
					? Math.floor(
							Math.min(
								(soTienThanhToanTong * (Number(method?.giaTriLePhiThanhToanMacDinh) ?? 0)) / 100,
								Number(method.mucPhiDichVuToiDa),
							),
						)
					: Math.floor((soTienThanhToanTong * (Number(method?.giaTriLePhiThanhToanMacDinh) ?? 0)) / 100)
			: 0;
	}, [soTienThanhToanTong, method]);

	const finalAmount = soTienThanhToanTong > 0 ? soTienThanhToanTong + phiThanhToan : 0;
	const thongTinHoaDon = Form.useWatch([], invoiceForm) ?? {};
	const isAmountValid =
		mode === 'multi'
			? totalThanhToan > 0
			: soTienMuonThanhToan !== null && soTienMuonThanhToan > 0 && soTienMuonThanhToan <= totalThanhToan;
	const isInvoiceValid =
		!guiThongTinHoaDon ||
		Boolean(thongTinHoaDon.tenToChuc?.trim() && thongTinHoaDon.maSoThue?.trim() && thongTinHoaDon.diaChi?.trim());

	const handlePayment = async () => {
		setLoadingOnePay(true);

		try {
			// Multi mode
			if (mode === 'multi') {
				const body: Parameters<typeof postTransactionMePayment>[0] = {
					kenhThanhToanId: method._id,
					billIdentityCodes: (bills ?? []).map((b) => b.identityCode ?? ''),
					againLink: window.location.href,
					webUrlCallBack: window.location.href,
				};
				if (guiThongTinHoaDon) {
					const invoiceValues = await invoiceForm.validateFields();
					body.guiThongTinHoaDon = true;
					body.thongTinHoaDon = invoiceValues;
				}
				const res = await postTransactionMePayment(body);
				const data = res?.data?.data;

				if (data?.paymentCollect) {
					setPaymentCollectData(data.paymentCollect);
					setTransactionIdentityCodes(data.transactionPayments?.map((tp: any) => tp.identityCode) ?? []);
				} else if (data?.payUrl) {
					window.location.href = data.payUrl;
				} else {
					message.error(intl.formatMessage({ id: 'taichinh.thanhtoan.modal.error.noPaymentUrl' }));
				}
			} else {
				// Single mode
				const body: Parameters<typeof postTransactionMePayment>[0] = {
					againLink: window.location.href,
					billIdentityCode: invoiceCode,
					kenhThanhToanId: method._id,
					soTienThanhToan: soTienThanhToan,
					webUrlCallBack: window.location.href,
				};
				if (guiThongTinHoaDon) {
					const invoiceValues = await invoiceForm.validateFields();
					body.guiThongTinHoaDon = true;
					body.thongTinHoaDon = invoiceValues;
				}
				const res = await postTransactionMePayment(body);
				const data = res?.data?.data;

				if (data?.paymentCollect) {
					setPaymentCollectData(data.paymentCollect);
					setTransactionIdentityCodes(data.transactionPayments?.map((tp: any) => tp.identityCode) ?? []);
				} else if (data?.payUrl) {
					window.location.href = data.payUrl;
				} else {
					message.error(intl.formatMessage({ id: 'taichinh.thanhtoan.modal.error.noPaymentUrl' }));
				}
			}
		} catch (er) {
			console.log(er);
		} finally {
			setLoadingOnePay(false);
		}
	};

	const handlePaymentCollectExpired = useCallback(() => {
		setPaymentCollectData(null);
		setTransactionIdentityCodes([]);
	}, []);

	const handlePaymentCollectSuccess = useCallback(() => {
		message.success(intl.formatMessage({ id: 'taichinh.thanhtoan.modal.success' }));
	}, [intl]);

	return (
		<div className='payment-detail'>
			{paymentCollectData ? (
				<PaymentCollectView
					data={paymentCollectData}
					transactionIdentityCodes={transactionIdentityCodes}
					onExpired={handlePaymentCollectExpired}
					onSuccess={handlePaymentCollectSuccess}
				/>
			) : (
				<>
					<div className='payment-detail__header'>
						<div className='payment-detail__title'>{intl.formatMessage({ id: 'taichinh.thanhtoan.modal.title' })}</div>
						<div className='payment-detail__subtitle'>
							{intl.formatMessage({ id: 'taichinh.thanhtoan.modal.subtitle' })}
						</div>
					</div>

					{mode !== 'multi' && (
						<div className='payment-detail__provider-card'>
							<div className='payment-detail__provider-name'>{method.tenNganHang || method.code}</div>
							{method.huongDanThanhToan && (
								<div className='payment-detail__provider-desc'>{method.huongDanThanhToan}</div>
							)}
							<Descriptions column={1} size='small' style={{ marginTop: 12 }}>
								<Descriptions.Item label={intl.formatMessage({ id: 'taichinh.thanhtoan.modal.magd' })}>
									#{invoiceCode}
								</Descriptions.Item>

								<Descriptions.Item label={intl.formatMessage({ id: 'taichinh.thanhtoan.modal.noidung' })}>
									{addInfo}
								</Descriptions.Item>
							</Descriptions>
						</div>
					)}

					{/* Multi: bang danh sach hoa don */}
					{mode === 'multi' && flatBills.length ? (
						<div className='payment-detail__multi-table'>
							<TableStaticData
								columns={
									[
										{
											title: intl.formatMessage({ id: 'taichinh.thanhtoan.modal.magd' }),
											dataIndex: 'identityCode',
											key: 'identityCode',
											width: 140,
										},
										{
											title: intl.formatMessage({ id: 'taichinh.hoadon.column.dotthu' }),
											dataIndex: ['dotThu', 'tenDot'],
											key: 'dotThu',
											width: 180,
										},
										{
											title: intl.formatMessage({ id: 'taichinh.thanhtoan.modal.sotienconlai' }),
											dataIndex: 'soTienConLai',
											key: 'soTienConLai',
											align: 'right',
											width: 160,
											render: (val: number) => inputFormat(val ?? 0) + 'đ',
										},
									] as unknown as IColumn<HoaDon.IRecord>[]
								}
								otherProps={{
									pagination: false,
									scroll: {
										y: 400,
									},
								}}
								data={flatBills}
								size='small'
								addStt
								hideChildrenRows
							/>
						</div>
					) : null}

					{/* Single: nhap so tien */}
					{mode !== 'multi' ? (
						<div className='payment-detail__amount-input'>
							<div className='payment-detail__amount-input-label'>
								{intl.formatMessage({ id: 'taichinh.thanhtoan.modal.sotienmuonthanhtoan' })}
							</div>
							<InputNumber
								style={{ width: '100%' }}
								disabled={isKtxDeposit || lockAmount}
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
					) : null}

					<div className='payment-detail__invoice-toggle'>
						<Checkbox checked={guiThongTinHoaDon} onChange={(event) => setGuiThongTinHoaDon(event.target.checked)}>
							{intl.formatMessage({ id: 'taichinh.thanhtoan.invoice.title' })}
						</Checkbox>
					</div>

					<InvoiceForm
						userFullname={userFullname ?? ''}
						userCode={userCode ?? ''}
						visible={guiThongTinHoaDon}
						form={invoiceForm}
					/>

					<div className='payment-detail__summary'>
						<div className='payment-detail__summary-row'>
							<span>{intl.formatMessage({ id: 'taichinh.thanhtoan.modal.tamtinh' })}</span>
							<span>{inputFormat(soTienThanhToanTong)}đ</span>
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
							disabled={!isAmountValid || !isInvoiceValid || !!paymentCollectData}
						>
							{intl.formatMessage({ id: 'taichinh.thanhtoan.modal.thanhtoanngay' })}
						</Button>
					</div>
				</>
			)}
		</div>
	);
};

export default PaymentDetail;
