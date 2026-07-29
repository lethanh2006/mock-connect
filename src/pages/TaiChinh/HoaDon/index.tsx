import PDFViewerV2 from '@/components/PDFViewerV2';
import PageCard from '@/components/PageCard';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import { type IColumn } from '@/components/Table/typing';
import { getExportBillUrl } from '@/services/TaiChinh/HoaDon';
import type { HoaDon } from '@/services/TaiChinh/HoaDon/typing';
import { EMauTrangThaiTraGopBill, ETrangThaiTraGopBill } from '@/services/TaiChinh/TraGop/constant';
import { EMaTrangThaiThanhToan, EMauTrangThaiThanhToanTable } from '@/services/TaiChinh/constant';
import { inputFormat } from '@/utils/utils';
import {
	EyeOutlined,
	FieldTimeOutlined,
	FilePdfOutlined,
	GiftOutlined,
	ScheduleOutlined,
	UnorderedListOutlined,
} from '@ant-design/icons';
import { Alert, Empty, Modal, Tabs, Tag, notification } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState, type Key, type ReactNode } from 'react';
import { useIntl, useModel } from 'umi';
import SelectDotThu from '../DotThu/Select';
import ModalThanhToan from './ThanhToan/ModalThanhToan';
import ThongTinThanhToan from './ThanhToan/ThongTinThanhToan';
import ModalDangKyTraGop from './TraGop/ModalDangKyTraGop';
import ModalTienDoTraGop from './TraGop/ModalTienDoTraGop';

const PaymentDeadlineCountdown = ({ deadline }: { deadline: string }) => {
	const intl = useIntl();
	const [now, setNow] = useState(() => Date.now());

	useEffect(() => {
		const timer = window.setInterval(() => setNow(Date.now()), 1000);
		return () => window.clearInterval(timer);
	}, []);

	const remainingSeconds = Math.max(0, Math.floor((dayjs(deadline).valueOf() - now) / 1000));
	const minutes = Math.floor(remainingSeconds / 60);
	const seconds = remainingSeconds % 60;

	return (
		<div style={{ color: '#cf1322', fontWeight: 500 }}>
			{intl.formatMessage(
				{ id: 'taichinh.hoadon.ktxDeposit.countdown' },
				{
					minutes: String(minutes).padStart(2, '0'),
					seconds: String(seconds).padStart(2, '0'),
				},
			)}
		</div>
	);
};

/** Kiểm tra nút thanh toán có bị disable không: ngoài thời gian thanh toán */
export const disableThanhToan = (rec?: HoaDon.IRecord): boolean => {
	if (!rec) return true;

	// Check thời gian đợt thu
	// if (rec.dotThu?._id && rec.dotThu?.thoiGianKetThuc && rec.dotThu.kichHoat) {
	// 	if (dayjs().isBefore(dayjs(rec.dotThu.thoiGianBatDau)) || dayjs().isAfter(dayjs(rec.dotThu.thoiGianKetThuc)))
	// 		return true;
	// }

	if (rec?.status === EMaTrangThaiThanhToan.DONG || rec?.status === EMaTrangThaiThanhToan.DA_THANH_TOAN_DU) return true;
	return false;
};

