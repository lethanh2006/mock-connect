import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import type { DangKyNhuCau } from '@/services/DaoTao/DangKyNhuCau/typing';
import {
	colorTrangThaiHocPhanDangKyNhuCau,
	mapTrangThaiHocPhanDangKyNhuCau,
	type ETrangThaiHocPhanDangKyNhuCau,
} from '@/services/DaoTao/constant';

import { Alert, Tag } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import FormDangKyNhuCau from './Form';

const NhuCauHocPhanPage = () => {
	const { record: recDot } = useModel('daotao.dangkynhucau.dotdangkynhucau');
	const { getModel, page, limit } = useModel('daotao.dangkynhucau.hocphandangkynhucau');

	const getData = () => getModel({});

	const ngoaiThoiGian =
		!recDot?.thoiGianBatDau ||
		!recDot?.thoiGianKetThuc ||
		moment().isBefore(recDot?.thoiGianBatDau, 'd') ||
		moment().isAfter(recDot?.thoiGianKetThuc, 'd');

	const columns: IColumn<DangKyNhuCau.IHocPhanDangKyNhuCau>[] = [
		{
			title: 'Khóa ngành',
			width: 100,
			dataIndex: 'maKhoaNganh',
			render: (val, rec) => rec.khoaNganh?.ten,
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

			<TableBase
				columns={columns}
				getData={getData}
				dependencies={[page, limit]}
				modelName='daotao.dangkynhucau.hocphandangkynhucau'
				title='Nhu Cầu học phần'
				hideCard
				Form={FormDangKyNhuCau}
				buttons={{ create: ngoaiThoiGian ? false : true }}
			/>
		</>
	);
};

export default NhuCauHocPhanPage;
