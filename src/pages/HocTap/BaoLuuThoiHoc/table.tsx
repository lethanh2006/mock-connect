import ExpandText from '@/components/ExpandText';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import type { QuyetDinh } from '@/services/HocTap/QuyetDinh/typing';
import {
	colorTrangThaiSinhVienBLTH,
	colorTrangThaiSinhVienBaoLuu,
	type ETrangThaiSinhVienBLTH,
	type ETrangThaiSinhVienBaoLuu,
} from '@/services/HocTap/constant';
import { Tag } from 'antd';
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
			title: 'Số quyết định',
			dataIndex: 'quyetDinhId',
			width: 150,
			render: (val, rec) => rec.quyetDinh?.soQuyetDinh ?? rec.soQuyetDinh,
		},
		{
			title: 'Ngày ban hành',
			align: 'center',
			dataIndex: 'quyetDinhId',
			width: 120,
			render: (val, rec) => rec.quyetDinh?.ngayBanHanh && moment(rec.quyetDinh?.ngayBanHanh).format('DD/MM/YYYY'),
		},
		{
			title: 'Kỳ học',
			dataIndex: 'maHocKy',
			width: 150,
			render: (val, rec) => rec?.hocKy?.ten ?? val,
		},
		{
			title: 'Số kỳ BL',
			dataIndex: 'soKyBaoLuu',
			width: 100,
			align: 'center',
			hide: isThoiHoc,
		},
		{
			title: 'Trạng thái BL',
			dataIndex: 'trangThaiBaoLuu',
			width: 120,
			align: 'center',
			hide: isThoiHoc,
			render: (val: ETrangThaiSinhVienBaoLuu) => val && <Tag color={colorTrangThaiSinhVienBaoLuu[val]}>{val}</Tag>,
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
			title: 'Ghi chú',
			dataIndex: 'ghiChu',
			width: 180,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
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
			render: (val) => <Tag color={colorTrangThaiSinhVienBLTH[val as ETrangThaiSinhVienBLTH]}>{val}</Tag>,
			width: 120,
		},
		{
			title: 'Ghi chú',
			dataIndex: 'ghiChu',
			width: 150,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
		},
	];

	return <TableStaticData columns={columns} data={danhSach} hasTotal addStt />;
};

export default BaoLuuThoiHocTable;
