import PDFViewerV2 from '@/components/PDFViewerV2';
import PageCard from '@/components/PageCard';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { getExportBillUrl } from '@/services/TaiChinh/HoaDon';
import type { HoaDon } from '@/services/TaiChinh/HoaDon/typing';
import { EMaTrangThaiThanhToan, EMauTrangThaiThanhToanTable, ETransactionType } from '@/services/TaiChinh/constant';
import { EMauTrangThaiTraGopBill, ETrangThaiTraGopBill } from '@/services/TaiChinh/TraGop/constant';
import { currencyFormat } from '@/utils/utils';
import {
	ArrowLeftOutlined,
	DollarOutlined,
	EyeOutlined,
	FieldTimeOutlined,
	FilePdfOutlined,
	ScheduleOutlined,
} from '@ant-design/icons';
import { Button, Col, Collapse, Empty, Modal, Progress, Row, Skeleton, Space, Tag, Typography } from 'antd';
import type { IntlShape } from 'react-intl';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { history, useIntl, useModel, useParams } from 'umi';
import { disableThanhToan } from '..';
import ModalThanhToan from '../ThanhToan/ModalThanhToan';
import ThongTinThanhToan from '../ThanhToan/ThongTinThanhToan';
import ModalDangKyTraGop from '../TraGop/ModalDangKyTraGop';
import ModalTienDoTraGop from '../TraGop/ModalTienDoTraGop';
import './style.less';

const { Title, Text } = Typography;

/** Cùng logic đếm ngày còn lại với cột "Hạn thanh toán" ở danh sách hóa đơn */
const renderDeadlineBadge = (intl: IntlShape, ngayHetHanThanhToan?: string) => {
	if (!ngayHetHanThanhToan) return null;
	const ngayHetHan = dayjs(ngayHetHanThanhToan);
	const soNgayConLai = ngayHetHan.diff(dayjs(), 'day', true);

	if (dayjs().isAfter(ngayHetHan, 'day')) {
		return <Tag color='error'>{intl.formatMessage({ id: 'taichinh.hoadon.hanthanhtoan.hethan' })}</Tag>;
	}
	if (soNgayConLai >= 0 && soNgayConLai <= 1) {
		return <Tag color='warning'>{intl.formatMessage({ id: 'taichinh.hoadon.hanthanhtoan.con1ngay' })}</Tag>;
	}
	if (soNgayConLai > 1 && soNgayConLai <= 10) {
		return (
			<Tag color='success'>
				{intl.formatMessage({ id: 'taichinh.hoadon.hanthanhtoan.conngay' }, { soNgay: Math.ceil(soNgayConLai) })}
			</Tag>
		);
	}
	return null;
};

type InvoiceCardProps = {
	bill: HoaDon.IRecord;
	isVirtual?: boolean;
	/** % ưu đãi thanh toán sớm — chỉ truyền cho card của virtualBill */
	discountPercent?: number;
	/** Tổng tiền nếu thanh toán cả 2 hóa đơn cùng lúc — chỉ truyền cho card của virtualBill */
	combinedTotal?: number;
	/** Số tiền hóa đơn hiện tại (bill gốc) — chỉ truyền cho card của virtualBill để lên breakdown gộp */
	currentBillAmount?: number;
	/** Số tiền ưu đãi thực tế — lấy từ giao dịch DISCOUNT cuối cùng của virtualBill */
	discountAmount?: number;
	onViewDetail: () => void;
	onViewPdf: () => void;
	/** Card hiện tại: thanh toán riêng đúng hóa đơn này. Card virtualBill: thanh toán gộp cả 2. */
	onPayNow?: () => void;
	/** Nhãn nút thanh toán — mặc định "Thanh toán ngay", card virtualBill truyền "Thanh toán cả 2" */
	payLabelId?: string;
	/** Ghi đè trạng thái disable của nút thanh toán (card virtualBill cần disable theo CẢ 2 hóa đơn) */
	payDisabled?: boolean;
	pdfLoading?: boolean;
	onDangKyTraGop?: () => void;
	onTienDoTraGop?: () => void;
};

