import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import type { TrangThaiTiepNhan } from '@/services/QuyTrinh/KhaiBao/constants';
import { MapColorTrangThaiTiepNhan } from '@/services/QuyTrinh/KhaiBao/constants';
import type { KhaiBaoQuyTrinh } from '@/services/QuyTrinh/KhaiBao/typings';

import { EyeOutlined } from '@ant-design/icons';
import { Button, Tag, Tooltip } from 'antd';
import moment from 'moment';
import { history, useModel } from 'umi';

const TableDonHoiDong = () => {
	const { page, limit, condition, getDonHoiDongModel, setRecord } = useModel('quytrinh.donhoidong');
	const { record: recordHoiDong } = useModel('quytrinh.hoidong');

	const onCell = (recordVal: KhaiBaoQuyTrinh.IRecord) => ({
		onClick: () => {
			history.push(`/khai-bao-quy-trinh/${recordVal?._id}`);
		},
		style: { cursor: 'pointer' },
	});

	const getData = () => {
		if (recordHoiDong?._id) getDonHoiDongModel(recordHoiDong._id);
	};

	const columns: IColumn<KhaiBaoQuyTrinh.IRecord>[] = [
		{
			title: 'Chi tiết',
			dataIndex: 'moTa',
			width: 250,
			onCell,
		},
		{
			title: 'Họ tên',
			dataIndex: 'nguoiKhaiBao.ten',
			width: 200,
			filterType: 'string',
			align: 'center',
			render: (val, recordVal) => {
				return (
					<div>
						{recordVal?.nguoiKhaiBao?.ten} ({recordVal?.nguoiKhaiBao?.donVi})
					</div>
				);
			},
			onCell,
		},
		{
			title: 'Tiến trình',
			dataIndex: 'quyTrinh',
			width: 250,
			align: 'center',
			render: (val, recordVal: KhaiBaoQuyTrinh.IRecord) => {
				return (
					<>
						Bước {recordVal?.danhSachBuocXuLy?.length}/{val?.danhSachBuocXuLy?.length}:{' '}
						{recordVal?.danhSachBuocXuLy?.find((item) => item.laBuocHienTai)?.ten}
					</>
				);
			},
			onCell,
		},
		{
			title: 'Trạng thái xử lý',
			dataIndex: 'quyTrinh',
			width: 200,
			align: 'center',
			render: (val, recordVal) => (
				<Tag
					color={
						MapColorTrangThaiTiepNhan?.[
							recordVal?.danhSachBuocXuLy?.[recordVal?.danhSachBuocXuLy?.length - 1]
								?.trangThaiTiepNhan as TrangThaiTiepNhan
						] ?? 'yellow'
					}
				>
					{recordVal?.danhSachBuocXuLy?.[recordVal?.danhSachBuocXuLy?.length - 1]?.trangThaiTiepNhan}
				</Tag>
			),
		},

		{
			title: 'Ngày tạo',
			dataIndex: 'createdAt',
			width: 150,
			align: 'center',
			render: (val) => {
				return val ? moment(val).format('DD/MM/YYYY') : 'Không có dữ liệu';
			},
			onCell,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 150,
			fixed: 'right',
			render: (recordVal: KhaiBaoQuyTrinh.IRecord) => (
				<>
					<Tooltip title='Xem chi tiết'>
						<Button
							onClick={() => {
								setRecord(recordVal);
								history.push(`/khai-bao-quy-trinh/${recordVal?._id}?hoiDong=true`);
							}}
							type='link'
							icon={<EyeOutlined />}
						/>
					</Tooltip>
				</>
			),
		},
	];
	return (
		<div>
			<TableBase
				modelName={'quytrinh.donhoidong'}
				columns={columns}
				getData={getData}
				dependencies={[page, limit, condition, recordHoiDong?._id]}
				title={'Danh sách chi tiết'}
				destroyModal
				buttons={{ create: false }}
			/>
		</div>
	);
};
export default TableDonHoiDong;
