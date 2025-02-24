import ExpandText from '@/components/ExpandText';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import type { XetHocVu } from '@/services/HocTap/XetHocVu/typing';
import {
	colorLoaiXuLyKQHT,
	colorTrangThaiDuyetXuLyKqht,
	loaiXuLyKQHT,
	type ELoaiXuLyKQHT,
	type ETrangThaiDuyetXuLyKqht,
} from '@/services/HocTap/constant';
import { Tag } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const XetHocVuPage = () => {
	const { getAllModel, loading } = useModel('daotao.xulykqht');
	const [danhSach, setDanhSach] = useState<XetHocVu.IRecord[]>([]);

	const getData = () =>
		getAllModel(undefined, undefined, { daChot: true }, undefined, 'me', false).then((res) => setDanhSach(res));

	useEffect(() => {
		getData();
	}, []);

	const columns: IColumn<XetHocVu.IRecord>[] = [
		{
			title: 'Học kỳ',
			dataIndex: 'maHocKy',
			width: 140,
			render: (val, rec) => rec.hocKy?.ten ?? val,
		},
		// {
		// 	title: 'Mã SV',
		// 	dataIndex: 'maSinhVien',
		// 	width: 120,
		// 	align: 'center',
		// },
		// {
		// 	title: 'Họ tên',
		// 	dataIndex: 'hoTen',
		// 	width: 180,
		// },
		{
			title: 'Khóa ngành',
			dataIndex: 'maKhoaNganh',
			width: 140,
			render: (val, rec) => rec?.khoaNganh?.ten,
		},
		{
			title: 'Lớp hành chính',
			dataIndex: 'tenLopHanhChinh',
			width: 120,
		},
		{
			title: 'Loại xử lý',
			dataIndex: 'loaiXuLy',
			align: 'center',
			width: 120,
			render: (val: ELoaiXuLyKQHT) => val && <Tag color={colorLoaiXuLyKQHT[val]}>{loaiXuLyKQHT[val]}</Tag>,
		},
		{
			title: 'Lý do',
			dataIndex: 'lyDo',
			width: 280,
			render: (val) => val && <ExpandText>{val}</ExpandText>,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			align: 'center',
			render: (val: ETrangThaiDuyetXuLyKqht) => <Tag color={colorTrangThaiDuyetXuLyKqht[val]}>{val}</Tag>,
			width: 120,
		},
		{
			title: 'Quyết định',
			dataIndex: 'quyetDinhId',
			align: 'center',
			width: 120,
			render: (val, rec) =>
				val && (
					<>
						{rec.quyetDinh?.soQuyetDinh}, {moment(rec?.quyetDinh?.ngayBanHanh).format('DD/MM/YYYY')}
					</>
				),
		},
	];

	return <TableStaticData columns={columns} data={danhSach} hasTotal addStt loading={loading} />;
};

export default XetHocVuPage;