const InvoiceCard = ({
	bill,
	isVirtual,
	discountPercent,
	combinedTotal,
	currentBillAmount,
	discountAmount,
	onViewDetail,
	onViewPdf,
	onPayNow,
	payLabelId,
	payDisabled,
	pdfLoading,
	onDangKyTraGop,
	onTienDoTraGop,
}: InvoiceCardProps) => {
	const intl = useIntl();
	const statusColor = EMauTrangThaiThanhToanTable[bill.status];
	const statusLabel = intl.formatMessage({ id: `taichinh.hoadon.status.${bill.status}` });

	return (
		<div className={`invoice-detail-card${isVirtual ? ' invoice-detail-card--virtual' : ''}`}>
			<Space size={6} className='invoice-detail-card__chip'>
				<Tag color={isVirtual ? 'gold' : 'blue'} style={{ margin: 0 }}>
					{isVirtual
						? intl.formatMessage({ id: 'taichinh.hoadon.virtualBill.earlyPayment' })
						: intl.formatMessage({ id: 'taichinh.hoadon.detail.currentTermChip' })}
				</Tag>
				{isVirtual && !!discountPercent && (
					<Tag color='error' style={{ margin: 0, fontWeight: 700 }}>
						−{discountPercent}%
					</Tag>
				)}
			</Space>
			<Title level={5} style={{ margin: '8px 0 0' }}>
				{bill.identityCode}
			</Title>
			<Text type='secondary' style={{ fontSize: 12.5 }}>
				{bill.dotThu?.tenDot}
			</Text>

			<div className='invoice-detail-card__meta'>
				<div>
					<Text type='secondary'>
						{intl.formatMessage({
							id: isVirtual ? 'taichinh.hoadon.detail.discountDeadline' : 'taichinh.hoadon.column.hanthanhtoan',
						})}
					</Text>
					<Space size={8}>
						<Text strong>
							{bill.ngayHetHanThanhToan ? dayjs(bill.ngayHetHanThanhToan).format('DD/MM/YYYY') : '-'}
						</Text>
						{renderDeadlineBadge(intl, bill.ngayHetHanThanhToan)}
					</Space>
				</div>
				<div>
					<Text type='secondary'>{intl.formatMessage({ id: 'taichinh.hoadon.column.trangthai' })}</Text>
					<Tag color={statusColor}>{statusLabel}</Tag>
				</div>
				{bill.trangThaiTraGop && (
					<div>
						<Text type='secondary'>{intl.formatMessage({ id: 'taichinh.tragop.column.trangthai' })}</Text>
						<Tag color={EMauTrangThaiTraGopBill[bill.trangThaiTraGop]}>
							{intl.formatMessage({ id: `taichinh.tragop.status.${bill.trangThaiTraGop}` })}
						</Tag>
					</div>
				)}
			</div>

			{isVirtual ? (
				<>
					<div className='invoice-detail-card__amount-zone'>
						<Text type='secondary' style={{ fontSize: 11.5 }}>
							{intl.formatMessage({ id: 'taichinh.hoadon.detail.combinedTotalLabel' })}
						</Text>
						<div className='invoice-detail-card__combo-breakdown'>
							<div className='invoice-detail-card__combo-row'>
								<span>{intl.formatMessage({ id: 'taichinh.hoadon.detail.currentTermChip' })}</span>
								<span>{currencyFormat(currentBillAmount ?? 0)} VND</span>
							</div>
							<span className='invoice-detail-card__combo-op'>+</span>
							<div className='invoice-detail-card__combo-row'>
								<span>{intl.formatMessage({ id: 'taichinh.hoadon.virtualBill.earlyPayment' })}</span>
								<span>{currencyFormat(bill.balance ?? 0)} VND</span>
							</div>
							<div className='invoice-detail-card__combo-row invoice-detail-card__combo-row--total'>
								<span>{intl.formatMessage({ id: 'taichinh.hoadon.detail.totalAmountLabel' })}</span>
								<span>{currencyFormat(combinedTotal ?? 0)} VND</span>
							</div>
						</div>
					</div>
					{!!discountAmount && (
						<div className='invoice-detail-card__discount-line'>
							{intl.formatMessage(
								{ id: 'taichinh.hoadon.detail.discountAmountLine' },
								{ amount: `${currencyFormat(discountAmount)} VND` },
							)}
						</div>
					)}
				</>
			) : (
				<div className='invoice-detail-card__amount-zone'>
					<div className='invoice-detail-card__combo-row invoice-detail-card__combo-row--total'>
						<span>{intl.formatMessage({ id: 'taichinh.hoadon.detail.totalAmountLabel' })}</span>
						<span>{currencyFormat(bill.balance ?? 0)} VND</span>
					</div>
				</div>
			)}
			{isVirtual && (
				<Text type='secondary' className='invoice-detail-card__optional-note'>
					{intl.formatMessage({ id: 'taichinh.hoadon.detail.optionalNote' })}
				</Text>
			)}

			{!!bill.billItems?.length && (
				<Collapse ghost size='small' className='invoice-detail-card__breakdown'>
					<Collapse.Panel header={intl.formatMessage({ id: 'taichinh.hoadon.detail.viewBreakdown' })} key='1'>
						{bill.billItems.map((item) => (
							<div key={item._id} className='invoice-detail-card__breakdown-row'>
								<span>{item.tenKhoanThu}</span>
								<span>{currencyFormat(item.amountDue ?? 0)} VND</span>
							</div>
						))}
					</Collapse.Panel>
				</Collapse>
			)}

			<Space wrap className='invoice-detail-card__actions'>
				{onPayNow &&
					(() => {
						const isDisabled = payDisabled ?? disableThanhToan(bill);
						return (
							<ButtonExtend
								size='small'
								type='primary'
								className='invoice-detail-card__pay-btn'
								icon={<DollarOutlined />}
								disabled={isDisabled}
								tooltip={
									isDisabled ? intl.formatMessage({ id: 'taichinh.hoadon.tooltip.ngoaithoihan' }) : undefined
								}
								onClick={onPayNow}
							>
								{intl.formatMessage({ id: payLabelId ?? 'taichinh.thanhtoan.button.thanhtoan' })}
							</ButtonExtend>
						);
					})()}
				<ButtonExtend
					size='small'
					type='text'
					icon={<EyeOutlined />}
					onClick={onViewDetail}
					tooltip={intl.formatMessage({ id: 'taichinh.hoadon.tooltip.xemchitiet' })}
				/>
				<ButtonExtend
					size='small'
					type='text'
					icon={<FilePdfOutlined />}
					loading={pdfLoading}
					onClick={onViewPdf}
					tooltip={intl.formatMessage({ id: 'taichinh.hoadon.tooltip.xemhuongdan' })}
				/>
				{!isVirtual &&
					bill.status !== EMaTrangThaiThanhToan.DA_THANH_TOAN_DU &&
					(!bill.trangThaiTraGop || bill.trangThaiTraGop === ETrangThaiTraGopBill.TU_CHOI) &&
					onDangKyTraGop && (
						<ButtonExtend size='small' icon={<ScheduleOutlined />} onClick={onDangKyTraGop}>
							{intl.formatMessage({ id: 'taichinh.tragop.tooltip.dangky' })}
						</ButtonExtend>
					)}
				{!isVirtual &&
					(bill.trangThaiTraGop === ETrangThaiTraGopBill.DANG_TRA_GOP ||
						bill.trangThaiTraGop === ETrangThaiTraGopBill.DA_HOAN_THANH_TRA_GOP) &&
					onTienDoTraGop && (
						<ButtonExtend size='small' icon={<FieldTimeOutlined />} onClick={onTienDoTraGop}>
							{intl.formatMessage({ id: 'taichinh.tragop.tooltip.tiendo' })}
						</ButtonExtend>
					)}
			</Space>
		</div>
	);
};

