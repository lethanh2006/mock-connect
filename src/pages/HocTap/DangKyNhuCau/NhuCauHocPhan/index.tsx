import ButtonExtend from '@/components/Table/ButtonExtend';
import ModalExpandable from '@/components/Table/ModalExpandable';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import type { DangKyNhuCau } from '@/services/DaoTao/DangKyNhuCau/typing';
import {
	colorTrangThaiHocPhanDangKyNhuCau,
	mapTrangThaiHocPhanDangKyNhuCau,
	type ETrangThaiHocPhanDangKyNhuCau,
} from '@/services/DaoTao/constant';
import { DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Alert, Popconfirm, Tag } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';
import FormDangKyNhuCau from './Form';

const NhuCauHocPhanPage = () =>
	// props: { khoaNganhTrongDot: boolean }
	{
		const { record: recDot } = useModel('daotao.dangkynhucau.dotdangky');
		const {
			getModel,
			// page,
			// limit,
			deleteModel,
			danhSach,
			loading,
			setRecord,
			setEdit,
			setIsView,
			setVisibleForm,
			visibleForm,
		} = useModel('daotao.dangkynhucau.hocphannhucau');
		// const { maKhoaNganh } = useModel('sinhvien.sinhvien');
		// const { khoaNganhTrongDot } = props;

		const getData = () =>
			// { maKhoaNganh }
			recDot?._id && getModel(undefined, undefined, undefined, undefined, 100, `me/dot/${recDot?._id}`);

		const ngoaiThoiGian =
			!recDot?.thoiGianBatDau ||
			!recDot?.thoiGianKetThuc ||
			moment().isBefore(recDot?.thoiGianBatDau, 'd') ||
			moment().isAfter(recDot?.thoiGianKetThuc, 'd');

		useEffect(() => {
			getData();
		}, [
			// maKhoaNganh,
			recDot?._id,
		]);

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
				title: 'Khóa ngành',
				width: 120,
				render: (val, rec) => rec.phieuDangKyHocNhuCau?.khoaNganh?.ten,
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
			{
				title: 'Thao tác',
				align: 'center',
				width: 60,
				render: (val, rec) => (
					<Popconfirm
						onConfirm={() => deleteModel(`${rec?._id}/me`, getData)}
						title='Bạn có chắc chắn muốn xóa học phần này?'
						placement='topLeft'
					>
						<ButtonExtend tooltip='Xóa' danger type='link' icon={<DeleteOutlined />} />
					</Popconfirm>
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

				<TableStaticData
					columns={columns}
					data={danhSach ?? []}
					loading={loading}
					addStt
					otherProps={{ pagination: true }}
					hasTotal
					onReload={getData}
				>
					<ButtonExtend
						type='primary'
						disabled={ngoaiThoiGian}
						onClick={() => {
							setRecord({} as DangKyNhuCau.IHocPhanDangKyNhuCau);
							setEdit(false);
							setIsView(false);
							setVisibleForm(true);
						}}
						icon={<PlusCircleOutlined />}
					>
						Thêm mới
					</ButtonExtend>
				</TableStaticData>

				<ModalExpandable
					onCancel={() => setVisibleForm(false)}
					footer={false}
					bodyStyle={{ padding: 0 }}
					visible={visibleForm}
					width={800}
				>
					<FormDangKyNhuCau getData={getData} title='Nhu cầu học phần' />
				</ModalExpandable>

				{/* <TableBase
					columns={columns}
					getData={getData}
					formProps={{ getData }}
					dependencies={[page, limit, maKhoaNganh, recDot?._id]}
					modelName='daotao.dangkynhucau.hocphannhucau'
					title='Nhu cầu học phần'
					hideCard
					Form={FormDangKyNhuCau}
					buttons={{
						create: !ngoaiThoiGian,
						// && khoaNganhTrongDot
					}}
					// otherButtons={
					// 	!khoaNganhTrongDot
					// 		? [
					// 				<i color='red' key='1'>
					// 					Bạn không được phép đăng ký nhu cầu mới
					// 				</i>,
					// 		  ]
					// 		: undefined
					// }
				/> */}
			</>
		);
	};

export default NhuCauHocPhanPage;
