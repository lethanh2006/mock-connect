import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';

import SelectNamHoc from '@/pages/DaoTao/NamHoc/Select';
import TableThanhVien from '@/pages/KhoaHoc/SanPhamHoatDongNCKH/components/TableThanhVien';
import ViewRender from '@/pages/KhoaHoc/SanPhamHoatDongNCKH/components/ViewRender';
import SelectDonVi from '@/pages/ToChucNhanSu/DonVi/Select';
import { primaryColor } from '@/services/base/constant';
import { EKieuDuLieu } from '@/services/KhoaHoc/LoaiHinhNCKH/constants';
import {
	ELoaiDuLieuQuyDoiGio,
	ELoaiKhaiBao,
	ETrangThaiSanPham,
	ETrangThaiYeuCauQuyDoiGio,
	MapKeyColorTrangThaiSanPham,
	MapKeyColorTrangThaiYeuCauQuyDoiGio,
	MapKeyLoaiDuLieuQuyDoiDiem,
	MapKeyLoaiDuLieuQuyDoiGio,
	MapKeyTextTrangThaiSanPham,
	MapKeyTextTrangThaiYeuCauQuyDoiGio,
} from '@/services/KhoaHoc/SanPhamNCKH/constants';
import type { SanPhamNCKH } from '@/services/KhoaHoc/SanPhamNCKH/typings';
import { CheckOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Divider, Modal, Popconfirm, Select, Tabs, Tag, Tooltip } from 'antd';
import { useCallback, useState } from 'react';
import { useModel } from 'umi';
import { buildFilter } from '../../components/BuildFilter';
import TableQuyDoiGio from '../../components/TableQuyDoiGio';
import ViewSanPham from '../../components/ViewSanPham';

