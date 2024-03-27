import ExpandText from '@/components/ExpandText';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import type { QuyetDinh } from '@/services/HocTap/QuyetDinh/typing';
import { colorTrangThaiSinhVienBaoLuu, type ETrangThaiSinhVienBaoLuu } from '@/services/HocTap/constant';
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
			title: 'Quyết định',
			dataIndex: 'soQuyetDinh',
			width: 150,
			render: (val, rec) => rec?.quyetDinh?.soQuyetDinh ?? val,
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
			title: 'Quyết định QLH',
			dataIndex: 'idDonQuayLaiHoc',
			align: 'center',
			width: 120,
			render: (val, rec) => rec.donQuayLaiHoc?.quyetDinh?.soQuyetDinh,
			hide: isThoiHoc,
		},
		{
			title: 'Khóa',
			dataIndex: 'maKhoaSinhVien',
			width: 100,
			render: (val, rec) => rec.khoaSinhVien?.ten,
		},
		{
			title: 'Ngành',
			dataIndex: 'maNganh',
			width: 150,
			render: (val, rec) => rec.nganh?.ten,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThaiBaoLuu',
			align: 'center',
			render: (val: ETrangThaiSinhVienBaoLuu) => val && <Tag color={colorTrangThaiSinhVienBaoLuu[val]}>{val}</Tag>,
			width: 120,
		},
		{
			title: 'Ghi chú',
			dataIndex: 'ghiChu',
			width: 150,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
		},
	];

	return (
		<Card title={`Lịch sử ${isThoiHoc ? 'thôi học' : 'bảo lưu'}`}>
			<TableStaticData columns={columns} data={danhSach} hasTotal addStt />
		</Card>
	);
};

export default BaoLuuThoiHocTable;
