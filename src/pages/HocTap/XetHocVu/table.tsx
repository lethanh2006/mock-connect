import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import type { XetHocVu } from '@/services/HocTap/XetHocVu/typing';
import { ETrangThaiDuyetCanhBao, colorTrangThaiDuyetCanhBao } from '@/services/HocTap/constant';
import { Tag, Card } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const SinhVienCanhBaoTable = (props: { isThoiHoc?: boolean }) => {
	const { isThoiHoc } = props;
	const { getAllModel } = useModel(isThoiHoc ? 'xethocvu.thoihoc' : 'xethocvu.canhbao');
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
			width: 150,
			render: (val, rec) => rec.hocKy?.ten,
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
			title: 'Lớp hành chính',
			dataIndex: 'tenLopHanhChinh',
			width: 120,
		},
		{
			title: 'Lý do',
			dataIndex: 'danhSachLyDo',
			width: 350,
			render: (val, rec) => rec.danhSachLyDo?.map((item) => <div key={item._id}>- {item?.noiDung}</div>),
		},
		{
			title: 'Loại',
			dataIndex: 'loaiThoiHoc',
			width: 120,
			hide: !isThoiHoc,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			align: 'center',
			filterType: 'select',
			filterData: Object.values(ETrangThaiDuyetCanhBao),
			render: (val, rec) => <Tag color={colorTrangThaiDuyetCanhBao[val as ETrangThaiDuyetCanhBao]}>{val}</Tag>,
			width: 120,
		},
	];

	return (
		<Card title={`Lịch sử ${isThoiHoc ? 'buộc thôi học' : 'cảnh báo học tập'}`}>
			<TableStaticData columns={columns} data={danhSach} otherProps={{ create: false, filter: true }} hasTotal addStt />
		</Card>
	);
};

export default SinhVienCanhBaoTable;
