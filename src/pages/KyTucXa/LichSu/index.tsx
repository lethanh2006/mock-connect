import PageCard from '@/components/PageCard';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import FilterHocKy from '@/pages/DaoTao/HocKy/FilterHocKy';
import { PhieuDangKyKTX } from '@/services/KyTucXa/PhieuDangKy/typing';
import { Phong } from '@/services/KyTucXa/Phong/typing';
import {
	EMaTrangThaiThanhToan,
	EMauTrangThaiThanhToanTable,
	ETrangThaiThanhToanKtxI18n,
} from '@/services/TaiChinh/constant';
import { formatDate } from '@/utils/formatDate';
import { tienVietNam } from '@/utils/utils';
import { DeleteOutlined, DollarCircleOutlined } from '@ant-design/icons';
import { Button, Empty, Popconfirm, Tag } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import ChiTietPhong from '../DangKy/components/ChiTiet';
import ModalDanKyKTX from '../DangKy/components/Modal';

const getFloorText = (floor?: number | string | null) => {
	if (!floor) return '--';
	const numberFloor = Number(floor);

	if (Number.isNaN(numberFloor)) return `${floor}`;

	switch (numberFloor) {
		case 1:
			return '1st';
		case 2:
			return '2nd';
		case 3:
			return '3rd';
		default:
			return `${numberFloor}th`;
	}
};

const getChinhSachPhong = (record?: PhieuDangKyKTX.IRecord) =>
	(record?.phong as (Phong.IRecord & { chinhSachPhong?: Phong.IChinhSachPhongRecord }) | undefined)?.chinhSachPhong;

const getChinhSachPhongChiTiet = (record?: PhieuDangKyKTX.IRecord) => {
	const chinhSachPhong = getChinhSachPhong(record);
	if (chinhSachPhong) return chinhSachPhong;
	if (!record?.phong) return undefined;

	return {
		_id: record.phong._id,
		roomId: record.phong._id,
		room: record.phong,
	} as Phong.IChinhSachPhongRecord;
};

const getRoomFromChinhSachPhong = (record?: PhieuDangKyKTX.IRecord) => getChinhSachPhong(record)?.room ?? record?.phong;

