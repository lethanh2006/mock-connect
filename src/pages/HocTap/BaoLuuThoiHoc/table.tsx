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
import { formatDate } from '@/utils/formatDate';
import { Tag } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const BaoLuuThoiHocTable = (props: { isThoiHoc?: boolean }) => {
	const intl = useIntl();
	const { isThoiHoc } = props;
	const { getAllModel, danhSach, setDanhSach } = useModel(isThoiHoc ? 'quyetdinh.thoihoc' : 'quyetdinh.baoluu');

	const getData = () =>
		getAllModel(undefined, undefined, undefined, undefined, 'me', false).then((res) => setDanhSach(res));

	useEffect(() => {
		getData();
	}, []);

	const columns: IColumn<QuyetDinh.ISinhVienBaoLuuThoiHoc>[] = [
		{
			title: intl.formatMessage({ id: 'hoctapkhac.baoluuthoihoc.soquyetdinh.tablecolumntitle' }),
			dataIndex: 'quyetDinhId',
			width: 150,
			render: (val, rec) => rec.quyetDinh?.soQuyetDinh ?? rec.soQuyetDinh,
		},
		{
			title: intl.formatMessage({ id: 'hoctapkhac.baoluuthoihoc.ngaybanhanh.tablecolumntitle' }),
			align: 'center',
			dataIndex: 'quyetDinhId',
			width: 120,
			render: (val, rec) => rec.quyetDinh?.ngayBanHanh && formatDate(rec.quyetDinh?.ngayBanHanh),
		},
		{
			title: intl.formatMessage({ id: 'hoctapkhac.baoluuthoihoc.kyhoc.tablecolumntitle' }),
			dataIndex: 'maHocKy',
			width: 150,
			render: (val, rec) => rec?.hocKy?.ten ?? val,
		},
		{
			title: intl.formatMessage({ id: 'hoctapkhac.baoluuthoihoc.sokybaoluu.tablecolumntitle' }),
			dataIndex: 'soKyBaoLuu',
			width: 100,
			align: 'center',
			hide: isThoiHoc,
		},
		{
			title: intl.formatMessage({ id: 'hoctapkhac.baoluuthoihoc.trangthaibaoluu.tablecolumntitle' }),
			dataIndex: 'trangThaiBaoLuu',
			width: 120,
			align: 'center',
			hide: isThoiHoc,
			render: (val: ETrangThaiSinhVienBaoLuu) => val && <Tag color={colorTrangThaiSinhVienBaoLuu[val]}>{val}</Tag>,
		},
		{
			title: intl.formatMessage({ id: 'hoctapkhac.baoluuthoihoc.quyetdinhquaylaihoc.tablecolumntitle' }),
			dataIndex: 'idDonQuayLaiHoc',
			align: 'center',
			width: 120,
			render: (val, rec) => rec.donQuayLaiHoc?.quyetDinh?.soQuyetDinh,
			hide: isThoiHoc,
		},
		{
			title: intl.formatMessage({ id: 'hoctapkhac.baoluuthoihoc.ghichu.tablecolumntitle' }),
			dataIndex: 'ghiChu',
			width: 180,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: intl.formatMessage({ id: 'hoctapkhac.baoluuthoihoc.khoasinhvien.tablecolumntitle' }),
			dataIndex: 'maKhoaSinhVien',
			width: 100,
			render: (val, rec) => rec.khoaSinhVien?.ten,
		},
		{
			title: intl.formatMessage({ id: 'hoctapkhac.baoluuthoihoc.nganh.tablecolumntitle' }),
			dataIndex: 'maNganh',
			width: 150,
			render: (val, rec) => rec.nganh?.ten,
		},
		{
			title: intl.formatMessage({ id: 'hoctapkhac.baoluuthoihoc.trangthai.tablecolumntitle' }),
			dataIndex: 'trangThaiBaoLuu',
			align: 'center',
			render: (val) => <Tag color={colorTrangThaiSinhVienBLTH[val as ETrangThaiSinhVienBLTH]}>{val}</Tag>,
			width: 120,
		},
		{
			title: intl.formatMessage({ id: 'hoctapkhac.baoluuthoihoc.ghichu.tablecolumntitle' }),
			dataIndex: 'ghiChu',
			width: 150,
			render: (val, rec) => <ExpandText>{val}</ExpandText>,
		},
	];

	return <TableStaticData columns={columns} data={danhSach} hasTotal addStt />;
};

export default BaoLuuThoiHocTable;
