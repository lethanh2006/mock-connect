import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import { ELoaiBoLoc, type ELoaiCheDoSinhVien } from '@/services/CongTacSinhVien/CheDoSinhVien/constant';
import type { CheDoSinhVien } from '@/services/CongTacSinhVien/CheDoSinhVien/typings';

import { Input, Modal, Select } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';

import { EOperatorType } from '@/components/Table/constant';
import { ELoaiDanhMucChung } from '@/services/QuyTrinh/DanhMuc/constants';
import { EKieuDuLieu } from '@/services/QuyTrinh/LoaiHinh/constants';
import ViewRender from '../KhaiBaoQuyTrinh/MauDon/ViewRender';

import SelectCheDoChinhSach from './components/SelectCheDoChinhSach';
import ViewQuyetDinh from './components/ViewQuyetDinh';

const QuyetDinh = (props: {
	title: string;
	loaiCheDoSinhVien: ELoaiCheDoSinhVien;
	ssoId?: string;
	filterWidth?: number;
}) => {
	const {
		setVisibleView,
		visibleView,
		setRecord: setRecordQuyetDinh,
		getModel,
		page,
		limit,
		setDanhSach,
		filters,
		setFilters,
	} = useModel('chedochinhsach.quyetdinhchedosinhvien');
	const { danhSach, getAllModel: getAllDanhMuc } = useModel('quytrinh.danhmuc');
	const {
		record: recordCheDoChinhSach,
		visibleImport,
		setVisibleImport,
		setRecord: setRecordCheDoChinhSach,
		danhSach: danhSachCheDoChinhSach,
	} = useModel('chedochinhsach.chedochinhsach');

	const getData = () => {
		if (recordCheDoChinhSach?._id) {
			getModel({ cheDoSinhVienId: recordCheDoChinhSach?._id }, undefined, undefined, undefined, undefined, 'page/my');
		} else setDanhSach([]);
	};

	const onCancelView = () => {
		setVisibleView(false);
	};

	const onCell = (record: CheDoSinhVien.QuyetDinhCheDoSinhVien) => ({
		onClick: () => {
			setVisibleView(true);
			setRecordQuyetDinh(record);
		},
		style: { cursor: 'pointer' },
	});

	useEffect(() => {
		getAllDanhMuc(false, undefined, { maModule: ELoaiDanhMucChung.CHE_DO_CHINH_SACH });
	}, []);

	const columns: IColumn<CheDoSinhVien.QuyetDinhCheDoSinhVien>[] = [
		{
			title: 'Họ và tên',
			dataIndex: 'hoVaTen',
			width: 150,
			align: 'center',
			filterType: 'string',
			onCell,
			hide: props.ssoId ? true : false,
		},
		{
			title: 'Mã SV',
			dataIndex: 'maSinhVien',
			width: 120,
			align: 'center',
			filterType: 'string',
			onCell,
			hide: props.ssoId ? true : false,
		},
		{
			title: 'Lớp',
			dataIndex: 'lop.ten',
			width: 100,
			align: 'center',
			filterType: 'string',
			onCell,
			render: (val, rec) => rec?.lop?.ten,
			hide: props.ssoId ? true : false,
		},
		{
			title: 'Ngành',
			dataIndex: 'nganh.ten',
			width: 200,
			align: 'center',
			onCell,
			filterType: 'string',
			render: (val, rec) => rec?.nganh?.ten,
			hide: props.ssoId ? true : false,
		},
		{
			title: 'Ngày sinh',
			dataIndex: 'ngaySinh',
			width: 100,
			align: 'center',
			render: (val) => (val ? moment(val).format('DD/MM/YYYY') : ''),
			onCell,
			hide: props.ssoId ? true : false,
		},
		{
			title: 'Giới tính',
			dataIndex: 'gioiTinh',
			width: 100,
			align: 'center',
			onCell,
			hide: props.ssoId ? true : false,
		},
		{
			title: 'Dân tộc',
			dataIndex: 'danToc',
			width: 100,
			align: 'center',
			onCell,
			filterType: 'string',
			hide: props.ssoId ? true : false,
		},
	];

	recordCheDoChinhSach?.danhSachCauHinhThongTin?.map((item) => {
		if (item.kieuDuLieu === EKieuDuLieu.TABLE || item.kieuDuLieu === EKieuDuLieu.DANHSACH) return;
		columns.push({
			title: item.ten,
			dataIndex: `thongTinQuyetDinh.${item.ma}.value` as any,
			width: 200,
			align: 'center',
			// specialFilter: true,
			onCell,
			render: (val, rec) => <ViewRender cauHinh={item} recordSanPham={{ thongTinKhaiBao: rec.thongTinQuyetDinh }} />,
			// ...buildFilter(item, danhSach),
		});
	});

	return (
		<>
			<TableBase
				// hideCard={props.ssoId ? true : false}
				buttons={{ create: false }}
				otherButtons={[
					<>
						{recordCheDoChinhSach?.danhSachBoLoc?.map((item) => (
							<>
								{item.loai === ELoaiBoLoc.GIA_TRI ? (
									<Input.Search placeholder={item.ten} />
								) : (
									<Select
										mode='multiple'
										onChange={(val) => {
											if (!val?.length) {
												setFilters(filters?.filter((ft) => ft.field !== item.path) ?? []);
											} else
												setFilters([
													...(filters?.filter((ft) => ft.field !== item.path) ?? []),
													{ field: item.path, active: true, values: val, operator: EOperatorType.INCLUDE },
												] as any);
										}}
										style={{ width: 250 }}
										allowClear
										placeholder={`Lọc theo ${item.ten}`}
										options={
											item.loai === ELoaiBoLoc.MANG
												? item.danhSachGiaTri.map((gt) => ({ value: gt, label: gt }))
												: danhSach
														.find((dm) => dm.maDanhMuc === item.maDanhMuc && dm.maModule === item.maModule)
														?.danhSachGiaTri.map((gt) => ({ value: gt?.value, label: gt?.value }))
										}
									/>
								)}
							</>
						))}
						<SelectCheDoChinhSach
							onChange={(val) => {
								setRecordCheDoChinhSach(danhSachCheDoChinhSach.find((item) => item._id === val));
							}}
							style={{ width: props?.filterWidth ?? 400 }}
							isSetRecord
							value={recordCheDoChinhSach?._id}
							condition={{ loaiCheDoSinhVien: props.loaiCheDoSinhVien }}
							key='filter'
						/>
					</>,
				]}
				getData={getData}
				widthDrawer={800}
				// Form={Form}
				dependencies={[page, limit, recordCheDoChinhSach?._id, props.loaiCheDoSinhVien]}
				title={props.title || 'Chế độ chính sách'}
				modelName={'chedochinhsach.quyetdinhchedosinhvien'}
				columns={columns}
			/>
			<Modal destroyOnClose width={900} title='Chi tiết' footer={false} visible={visibleView} onCancel={onCancelView}>
				<ViewQuyetDinh />
			</Modal>
		</>
	);
};

export default QuyetDinh;