const LichSuaKTX = () => {
	const intl = useIntl();
	const { record: recHocKy } = useModel('daotao.hocky');
	const { getByIdModel: getDotDangKy, record: recDot, setRecord: setRecDot } = useModel('kytucxa.dotdangky');
	const { getModel, page, limit, deleteModel, handleEdit, setRecord } = useModel('kytucxa.phieudangky');
	const {
		setRecord: setRecPhong,
		setVisibleForm: setVisibleChiTietPhong,
		setVisibleDangKy,
	} = useModel('kytucxa.phong');
	const getPaymentStatusLabel = (status?: EMaTrangThaiThanhToan) => (status ? ETrangThaiThanhToanKtxI18n[status] : '');

	//Get đợt đăng ký
	useEffect(() => {
		if (recHocKy?.ma)
			getDotDangKy('me/one', true, {
				condition: { maHocKy: recHocKy?.ma },
			}).then((res: any) => setRecDot(res?.data));
	}, [recHocKy?.ma]);

	const getData = () => {
		if (recDot?._id)
			getModel(
				{
					maDotId: recDot?._id,
				},
				undefined,
				undefined,
				undefined,
				undefined,
				'me/page',
			);
	};

	const onCell = (record: PhieuDangKyKTX.IRecord) => ({
		onClick: () => {
			setRecord(record);
			setVisibleDangKy(true);
		},
		style: { cursor: 'pointer' },
	});

	const handleViewPhong = (record: PhieuDangKyKTX.IRecord) => {
		const chinhSachPhong = getChinhSachPhongChiTiet(record);

		setRecord(record);
		setRecPhong(chinhSachPhong);
		setVisibleChiTietPhong(true);
	};

	const columns: IColumn<PhieuDangKyKTX.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'kytucxa.lichsu.column.floor' }),
			width: 90,
			sortable: true,
			onCell,
			render: (_val, rec) => getFloorText(getRoomFromChinhSachPhong(rec)?.tangThu),
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.lichsu.column.roomCode' }),
			width: 120,
			render: (_val, rec) => {
				const roomCode = getRoomFromChinhSachPhong(rec)?.ma || rec?.maPhong;

				if (!roomCode) return '--';

				return (
					<Button
						type='link'
						style={{ padding: 0, height: 'auto' }}
						onClick={(event) => {
							event.stopPropagation();
							handleViewPhong(rec);
						}}
					>
						{roomCode}
					</Button>
				);
			},
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.lichsu.column.apartmentType' }),
			width: 260,
			sortable: true,
			onCell,
			render: (_val, rec) => {
				const chinhSachPhong = getChinhSachPhong(rec);
				const room = getRoomFromChinhSachPhong(rec);

				return chinhSachPhong?.loaiPhongKtx?.ten || chinhSachPhong?.moTa || room?.moTa || room?.ten || '--';
			},
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.lichsu.column.price' }),
			width: 160,
			onCell,
			render: (_val, rec) => {
				const chinhSachPhong = getChinhSachPhong(rec) as
					| (Phong.IChinhSachPhongRecord & { giaPhong?: number })
					| undefined;

				return tienVietNam(chinhSachPhong?.giaPhong ?? getRoomFromChinhSachPhong(rec)?.giaPhong ?? 0);
			},
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.lichsu.column.moveInDate' }),
			dataIndex: 'thoiGianChuyenVao',
			width: 150,
			render: (_val, rec) => _val && formatDate(_val),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.lichsu.column.moveOutDate' }),
			dataIndex: 'thoiGianChuyenRa',
			sortable: true,
			width: 150,
			render: (_val, rec) => _val && formatDate(_val),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.lichsu.column.paymentStatus' }),
			dataIndex: 'trangThaiThanhToan',
			sortable: true,
			width: 150,
			render: (val: EMaTrangThaiThanhToan) => (
				<Tag color={EMauTrangThaiThanhToanTable[val]}>{intl.formatMessage({ id: getPaymentStatusLabel(val) })}</Tag>
			),
			filterType: 'select',
			filterData: Object.values(EMaTrangThaiThanhToan).map((item) => ({
				value: item,
				label: intl.formatMessage({ id: getPaymentStatusLabel(item) }),
			})),
			onCell,
			fixed: 'right',
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.lichsu.column.action' }),
			align: 'center',
			width: 100,
			fixed: 'right',
			render: (_val, rec) => {
				const isPaid = rec?.trangThaiThanhToan === EMaTrangThaiThanhToan.DA_THANH_TOAN_DU;
				const isClosed = rec?.trangThaiThanhToan === EMaTrangThaiThanhToan.DONG;

				return (
					<>
						{!isPaid && !isClosed ? (
							<ButtonExtend
								type='link'
								tooltip={intl.formatMessage({ id: 'kytucxa.lichsu.tooltip.thanhToan' })}
								onClick={() => handleEdit(rec)}
								icon={<DollarCircleOutlined />}
							/>
						) : null}

						<Popconfirm
							onConfirm={() => deleteModel(`me/${rec?._id}`, getData)}
							title={intl.formatMessage({ id: 'kytucxa.danhmucchung.xacnhanxoa' })}
							placement='topRight'
							disabled={isClosed}
						>
							<ButtonExtend
								tooltip={intl.formatMessage({ id: 'kytucxa.danhmucchung.delete' })}
								danger
								disabled={isClosed}
								type='link'
								icon={<DeleteOutlined />}
							/>
						</Popconfirm>
					</>
				);
			},
		},
	];

	return (
		<PageCard title={intl.formatMessage({ id: 'kytucxa.lichsu.title' })}>
			<FilterHocKy isSetHocKy style={{ marginBottom: 12 }} />

			{recDot?._id ? (
				<TableBase
					getData={getData}
					columns={columns}
					dependencies={[page, limit, recDot?._id]}
					modelName='kytucxa.phieudangky'
					title={intl.formatMessage({ id: 'kytucxa.lichsu.title' })}
					buttons={{ create: false }}
					hideCard
				/>
			) : (
				<Empty description={intl.formatMessage({ id: 'kytucxa.dangky.empty.noDotDangKy' })} />
			)}

			<ModalDanKyKTX isView />

			<ChiTietPhong daCoLichSuDangKy />
		</PageCard>
	);
};

export default LichSuaKTX;
