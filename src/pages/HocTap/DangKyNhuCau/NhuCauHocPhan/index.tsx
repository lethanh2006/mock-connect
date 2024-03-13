import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import type { DangKyNhuCau } from '@/services/DaoTao/DangKyNhuCau/typing';
import {
	colorTrangThaiHocPhanDangKyNhuCau,
	mapTrangThaiHocPhanDangKyNhuCau,
	type ETrangThaiHocPhanDangKyNhuCau,
} from '@/services/DaoTao/constant';

import SelectSongNganh from '@/pages/DaoTao/SongNganh/SelectSongNganh';
import { Alert, Empty, Tag } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';
import FormDangKyNhuCau from './Form';

const NhuCauHocPhanPage = () => {
	const { record: recDot } = useModel('daotao.dangkynhucau.dotdangkynhucau');
	const { getModel, page, limit } = useModel('daotao.dangkynhucau.hocphandangkynhucau');
	const { getAllModel, danhSach } = useModel('daotao.dangkynhucau.dotdangkynhucaukhoanganh');
	const { maKhoaNganh, setMaKhoaNganh } = useModel('sinhvien.sinhvien');

	useEffect(() => {
		getAllModel(undefined, undefined, { dotDangKyNhuCauId: recDot?._id });
	}, []);

	const checkKhoaNganh = danhSach.find((item) => maKhoaNganh?.includes(item?.maKhoaNganh));

	const getData = () => getModel({ maKhoaNganh }, undefined, undefined, undefined, undefined, `me/dot/${recDot?._id}`);

	const ngoaiThoiGian =
		!recDot?.thoiGianBatDau ||
		!recDot?.thoiGianKetThuc ||
		moment().isBefore(recDot?.thoiGianBatDau, 'd') ||
		moment().isAfter(recDot?.thoiGianKetThuc, 'd');

	const columns: IColumn<DangKyNhuCau.IHocPhanDangKyNhuCau>[] = [
		{
			title: 'Khóa ngành',
			width: 100,
			render: (val, rec) => rec.phieuDangKyHocNhuCau?.khoaNganh?.ten,
		},
		{
			title: 'Học phần',
			width: 150,
			dataIndex: 'maHocPhan',
			render: (val, rec) => rec.hocPhan?.ten,
		},
		{
			title: 'Số tín chỉ',
			width: 60,
			align: 'center',
			render: (val, rec) => rec.hocPhan?.soTinChi,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			align: 'center',
			width: 90,
			render: (val, rec) => (
				<Tag color={colorTrangThaiHocPhanDangKyNhuCau[val as ETrangThaiHocPhanDangKyNhuCau]}>
					{mapTrangThaiHocPhanDangKyNhuCau[val as ETrangThaiHocPhanDangKyNhuCau]}
				</Tag>
			),
		},
	];

	return (
		<>
			<div style={{ marginBottom: 12 }}>
				<Alert
					type={ngoaiThoiGian ? 'warning' : 'info'}
					description={
						ngoaiThoiGian ? (
							'Ngoài thời gian đăng ký nhu cầu !'
						) : (
							<>
								Thời gian đăng ký nhu cầu từ <b>{moment(recDot?.thoiGianBatDau).format('DD/MM/YYYY')}</b> đến{' '}
								<b>{moment(recDot?.thoiGianKetThuc).format('DD/MM/YYYY')}</b>
							</>
						)
					}
					showIcon
				/>
			</div>
			<div style={{ marginBottom: 12 }}>
				<SelectSongNganh style={{ width: 250 }} value={maKhoaNganh} onChange={(val) => setMaKhoaNganh(val)} />
			</div>

			{checkKhoaNganh?._id ? (
				<TableBase
					columns={columns}
					getData={getData}
					formProps={{ getData }}
					dependencies={[page, limit, maKhoaNganh]}
					modelName='daotao.dangkynhucau.hocphandangkynhucau'
					title='Nhu Cầu học phần'
					hideCard
					Form={FormDangKyNhuCau}
					buttons={{ create: ngoaiThoiGian ? false : true }}
				/>
			) : (
				<Empty description='Khóa ngành không có trong đợt đăng ký!' style={{ marginTop: 32, marginBottom: 32 }} />
			)}
		</>
	);
};

export default NhuCauHocPhanPage;
