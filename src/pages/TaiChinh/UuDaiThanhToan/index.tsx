import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import type { UuDaiThanhToan } from '@/services/TaiChinh/UuDaiThanhToan/typing';
import moment from 'moment';
import { useModel } from 'umi';

const UuDaiThanhToanPage = () => {
	const { page, limit, getModel } = useModel('taichinh.uudaiuser');

	const getData = () => getModel(undefined, undefined, undefined, undefined, undefined, 'me/page');

	const columns: IColumn<UuDaiThanhToan.IUuDaiUser>[] = [
		{
			title: 'Tên ưu đãi',
			dataIndex: ['uuDai', 'ten'],
			filterType: 'string',
			width: 180,
		},
		{
			title: 'Thời gian áp dụng',
			align: 'center',
			width: 140,
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
			title: 'Mô tả',
			dataIndex: ['uuDai', 'moTa'],
			width: 220,
			render: (val) => val && <ExpandText>{val}</ExpandText>,
		},
		{
			title: 'Ngày nhận',
			dataIndex: 'createdAt',
			align: 'center',
			width: 100,
			render: (val) => val && moment(val).format('DD/MM/YYYY'),
		},
	];

	return (
		<TableBase
			buttons={{ create: false }}
			columns={columns}
			getData={getData}
			dependencies={[page, limit]}
			modelName='taichinh.uudaiuser'
			title='Ưu đãi thanh toán đã nhận được'
		/>
	);
};

export default UuDaiThanhToanPage;
