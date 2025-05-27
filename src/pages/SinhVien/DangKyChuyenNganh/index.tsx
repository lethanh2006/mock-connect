import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import {
	colorTrangThaiDangKyChuyenNganh,
	ETrangThaiDangKyChuyenNganh,
	trangThaiDangKyChuyenNganh,
} from '@/services/DaoTao/DangKyChuyenNganh/constant';
import type { DangKyChuyenNganh } from '@/services/DaoTao/DangKyChuyenNganh/typing';
import { EditOutlined } from '@ant-design/icons';
import { Alert, Button, Tag, Tooltip } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';
import Form from './Form';

const DangKyChuyenNganhPage = () => {
	const { getModel, page, limit, handleEdit, dotHienHanh, getDotHienHanhModel, danhSach } = useModel(
		'sinhvien.dangkychuyennganh.sinhvien',
	);
	const hasCreate =
		!!dotHienHanh?._id &&
		!danhSach.filter(
			(i) =>
				i.dotDangKyChuyenNganhId === dotHienHanh._id && i.trangThaiDangKy !== ETrangThaiDangKyChuyenNganh.KHONG_DUYET,
		)?.length;

	const getData = () => getModel(undefined, undefined, undefined, undefined, undefined, 'my/page');

	useEffect(() => {
		if (!dotHienHanh) getDotHienHanhModel();
	}, []);

	const columns: IColumn<DangKyChuyenNganh.ISinhVienDangKy>[] = [
		{
			title: 'Đợt đăng ký',
			width: 200,
			render: (val, rec) => rec.dotDangKyChuyenNganh?.ten,
		},
		{
			title: 'Chuyên ngành',
			dataIndex: 'maChuyenNganh',
			width: 160,
			render: (val, rec) => rec.chuyenNganh?.ten ?? val,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThaiDangKy',
			align: 'center',
			width: 150,
			render: (val: ETrangThaiDangKyChuyenNganh) => (
				<Tag color={colorTrangThaiDangKyChuyenNganh[val]}>{trangThaiDangKyChuyenNganh[val]}</Tag>
			),
		},
		{
			title: 'Ghi chú',
			dataIndex: 'ghiChu',
			filterType: 'string',
			width: 180,
			render: (val) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: 'Đăng ký',
			width: 120,
			align: 'center',
			dataIndex: 'createdAt',
			render: (val) => val && moment(val).format('HH:mm DD/MM/YYYY'),
		},
		{
			title: 'Cập nhật',
			width: 120,
			align: 'center',
			dataIndex: 'updatedAt',
			render: (val) => val && moment(val).format('HH:mm DD/MM/YYYY'),
		},
		// {
		// 	title: 'Khóa ngành sinh viên',
		// 	width: 200,
		// 	render: (val, rec) => rec.sinhVien?.khoaNganh?.ten,
		// 	onCell,
		// },
		{
			title: 'Thao tác',
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button
							disabled={
								rec.trangThaiDangKy === ETrangThaiDangKyChuyenNganh.DA_DUYET ||
								rec.trangThaiDangKy === ETrangThaiDangKyChuyenNganh.KHONG_DUYET
							}
							onClick={() => handleEdit(rec)}
							type='link'
							icon={<EditOutlined />}
						/>
					</Tooltip>
				</>
			),
			hide: !dotHienHanh?._id,
		},
	];

	return (
		<>
			<div style={{ marginBottom: 12 }}>
				{dotHienHanh?._id ? (
					<Alert
						showIcon
						message={
							<>
								Đợt đăng ký chuyên ngành &quot;<b>{dotHienHanh.ten}</b>&quot; đang diễn ra từ{' '}
								<b>
									{moment(dotHienHanh.thoiGianBatDau).format('HH:mm:ss DD/MM')} -{' '}
									{moment(dotHienHanh.thoiGianKetThuc).format('HH:mm:ss DD/MM')}
								</b>
								. Vui lòng đăng ký đúng thời hạn
							</>
						}
						type='success'
					/>
				) : (
					<Alert
						showIcon
						message='Hiện không có đợt đăng ký chuyên ngành phù hợp, vui lòng thử lại sau'
						type='warning'
					/>
				)}
			</div>

			<TableBase
				columns={columns}
				dependencies={[page, limit]}
				getData={getData}
				modelName='sinhvien.dangkychuyennganh.sinhvien'
				Form={Form}
				formProps={{ getData }}
				hideCard
				buttons={{ create: hasCreate }}
			/>
		</>
	);
};

export default DangKyChuyenNganhPage;
