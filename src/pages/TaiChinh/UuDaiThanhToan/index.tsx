import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import type { UuDaiThanhToan } from '@/services/TaiChinh/UuDaiThanhToan/typing';
import moment from 'moment';
import { useModel } from 'umi';

const UuDaiThanhToanPage = () => {
	const { page, limit } = useModel('taichinh.uudaiuser');

	const columns: IColumn<UuDaiThanhToan.IUuDaiUser>[] = [
		{
			title: 'Tên ưu đãi',
			dataIndex: ['uuDai', 'ten'],
			width: 150,
		},
		{
			title: 'Thời gian áp dụng',
			align: 'center',
			width: 120,
			render: (val, rec) =>
				`${rec.uuDai?.thoiGianBatDau ? moment(rec.uuDai?.thoiGianBatDau).format('DD/MM/YYYY') : ''} - ${
					rec.uuDai?.thoiGianKetThuc ? moment(rec.uuDai?.thoiGianKetThuc).format('DD/MM/YYYY') : ''
				}`,
		},
		{
			title: 'Loại khoản thu áp dụng',
			dataIndex: ['uuDai', 'maKhoanThuApDung'],
			width: 140,
			render: (val, rec) => rec.uuDai?.khoanThuApDung?.name ?? val,
		},
		{
			title: 'Giá trị ưu đãi',
			dataIndex: ['uuDai', 'phanTramUuDai'],
			align: 'center',
			width: 80,
			render: (val) => val && `${val}%`,
		},
		{
			title: 'Sử dụng',
			dataIndex: 'idDotThu',
			width: 180,
			render: (val, rec) => (val ? rec.dotThu?.tenDot ?? 'Đã sử dụng' : <i>Chưa sử dụng</i>),
		},
		{
			title: 'Mô tả',
			dataIndex: ['uuDai', 'moTa'],
			width: 220,
			render: (val) => val && <ExpandText>{val}</ExpandText>,
		},
	];

	return (
		<TableBase
			buttons={{ create: false }}
			columns={columns}
			dependencies={[page, limit]}
			modelName='taichinh.uudaiuser'
			title='Ưu đãi thanh toán'
		/>
	);
};

export default UuDaiThanhToanPage;
