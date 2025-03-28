import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';

import { ELoaiQueryDot } from '@/services/KhoaHoc/DanhMuc/NamHoc/constant';
import { ECheDoHienThi, EKieuDuLieu, ELoaiThoiGianThucHien } from '@/services/KhoaHoc/LoaiHinhNCKH/constants';
import {
	EKieuDuLieuSanPham,
	ELoaiKhaiBao,
	ETrangThaiSanPham,
	ETrangThaiYeuCauQuyDoiGio,
	MapKeyColorTrangThaiSanPham,
	MapKeyColorTrangThaiYeuCauQuyDoiGio,
	MapKeyTextTrangThaiSanPham,
	MapKeyTextTrangThaiYeuCauQuyDoiGio,
} from '@/services/KhoaHoc/SanPhamNCKH/constants';
import type { SanPhamNCKH } from '@/services/KhoaHoc/SanPhamNCKH/typings';

import {
	CheckOutlined,
	DeleteOutlined,
	EditOutlined,
	ExportOutlined,
	EyeOutlined,
	PlusCircleOutlined,
} from '@ant-design/icons';
import { Button, Descriptions, Divider, Modal, Popconfirm, Select, Tag, Tooltip } from 'antd';
import { useCallback, useState } from 'react';
import { useModel } from 'umi';

import TableBase from '@/components/Table';
import SelectDonVi from '@/pages/ToChucNhanSu/DonVi/Select';
import { primaryColor } from '@/services/base/constant';
import moment from 'moment';
import SelectNamHoc from '../../components/SelectNamHoc';
import { buildFilter } from './BuildFilter';
import FormChonDot from './FormChonDot';
import FormChuyenDot from './FormChuyenDot';
import FormSanPhamHoatDong from './FormSanPhamHoatDong';
import TableQuyDoiGio from './TableQuyDoiGio';
import TableThanhVien from './TableThanhVien';
import ViewRender from './ViewRender';
import ViewSanPham from './ViewSanPham';

