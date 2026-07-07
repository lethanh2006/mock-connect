import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import FilterHocKy from '@/pages/DaoTao/HocKy/FilterHocKy';
import { PhieuDangKyKTX } from '@/services/KyTucXa/PhieuDangKy/typing';
import { DeleteOutlined, DollarCircleOutlined } from '@ant-design/icons';
import { Popconfirm, Tag } from 'antd';
import dayjs from 'dayjs';
import { useIntl, useModel } from 'umi';
import SelectDotDangKyKTX from '../DotDangKyKTX/Select';

const formatCurrency = (value?: number | string) => {
	if (!value) return '--';
	const numberValue = Number(value);
	if (Number.isNaN(numberValue)) return `${value}`;
	return `${numberValue.toLocaleString('vi-VN')} VND`;
};

const formatDate = (value?: string | Date | null) => {
	if (!value) return '--';
	return dayjs(value).format('HH:mm DD/MM/YYYY');
};

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

const getPaymentTag = (status?: string) => {
	switch (status) {
		case 'Đã thanh toán':
		case 'Paid':
			return <Tag color='success'>Paid</Tag>;

		case 'Chưa thanh toán':
		case 'Unpaid':
			return <Tag color='error'>Unpaid</Tag>;

		case 'Thanh toán thiếu':
		case 'Underpaid':
			return <Tag color='warning'>Underpaid</Tag>;

		case 'Đã đóng':
		case 'Closed':
			return <Tag color='purple'>Closed</Tag>;

		default:
			return <Tag>{status || '--'}</Tag>;
	}
};

const LichSuaKTX = () => {
	const intl = useIntl();
	const { record: recHocKy } = useModel('daotao.hocky');
	const { record: recDot } = useModel('kytucxa.dotdangky');
	const { getModel, page, limit, deleteModel, handleEdit } = useModel('kytucxa.phieudangky');

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

	const columns: IColumn<PhieuDangKyKTX.IRecord>[] = [
		{
			title: 'Floor',
			width: 90,
			sortable: true,
			render: (_val, rec) => getFloorText(rec?.phong?.tangThu),
		},
		{
			title: 'Room Code',
			width: 120,
			render: (_val, rec) => rec?.phong?.ma || rec?.maPhong || '--',
		},
		{
			title: 'Apartment Type',
			width: 260,
			sortable: true,
			render: (_val, rec) => rec?.phong?.moTa || rec?.phong?.ten || '--',
		},
		{
			title: 'Price',
			width: 160,
			render: (_val, rec) => {
				const giaPhong = (rec?.phong as any)?.giaPhong || (rec as any)?.giaPhong;
				return formatCurrency(giaPhong);
			},
		},
		{
			title: 'Move In Date',
			width: 150,
			render: (_val, rec) => {
				const moveInDate = (rec as any)?.ngayNhanPhong || (rec as any)?.moveInDate || rec?.createdAt;
				return formatDate(moveInDate);
			},
		},
		{
			title: 'Move Out Date',
			width: 150,
			render: (_val, rec) => {
				const moveOutDate = (rec as any)?.ngayTraPhong || (rec as any)?.moveOutDate || rec?.thoiHanThanhToan;
				return formatDate(moveOutDate);
			},
		},
		{
			title: 'Payment Status',
			width: 150,
			sortable: true,
			render: (_val, rec) => getPaymentTag(rec?.trangThaiThanhToan),
		},
		{
			title: 'Action',
			align: 'center',
			width: 100,
			fixed: 'right',
			render: (_val, rec) => {
				const isPaid = rec?.trangThaiThanhToan === 'Đã thanh toán' || rec?.trangThaiThanhToan === 'Paid';
				const isClosed = rec?.trangThaiThanhToan === 'Đã đóng' || rec?.trangThaiThanhToan === 'Closed';

				return (
					<>
						{!isPaid && !isClosed ? (
							<ButtonExtend
								tooltip='Thanh toán'
								onClick={() => handleEdit(rec)}
								type='primary'
								icon={<DollarCircleOutlined />}
								style={{ marginRight: 8 }}
							/>
						) : null}

						<Popconfirm
							onConfirm={() => deleteModel(rec?._id, getData)}
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
		<TableBase
			getData={getData}
			columns={columns}
			dependencies={[page, limit, recDot?._id]}
			modelName='kytucxa.phieudangky'
			title='Phiếu đăng ký'
			buttons={{ create: false }}
		>
			<FilterHocKy isSetHocKy style={{ marginBottom: 12 }}>
				<SelectDotDangKyKTX condition={{ maHocKy: recHocKy?.ma }} style={{ width: 250 }} allowClear isSetRecord />
			</FilterHocKy>
		</TableBase>
	);
};

export default LichSuaKTX;
