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
import dayjs from '@/utils/dayjs';
import { Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

const XetHocVuPage = () => {
	const intl = useIntl();
	const { getAllModel, loading } = useModel('daotao.xulykqht');
	const [danhSach, setDanhSach] = useState<XetHocVu.IRecord[]>([]);

	const getData = () =>
		getAllModel(undefined, undefined, { daChot: true }, undefined, 'me', false).then((res) => setDanhSach(res));

	useEffect(() => {
		getData();
	}, []);

	const columns: IColumn<XetHocVu.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'hoctapkhac.xethocvu.hocky.tablecolumntitle' }),
			dataIndex: 'maHocKy',
			width: 140,
			render: (val, rec) => rec.hocKy?.ten ?? val,
		},
		// {
		// 	title: intl.formatMessage({ id: 'hoctapkhac.xethocvu.masv.tablecolumntitle' }),
		// 	dataIndex: 'maSinhVien',
		// 	width: 120,
		// 	align: 'center',
		// },
		// {
		// 	title: intl.formatMessage({ id: 'hoctapkhac.xethocvu.hoten.tablecolumntitle' }),
		// 	dataIndex: 'hoTen',
		// 	width: 180,
		// },
		{
			title: intl.formatMessage({ id: 'hoctapkhac.xethocvu.khoanganh.tablecolumntitle' }),
			dataIndex: 'maKhoaNganh',
			width: 140,
			render: (val, rec) => rec?.khoaNganh?.ten,
		},
		{
			title: intl.formatMessage({ id: 'hoctapkhac.xethocvu.lophanhchinh.tablecolumntitle' }),
			dataIndex: 'tenLopHanhChinh',
			width: 120,
		},
		{
			title: intl.formatMessage({ id: 'hoctapkhac.xethocvu.loaixuly.tablecolumntitle' }),
			dataIndex: 'loaiXuLy',
			align: 'center',
			width: 120,
			render: (val: ELoaiXuLyKQHT) => val && <Tag color={colorLoaiXuLyKQHT[val]}>{loaiXuLyKQHT[val]}</Tag>,
		},
		{
			title: intl.formatMessage({ id: 'hoctapkhac.xethocvu.lydo.tablecolumntitle' }),
			dataIndex: 'lyDo',
			width: 280,
			render: (val) => val && <ExpandText>{val}</ExpandText>,
		},
		{
			title: intl.formatMessage({ id: 'hoctapkhac.xethocvu.trangThai.tablecolumntitle' }),
			dataIndex: 'trangThai',
			align: 'center',
			render: (val: ETrangThaiDuyetXuLyKqht) => <Tag color={colorTrangThaiDuyetXuLyKqht[val]}>{val}</Tag>,
			width: 120,
		},
		{
			title: intl.formatMessage({ id: 'hoctapkhac.xethocvu.quyetdinh.tablecolumntitle' }),
			dataIndex: 'quyetDinhId',
			align: 'center',
			width: 120,
			render: (val, rec) =>
				val && (
					<>
						{rec.quyetDinh?.soQuyetDinh}, {dayjs(rec?.quyetDinh?.ngayBanHanh).format('DD/MM/YYYY')}
					</>
				),
		},
	];

	return <TableStaticData columns={columns} data={danhSach} hasTotal addStt loading={loading} />;
};

export default XetHocVuPage;