const TableSanPhamNCKH = (props: {
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
	isDangThucHien?: boolean;
	title?: string;
}) => {
	const {
		getSanPhamDaKhaiBao: getModel,
		getModel: getToanTruong,
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
		setCurrent,
		setQuyDoiDiem,
		setQuyDoiGio,
		setIsView,
		setEdit,
		setVisibleForm,
		exportSanPhamModel,
		loading,
		isXacNhanHoanThanh,
		setIsXacNhanHoanThanh,
	} = useModel('khoahoc.sanphamnckh');

	const { initialState } = useModel('@@initialState');
	const [loaiKhaiBao, setLoaiKhaiBao] = useState<ELoaiKhaiBao | undefined>();
	const [visibleViewThanhVien, setVisibleViewThanhVien] = useState<boolean>(false);
	const { record: recordLoaiHinhNCKH } = useModel('khoahoc.loaihinhnckh');
	const {
		record: recordNamHoc,
		danhSach: danhSachNamHoc,
		setRecord: setRecNamHoc,
	} = useModel('khoahoc.danhmuc.namhoc');
	const [mode, setMode] = useState<'GIO' | 'DIEM'>(props.mode === 'quydoidiem' ? 'DIEM' : 'GIO');
	const [kieuDuLieu, setKieuDuLieu] = useState<EKieuDuLieuSanPham>(EKieuDuLieuSanPham.CUA_TOI);
	const { danhSach } = useModel('khoahoc.danhmuc.chung');
	const [visibleSelectDot, setVisibleSelectDot] = useState<boolean>(false);
	const [visibleChuyenDot, setVisibleChuyenDot] = useState<boolean>(false);
	const [listIdNamHoc, setListIdNamHoc] = useState<string[]>([]);

	const buildParamCondition = () => {
		const paramCondition = {
			loaiHinhNckhId: recordLoaiHinhNCKH?._id,
			finalStartDate:
				recordNamHoc?._id && recordNamHoc.loaiQueryDot === ELoaiQueryDot.THOIGIANDOT
					? { $lte: recordNamHoc?.thoiGianKetThuc }
					: undefined,
			finalEndDate:
				recordNamHoc?._id && recordNamHoc.loaiQueryDot === ELoaiQueryDot.THOIGIANDOT
					? { $gte: recordNamHoc?.thoiGianBatDau }
					: undefined,

			dotId:
				// recordNamHoc?.loaiQueryDot === ELoaiQueryDot.DOT &&
				listIdNamHoc.length ? { $in: listIdNamHoc } : undefined,
			...(props?.paramCondition ?? {}),
		};

		return paramCondition;
	};

	const getDataToanTruong = () => {
		if (recordLoaiHinhNCKH?._id) getToanTruong(buildParamCondition(), undefined, { createdAt: -1 });
	};

	const getDataCuaToi = () => {
		let otherQuery;

		if (props.role === 'cbgv') {
			if (loaiKhaiBao === ELoaiKhaiBao.TU_KHAI_BAO) {
				otherQuery = {
					loaiCaNhanKhaiBao: 'TU_KHAI_BAO',
				};
			} else if (loaiKhaiBao === ELoaiKhaiBao.DUOC_KHAI_BAO) {
				otherQuery = {
					loaiCaNhanKhaiBao: 'DUOC_KHAI_BAO',
				};
			}
		}

		if (recordLoaiHinhNCKH?._id) getModel(buildParamCondition(), otherQuery);
	};

	const getData = () => {
		if (kieuDuLieu === EKieuDuLieuSanPham.CUA_TOI) getDataCuaToi();
		else getDataToanTruong();
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

	const handleInitGioVaDiem = (record: SanPhamNCKH.IRecord) => {
		const buildQuyDoiGio: any = {};
		record?.danhSachYeuCauQuyDoiGio?.map((item) => {
			buildQuyDoiGio[item.namHocId] = item.danhSachKetQuaTinhGioThanhVien;
		});
		setQuyDoiGio(buildQuyDoiGio);
		if (recordLoaiHinhNCKH?.tinhDiem) {
			const buildQuyDoiDiem: any = {};
			record?.danhSachYeuCauQuyDoiDiem?.map((item) => {
				buildQuyDoiDiem[item.namHocId] = item.danhSachKetQuaTinhGioThanhVien;
			});
			setQuyDoiDiem(buildQuyDoiDiem);
		}
	};

	const onCell = (record: SanPhamNCKH.IRecord) => ({
		onClick: () => {
			setVisibleViewSanPham(true);
			setRecordSanPham(record);
			handleInitGioVaDiem(record);
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
			filterType: 'string',
			dataIndex: 'danhSachThanhVien.hoVaTen',
			render: (val, rec: SanPhamNCKH.IRecord) => (
				<a
					onClick={() => {
						setRecordSanPham(rec);
						setVisibleViewThanhVien(true);
						handleInitGioVaDiem(rec);
					}}
				>
					{rec.danhSachThanhVien.length} thành viên
				</a>
			),
		},
		{
			title:
				recordLoaiHinhNCKH?.loaiThoiGianThucHien &&
				[ELoaiThoiGianThucHien.NAM, ELoaiThoiGianThucHien.NGAYTHANGNAM, ELoaiThoiGianThucHien.THANGNAM].includes(
					recordLoaiHinhNCKH?.loaiThoiGianThucHien,
				)
					? `${recordLoaiHinhNCKH?.startLabel} - ${recordLoaiHinhNCKH?.endLabel}`
					: recordLoaiHinhNCKH?.timelineLabel,
			width: 120,
			align: 'center',
			render: (val, rec) =>
				recordLoaiHinhNCKH &&
				[ELoaiThoiGianThucHien.NAM, ELoaiThoiGianThucHien.NGAYTHANGNAM, ELoaiThoiGianThucHien.THANGNAM].includes(
					recordLoaiHinhNCKH?.loaiThoiGianThucHien,
				) ? (
					<Descriptions.Item span={6} label={`${recordLoaiHinhNCKH.startLabel} - ${recordLoaiHinhNCKH.endLabel}`}>
						{moment(rec?.thongTinThoiGian?.start).format(
							recordLoaiHinhNCKH.loaiThoiGianThucHien === ELoaiThoiGianThucHien.NAM
								? 'YYYY'
								: recordLoaiHinhNCKH.loaiThoiGianThucHien === ELoaiThoiGianThucHien.THANGNAM
								? 'MM/YYYY'
								: 'DD/MM/YYYY',
						)}{' '}
						-{' '}
						{moment(rec?.thongTinThoiGian?.end).format(
							recordLoaiHinhNCKH.loaiThoiGianThucHien === ELoaiThoiGianThucHien.NAM
								? 'YYYY'
								: recordLoaiHinhNCKH.loaiThoiGianThucHien === ELoaiThoiGianThucHien.THANGNAM
								? 'MM/YYYY'
								: 'DD/MM/YYYY',
						)}
					</Descriptions.Item>
				) : (
					<Descriptions.Item span={6} label={recordLoaiHinhNCKH?.timelineLabel}>
						{moment(rec?.thongTinThoiGian?.timeline).format(
							recordLoaiHinhNCKH?.loaiThoiGianThucHien === ELoaiThoiGianThucHien.THOIGIANCUTHE_YYYY
								? 'YYYY'
								: recordLoaiHinhNCKH?.loaiThoiGianThucHien === ELoaiThoiGianThucHien.THOIGIANCUTHE_MMYYYY
								? 'MM/YYYY'
								: 'DD/MM/YYYY',
						)}
					</Descriptions.Item>
				),
		},
	];

	recordLoaiHinhNCKH?.cauHinhLoaiHinh
		?.filter((item) =>
			recordLoaiHinhNCKH?.danhSachCotHienThi?.length ? recordLoaiHinhNCKH.danhSachCotHienThi.includes(item.ma) : item,
		)
		?.filter((item) => {
			if (!item.cheDoHienThi) return item;
			if (props.isDangThucHien) return [ECheDoHienThi.THUC_HIEN, ECheDoHienThi.TAT_CA].includes(item.cheDoHienThi);
			else return [ECheDoHienThi.SAN_PHAM, ECheDoHienThi.TAT_CA].includes(item.cheDoHienThi);
		})
		.map((item) => {
			if (item.kieuDuLieu === EKieuDuLieu.TABLE || item.kieuDuLieu === EKieuDuLieu.DANHSACH) return;
			columns.push({
				title: item.ten,
				dataIndex: `thongTinKhaiBao.${item.ma}`,
				width: 200,
				align: 'center',
				specialFilter: true,
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
					return (
						<>
							<Tag color={MapKeyColorTrangThaiSanPham[val]}>{MapKeyTextTrangThaiSanPham[val]}</Tag>
						</>
					);
				},
			},
			{
				title: 'Thao tác',
				align: 'center',
				width: 120,
				fixed: 'right',
				hide: props?.select,
				render: (record: SanPhamNCKH.IRecord) => {
					const isNguoiKhaiBao = record?.nguoiKhaiBao?.ssoId === initialState?.currentUser?.ssoId;
					const isAdminKhaiHo = record.nguoiKhaiBao.hoVaTen?.toLowerCase()?.includes('admin');
					// const isGiamDocHocVien = initialState?.currentUser?.ssoId === '99e07c0e-6671-4bf9-a168-7fe55639eccd';
					const isGiamDocHocVien = initialState?.currentUser?.ssoId === 'f8933f58-6cce-42bb-8533-ee195f232568';
					const isDangThucHien = record?.trangThaiSanPham === ETrangThaiSanPham.DANG_THUC_HIEN;
					return (
						<>
							{isDangThucHien && (
								<Tooltip title='Xác nhận đã hoàn thành'>
									<Button
										disabled={
											(isNguoiKhaiBao &&
												[
													ETrangThaiSanPham.CHINH_SUA_LAI,
													ETrangThaiSanPham.CHUA_TIEP_NHAN,
													ETrangThaiSanPham.DANG_THUC_HIEN,
												].includes(record.trangThaiSanPham)) ||
											(isNguoiKhaiBao &&
												recordLoaiHinhNCKH?.cauHinhChinhSuaSauDuyet?.choPhepChinhSuaSauDuyet &&
												[ETrangThaiSanPham.DUYET].includes(record.trangThaiSanPham)) ||
											props.role === 'admin' ||
											(isAdminKhaiHo && kieuDuLieu === EKieuDuLieuSanPham.CUA_TOI)
												? false
												: true
										}
										onClick={() => {
											setCurrent(0);
											handleEdit(record);
											handleInitGioVaDiem(record);
											setIsXacNhanHoanThanh(true);
										}}
										type='link'
										icon={<CheckOutlined />}
									/>
								</Tooltip>
							)}
							<Tooltip title='Chỉnh sửa'>
								<Button
									disabled={
										isDangThucHien
											? false
											: (isNguoiKhaiBao &&
													[
														ETrangThaiSanPham.CHINH_SUA_LAI,
														ETrangThaiSanPham.CHUA_TIEP_NHAN,
														ETrangThaiSanPham.DANG_THUC_HIEN,
														ETrangThaiSanPham.DA_CHINH_SUA_LAI,
													].includes(record.trangThaiSanPham)) ||
											  (isNguoiKhaiBao &&
													recordLoaiHinhNCKH?.cauHinhChinhSuaSauDuyet?.choPhepChinhSuaSauDuyet &&
													[ETrangThaiSanPham.DUYET].includes(record.trangThaiSanPham)) ||
											  props.role === 'admin' ||
											  (isAdminKhaiHo && kieuDuLieu === EKieuDuLieuSanPham.CUA_TOI)
											? false
											: true
									}
									onClick={() => {
										setCurrent(0);
										handleEdit(record);
										handleInitGioVaDiem(record);
										setIsXacNhanHoanThanh(false);
									}}
									type='link'
									icon={<EditOutlined />}
								/>
							</Tooltip>
							<Tooltip title='Xóa'>
								<Popconfirm
									disabled={
										isGiamDocHocVien
											? false
											: !isNguoiKhaiBao ||
											  (record.trangThaiSanPham !== ETrangThaiSanPham.CHUA_TIEP_NHAN &&
													record.trangThaiSanPham !== ETrangThaiSanPham.DANG_THUC_HIEN &&
													props.role === 'cbgv')
									}
									onConfirm={() => deleteModel(record._id, getData)}
									title='Bạn có chắc chắn muốn xóa?'
									placement='topLeft'
								>
									<Button
										disabled={
											isGiamDocHocVien
												? false
												: !isNguoiKhaiBao ||
												  (record.trangThaiSanPham !== ETrangThaiSanPham.CHUA_TIEP_NHAN &&
														record.trangThaiSanPham !== ETrangThaiSanPham.DANG_THUC_HIEN &&
														props.role === 'cbgv')
										}
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
					);
				},
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
					const trangThai = record.danhSachYeuCauQuyDoiGio?.find(
						(item) => item.namHocId === recordNamHoc?._id,
					)?.trangThaiTiepNhan;
					const isView =
						trangThai &&
						[
							ETrangThaiYeuCauQuyDoiGio.DUYET,
							ETrangThaiYeuCauQuyDoiGio.DA_CHINH_SUA_LAI,
							ETrangThaiYeuCauQuyDoiGio.KHONG_DUYET,
						].includes(trangThai);
					return (
						<>
							<Tooltip title={isView ? 'Chi tiết' : 'Khai báo'}>
								<Button
									// disabled={
									// 	trangThai &&
									// 	[
									// 		ETrangThaiYeuCauQuyDoiGio.DUYET,
									// 		ETrangThaiYeuCauQuyDoiGio.DA_CHINH_SUA_LAI,
									// 		ETrangThaiYeuCauQuyDoiGio.KHONG_DUYET,
									// 	].includes(trangThai)
									// }
									onClick={() => handleQuyDoi(record, 'GIO')}
									type='link'
									icon={isView ? <EyeOutlined /> : <EditOutlined />}
								/>
							</Tooltip>
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
					const recKetQuaQuyDoiDiemTheoNam = rec.danhSachKetQuaQuyDoiDiem?.find(
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
					const isView =
						trangThai &&
						[
							ETrangThaiYeuCauQuyDoiGio.DUYET,
							ETrangThaiYeuCauQuyDoiGio.DA_CHINH_SUA_LAI,
							ETrangThaiYeuCauQuyDoiGio.KHONG_DUYET,
						].includes(trangThai);

					return (
						<>
							<Tooltip title={isView ? 'Chi tiết' : 'Khai báo'}>
								<Button
									// disabled={
									// 	trangThai &&
									// 	[
									// 		ETrangThaiYeuCauQuyDoiGio.DUYET,
									// 		ETrangThaiYeuCauQuyDoiGio.DA_CHINH_SUA_LAI,
									// 		ETrangThaiYeuCauQuyDoiGio.KHONG_DUYET,
									// 	].includes(trangThai)
									// }
									onClick={() => handleQuyDoi(record, 'DIEM')}
									type='link'
									icon={isView ? <EyeOutlined /> : <EditOutlined />}
								/>
							</Tooltip>
						</>
					);
				},
			},
		);
	}

	const Form = useCallback(
		() => (
			<FormSanPhamHoatDong
				isDangThucHien={isXacNhanHoanThanh ? false : props?.isDangThucHien}
				role={props.role}
				getData={getData}
			/>
		),
		[
			recordNamHoc?._id,
			recordLoaiHinhNCKH?._id,
			page,
			limit,
			condition,
			filters,
			loaiKhaiBao,
			listIdNamHoc,
			props.isDangThucHien,
			isXacNhanHoanThanh,
		],
	);

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
								getCheckboxProps: (record: { _id: any }) => ({
									disabled: false,
									name: record._id,
								}),
						  }
						: undefined
				}
				buttons={{ create: props?.select ? false : props.hasCreate ? true : false, import: props.role === 'admin' }}
				otherButtons={[
					<Select
						value={kieuDuLieu}
						onChange={(val) => setKieuDuLieu(val)}
						style={{ width: 180, display: props.hideFilterLoaiKhaiBao ? 'none' : undefined }}
						key={'data'}
						placeholder='Dữ liệu'
						options={Object.values(EKieuDuLieuSanPham).map((item) => ({ value: item, label: item }))}
					/>,
					<>
						{kieuDuLieu === EKieuDuLieuSanPham.CUA_TOI && (
							<ButtonExtend
								key={'0'}
								onClick={() => {
									if (listIdNamHoc.length === 1) {
										setRecordSanPham(undefined);
										setEdit(false);
										setIsView(false);
										setVisibleForm(true);
										setQuyDoiDiem({});
										setQuyDoiGio({});
									} else {
										setVisibleSelectDot(true);
									}
								}}
								icon={<PlusCircleOutlined />}
								type='primary'
								notHideText
								tooltip='Thêm mới dữ liệu'
							>
								Thêm mới
							</ButtonExtend>
						)}
					</>,
					<>
						<SelectNamHoc
							onChange={(val: string[]) => {
								if (val?.length !== 1) {
									setRecNamHoc(undefined);
								} else {
									setRecNamHoc(danhSachNamHoc.find((item) => item._id === val[0]));
								}
								setListIdNamHoc(val);
							}}
							value={listIdNamHoc}
							mode={'multiple'}
							key={'1'}
							allowClear
							// allowClear={props?.paramCondition?.trangThaiSanPham === ETrangThaiSanPham.DUYET ? false : true}
							style={{ width: 400, display: props.hideFilterNamHoc ? 'none' : undefined }}
						/>
						{kieuDuLieu === EKieuDuLieuSanPham.TOAN_HOC_VIEN && (
							<Button
								loading={loading}
								onClick={() => exportSanPhamModel(recordLoaiHinhNCKH?.ten ?? '', buildParamCondition())}
								key={'export'}
								type='primary'
								icon={<ExportOutlined />}
							>
								Xuất dữ liệu
							</Button>
						)}
					</>,

					<SelectDonVi
						style={{ width: 250, display: props.hideFilterDonVi ? 'none' : undefined }}
						placeholder='Lọc theo đơn vị'
						key={'3'}
						allowClear
						fieldValue='maDonVi'
						onChange={(val) => {
							setCondition({ ...condition, 'nguoiKhaiBao.maDonVi': val });
						}}
					/>,

					<>
						{kieuDuLieu === EKieuDuLieuSanPham.CUA_TOI && (
							<Select
								allowClear
								onChange={(val) => setLoaiKhaiBao(val)}
								style={{ width: 180, display: props.hideFilterLoaiKhaiBao ? 'block' : undefined }}
								key={'2'}
								placeholder='Loại khai báo'
								options={Object.values(ELoaiKhaiBao).map((item) => ({ value: item, label: item }))}
							/>
						)}
					</>,
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
				widthDrawer={950}
				Form={Form}
				hideCard
				modelName='quanlykhoahoc.sanphamnckh'
				getData={getData}
				dependencies={[
					// recordNamHoc?._id,
					recordLoaiHinhNCKH?._id,
					page,
					limit,
					condition,
					filters,
					loaiKhaiBao,
					kieuDuLieu,
					listIdNamHoc,
				]}
				columns={columns}
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
					isDangThucHien={props.isDangThucHien}
					onCancel={onCancelViewSanPham}
					getData={getData}
					mode={props.role === 'admin' ? 'handle' : 'view'}
				/>
			</Modal>
			<Modal
				footer={false}
				bodyStyle={{ padding: 0 }}
				onCancel={() => setVisibleSelectDot(false)}
				visible={visibleSelectDot}
			>
				<FormChonDot title={props?.title} onCancel={() => setVisibleSelectDot(false)} />
			</Modal>
			<Modal
				footer={false}
				bodyStyle={{ padding: 0 }}
				onCancel={() => setVisibleChuyenDot(false)}
				visible={visibleChuyenDot}
			>
				<FormChuyenDot getData={getData} onCancel={() => setVisibleChuyenDot(false)} />
			</Modal>
			<Modal
				destroyOnClose
				width={900}
				title={mode === 'GIO' ? 'Giờ chuẩn NCKH' : 'Điểm công trình khoa học'}
				bodyStyle={{ paddingTop: 4 }}
				footer={false}
				visible={visibleViewQuyDoiGio}
				onCancel={onCancelViewQuyDoiGio}
			>
				{/* <Tabs activeKey={loaiDuLieuQuyDoiGio} onChange={(val: any) => setLoaiDuLieuQuyDoiGio(val)}>
					{Object.values(ELoaiDuLieuQuyDoiGio).map((item) => (
						<Tabs.TabPane
							tab={mode === 'GIO' ? MapKeyLoaiDuLieuQuyDoiGio[item] : MapKeyLoaiDuLieuQuyDoiDiem[item]}
							tabKey={item}
							key={item}
						/>
					))}
				</Tabs> */}
				<TableQuyDoiGio
					fieldNameKetQua={mode === 'DIEM' ? 'danhSachKetQuaQuyDoiDiem' : 'danhSachKetQuaQuyDoiGio'}
					fieldNameYeuCau={mode === 'DIEM' ? 'danhSachYeuCauQuyDoiDiem' : 'danhSachYeuCauQuyDoiGio'}
					mode={mode}
					// loaiDuLieuQuyDoiGio={loaiDuLieuQuyDoiGio}
					role={props.role}
					getData={getData}
				/>
			</Modal>
		</>
	);
};

export default TableSanPhamNCKH;