const HoaDonDetailPage = () => {
	const intl = useIntl();
	const { identityCode } = useParams<{ identityCode: string }>();
	// Lưu ý: `record`/`setRecord` của model `taichinh.hoadon` dùng CHUNG cho các modal con
	// (xem nhanh, thanh toán, trả góp) — nếu dùng luôn `record` làm dữ liệu chính của trang thì
	// khi bấm "Xem chi tiết" ở card virtualBill, setRecord(virtualBill) sẽ ghi đè và làm cả trang
	// hiển thị nhầm sang virtualBill. Vì vậy trang này giữ dữ liệu chính (`bill`) ở state riêng,
	// chỉ dùng `setRecord` khi cần mở các modal đó.
	const { setRecord, danhSach, getModel, loading, visibleModalThanhToan, setVisibleModalThanhToan } =
		useModel('taichinh.hoadon');
	const [bill, setBill] = useState<HoaDon.IRecord | undefined>(undefined);

	const [paymentMode, setPaymentMode] = useState<'single' | 'multi'>('single');
	const [billsForPayment, setBillsForPayment] = useState<HoaDon.IRecord[]>([]);
	const [initialPaymentAmount, setInitialPaymentAmount] = useState<number | undefined>(undefined);
	const [lockPaymentAmount, setLockPaymentAmount] = useState<boolean>(false);
	const [visibleModalDetail, setVisibleModalDetail] = useState(false);
	const [visibleModalPDF, setVisibleModalPDF] = useState(false);
	const [pdfUrl, setPdfUrl] = useState<string | undefined>(undefined);
	const [pdfLoadingId, setPdfLoadingId] = useState<string | undefined>(undefined);
	const [visibleModalDangKyTraGop, setVisibleModalDangKyTraGop] = useState(false);
	const [visibleModalTienDoTraGop, setVisibleModalTienDoTraGop] = useState(false);
	const [billTraGop, setBillTraGop] = useState<HoaDon.IRecord | undefined>(undefined);

	// Danh sách hóa đơn (danhSach) đã được trang danh sách load sẵn qua getModel (me/pageable),
	// nên chỉ cần tìm đúng hóa đơn theo identityCode thay vì gọi thêm bill/one.
	const fetchBill = () => {
		if (!identityCode) return;
		getModel()
			.then((res) => {
				const found = res.find((item) => item.identityCode === identityCode);
				if (found) setBill(found);
			})
			.catch(() => undefined);
	};

	useEffect(() => {
		if (!identityCode) return;
		const existing = danhSach.find((item) => item.identityCode === identityCode);
		if (existing) setBill(existing);
		else fetchBill();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [identityCode]);

	const virtualBill = bill?.virtualBill;
	const uuDaiPercent = bill?.dotThu?.uuDaiThanhToanTruocKy ?? 0;

	const groupBills = useMemo(
		() => [bill, virtualBill].filter((item): item is HoaDon.IRecord => Boolean(item)),
		[bill, virtualBill],
	);

	// Tổng tiền nếu thanh toán gộp cả 2 hóa đơn cùng lúc.
	const combinedTotal = useMemo(() => groupBills.reduce((sum, item) => sum + (item.balance ?? 0), 0), [groupBills]);
	// Số tiền ưu đãi THỰC lấy từ giao dịch loại DISCOUNT cuối cùng của virtualBill
	// (không tự ước tính theo %, vì backend đã ghi nhận đúng số tiền đã áp dụng).
	const discountAmount = useMemo(() => {
		const discountTransactions = (virtualBill?.transactions ?? []).filter(
			(item) => item.type === ETransactionType.DISCOUNT,
		);
		const lastDiscount = discountTransactions[discountTransactions.length - 1];
		return Math.abs(lastDiscount?.amount ?? 0);
	}, [virtualBill]);

	// "Tổng cần thanh toán" của nhóm chỉ tính hóa đơn hiện tại (khoản thực sự đến hạn) —
	// hóa đơn virtualBill (đóng sớm kỳ tới) là một lựa chọn thêm, không phải khoản đang nợ.
	const totalBalance = bill?.balance ?? 0;
	const totalPaid = bill?.amountPaid ?? 0;
	const payBothDisabled = !virtualBill || disableThanhToan(bill) || disableThanhToan(virtualBill);

	/** Thanh toán gộp cả 2 hóa đơn (hóa đơn hiện tại + hóa đơn đóng sớm) cùng lúc */
	const handlePayBoth = () => {
		if (!bill || !virtualBill) return;
		setRecord(bill);
		setInitialPaymentAmount(undefined);
		setLockPaymentAmount(false);
		setPaymentMode('multi');
		setBillsForPayment([bill, virtualBill]);
		setVisibleModalThanhToan(true);
	};

	const handleViewDetail = (rec: HoaDon.IRecord) => {
		setRecord(rec);
		setVisibleModalDetail(true);
	};

	/** Thanh toán ngay cho đúng 1 hóa đơn của card đó, không phụ thuộc checkbox đang chọn */
	const handlePaySingle = (rec: HoaDon.IRecord) => {
		setRecord(rec);
		setInitialPaymentAmount(undefined);
		setLockPaymentAmount(false);
		setPaymentMode('single');
		setBillsForPayment([]);
		setVisibleModalThanhToan(true);
	};

	const handleViewPdf = async (rec: HoaDon.IRecord) => {
		try {
			setPdfLoadingId(rec._id);
			const url = await getExportBillUrl(rec.identityCode);
			if (url) {
				setPdfUrl(url);
				setVisibleModalPDF(true);
			}
		} catch {
			// error handled by axios interceptor
		} finally {
			setPdfLoadingId(undefined);
		}
	};

	if (loading && !bill?._id) {
		return (
			<PageCard title={intl.formatMessage({ id: 'taichinh.hoadon.title' })}>
				<Skeleton active paragraph={{ rows: 8 }} />
			</PageCard>
		);
	}

	if (!bill?._id) {
		return (
			<PageCard title={intl.formatMessage({ id: 'taichinh.hoadon.title' })}>
				<Empty description={intl.formatMessage({ id: 'taichinh.hoadon.detail.notFound' })} />
			</PageCard>
		);
	}

	return (
		<PageCard title={intl.formatMessage({ id: 'taichinh.hoadon.title' })}>
			<div className='invoice-group-detail'>
				<Button
					type='link'
					className='invoice-group-detail__back'
					icon={<ArrowLeftOutlined />}
					onClick={() => history.push('/finance/tuition-billing')}
				>
					{intl.formatMessage({ id: 'taichinh.hoadon.detail.backToList' })}
				</Button>

				<div className='invoice-group-detail__header'>
					<div>
						<Title level={3} style={{ margin: 0 }}>
							{bill.identityCode}
						</Title>
					</div>
					<Tag color={EMauTrangThaiThanhToanTable[bill.status]} style={{ fontSize: 13, padding: '4px 12px' }}>
						{intl.formatMessage({ id: `taichinh.hoadon.status.${bill.status}` })}
					</Tag>
				</div>

				<div className='invoice-group-detail__summary'>
					<Row gutter={[20, 12]}>
						<Col xs={12} md={12}>
							<div className='invoice-group-detail__stat-label'>
								{intl.formatMessage({ id: 'taichinh.hoadon.column.tongcanthanhtoan' })}
							</div>
							<div className='invoice-group-detail__stat-value'>{currencyFormat(totalBalance)} VND</div>
						</Col>
						<Col xs={12} md={12}>
							<div className='invoice-group-detail__stat-label'>
								{intl.formatMessage({ id: 'taichinh.hoadon.column.tongdathanhtoan' })}
							</div>
							<div className='invoice-group-detail__stat-value'>{currencyFormat(totalPaid)} VND</div>
						</Col>
					</Row>
					<Progress
						percent={totalBalance + totalPaid > 0 ? Math.round((totalPaid / (totalBalance + totalPaid)) * 100) : 0}
						showInfo={false}
					/>
				</div>

				<Row gutter={[16, 16]} className='invoice-group-detail__cards'>
					<Col xs={24} md={virtualBill ? 12 : 24}>
						<InvoiceCard
							bill={bill}
							onViewDetail={() => handleViewDetail(bill)}
							onViewPdf={() => handleViewPdf(bill)}
							onPayNow={() => handlePaySingle(bill)}
							pdfLoading={pdfLoadingId === bill._id}
							onDangKyTraGop={() => {
								setBillTraGop(bill);
								setVisibleModalDangKyTraGop(true);
							}}
							onTienDoTraGop={() => {
								setBillTraGop(bill);
								setVisibleModalTienDoTraGop(true);
							}}
						/>
					</Col>
					{virtualBill && (
						<Col xs={24} md={12}>
							<InvoiceCard
								bill={virtualBill}
								isVirtual
								discountPercent={uuDaiPercent}
								combinedTotal={combinedTotal}
								currentBillAmount={bill.balance ?? 0}
								discountAmount={discountAmount}
								onViewDetail={() => handleViewDetail(virtualBill)}
								onViewPdf={() => handleViewPdf(virtualBill)}
								onPayNow={handlePayBoth}
								payLabelId='taichinh.hoadon.detail.payBothButton'
								payDisabled={payBothDisabled}
								pdfLoading={pdfLoadingId === virtualBill._id}
							/>
						</Col>
					)}
				</Row>

				<Text type='secondary' className='invoice-group-detail__footnote'>
					{intl.formatMessage({ id: 'taichinh.hoadon.detail.needHelp' })}
				</Text>
			</div>

			<Modal
				open={visibleModalDetail}
				onCancel={() => setVisibleModalDetail(false)}
				footer={null}
				styles={{ body: { padding: 0 } }}
				width={1000}
			>
				<ThongTinThanhToan setVisible={setVisibleModalDetail} getData={fetchBill} />
			</Modal>

			<Modal
				open={visibleModalPDF}
				onCancel={() => setVisibleModalPDF(false)}
				footer={null}
				width={900}
				title={intl.formatMessage({ id: 'taichinh.hoadon.tooltip.xemhuongdan' })}
			>
				{pdfUrl ? <PDFViewerV2 url={pdfUrl} height='80vh' /> : <Empty />}
			</Modal>

			<ModalThanhToan
				visible={visibleModalThanhToan}
				onClose={() => {
					setVisibleModalThanhToan(false);
					setBillsForPayment([]);
					setPaymentMode('single');
					setInitialPaymentAmount(undefined);
					setLockPaymentAmount(false);
				}}
				onSuccess={() => {
					fetchBill();
					setVisibleModalThanhToan(false);
					setBillsForPayment([]);
					setPaymentMode('single');
					setInitialPaymentAmount(undefined);
					setLockPaymentAmount(false);
				}}
				mode={paymentMode}
				bills={billsForPayment}
				initialAmount={initialPaymentAmount}
				lockAmount={lockPaymentAmount}
			/>

			<ModalDangKyTraGop
				visible={visibleModalDangKyTraGop}
				bill={billTraGop}
				onClose={() => setVisibleModalDangKyTraGop(false)}
				onSuccess={fetchBill}
			/>

			<ModalTienDoTraGop
				visible={visibleModalTienDoTraGop}
				bill={billTraGop}
				onClose={() => setVisibleModalTienDoTraGop(false)}
				onPayNow={(_phien, amount) => {
					if (!billTraGop) return;
					setRecord(billTraGop);
					setPaymentMode('single');
					setBillsForPayment([]);
					setInitialPaymentAmount(amount);
					setLockPaymentAmount(true);
					setVisibleModalTienDoTraGop(false);
					setVisibleModalThanhToan(true);
				}}
			/>
		</PageCard>
	);
};

export default HoaDonDetailPage;