const TableSanPhamNCKHStatic = (props: {
	paramCondition?: any;
	role: 'admin' | 'cbgv';
	mode: 'sanpham' | 'quydoigio' | 'quydoidiem';
	hideFilterNamHoc?: boolean;
	hideFilterDonVi?: boolean;
	hideFilterLoaiKhaiBao?: boolean;
	hasCreate?: boolean;
	select?: boolean;
	handleSelect?: (data: any) => void;
	dataInitSelect?: any[];
}) => {
	const {
		getModelSelect,
		page,
		limit,
		condition,
		filters,
		deleteModel,
		handleEdit,
		setRecord: setRecordSanPham,
		visibleViewSanPham,
		setVisibleViewSanPham,
		visibleViewQuyDoiGio,
		setVisibleViewQuyDoiGio,
		setCondition,
	} = useModel('khoahoc.sanphamnckh');

	const { initialState } = useModel('@@initialState');
	const [loaiKhaiBao, setLoaiKhaiBao] = useState<ELoaiKhaiBao | undefined>();
	const [visibleViewThanhVien, setVisibleViewThanhVien] = useState<boolean>(false);
	const { recordStatic: recordLoaiHinhNCKH } = useModel('khoahoc.loaihinhnckh');
	const { record: recordNamHoc } = useModel('khoahoc.danhmuc.namhoc');
	const [mode, setMode] = useState<'GIO' | 'DIEM'>(props.mode === 'quydoidiem' ? 'DIEM' : 'GIO');
	const [loaiDuLieuQuyDoiGio, setLoaiDuLieuQuyDoiGio] = useState<ELoaiDuLieuQuyDoiGio>(
		ELoaiDuLieuQuyDoiGio.PHONG_QLKH_DA_DUYET,
	);
	const { danhSach } = useModel('khoahoc.danhmuc.chung');

	const getData = () => {
		let paramCondition = {
			loaiHinhNckhId: recordLoaiHinhNCKH?._id,
			finalStartDate: recordNamHoc?._id ? { $lte: recordNamHoc?.thoiGianKetThuc } : undefined,
			finalEndDate: recordNamHoc?._id ? { $gte: recordNamHoc?.thoiGianBatDau } : undefined,
			...(props?.paramCondition ?? {}),
		};
		if (props.role === 'cbgv') {
			if (loaiKhaiBao === ELoaiKhaiBao.TU_KHAI_BAO) {
				paramCondition = {
					...paramCondition,
					'nguoiKhaiBao.ssoId': initialState?.currentUser?.ssoId,
					'danhSachThanhVien.ssoId': undefined,
				};
			} else if (loaiKhaiBao === ELoaiKhaiBao.DUOC_KHAI_BAO) {
				paramCondition = {
					...paramCondition,
					'nguoiKhaiBao.ssoId': { $ne: initialState?.currentUser?.ssoId },
					'danhSachThanhVien.ssoId': initialState?.currentUser?.ssoId,
				};
			} else paramCondition = { ...paramCondition };
		}
		getModelSelect(paramCondition);
	};

	const onCancelViewThanhVien = useCallback(() => {
		setVisibleViewThanhVien(false);
	}, []);

	const onCancelViewSanPham = useCallback(() => {
		setVisibleViewSanPham(false);
	}, []);
	const onCancelViewQuyDoiGio = useCallback(() => {
		setVisibleViewQuyDoiGio(false);
	}, []);

	const onCell = (record: SanPhamNCKH.IRecord) => ({
		onClick: () => {
			setVisibleViewSanPham(true);
			setRecordSanPham(record);
		},
		style: { cursor: 'pointer' },
	});

	const handleXuLy = (record: SanPhamNCKH.IRecord) => {
		setVisibleViewSanPham(true);
		setRecordSanPham(record);
	};

	const handleQuyDoi = (record: SanPhamNCKH.IRecord, modeTemp: 'GIO' | 'DIEM') => {
		setVisibleViewQuyDoiGio(true);
		setMode(modeTemp);
		setRecordSanPham(record);
	};

	const columns: IColumn<SanPhamNCKH.IRecord>[] = [
		{
			title: 'Người khai báo',
			filterType: 'string',
			dataIndex: 'nguoiKhaiBao.hoVaTen',
			width: 130,
			align: 'center',
			onCell,
			render: (val, rec) => rec.nguoiKhaiBao.hoVaTen,
		},
		{
			title: 'Thành viên',
			width: 100,
			align: 'center',
			render: (rec: SanPhamNCKH.IRecord) => (
				<a
					onClick={() => {
						setRecordSanPham(rec);
						setVisibleViewThanhVien(true);
					}}
				>
					{rec.danhSachThanhVien.length} thành viên
				</a>
			),
		},
	];

	recordLoaiHinhNCKH?.cauHinhLoaiHinh
		?.filter((item) =>
			recordLoaiHinhNCKH?.danhSachCotHienThi?.length ? recordLoaiHinhNCKH.danhSachCotHienThi.includes(item.ma) : item,
		)
		.map((item) => {
			if (item.kieuDuLieu === EKieuDuLieu.TABLE || item.kieuDuLieu === EKieuDuLieu.DANHSACH) return;
			columns.push({
				title: item.ten,
				dataIndex: `thongTinKhaiBao.${item.ma}`,
				width: 200,
				align: 'center',
				onCell,
				render: (val, rec) => <ViewRender cauHinh={item} recordSanPham={rec} />,
				...buildFilter(item, danhSach),
			});
		});

	if (props.mode === 'sanpham') {
		columns.push(
			{
				title: 'Trạng thái',
				dataIndex: 'trangThaiSanPham',
				width: 150,
				align: 'center',
				fixed: 'right',
				filterType: 'select',
				filterData: Object.values(ETrangThaiSanPham).map((item) => ({
					label: MapKeyTextTrangThaiSanPham[item],
					value: item,
				})),
				render: (val: ETrangThaiSanPham, rec: SanPhamNCKH.IRecord) => {
					const recKetQuaQuyDoiGioTheoNam = rec?.danhSachKetQuaQuyDoiGio?.find(
						(item) => item.namHocId === recordNamHoc?._id,
					);
					const daDuyetQuyDoiGio =
						rec.trangThaiSanPham === ETrangThaiSanPham.DUYET &&
						((recordNamHoc?._id && recKetQuaQuyDoiGioTheoNam?.namHocId) ||
							(!recordNamHoc?._id && rec?.danhSachKetQuaQuyDoiGio?.length));
					const recKetQuaQuyDoiDiemTheoNam = rec?.danhSachKetQuaQuyDoiDiem?.find(
						(item) => item.namHocId === recordNamHoc?._id,
					);
					const daDuyetQuyDoiDiem =
						rec.trangThaiSanPham === ETrangThaiSanPham.DUYET &&
						((recordNamHoc?._id && recKetQuaQuyDoiDiemTheoNam?.namHocId) ||
							(!recordNamHoc?._id && rec?.danhSachKetQuaQuyDoiDiem?.length));
					return (
						<>
							<Tag color={MapKeyColorTrangThaiSanPham[val]}>{MapKeyTextTrangThaiSanPham[val]}</Tag>
							{rec.trangThaiSanPham === ETrangThaiSanPham.DUYET && (
								<>
									<Divider style={{ marginTop: 8, marginBottom: 0 }} />
									<div
										onClick={() => {
											handleQuyDoi(rec, 'GIO');
										}}
										style={{
											cursor: 'pointer',
											color: !daDuyetQuyDoiGio ? 'red' : primaryColor,
										}}
									>
										{daDuyetQuyDoiGio ? 'Đã duyệt giờ chuẩn' : 'Chưa duyệt giờ chuẩn'}
									</div>
									<Divider style={{ marginTop: 8, marginBottom: 0 }} />
									<div
										onClick={() => {
											handleQuyDoi(rec, 'DIEM');
										}}
										style={{
											cursor: 'pointer',
											color: !daDuyetQuyDoiDiem ? 'red' : primaryColor,
										}}
									>
										{daDuyetQuyDoiDiem ? 'Đã duyệt điểm công trình' : 'Chưa duyệt điểm công trình'}
									</div>
								</>
							)}
						</>
					);
				},
			},
			{
				title: 'Thao tác',
				align: 'center',
				width: 120,
				fixed: 'right',
				render: (record: SanPhamNCKH.IRecord) => (
					<>
						<Tooltip title='Chỉnh sửa'>
							<Button
								disabled={
									[ETrangThaiSanPham.CHINH_SUA_LAI, ETrangThaiSanPham.CHUA_TIEP_NHAN].includes(
										record.trangThaiSanPham,
									) || props.role === 'admin'
										? false
										: true
								}
								onClick={() => handleEdit(record)}
								type='link'
								icon={<EditOutlined />}
							/>
						</Tooltip>
						<Tooltip title='Xóa'>
							<Popconfirm
								disabled={record.trangThaiSanPham !== ETrangThaiSanPham.CHUA_TIEP_NHAN && props.role === 'cbgv'}
								onConfirm={() => deleteModel(record._id, getData)}
								title='Bạn có chắc chắn muốn xóa?'
								placement='topLeft'
							>
								<Button
									disabled={record.trangThaiSanPham !== ETrangThaiSanPham.CHUA_TIEP_NHAN && props.role === 'cbgv'}
									danger
									type='link'
									icon={<DeleteOutlined />}
								/>
							</Popconfirm>
						</Tooltip>
						{[
							ETrangThaiSanPham.CHINH_SUA_LAI,
							ETrangThaiSanPham.DA_CHINH_SUA_LAI,
							ETrangThaiSanPham.CHUA_TIEP_NHAN,
						].includes(record.trangThaiSanPham) &&
							props.role === 'admin' && (
								<Tooltip title='Xử lý'>
									<Button onClick={() => handleXuLy(record)} type='link' icon={<CheckOutlined />} />
								</Tooltip>
							)}
					</>
				),
			},
		);
	} else if (props.mode === 'quydoigio') {
		columns.push(
			{
				title: 'Trạng thái',
				dataIndex: 'danhSachYeuCauQuyDoiGio',
				width: 130,
				align: 'center',
				fixed: 'right',
				render: (val: SanPhamNCKH.YeuCauQuyDoiGio[], rec: SanPhamNCKH.IRecord) => {
					const trangThai = val?.find((item) => item.namHocId === recordNamHoc?._id)?.trangThaiTiepNhan;
					const recKetQuaQuyDoiGioTheoNam = rec.danhSachKetQuaQuyDoiGio?.find(
						(item) => item.namHocId === recordNamHoc?._id,
					);

					const daDuyetQuyDoiGio =
						rec.trangThaiSanPham === ETrangThaiSanPham.DUYET &&
						((recordNamHoc?._id && recKetQuaQuyDoiGioTheoNam?.namHocId) ||
							(!recordNamHoc?._id && rec.danhSachKetQuaQuyDoiGio.length));
					return (
						<>
							<Tag color={trangThai ? MapKeyColorTrangThaiYeuCauQuyDoiGio[trangThai] : 'grey'}>
								{trangThai ? MapKeyTextTrangThaiYeuCauQuyDoiGio[trangThai] : 'Chưa khai báo'}
							</Tag>
							{!trangThai && (
								<>
									<Divider style={{ marginTop: 8, marginBottom: 0 }} />
									<div
										onClick={() => {
											handleQuyDoi(rec, 'GIO');
										}}
										style={{
											cursor: 'pointer',
											color: !daDuyetQuyDoiGio ? 'red' : primaryColor,
										}}
									>
										{daDuyetQuyDoiGio ? 'Đã duyệt giờ chuẩn' : 'Chưa duyệt giờ chuẩn'}
									</div>
								</>
							)}
						</>
					);
				},
			},
			{
				title: 'Thao tác',
				align: 'center',
				width: 80,
				fixed: 'right',
				render: (record: SanPhamNCKH.IRecord) => {
					const trangThai = record?.danhSachYeuCauQuyDoiGio?.find(
						(item) => item.namHocId === recordNamHoc?._id,
					)?.trangThaiTiepNhan;

					return (
						<>
							{props.role === 'cbgv' ? (
								<Tooltip title='Khai báo'>
									<Button
										disabled={
											trangThai &&
											[
												ETrangThaiYeuCauQuyDoiGio.DUYET,
												ETrangThaiYeuCauQuyDoiGio.DA_CHINH_SUA_LAI,
												ETrangThaiYeuCauQuyDoiGio.KHONG_DUYET,
											].includes(trangThai)
										}
										onClick={() => handleQuyDoi(record, 'GIO')}
										type='link'
										icon={<EditOutlined />}
									/>
								</Tooltip>
							) : (
								<Tooltip title='Xử lý'>
									<Button onClick={() => handleQuyDoi(record, 'GIO')} type='link' icon={<CheckOutlined />} />
								</Tooltip>
							)}
						</>
					);
				},
			},
		);
	} else if (props.mode === 'quydoidiem') {
		columns.push(
			{
				title: 'Trạng thái',
				dataIndex: 'danhSachYeuCauQuyDoiDiem',
				width: 130,
				align: 'center',
				fixed: 'right',
				render: (val: SanPhamNCKH.YeuCauQuyDoiGio[], rec: SanPhamNCKH.IRecord) => {
					const trangThai = val?.find((item) => item.namHocId === recordNamHoc?._id)?.trangThaiTiepNhan;
					const recKetQuaQuyDoiDiemTheoNam = rec?.danhSachKetQuaQuyDoiDiem?.find(
						(item) => item.namHocId === recordNamHoc?._id,
					);

					const daDuyetQuyDoiDiem =
						rec.trangThaiSanPham === ETrangThaiSanPham.DUYET &&
						((recordNamHoc?._id && recKetQuaQuyDoiDiemTheoNam?.namHocId) ||
							(!recordNamHoc?._id && rec?.danhSachKetQuaQuyDoiDiem?.length));
					return (
						<>
							<Tag color={trangThai ? MapKeyColorTrangThaiYeuCauQuyDoiGio[trangThai] : 'grey'}>
								{trangThai ? MapKeyTextTrangThaiYeuCauQuyDoiGio[trangThai] : 'Chưa khai báo'}
							</Tag>
							{!trangThai && (
								<>
									<Divider style={{ marginTop: 8, marginBottom: 0 }} />
									<div
										onClick={() => {
											handleQuyDoi(rec, 'DIEM');
										}}
										style={{
											cursor: 'pointer',
											color: !daDuyetQuyDoiDiem ? 'red' : primaryColor,
										}}
									>
										{daDuyetQuyDoiDiem ? 'Đã duyệt điểm công trình' : 'Chưa duyệt điểm công trình'}
									</div>
								</>
							)}
						</>
					);
				},
			},
			{
				title: 'Thao tác',
				align: 'center',
				width: 80,
				fixed: 'right',
				render: (record: SanPhamNCKH.IRecord) => {
					const trangThai = record.danhSachYeuCauQuyDoiDiem?.find(
						(item) => item.namHocId === recordNamHoc?._id,
					)?.trangThaiTiepNhan;

					return (
						<>
							{props.role === 'cbgv' ? (
								<Tooltip title='Khai báo'>
									<Button
										disabled={
											trangThai &&
											[
												ETrangThaiYeuCauQuyDoiGio.DUYET,
												ETrangThaiYeuCauQuyDoiGio.DA_CHINH_SUA_LAI,
												ETrangThaiYeuCauQuyDoiGio.KHONG_DUYET,
											].includes(trangThai)
										}
										onClick={() => handleQuyDoi(record, 'DIEM')}
										type='link'
										icon={<EditOutlined />}
									/>
								</Tooltip>
							) : (
								<Tooltip title='Xử lý'>
									<Button onClick={() => handleQuyDoi(record, 'DIEM')} type='link' icon={<CheckOutlined />} />
								</Tooltip>
							)}
						</>
					);
				},
			},
		);
	}

	return (
		<>
			<TableBase
				rowSelection={props.select}
				detailRow={
					props.select
						? {
								// selectedRowKeys: props?.dataInitSelect?.map((item) => item._id) ?? [],
								onChange: (selectedRowKeys: React.Key[], selectedRows: SanPhamNCKH.IRecord[]) => {
									// if (props.setDataCheckBox) props?.setDataCheckBox([...unSelectedRows, ...selectedRows]);

									// eslint-disable-next-line @typescript-eslint/no-unused-expressions
									props?.handleSelect && props?.handleSelect(selectedRows);
								},
								getCheckboxProps: (record: SanPhamNCKH.IRecord) => ({
									disabled: false,
									name: record._id,
								}),
						  }
						: undefined
				}
				buttons={{ create: false }}
				otherButtons={[
					<SelectNamHoc
						key={'1'}
						allowClear={props?.paramCondition?.trangThaiSanPham === ETrangThaiSanPham.DUYET ? false : true}
						style={{ width: 200, display: props.hideFilterNamHoc ? 'none' : undefined }}
					/>,
					<SelectDonVi
						style={{ width: 250, display: props.hideFilterDonVi ? 'none' : undefined }}
						key={'3'}
						allowClear
						fieldValue='maDonVi'
						onChange={(val) => {
							setCondition({ ...condition, 'nguoiKhaiBao.maDonVi': val });
						}}
					/>,
					<Select
						allowClear
						onChange={(val) => setLoaiKhaiBao(val)}
						style={{ width: 150, display: props.hideFilterLoaiKhaiBao ? 'none' : undefined }}
						key={'2'}
						placeholder='Loại khai báo'
						options={Object.values(ELoaiKhaiBao).map((item) => ({ value: item, label: item }))}
					/>,
					<Select
						allowClear
						onChange={(val) => {
							if (!val) {
								setCondition({ ...condition, danhSachYeuCauQuyDoiGio: undefined });
							} else if (val === 'Chưa khai báo') {
								setCondition({ ...condition, danhSachYeuCauQuyDoiGio: { $eq: [] } });
							} else
								setCondition({
									...condition,
									danhSachYeuCauQuyDoiGio: { $elemMatch: { namHocId: recordNamHoc?._id, trangThaiTiepNhan: val } },
								});
						}}
						style={{ width: 200, display: props.mode !== 'quydoigio' ? 'none' : undefined }}
						key={'4'}
						placeholder='Lọc theo trạng thái'
						options={['Chưa khai báo', ...Object.values(ETrangThaiYeuCauQuyDoiGio)].map((item) => ({
							value: item,
							label: item,
						}))}
					/>,
				]}
				widthDrawer={800}
				hideCard
				modelName='khoahoc.sanphamnckh'
				getData={getData}
				dependencies={[recordNamHoc?._id, recordLoaiHinhNCKH?._id, page, limit, condition, filters, loaiKhaiBao]}
				columns={columns}
				dataState={'dataSelectView'}
			/>

			<Modal
				width={900}
				title='Danh sách thành viên'
				footer={
					<Button type='primary' onClick={onCancelViewThanhVien}>
						Đóng
					</Button>
				}
				visible={visibleViewThanhVien}
				onCancel={onCancelViewThanhVien}
			>
				<TableThanhVien mode='view' />
			</Modal>
			<Modal
				destroyOnClose
				width={900}
				title='Chi tiết sản phẩm, hoạt động NCKH'
				footer={false}
				visible={visibleViewSanPham}
				onCancel={onCancelViewSanPham}
			>
				<ViewSanPham
					onCancel={onCancelViewSanPham}
					getData={getData}
					mode={props.role === 'admin' ? 'handle' : 'view'}
				/>
			</Modal>
			<Modal
				destroyOnClose
				width={900}
				title='Giờ chuẩn NCKH'
				footer={false}
				visible={visibleViewQuyDoiGio}
				onCancel={onCancelViewQuyDoiGio}
			>
				<Tabs activeKey={loaiDuLieuQuyDoiGio} onChange={(val: any) => setLoaiDuLieuQuyDoiGio(val)}>
					{Object.values(ELoaiDuLieuQuyDoiGio).map((item) => (
						<Tabs.TabPane
							tab={mode === 'GIO' ? MapKeyLoaiDuLieuQuyDoiGio[item] : MapKeyLoaiDuLieuQuyDoiDiem[item]}
							tabKey={item}
							key={item}
						/>
					))}
				</Tabs>
				<TableQuyDoiGio
					role={props.role}
					getData={getData}
					loaiDuLieuQuyDoiGio={loaiDuLieuQuyDoiGio}
					mode={mode}
					fieldNameKetQua={mode === 'DIEM' ? 'danhSachKetQuaQuyDoiDiem' : 'danhSachKetQuaQuyDoiGio'}
					fieldNameYeuCau={mode === 'DIEM' ? 'danhSachYeuCauQuyDoiDiem' : 'danhSachYeuCauQuyDoiGio'}
				/>
			</Modal>
		</>
	);
};

export default TableSanPhamNCKHStatic;
