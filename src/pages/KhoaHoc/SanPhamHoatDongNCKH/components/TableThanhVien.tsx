import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { EKieuDuLieu, ELoaiThoiGianThucHien } from '@/services/KhoaHoc/LoaiHinhNCKH/constants';
import { ETrangThaiSanPham, ShortNameHocHam, ShortNameHocVi } from '@/services/KhoaHoc/SanPhamNCKH/constants';
import type { SanPhamNCKH } from '@/services/KhoaHoc/SanPhamNCKH/typings';
import rules from '@/utils/rules';
import { toISOString } from '@/utils/utils';
import { CalculatorOutlined, DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Input, InputNumber, Modal, Popconfirm, Space, Tooltip } from 'antd';
import type { FormInstance } from 'antd/es/form/Form';
import { useCallback, useEffect, useState } from 'react';
import { useModel } from 'umi';
import FormThanhVien from './FormThanhVien';
const TableThanhVien = (props: {
	mode: 'view' | 'edit';
	data?: SanPhamNCKH.ThanhVienNCKH[];
	formValues?: any;
	form?: FormInstance;
	isDangThucHien?: boolean;
}) => {
	const {
		record: recordSanPham,
		setRecord: setRecordSanPham,
		getQuyDoiGioTheoCongThucModel,
		quyDoiDiem,
		quyDoiGio,
		loading,
		setQuyDoiDiem,
		setQuyDoiGio,
	} = useModel('khoahoc.sanphamnckh');
	const { record: recordLoaiHinh } = useModel('khoahoc.loaihinhnckh');
	const isAdminKhaiHo = recordSanPham?.nguoiKhaiBao?.hoVaTen?.toLowerCase()?.includes('admin');
	const isChinhSuaSauDuyet =
		recordSanPham?.trangThaiSanPham === ETrangThaiSanPham.DUYET &&
		recordLoaiHinh?.cauHinhChinhSuaSauDuyet.choPhepChinhSuaSauDuyet;
	const [edit, setEdit] = useState<boolean>(false);
	const [visibleForm, setVisibleForm] = useState<boolean>(false);
	const [record, setRecord] = useState<SanPhamNCKH.ThanhVienNCKH>();
	const { record: recordNamHoc } = useModel('khoahoc.danhmuc.namhoc');
	const onCancelForm = useCallback(() => {
		setVisibleForm(false);
	}, []);

	useEffect(() => {
		if (props.form && (recordNamHoc?._id || recordSanPham?.dotId) && props.formValues) {
			if (props.formValues.gio) {
				const quyDoiGioTemp: any = {
					...(quyDoiGio || {}),
					[recordNamHoc?._id ?? recordSanPham?.dotId ?? '']: Object.keys(props?.formValues?.gio ?? {})?.map((item) => ({
						ssoId: item,
						tongGio: props?.formValues?.gio[item],
					})),
				};
				setQuyDoiGio(quyDoiGioTemp);
			}
			if (props.formValues.diem) {
				const quyDoiDiemTemp: any = {
					...(quyDoiDiem || {}),
					[recordNamHoc?._id ?? recordSanPham?.dotId ?? '']: Object.keys(props?.formValues?.diem ?? {})?.map(
						(item) => ({
							ssoId: item,
							tongGio: props?.formValues?.diem[item],
						}),
					),
				};
				setQuyDoiDiem(quyDoiDiemTemp);
			}
		}
	}, [props.formValues]);

	const handleCalculate = async (mode: 'GIO' | 'DIEM') => {
		const thongTinKhaiBao: any = recordLoaiHinh?.cauHinhLoaiHinh
			?.map((item) => ({
				ma: item.ma,
				value: [EKieuDuLieu.TABLE, EKieuDuLieu.DANHSACH].includes(item.kieuDuLieu)
					? recordSanPham?.thongTinKhaiBao?.find((ele) => ele.ma === item.ma)?.value
					: props.formValues?.[item.ma],
			}))
			?.filter((item) => item.value);

		const payload = {
			danhSachThanhVien: recordSanPham?.danhSachThanhVien?.filter((item) => item.ssoId) ?? [],
			thongTinKhaiBao,
			soLuongThanhVien: props.formValues?.soLuongThanhVien ?? 1,
			loaiHinhNckhId: recordLoaiHinh?._id ?? '',
			thongTinThoiGian: {
				loaiThoiGianThucHien: recordLoaiHinh?.loaiThoiGianThucHien ?? ELoaiThoiGianThucHien.THOIGIANCUTHE_YYYY,
				timeline: toISOString(props.formValues?.thongTinThoiGian?.timeline),
				start: toISOString(props.formValues?.thoiGian?.[0]),
				end: toISOString(props.formValues?.thoiGian?.[1]),
			},
		};

		const res: SanPhamNCKH.KetQuaTinhGioThanhVien[] = await getQuyDoiGioTheoCongThucModel(
			recordNamHoc?._id || recordSanPham?.dotId || '',
			mode,
			payload,
		);

		const gio: any = {};
		const diem: any = {};
		if (mode === 'GIO') {
			res?.map((item) => {
				if (item.ssoId) gio[item.ssoId] = item?.tongGio?.toFixed(2);
			});
			if (props.form)
				props.form.setFieldsValue({
					gio,
				});
		} else {
			res?.map((item) => {
				if (item.ssoId) diem[item.ssoId] = item?.tongGio?.toFixed(2);
			});
			if (props.form)
				props.form.setFieldsValue({
					diem,
				});
		}
	};

	const columns: IColumn<SanPhamNCKH.ThanhVienNCKH>[] = [
		{
			title: 'Họ tên',
			dataIndex: 'hoVaTen',
			width: 120,
			// align: 'center',
			render: (val, rec) => (
				<div>
					{[ShortNameHocHam?.[rec?.hocHam], ShortNameHocVi?.[rec?.hocVi], val].filter((item) => item).join(' ')}
				</div>
			),
		},
		{
			title: 'CCCD',
			dataIndex: 'cmtCccd',
			width: 120,
			align: 'center',
		},
		{
			title: 'Đơn vị công tác',
			width: 120,
			dataIndex: 'donVi',
		},
		{
			title: 'Vai trò',
			dataIndex: 'danhSachVaiTro',
			width: 100,
			align: 'center',
			render: (val) => val?.join(', '),
		},
		{
			title: 'Chương phụ trách',
			dataIndex: 'ghiChu',
			width: 200,
			hide: !recordLoaiHinh?.ten.toLowerCase().includes('sách') || props.isDangThucHien,
		},
		{
			title: 'Giờ chuẩn NCKH',
			dataIndex: 'tongGio',
			width: 120,
			align: 'center',
			hide: recordLoaiHinh?.tinhTheoTungNam || (props.mode === 'edit' && isChinhSuaSauDuyet) || props.isDangThucHien,
			render: (val, rec) => {
				const recGio = quyDoiGio[recordSanPham?.dotId || recordNamHoc?._id || '']?.find(
					(item) => item?.ssoId === rec?.ssoId,
				);
				const gioDaDuyet = recordSanPham?.danhSachKetQuaQuyDoiGio
					?.sort((a, b) => b.danhSachKetQuaTinhGioThanhVien.length - a.danhSachKetQuaTinhGioThanhVien.length)
					?.find((item) => item.namHocId === recordNamHoc?._id || item.namHocId === recordSanPham?.dotId)
					?.danhSachKetQuaTinhGioThanhVien?.find((item) => item?.ssoId === rec?.ssoId)?.tongGio;

				const gioFinal =
					recordSanPham?.trangThaiSanPham &&
					[
						ETrangThaiSanPham.CHINH_SUA_LAI,
						ETrangThaiSanPham.DA_CHINH_SUA_LAI,
						ETrangThaiSanPham.CHUA_TIEP_NHAN,
					].includes(recordSanPham?.trangThaiSanPham)
						? recGio?.tongGio
						: gioDaDuyet;

				const isDeTai = recordLoaiHinh?.ten?.toLowerCase()?.includes('thực hiện đề tài') ?? false;

				const tinhTrangDeTai = props?.formValues?.tinhTrangCuaDeTai;
				const isDeTaiNghiemThu =
					tinhTrangDeTai &&
					[
						'Đã nghiệm thu và có Quyết định công nhận kết quả đề tài',
						'Đã nghiệm thu và chưa có Quyết định công nhận kết quả đề tài',
					].includes(tinhTrangDeTai);

				return props.mode === 'edit' && !isChinhSuaSauDuyet ? (
					<Form.Item
						rules={!isAdminKhaiHo && (!isDeTai || (isDeTai && isDeTaiNghiemThu)) ? [...rules.required] : undefined}
						name={['gio', rec?.ssoId ?? rec.index]}
						style={{ margin: 0 }}
						initialValue={gioFinal}
					>
						<InputNumber style={{ width: '100%' }} placeholder='Nhập giờ' />
					</Form.Item>
				) : (
					<div>
						{gioFinal} {gioFinal ? 'giờ' : ''}
					</div>
				);
			},
		},
		{
			title: 'Điểm sản phẩm NCKH',
			dataIndex: 'tongDiem',
			width: 120,
			align: 'center',
			hide:
				recordLoaiHinh?.tinhTheoTungNam ||
				!recordLoaiHinh?.tinhDiem ||
				props?.formValues?.phanLoai?.toLowerCase()?.includes('tập bài giảng') ||
				(props.mode === 'edit' && isChinhSuaSauDuyet) ||
				props?.isDangThucHien,
			render: (val, rec) => {
				const recDiem = quyDoiDiem[recordSanPham?.dotId || recordNamHoc?._id || '']?.find(
					(item) => item?.ssoId === rec?.ssoId,
				);
				const diemDaDuyet = recordSanPham?.danhSachKetQuaQuyDoiDiem
					?.sort((a, b) => b.danhSachKetQuaTinhGioThanhVien.length - a.danhSachKetQuaTinhGioThanhVien.length)
					?.find((item) => item.namHocId === recordNamHoc?._id || item.namHocId === recordSanPham?.dotId)
					?.danhSachKetQuaTinhGioThanhVien?.find((item) => item?.ssoId === rec?.ssoId)?.tongGio;

				const diemFinal =
					recordSanPham?.trangThaiSanPham &&
					[
						ETrangThaiSanPham.CHINH_SUA_LAI,
						ETrangThaiSanPham.DA_CHINH_SUA_LAI,
						ETrangThaiSanPham.CHUA_TIEP_NHAN,
					].includes(recordSanPham?.trangThaiSanPham)
						? recDiem?.tongGio
						: diemDaDuyet;

				const isDeTai = recordLoaiHinh?.ten?.toLowerCase()?.includes('thực hiện đề tài') ?? false;

				const tinhTrangDeTai = props?.formValues?.tinhTrangCuaDeTai;
				const isDeTaiNghiemThu =
					tinhTrangDeTai &&
					[
						'Đã nghiệm thu và có Quyết định công nhận kết quả đề tài',
						'Đã nghiệm thu và chưa có Quyết định công nhận kết quả đề tài',
					].includes(tinhTrangDeTai);

				return props.mode === 'edit' && !isChinhSuaSauDuyet ? (
					<Form.Item
						rules={
							!isAdminKhaiHo && (!isDeTai || (isDeTai && isDeTaiNghiemThu))
								? [...rules.required, ...rules.floatnumber()]
								: [...rules.floatnumber()]
						}
						name={['diem', rec?.ssoId ?? rec.index]}
						style={{ margin: 0 }}
						initialValue={diemFinal}
					>
						<Input style={{ width: '100%' }} placeholder='Nhập điểm' />
					</Form.Item>
				) : (
					<div>
						{diemFinal} {diemFinal ? 'điểm' : ''}
					</div>
				);
			},
		},
		{
			title: 'Ghi chú duyệt',
			dataIndex: 'ghiChu',
			width: 220,
			align: 'center',
			hide: recordLoaiHinh?.tinhTheoTungNam || props.mode === 'edit',
			render: (val, rec) => {
				const ghiChu = recordSanPham?.danhSachKetQuaQuyDoiGio
					?.find((item) => item.namHocId === recordNamHoc?._id || item.namHocId === recordSanPham?.dotId)
					?.danhSachKetQuaTinhGioThanhVien?.find((item) => item?.ssoId === rec?.ssoId)?.ghiChuTiepNhan;
				return <div>{ghiChu}</div>;
			},
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 80,
			fixed: 'right',
			hide: props.mode === 'view' || (isChinhSuaSauDuyet && !isAdminKhaiHo),
			render: (rec: SanPhamNCKH.ThanhVienNCKH) => (
				<>
					<Tooltip title='Chỉnh sửa'>
						<Button
							size='small'
							onClick={() => {
								setEdit(true);
								setVisibleForm(true);
								setRecord(rec);
							}}
							shape='circle'
							icon={<EditOutlined />}
							type='link'
						/>
					</Tooltip>
					<Divider type='vertical' />
					<Tooltip title='Xóa'>
						<Popconfirm
							onConfirm={() => {
								if (recordSanPham) {
									setRecordSanPham({
										...recordSanPham,
										danhSachThanhVien: recordSanPham.danhSachThanhVien
											?.map((item, index) => ({ ...item, index: index + 1 }))
											.filter((item) => item.index !== rec.index),
									});
								}
							}}
							title='Bạn có chắc chắn muốn xóa?'
						>
							<Button size='small' shape='circle' type={'link'} danger icon={<DeleteOutlined />} />
						</Popconfirm>
					</Tooltip>
				</>
			),
		},
	];

	return (
		<>
			<TableStaticData
				addStt
				data={
					props?.data
						? props.data
						: recordSanPham?.danhSachThanhVien?.map((item, index) => ({ ...item, index: index + 1 })) ?? []
				}
				otherProps={{
					pagination: false,
					size: 'small',
				}}
				columns={columns?.filter((item) => item.hide !== true)}
			>
				{((isChinhSuaSauDuyet && isAdminKhaiHo) || (props.mode === 'edit' && !isChinhSuaSauDuyet)) && (
					<Space wrap>
						<Button
							size='small'
							type='primary'
							icon={<PlusCircleOutlined />}
							onClick={() => {
								setEdit(false);
								setVisibleForm(true);
								setRecord(undefined);
							}}
						>
							Thêm mới
						</Button>
						{!isChinhSuaSauDuyet &&
						!props.isDangThucHien &&
						recordLoaiHinh?.danhSachDieuKienQuyDoi.length &&
						props.formValues &&
						recordLoaiHinh._id &&
						(props?.data?.length || recordSanPham?.danhSachThanhVien?.length) ? (
							<Popconfirm
								title={
									<div style={{ maxWidth: 300 }}>
										Cán bộ, giảng viên cần điền đầy đủ các thông tin trong Form để kết quả tự động tính được chính xác,
										hệ thống sẽ tự động tính và ghi đè dữ liệu giờ mà cán bộ/giảng viên đã khai báo?
									</div>
								}
								onConfirm={() => handleCalculate('GIO')}
							>
								<Button loading={loading} icon={<CalculatorOutlined />} size='small'>
									{'Tự động tính giờ'}
								</Button>
							</Popconfirm>
						) : null}
						{!isChinhSuaSauDuyet &&
						!props.isDangThucHien &&
						recordLoaiHinh?.tinhDiem &&
						recordLoaiHinh?.danhSachDieuKienQuyDoiDiem.length &&
						props.formValues &&
						recordLoaiHinh._id &&
						(props?.data?.length || recordSanPham?.danhSachThanhVien?.length) ? (
							<Popconfirm
								title={
									<div style={{ maxWidth: 300 }}>
										Cán bộ, giảng viên cần điền đầy đủ các thông tin trong Form để kết quả tự động tính được chính xác,
										hệ thống sẽ tự động tính và ghi đè dữ liệu giờ mà cán bộ/giảng viên đã khai báo?
									</div>
								}
								onConfirm={() => handleCalculate('DIEM')}
							>
								<Button loading={loading} icon={<CalculatorOutlined />} size='small'>
									{'Tự động tính điểm'}
								</Button>
							</Popconfirm>
						) : null}
					</Space>
				)}
			</TableStaticData>
			<Modal destroyOnClose visible={visibleForm} onCancel={onCancelForm} footer={false} bodyStyle={{ padding: 0 }}>
				<FormThanhVien isDangThucHien={props?.isDangThucHien} record={record} edit={edit} onCancel={onCancelForm} />
			</Modal>
		</>
	);
};

export default TableThanhVien;
