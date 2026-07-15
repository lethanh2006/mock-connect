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
import { Button, Empty, message, Popconfirm, Tag } from 'antd';
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

const LichSuaKTX = () => {
	const intl = useIntl();
	const { record: recHocKy } = useModel('daotao.hocky');
	const { getByIdModel: getDotDangKy, record: recDot, setRecord: setRecDot } = useModel('kytucxa.dotdangky');
	const { getModel, page, limit, deleteModel, handleEdit, setRecord } = useModel('kytucxa.phieudangky');
	const {
		getModel: getPhongChinhSach,
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

	const handleViewPhong = async (record: PhieuDangKyKTX.IRecord) => {
		const maDotId = recDot?._id;

		if (!maDotId) {
			message.warning(intl.formatMessage({ id: 'global.title.khongcodulieu' }));
			return;
		}

		try {
			const data = await getPhongChinhSach(
				{
					maDotId,
				},
				undefined,
				undefined,
				undefined,
				undefined,
				'ktx/chinh-sach-phong/page',
				undefined,
				false,
			);
			const phong = data?.[0] as Phong.IChinhSachPhongRecord | undefined;

			if (!phong) {
				message.warning(intl.formatMessage({ id: 'global.title.khongcodulieu' }));
				return;
			}

			setRecord(record);
			setRecPhong(phong);
			setVisibleChiTietPhong(true);
		} catch {
			message.error(intl.formatMessage({ id: 'global.message.capnhatthatbai' }));
		}
	};

	const columns: IColumn<PhieuDangKyKTX.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'kytucxa.lichsu.column.floor' }),
			width: 90,
			sortable: true,
			onCell,
			render: (_val, rec) => getFloorText(rec?.phong?.tangThu),
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.lichsu.column.roomCode' }),
			width: 120,
			render: (_val, rec) => {
				const roomCode = rec?.phong?.ma || rec?.maPhong;

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
			render: (_val, rec) => rec?.phong?.moTa || rec?.phong?.ten || '--',
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.lichsu.column.price' }),
			width: 160,
			onCell,
			render: (_val, rec) => tienVietNam(rec?.phong?.giaPhong ?? 0),
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
			width: 150,
			render: (_val, rec) => _val && formatDate(_val),
			onCell,
		},
		{
			title: intl.formatMessage({ id: 'kytucxa.lichsu.column.paymentStatus' }),
			dataIndex: 'trangThaiThanhToan',
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
