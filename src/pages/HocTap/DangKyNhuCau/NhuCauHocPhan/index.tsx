import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import type { DangKyNhuCau } from '@/services/DaoTao/DangKyNhuCau/typing';
import {
	colorTrangThaiHocPhanDangKyNhuCau,
	mapTrangThaiHocPhanDangKyNhuCau,
	type ETrangThaiHocPhanDangKyNhuCau,
} from '@/services/DaoTao/constant';
import { Alert, Empty, Tag } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';
import FormDangKyNhuCau from './Form';

const NhuCauHocPhanPage = () => {
	const { record: recDot } = useModel('daotao.dangkynhucau.dotdangky');
	const { getModel, page, limit } = useModel('daotao.dangkynhucau.hocphannhucau');
	const { getAllModel, danhSach } = useModel('daotao.dangkynhucau.khoanganhdot');
	const { maKhoaNganh } = useModel('sinhvien.sinhvien');

	useEffect(() => {
		getAllModel(undefined, undefined, { dotDangKyNhuCauId: recDot?._id });
	}, []);

	const checkKhoaNganh = danhSach.find((item) => maKhoaNganh === item?.maKhoaNganh);

	const getData = () =>
		recDot?._id && getModel({ maKhoaNganh }, undefined, undefined, undefined, undefined, `me/dot/${recDot?._id}`);

	const ngoaiThoiGian =
		!recDot?.thoiGianBatDau ||
		!recDot?.thoiGianKetThuc ||
		moment().isBefore(recDot?.thoiGianBatDau, 'd') ||
		moment().isAfter(recDot?.thoiGianKetThuc, 'd');

	const columns: IColumn<DangKyNhuCau.IHocPhanDangKyNhuCau>[] = [
		{
			title: 'Mã HP',
			width: 80,
			dataIndex: 'maHocPhan',
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
			render: (val) => (
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
					message={
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

			{checkKhoaNganh?._id ? (
				<TableBase
					columns={columns}
					getData={getData}
					formProps={{ getData }}
					dependencies={[page, limit, maKhoaNganh]}
					modelName='daotao.dangkynhucau.hocphannhucau'
					title='Nhu cầu học phần'
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
