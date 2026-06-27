import PDFViewerV2 from '@/components/PDFViewerV2';
import PageCard from '@/components/PageCard';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import { type IColumn } from '@/components/Table/typing';
import { getExportBillUrl } from '@/services/TaiChinh/HoaDon';
import type { HoaDon } from '@/services/TaiChinh/HoaDon/typing';
import { EMaTrangThaiThanhToan, EMauTrangThaiThanhToanTable, ETrangThaiThanhToan } from '@/services/TaiChinh/constant';
import { inputFormat } from '@/utils/utils';
import { EyeOutlined, FilePdfOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Empty, Modal, Tabs, Tag, notification } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import SelectDotThu from '../DotThu/Select';
import ModalThanhToan from './ThanhToan/ModalThanhToan';
import ThongTinThanhToan from './ThanhToan/ThongTinThanhToan';

/** Kiểm tra nút thanh toán có bị disable không: ngoài thời gian thanh toán */
export const disableThanhToan = (rec?: HoaDon.IRecord): boolean => {
	if (!rec) return true;

	// Check thời gian đợt thu
	// if (rec.dotThu?._id && rec.dotThu?.thoiGianKetThuc && rec.dotThu.kichHoat) {
	// 	if (dayjs().isBefore(dayjs(rec.dotThu.thoiGianBatDau)) || dayjs().isAfter(dayjs(rec.dotThu.thoiGianKetThuc)))
	// 		return true;
	// }

	if (rec?.status === EMaTrangThaiThanhToan.DONG) return true;
	return false;
};

const HoaDonPage = () => {
	const intl = useIntl();
	const { getModel, page, limit, setRecord, record, visibleModalThanhToan, setVisibleModalThanhToan } =
		useModel('taichinh.hoadon');
	const [visibleModal, setVisibleModal] = useState<boolean>(false);
	const [visibleModalPDF, setVisibleModalPDF] = useState<boolean>(false);
	const [pdfUrl, setPdfUrl] = useState<string | undefined>(undefined);
	const [loadingPdfMap, setLoadingPdfMap] = useState<Record<string, boolean>>({});
	const [activeKey, setActiveKey] = useState<'chua_thanh_toan' | 'da_thanh_toan'>('chua_thanh_toan');

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

	const columns: IColumn<HoaDon.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'taichinh.hoadon.column.identityCode' }),
			dataIndex: 'identityCode',
			align: 'center',
			filterType: 'string',
			width: 120,
		},
		{
			title: intl.formatMessage({ id: 'taichinh.hoadon.column.dotthu' }),
			dataIndex: 'idDotThu',
			width: 180,
			render: (val, rec) => rec.dotThu?.tenDot,
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
			width: 150,
			render: (val, rec) => {
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
			dataIndex: 'soTienDaThu',
			width: 180,
			align: 'right',
			sortable: true,
			render: (val) => <span className='text-primary fw500'>{inputFormat(val ?? 0)} VND</span>,
		},
		{
			title: intl.formatMessage({ id: 'taichinh.hoadon.column.tongcanthanhtoan' }),
			dataIndex: 'soTienConLai',
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
				<Tag color={EMauTrangThaiThanhToanTable[val]}>{ETrangThaiThanhToan[val]}</Tag>
			),
			filterType: 'select',
			filterData: Object.values(EMaTrangThaiThanhToan).map((item) => ({
				value: item,
				label: ETrangThaiThanhToan[item],
			})),
		},
		{
			title: intl.formatMessage({ id: 'taichinh.hoadon.column.thaotac' }),
			align: 'center',
			width: 150,
			fixed: 'right',
			render: (val, rec: HoaDon.IRecord) => (
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
							setVisibleModalThanhToan(true);
						}}
						type='link'
						className='text-success'
						icon={<UnorderedListOutlined />}
					/>
					<ButtonExtend
						tooltip={intl.formatMessage({ id: 'taichinh.hoadon.tooltip.xemchitiet' })}
						icon={<EyeOutlined />}
						onClick={() => handleDetail(rec)}
						type='link'
					/>

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
				</div>
			),
		},
	];

	return (
		<PageCard title={intl.formatMessage({ id: 'taichinh.hoadon.title' })}>
			<style>{`.row-qua-han { background-color: #fff1f0 !important; }`}</style>

			<Tabs
				activeKey={activeKey}
				onChange={(tab) => {
					setActiveKey(tab as 'chua_thanh_toan' | 'da_thanh_toan');
				}}
			>
				<Tabs.TabPane key='chua_thanh_toan' tab='Chưa thanh toán' />
				<Tabs.TabPane key='da_thanh_toan' tab='Đã thanh toán' />
			</Tabs>

			<TableBase
				columns={columns}
				getData={() => getData(activeKey)}
				buttons={{ create: false }}
				dependencies={[page, limit, activeKey]}
				modelName='taichinh.hoadon'
				widthDrawer={1000}
				otherProps={{
					rowClassName: (rec: HoaDon.IRecord) => {
						// Check hạn thanh toán từ hóa đơn
						if (rec.ngayHetHanThanhToan && dayjs().isAfter(dayjs(rec.ngayHetHanThanhToan), 'day')) return 'row-qua-han';

						return '';
					},
					onRow: (rec: HoaDon.IRecord) => ({
						onClick: () => handleDetail(rec),
						style: { cursor: 'pointer' },
					}),
				}}
			/>

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
				onClose={() => setVisibleModalThanhToan(false)}
				onSuccess={() => {
					getData(activeKey);
					setVisibleModalThanhToan(false);
				}}
			/>
		</PageCard>
	);
};

export default HoaDonPage;
