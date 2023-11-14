import ExpandText from '@/components/ExpandText';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import type { QuyetDinh } from '@/services/HocTap/QuyetDinh/typing';
import { colorTrangThaiSinhVienBLTH, type ETrangThaiSinhVienBLTH } from '@/services/HocTap/constant';
import { Card, Tag } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';

const BaoLuuThoiHocTable = (props: { isThoiHoc?: boolean }) => {
	const { isThoiHoc } = props;
	const { getAllModel, danhSach, setDanhSach } = useModel(isThoiHoc ? 'quyetdinh.thoihoc' : 'quyetdinh.baoluu');

	const getData = () =>
		getAllModel(undefined, undefined, undefined, undefined, 'me', false).then((res) => setDanhSach(res));

	useEffect(() => {
		getData();
	}, []);

	const columns: IColumn<QuyetDinh.ISinhVienBaoLuuThoiHoc>[] = [
		{
			title: 'Số quyết đinh',
			dataIndex: 'soQuyetDinh',
			width: 150,
		},
		{
			title: 'Nội dung',
			dataIndex: 'quyetDinh',
			width: 250,
			render: (val, rec) => <ExpandText>{rec.quyetDinh?.noiDung}</ExpandText>,
		},
		{
			title: 'Thời gian thôi học',
			dataIndex: 'thoiGianHieuLuc',
			width: 120,
			align: 'center',
			render: (val, rec) => val && moment(val).format('DD/MM/YYYY'),
			hide: !isThoiHoc,
		},
		{
			title: 'Thời gian bảo lưu',
			dataIndex: 'thoiGianBatDau',
			width: 120,
			align: 'center',
			render: (val, rec) => val && moment(val).format('DD/MM/YYYY'),
			hide: isThoiHoc,
		},
		{
			title: 'Thời gian kết thúc',
			dataIndex: 'thoiGianKetThuc',
			width: 120,
			align: 'center',
			render: (val, rec) => val && moment(val).format('DD/MM/YYYY'),
			hide: isThoiHoc,
		},
		{
			title: 'Tập tin',
			dataIndex: 'quyetDinh',
			align: 'center',
			width: 120,
			render: (val, rec) => rec.quyetDinh?.url && <a href={rec.quyetDinh?.url}>Xem chi tiết</a>,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			align: 'center',
			render: (val, rec) => <Tag color={colorTrangThaiSinhVienBLTH[val as ETrangThaiSinhVienBLTH]}>{val}</Tag>,
			width: 120,
		},
	];

	return (
		<Card title={`Quyết định ${isThoiHoc ? 'thôi học' : 'bảo lưu'}`}>
			<TableStaticData columns={columns} data={danhSach} hasTotal addStt size='small' />
		</Card>
	);
};

export default BaoLuuThoiHocTable;
