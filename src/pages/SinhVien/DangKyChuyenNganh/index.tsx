import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import {
	colorTrangThaiDangKyChuyenNganh,
	ETrangThaiDangKyChuyenNganh,
	trangThaiDangKyChuyenNganh,
} from '@/services/DaoTao/DangKyChuyenNganh/constant';
import type { DangKyChuyenNganh } from '@/services/DaoTao/DangKyChuyenNganh/typing';
import { formatDateTime } from '@/utils/formatDate';
import { IconPencil01 } from '@/components/Icons';
import { Alert, Button, Tag, Tooltip } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import Form from './Form';

const DangKyChuyenNganhPage = () => {
	const intl = useIntl();
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
			title: intl.formatMessage({ id: 'hoctapkhac.dangkychuyennganh.dotangky.tablecolumntitle' }),
			width: 200,
			render: (val, rec) => rec.dotDangKyChuyenNganh?.ten,
		},
		{
			title: intl.formatMessage({ id: 'hoctapkhac.dangkychuyennganh.chuyennganh.tablecolumntitle' }),
			dataIndex: 'maChuyenNganh',
			width: 160,
			render: (val, rec) => rec.chuyenNganh?.ten ?? val,
		},
		{
			title: intl.formatMessage({ id: 'hoctapkhac.dangkychuyennganh.trangthai.tablecolumntitle' }),
			dataIndex: 'trangThaiDangKy',
			align: 'center',
			width: 150,
			render: (val: ETrangThaiDangKyChuyenNganh) => (
				<Tag color={colorTrangThaiDangKyChuyenNganh[val]}>{trangThaiDangKyChuyenNganh[val]}</Tag>
			),
		},
		{
			title: intl.formatMessage({ id: 'hoctapkhac.dangkychuyennganh.ghichu.tablecolumntitle' }),
			dataIndex: 'ghiChu',
			filterType: 'string',
			width: 180,
			render: (val) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: intl.formatMessage({ id: 'hoctapkhac.dangkychuyennganh.dangky.tablecolumntitle' }),
			width: 120,
			align: 'center',
			dataIndex: 'createdAt',
			render: (val) => val && formatDateTime(val),
		},
		{
			title: intl.formatMessage({ id: 'hoctapkhac.dangkychuyennganh.capnhat.tablecolumntitle' }),
			width: 120,
			align: 'center',
			dataIndex: 'updatedAt',
			render: (val) => val && formatDateTime(val),
		},
		// {
		// 	title: intl.formatMessage({ id: 'hoctapkhac.dangkychuyennganh.khoanganhsinhvien.tablecolumntitle' }),
		// 	width: 200,
		// 	render: (val, rec) => rec.sinhVien?.khoaNganh?.ten,
		// 	onCell,
		// },
		{
			title: intl.formatMessage({ id: 'hoctapkhac.dangkychuyennganh.thaotac.tablecolumntitle' }),
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<Tooltip title={intl.formatMessage({ id: 'hoctapkhac.dangkychuyennganh.thaotac.chinhsua.tooltiptitle' })}>
						<Button
							disabled={
								rec.trangThaiDangKy === ETrangThaiDangKyChuyenNganh.DA_DUYET ||
								rec.trangThaiDangKy === ETrangThaiDangKyChuyenNganh.KHONG_DUYET
							}
							onClick={() => handleEdit(rec)}
							type='link'
							icon={<IconPencil01 />}
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
								{intl.formatMessage({ id: 'hoctapkhac.dangkychuyennganh.alert.success.beginningofsentence' })} &quot;
								<b>{dotHienHanh.ten}</b>&quot;{' '}
								{intl.formatMessage({ id: 'hoctapkhac.dangkychuyennganh.alert.success.endofsentence' })}{' '}
								<b>
									{formatDateTime(dotHienHanh.thoiGianBatDau)} -{' '}
									{formatDateTime(dotHienHanh.thoiGianKetThuc)}
								</b>
								. {intl.formatMessage({ id: 'hoctapkhac.dangkychuyennganh.alert.success.conclusionofsentence' })}
							</>
						}
						type='success'
					/>
				) : (
					<Alert
						showIcon
						message={intl.formatMessage({ id: 'hoctapkhac.dangkychuyennganh.alert.warning' })}
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
