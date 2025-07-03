import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import {
	colorXepLoaiRenLuyen,
	ETrangThaiChamDiem,
	EXepLoaiRenLuyen,
	MapKeyColorTrangThaiChamDiem,
	MapKeyNameTrangThaiChamDiem,
	xepLoaiRenLuyen,
} from '@/services/CongTacSinhVien/DiemRenLuyenV2/PhieuDiemRenLuyen/constants';
import { useModel } from '@@/plugin-model/useModel';
import { Tag } from 'antd';
import monent from 'moment';
import { useEffect } from 'react';

const PhieuDiemRenLuyen = () => {
	const { condition, getModel } = useModel('diemrenluyenv2.phieudiemrenluyen');
	const { danhSach, getAllModel } = useModel('daotao.hocky');

	const getData = () => {
		getModel(undefined, undefined, undefined, undefined, undefined, 'page/me');
	};

	useEffect(() => {
		getAllModel();
	}, []);

	const columns: IColumn<PhieuDiemRenLuyenV2.IRecord>[] = [
		{
			title: 'Học kỳ',
			dataIndex: ['dotDrl', 'maHocKy'],
			filterType: 'string',
			width: 170,
			render: (val) => danhSach?.find((item) => item?.ma === val)?.ten,
		},
		{
			title: 'Thời gian phản hồi',
			dataIndex: ['dotDrl', 'thoiGianBatDau'],
			filterType: 'string',
			width: 170,
			render: (val, rec) =>
				rec?.dotDrl?.thoiGianKetThuc && val
					? `${monent(val).format('DD/MM/YYYY')} - ${monent(rec?.dotDrl?.thoiGianKetThuc).format('DD/MM/YYYY')}`
					: '--',
		},
		{
			title: 'Họ và tên',
			dataIndex: ['thongTinNguoiTao', 'ten'],
			width: 150,
			filterType: 'string',
		},
		{
			title: 'Mã sinh viên',
			dataIndex: ['thongTinNguoiTao', 'ma'],
			width: 120,
			filterType: 'string',
		},
		{
			title: 'Lớp',
			dataIndex: 'maLopHanhChinh',
			width: 100,
			filterType: 'string',
			align: 'center',
		},
		{
			title: 'Ngành',
			dataIndex: 'nganh',
			width: 150,
			filterType: 'string',
			align: 'center',
			render: (val) => val?.ten,
		},
		{
			title: 'Trạng thái',
			align: 'center',
			dataIndex: 'trangThai',
			filterType: 'select',
			filterData: Object.values(ETrangThaiChamDiem).map((item) => ({
				value: item,
				label: MapKeyNameTrangThaiChamDiem[item],
			})),
			width: 150,
			render: (val, rec) => (
				<Tag color={MapKeyColorTrangThaiChamDiem?.[val as ETrangThaiChamDiem]}>
					{MapKeyNameTrangThaiChamDiem?.[val as ETrangThaiChamDiem]}
				</Tag>
			),
		},
		{
			title: 'Điểm',
			dataIndex: 'diemSo',
			align: 'center',
			sortable: true,
			width: 80,
		},
		{
			title: 'Xếp loại',
			dataIndex: 'xepLoai',
			align: 'center',
			width: 100,
			filterType: 'select',
			filterData: Object.values(EXepLoaiRenLuyen).map((item) => ({
				value: item,
				label: xepLoaiRenLuyen[item],
			})),
			render: (val, rec) => (
				<Tag color={colorXepLoaiRenLuyen?.[val as EXepLoaiRenLuyen]}>{xepLoaiRenLuyen?.[val as EXepLoaiRenLuyen]}</Tag>
			),
		},
		// {
		// 	title: 'Thao tác',
		// 	align: 'center',
		// 	width: 90,
		// 	fixed: 'right',
		// 	render: (_, rec) => (
		// 		<>
		// 			<Tooltip title='Xem chi tiết'>
		// 				<Button onClick={() => {}} type='link' icon={<EyeOutlined />} />
		// 			</Tooltip>
		// 		</>
		// 	),
		// },
	];

	return (
		<>
			<TableBase
				getData={getData}
				buttons={{ create: false }}
				title={'Phiếu điểm rèn luyện'}
				modelName={'diemrenluyenv2.phieudiemrenluyen'}
				columns={columns}
			/>
		</>
	);
};
export default PhieuDiemRenLuyen;