const HoaDonPage = () => {
	const intl = useIntl();
	const {
		getModel,
		page,
		limit,
		setRecord,
		record,
		visibleModalThanhToan,
		setVisibleModalThanhToan,
		selectedIds,
		setSelectedIds,
		danhSach,
	} = useModel('taichinh.hoadon');
	const [visibleModal, setVisibleModal] = useState<boolean>(false);
	const [visibleModalPDF, setVisibleModalPDF] = useState<boolean>(false);
	const [visibleModalDangKyTraGop, setVisibleModalDangKyTraGop] = useState<boolean>(false);
	const [visibleModalTienDoTraGop, setVisibleModalTienDoTraGop] = useState<boolean>(false);
	const [billTraGop, setBillTraGop] = useState<HoaDon.IRecord | undefined>(undefined);
	const [initialPaymentAmount, setInitialPaymentAmount] = useState<number | undefined>(undefined);
	const [lockPaymentAmount, setLockPaymentAmount] = useState<boolean>(false);
	const [pdfUrl, setPdfUrl] = useState<string | undefined>(undefined);
	const [loadingPdfMap, setLoadingPdfMap] = useState<Record<string, boolean>>({});
	const [activeKey, setActiveKey] = useState<'chua_thanh_toan' | 'da_thanh_toan'>('chua_thanh_toan');
	// Multi payment state
	const [selectedBills, setSelectedBills] = useState<HoaDon.IRecord[]>([]);
	const [paymentMode, setPaymentMode] = useState<'single' | 'multi'>('single');
	type BillTableRecord = HoaDon.IRecord & {
		_isVirtualBill?: boolean;
		_isVirtualBillNotice?: boolean;
		_isKtxDepositNotice?: boolean;
		_parentBillId?: string;
		index?: number;
		key?: string;
		children?: BillTableRecord[];
	};
	const tableData = useMemo<BillTableRecord[]>(
		() =>
			danhSach.flatMap((bill, index) => {
				const parent: BillTableRecord = {
					...bill,
					index: index + 1 + (page - 1) * limit,
					key: bill._id,
				};
				const children: BillTableRecord[] = [];
				const rows: BillTableRecord[] = [];
				if (bill.transactions?.some((transaction) => transaction.isKtxDeposit === true)) {
					rows.push({
						...bill,
						_id: `ktx-deposit-notice-${bill._id}`,
						identityCode: '',
						virtualBill: undefined,
						_isKtxDepositNotice: true,
						_parentBillId: bill._id,
						key: `ktx-deposit-notice-${bill._id}`,
					});
				}
				if (bill.virtualBill) {
					children.push(
						{
							...bill,
							_id: `virtual-bill-notice-${bill._id}`,
							identityCode: '',
							virtualBill: undefined,
							_isVirtualBillNotice: true,
							_parentBillId: bill._id,
							key: `virtual-bill-notice-${bill._id}`,
						},
						{
							...bill.virtualBill,
							_isVirtualBill: true,
							_parentBillId: bill._id,
							key: bill.virtualBill._id,
						},
					);
				}
				if (children.length) parent.children = children;

				return [...rows, parent];
			}),
		[danhSach, page, limit],
	);
	const allTableBills = useMemo(
		() =>
			tableData
				.filter((bill) => !bill._isVirtualBillNotice && !bill._isKtxDepositNotice)
				.flatMap((bill) => [
					bill,
					...(bill.children ?? []).filter((item) => !item._isVirtualBillNotice && !item._isKtxDepositNotice),
				]),
		[tableData],
	);
	const [expandedRowKeys, setExpandedRowKeys] = useState<Key[]>([]);

	useEffect(() => {
		setExpandedRowKeys(tableData.filter((bill) => bill.children?.length).map((bill) => bill._id));
	}, [tableData]);
	const renderVirtualBillNotice = (rec: BillTableRecord) => {
		const uuDaiThanhToanTruocKy = rec.dotThu?.uuDaiThanhToanTruocKy ?? 0;

		return (
			<div className='virtual-bill-notice'>
				<div className='virtual-bill-notice-icon'>
					<GiftOutlined />
				</div>
				<div>
					<div className='virtual-bill-notice-title'>
						{intl.formatMessage(
							{ id: 'taichinh.hoadon.virtualBill.discount.title' },
							{ percent: uuDaiThanhToanTruocKy },
						)}
					</div>
					<div className='virtual-bill-notice-description'>
						{intl.formatMessage(
							{ id: 'taichinh.hoadon.virtualBill.discount.description' },
							{ percent: uuDaiThanhToanTruocKy },
						)}
					</div>
				</div>
			</div>
		);
	};
	const renderKtxDepositNotice = () => (
		<Alert
			className='ktx-deposit-notice'
			type='error'
			showIcon
			message={intl.formatMessage({ id: 'taichinh.hoadon.ktxDeposit.expirationWarning' })}
		/>
	);
	const getPaymentStatusLabel = (status?: EMaTrangThaiThanhToan) =>
		status ? intl.formatMessage({ id: `taichinh.hoadon.status.${status}` }) : '';

	// Callback from MOMO
	useEffect(() => {
		if (window.location.href.includes('orderType=momo_wallet'))
			if (window.location.href.includes('resultCode=0'))
				notification.success({
					message: intl.formatMessage({ id: 'taichinh.hoadon.notify.success.title' }),
					description: intl.formatMessage({ id: 'taichinh.hoadon.notify.success.desc' }),
				});
			else
				notification.warning({
					message: intl.formatMessage({ id: 'taichinh.hoadon.notify.fail.title' }),
					description: intl.formatMessage({ id: 'taichinh.hoadon.notify.fail.desc' }),
				});
	}, []);

	const getData = (activeKey: 'chua_thanh_toan' | 'da_thanh_toan') =>
		getModel(undefined, [
			{
				field: 'status',
				operator: activeKey === 'da_thanh_toan' ? EOperatorType.INCLUDE : EOperatorType.NOT_INCLUDE,
				values: [`${EMaTrangThaiThanhToan.DA_THANH_TOAN_DU}`],
			},
		]).then((res) => {
			// Sau khi thanh toán => Get lại danh sách và set lại record hóa đơn hiện tại
			if (record?._id) setRecord(res.find((item) => item._id === record._id));
		});

	const handleDetail = (rec: HoaDon.IRecord) => {
		setRecord(rec);
		setVisibleModal(true);
	};

	const baseColumns: IColumn<HoaDon.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'global.table.column.tt' }),
			dataIndex: 'index',
			align: 'center',
			width: 60,
			render: (val) => val,
		},
		{
			title: intl.formatMessage({ id: 'taichinh.hoadon.column.identityCode' }),
			dataIndex: 'identityCode',
			align: 'center',
			filterType: 'string',
			width: 120,
			render: (val, rec: BillTableRecord) =>
				rec._isVirtualBillNotice ? null : (
					<div className={rec._isVirtualBill ? 'virtual-bill-identity' : undefined}>
						{/* {rec._isVirtualBill && <Tag color='blue'>Hóa đơn con</Tag>} */}
						<div>{val}</div>
					</div>
				),
		},
		{
			title: intl.formatMessage({ id: 'taichinh.hoadon.column.dotthu' }),
			dataIndex: 'idDotThu',
			width: 180,
			render: (_val, rec: BillTableRecord) => (
				<div>
					{rec._isVirtualBill && (
						<Tag color='gold' style={{ marginBottom: 4 }}>
							{intl.formatMessage({ id: 'taichinh.hoadon.virtualBill.earlyPayment' })}
						</Tag>
					)}
					<div>{rec.dotThu?.tenDot}</div>
				</div>
			),
			filterType: 'customselect',
			filterCustomSelect: <SelectDotThu multiple />,
		},
		// {
		// 	title: intl.formatMessage({ id: 'taichinh.hoadon.column.khoanthu' }),
		// 	width: 250,
		// 	render: (val, rec) => (
		// 		<ExpandText>
		// 			{rec?.billItems
		// 				?.filter((item) => item.status !== EMaTrangThaiThanhToan.DONG)
		// 				?.map((item) => <div key={item._id}>- {item.ten ?? item?.tenKhoanThu}</div>)}
		// 		</ExpandText>
		// 	),
		// },
		{
			title: intl.formatMessage({ id: 'taichinh.hoadon.column.hanthanhtoan' }),
			dataIndex: 'ngayHetHanThanhToan',
			width: 200,
			render: (val, rec) => {
				const isKtxDeposit = rec.transactions?.some((transaction) => transaction.isKtxDeposit === true);
				if (isKtxDeposit) return <PaymentDeadlineCountdown deadline={val} />;

				const ngayHetHan = dayjs(val);
				const now = dayjs();
				const soNgayConLai = ngayHetHan.diff(now, 'day', true);

				let extraText = null;

				if (dayjs().isAfter(dayjs(rec.ngayHetHanThanhToan), 'day')) {
					extraText = (
						<div style={{ color: '#cf1322', fontWeight: 500, fontSize: 12 }}>
							{intl.formatMessage({ id: 'taichinh.hoadon.hanthanhtoan.hethan' })}
						</div>
					);
				} else if (soNgayConLai >= 0 && soNgayConLai <= 1) {
					extraText = (
						<div style={{ color: '#d48806', fontWeight: 500, fontSize: 12 }}>
							{intl.formatMessage({ id: 'taichinh.hoadon.hanthanhtoan.con1ngay' })}
						</div>
					);
				} else if (soNgayConLai > 1 && soNgayConLai <= 10) {
					extraText = (
						<div style={{ color: '#52c41a', fontWeight: 500, fontSize: 12 }}>
							{intl.formatMessage({ id: 'taichinh.hoadon.hanthanhtoan.conngay' }, { soNgay: Math.ceil(soNgayConLai) })}
						</div>
					);
				}

				return (
					<div>
						<div>{ngayHetHan.format('DD/MM/YYYY')}</div>
						{rec?.status !== EMaTrangThaiThanhToan.DA_THANH_TOAN_DU && extraText}
					</div>
				);
			},
			filterType: 'date',
		},

		// {
		// 	title: intl.formatMessage({ id: 'taichinh.hoadon.column.phiphainop' }),
		// 	width: 200,
		// 	// hide: releaseFilter === 'RELEASED',
		// 	render: (val, rec) => {
		// 		return (
		// 			<div>
		// 				{rec?.transactions
		// 					?.filter((item) => item.type === ETransactionType.CHARGE)
		// 					?.map((item, index) => (
		// 						<div style={{ marginBottom: 8 }} key={index}>
		// 							<div>
		// 								[{item.maKhoanThu}] {item.tenKhoanThu}
		// 							</div>
		// 							<div className='text-primary fw500'>
		// 								{item.loaiTienTe} {currencyFormat(item.amount)}
		// 							</div>
		// 						</div>
		// 					))}
		// 			</div>
		// 		);
		// 	},
		// },

		// {
		// 	title: intl.formatMessage({ id: 'taichinh.hoadon.column.phigiamtru' }),
		// 	width: 200,
		// 	// hide: releaseFilter === 'RELEASED',
		// 	render: (val, rec) => {
		// 		return (
		// 			<div>
		// 				{rec?.transactions
		// 					?.filter((item) => item.type === ETransactionType.DISCOUNT)
		// 					?.map((item, index) => (
		// 						<div style={{ marginBottom: 8 }} key={index}>
		// 							<div>
		// 								[{item.maKhoanThu}] {item.tenKhoanThu}
		// 							</div>
		// 							<div className='text-primary fw500'>
		// 								{item.loaiTienTe} {currencyFormat(item.amount)}
		// 							</div>
		// 						</div>
		// 					))}
		// 			</div>
		// 		);
		// 	},
		// },

		// {
		// 	title: 'Số dư có thể cấn trừ',
		// 	dataIndex: 'soTienConLai',
		// 	width: 180,
		// 	sortable: true,
		// 	render: (val) => <span className='text-primary fw500'>{inputFormat(0)} VND</span>,
		// },
		// {
		// 	title: intl.formatMessage({ id: 'taichinh.hoadon.column.tongphiphainop' }),
		// 	dataIndex: 'soTienPhaiThu',
		// 	width: 180,
		// 	sortable: true,
		// 	render: (val) => <span className='text-primary fw500'>{inputFormat(val ?? 0)} VND</span>,
		// },
		// {
		// 	title: intl.formatMessage({ id: 'taichinh.hoadon.column.tongphigiamtru' }),
		// 	dataIndex: 'soTienKhuyenMai',
		// 	width: 180,
		// 	sortable: true,
		// 	render: (val) => <span className='text-primary fw500'>{inputFormat(val ?? 0)} VND</span>,
		// },
		{
			title: intl.formatMessage({ id: 'taichinh.hoadon.column.tongdathanhtoan' }),
			dataIndex: 'amountPaid',
			width: 180,
			align: 'right',
			sortable: true,
			render: (val) => <span className='text-primary fw500'>{inputFormat(val ?? 0)} VND</span>,
		},
		{
			title: intl.formatMessage({ id: 'taichinh.hoadon.column.tongcanthanhtoan' }),
			dataIndex: 'balance',
			width: 180,
			align: 'right',
			sortable: true,
			render: (val) => <span className='text-primary fw500'>{inputFormat(val ?? 0)} VND</span>,
			fixed: 'right',
		},

		{
			title: intl.formatMessage({ id: 'taichinh.hoadon.column.trangthai' }),
			dataIndex: 'status',
			fixed: 'right',
			align: 'center',
			width: 150,
			render: (val: EMaTrangThaiThanhToan) => (
				<Tag color={EMauTrangThaiThanhToanTable[val]}>{getPaymentStatusLabel(val)}</Tag>
			),
			filterType: 'select',
			filterData: Object.values(EMaTrangThaiThanhToan).map((item) => ({
				value: item,
				label: getPaymentStatusLabel(item),
			})),
		},
		{
			title: intl.formatMessage({ id: 'taichinh.tragop.column.trangthai' }),
			dataIndex: 'trangThaiTraGop',
			align: 'center',
			width: 160,
			render: (val?: ETrangThaiTraGopBill) =>
				val ? (
					<Tag color={EMauTrangThaiTraGopBill[val]}>{intl.formatMessage({ id: `taichinh.tragop.status.${val}` })}</Tag>
				) : null,
		},
		{
			title: intl.formatMessage({ id: 'taichinh.hoadon.column.thaotac' }),
			align: 'center',
			width: 150,
			fixed: 'right',
			render: (val, rec: BillTableRecord) => (
				<div onClick={(e) => e.stopPropagation()}>
					<ButtonExtend
						tooltip={
							disableThanhToan(rec)
								? intl.formatMessage({ id: 'taichinh.hoadon.tooltip.ngoaithoihan' })
								: intl.formatMessage({ id: 'taichinh.hoadon.tooltip.thanhtoanngay' })
						}
						disabled={disableThanhToan(rec)}
						onClick={() => {
							setRecord(rec);
							setInitialPaymentAmount(undefined);
							setLockPaymentAmount(false);
							setVisibleModalThanhToan(true);
						}}
						type='link'
						className={disableThanhToan(rec) ? undefined : 'text-success'}
						icon={<UnorderedListOutlined />}
					/>
					<ButtonExtend
						tooltip={intl.formatMessage({ id: 'taichinh.hoadon.tooltip.xemchitiet' })}
						icon={<EyeOutlined />}
						onClick={() => handleDetail(rec)}
						type='link'
					/>

					<ButtonExtend
						tooltip={intl.formatMessage({ id: 'taichinh.tragop.tooltip.dangky' })}
						icon={<ScheduleOutlined />}
						type='link'
						onClick={() => {
							setBillTraGop(rec);
							setVisibleModalDangKyTraGop(true);
						}}
					/>

					<ButtonExtend
						tooltip={intl.formatMessage({ id: 'taichinh.tragop.tooltip.tiendo' })}
						icon={<FieldTimeOutlined />}
						type='link'
						onClick={() => {
							setBillTraGop(rec);
							setVisibleModalTienDoTraGop(true);
						}}
					/>

					{!rec._isVirtualBill && (
						<ButtonExtend
							tooltip={intl.formatMessage({ id: 'taichinh.hoadon.tooltip.xemhuongdan' })}
							danger
							loading={loadingPdfMap[rec._id]}
							onClick={async () => {
								try {
									setLoadingPdfMap((prev) => ({ ...prev, [rec._id]: true }));
									const url = await getExportBillUrl(rec.identityCode);
									if (url) {
										setPdfUrl(url);
										setVisibleModalPDF(true);
									}
								} catch {
									// error handled by axios interceptor
								} finally {
									setLoadingPdfMap((prev) => ({ ...prev, [rec._id]: false }));
								}
							}}
							type='link'
							icon={<FilePdfOutlined />}
						/>
					)}
				</div>
			),
		},
	];
	const columns: IColumn<HoaDon.IRecord>[] = baseColumns.map((column) => {
		const originalRender = column.render;
		const originalOnCell = column.onCell;
		return {
			...column,
			onCell: (rec: BillTableRecord, index) => ({
				...originalOnCell?.(rec, index),
				...(rec._isVirtualBillNotice || rec._isKtxDepositNotice ? { colSpan: 0 } : {}),
			}),
			render: (value, rec: BillTableRecord, index) => {
				if (rec._isVirtualBillNotice || rec._isKtxDepositNotice) {
					return null;
				}
				return originalRender ? originalRender(value, rec, index) : value;
			},
		};
	});
	console.log('selectedIds', selectedIds);

	return (
		<PageCard title={intl.formatMessage({ id: 'taichinh.hoadon.title' })}>
			<style>{`
				.row-qua-han > td { background-color: #fff1f0 !important; }
				.ant-table-wrapper .ant-table-tbody > tr.row-hoa-don-con > td {
					background: #fafcff !important;
				}
				.ant-table-wrapper .ant-table-tbody > tr.row-hoa-don-con:hover > td {
					background: #f0f7ff !important;
				}
				.ant-table-wrapper .ant-table-tbody > tr.virtual-bill-notice-row > td {
					padding-top: 8px !important;
					padding-bottom: 8px !important;
					background: #fffdf0 !important;
					border-top: 1px solid #f8e8a6 !important;
					border-bottom: 1px solid #f8e8a6 !important;
				}
				.ant-table-wrapper .ant-table-tbody > tr.virtual-bill-notice-row > td.ant-table-selection-column {
					position: static !important;
					z-index: auto !important;
					text-align: left;
				}
				.ant-table-wrapper .ant-table-tbody > tr.virtual-bill-notice-row > td.ant-table-cell-fix-right {
					position: static !important;
				}
				.ant-table-wrapper .ant-table-tbody > tr.ktx-deposit-notice-row > td {
					padding: 8px !important;
					background: #fff1f0 !important;
				}
				.ant-table-wrapper .ant-table-tbody > tr.ktx-deposit-notice-row > td.ant-table-selection-column,
				.ant-table-wrapper .ant-table-tbody > tr.ktx-deposit-notice-row > td.ant-table-cell-fix-right {
					position: static !important;
					z-index: auto !important;
					text-align: left;
				}
				.ktx-deposit-notice { width: 100%; }
				.virtual-bill-notice {
					display: flex;
					align-items: flex-start;
					gap: 10px;
					min-width: 620px;
					color: #5c4b16;
					font-size: 12px;
					line-height: 1.45;
				}
				.virtual-bill-notice-icon {
					display: flex;
					align-items: center;
					justify-content: center;
					flex: 0 0 30px;
					height: 30px;
					margin-top: 1px;
					color: #fff;
					background: #f7c948;
					border-radius: 6px;
					font-size: 16px;
				}
				.virtual-bill-notice-title {
					margin-bottom: 1px;
					color: #594714;
					font-weight: 600;
				}
				.virtual-bill-notice-description {
					color: #78662e;
				}
				.virtual-bill-identity { padding-left: 16px; position: relative; }
				.virtual-bill-identity::before {
					content: '';
					position: absolute;
					left: 0;
					top: 6px;
					width: 9px;
					height: 12px;
					border-left: 1px solid #1677ff;
					border-bottom: 1px solid #1677ff;
				}
				.virtual-bill-identity .ant-tag { margin: 0 0 4px; font-size: 11px; }
			`}</style>

			<Tabs
				activeKey={activeKey}
				onChange={(tab) => {
					setActiveKey(tab as 'chua_thanh_toan' | 'da_thanh_toan');
				}}
			>
				<Tabs.TabPane key='chua_thanh_toan' tab={intl.formatMessage({ id: 'taichinh.hoadon.tab.unpaid' })} />
				<Tabs.TabPane key='da_thanh_toan' tab={intl.formatMessage({ id: 'taichinh.hoadon.tab.paid' })} />
			</Tabs>

			<TableBase
				addStt={false}
				rowSelection={activeKey === 'chua_thanh_toan'}
				columns={columns}
				getData={() => getData(activeKey)}
				buttons={{ create: false }}
				dependencies={[page, limit, activeKey]}
				modelName='taichinh.hoadon'
				widthDrawer={1000}
				otherButtons={[
					...(selectedIds && selectedIds?.length > 0
						? [
								<ButtonExtend
									key={'thanh-toan'}
									icon={<UnorderedListOutlined />}
									onClick={() => {
										const bills = allTableBills.filter(
											(item) =>
												selectedIds.includes(item._id) &&
												!item.transactions?.some((transaction) => transaction.isKtxDeposit === true),
										);
										if (!bills.length) return;
										if (bills.length === 1) {
											setRecord(bills[0]);
											setSelectedBills([]);
											setPaymentMode('single');
										} else {
											setSelectedBills(bills);
											setPaymentMode('multi');
										}
										setInitialPaymentAmount(undefined);
										setLockPaymentAmount(false);
										setVisibleModalThanhToan(true);
									}}
									type='primary'
								>
									{intl.formatMessage({ id: 'taichinh.hoadon.action.paySelected' }, { count: selectedIds?.length })}
								</ButtonExtend>,
							]
						: []),
				]}
				otherProps={{
					dataSource: tableData,
					rowKey: (rec: BillTableRecord) => rec._id,
					expandable: {
						expandedRowKeys,
						onExpandedRowsChange: (keys) => setExpandedRowKeys([...keys]),
						indentSize: 24,
						rowExpandable: (rec) => Boolean(rec.children?.length),
					},
					rowClassName: (rec: BillTableRecord) => {
						if (rec._isVirtualBillNotice) return 'virtual-bill-notice-row';
						if (rec._isKtxDepositNotice) return 'ktx-deposit-notice-row';
						if (rec._isVirtualBill) return 'row-hoa-don-con';
						// Check hạn thanh toán từ hóa đơn
						if (rec.ngayHetHanThanhToan && dayjs().isAfter(dayjs(rec.ngayHetHanThanhToan), 'day')) return 'row-qua-han';

						return '';
					},
					onRow: (rec: BillTableRecord) => ({
						onClick: rec._isVirtualBillNotice || rec._isKtxDepositNotice ? undefined : () => handleDetail(rec),
						style: { cursor: rec._isVirtualBillNotice || rec._isKtxDepositNotice ? 'default' : 'pointer' },
					}),
				}}
				detailRow={{
					checkStrictly: true,
					getCheckboxProps: (rec: BillTableRecord) => ({
						disabled: Boolean(
							rec._isVirtualBillNotice ||
							rec._isKtxDepositNotice ||
							rec.transactions?.some((transaction) => transaction.isKtxDeposit === true),
						),
					}),
					onChange: (selectedRowKeys: Key[]) => {
						const nextSelectedIds = new Set(selectedRowKeys.map(String));

						allTableBills.forEach((bill) => {
							if (bill.transactions?.some((transaction) => transaction.isKtxDeposit === true)) {
								nextSelectedIds.delete(bill._id);
								return;
							}
							if (bill._isVirtualBill && nextSelectedIds.has(bill._id) && bill._parentBillId) {
								nextSelectedIds.add(bill._parentBillId);
							}
						});

						setSelectedIds(Array.from(nextSelectedIds));
					},
					renderCell: (_checked: boolean, rec: BillTableRecord, _index: number, originNode: ReactNode) => {
						if (rec._isVirtualBillNotice) return renderVirtualBillNotice(rec);
						if (rec._isKtxDepositNotice) return renderKtxDepositNotice();
						return originNode;
					},
					onCell: (rec: BillTableRecord) =>
						rec._isVirtualBillNotice || rec._isKtxDepositNotice ? { colSpan: baseColumns.length + 1 } : {},
				}}
			></TableBase>

			<Modal
				open={visibleModal}
				onCancel={() => setVisibleModal(false)}
				footer={null}
				styles={{ body: { padding: 0 } }}
				width={1000}
			>
				<ThongTinThanhToan setVisible={setVisibleModal} getData={() => getData(activeKey)} />
			</Modal>

			<Modal
				open={visibleModalPDF}
				onCancel={() => setVisibleModalPDF(false)}
				footer={null}
				width={900}
				title={intl.formatMessage({ id: 'taichinh.hoadon.tooltip.xemhuongdan' })}
			>
				{/* <PreviewFile file={pdfUrl ?? ''} /> */}
				{pdfUrl ? <PDFViewerV2 url={pdfUrl} height='80vh' /> : <Empty />}
			</Modal>

			<ModalThanhToan
				visible={visibleModalThanhToan}
				onClose={() => {
					setVisibleModalThanhToan(false);
					setSelectedBills([]);
					setPaymentMode('single');
					setInitialPaymentAmount(undefined);
					setLockPaymentAmount(false);
				}}
				onSuccess={() => {
					getData(activeKey);
					setVisibleModalThanhToan(false);
					setSelectedBills([]);
					setPaymentMode('single');
					setInitialPaymentAmount(undefined);
					setLockPaymentAmount(false);
				}}
				mode={paymentMode}
				bills={selectedBills}
				initialAmount={initialPaymentAmount}
				lockAmount={lockPaymentAmount}
			/>

			<ModalDangKyTraGop
				visible={visibleModalDangKyTraGop}
				bill={billTraGop}
				onClose={() => setVisibleModalDangKyTraGop(false)}
				onSuccess={() => getData(activeKey)}
			/>

			<ModalTienDoTraGop
				visible={visibleModalTienDoTraGop}
				bill={billTraGop}
				onClose={() => setVisibleModalTienDoTraGop(false)}
				onPayNow={(_phien, amount) => {
					if (!billTraGop) return;
					setRecord(billTraGop);
					setPaymentMode('single');
					setInitialPaymentAmount(amount);
					setLockPaymentAmount(true);
					setVisibleModalTienDoTraGop(false);
					setVisibleModalThanhToan(true);
				}}
			/>
		</PageCard>
	);
};

export default HoaDonPage;
