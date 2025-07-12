import MyDatePicker from '@/components/MyDatePicker';
import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';
import UploadFile from '@/components/Upload/UploadFile';
import {
	ECheDoHienThi,
	EKieuDuLieu,
	ELoaiThoiGianThucHien,
	ELoaiTruongThongTinTinh,
} from '@/services/KhoaHoc/LoaiHinhNCKH/constants';
import {
	ETrangThaiSanPham,
	MapKeyColorTrangThaiSanPham,
	MapKeyTextTrangThaiSanPham,
} from '@/services/KhoaHoc/SanPhamNCKH/constants';
import type { SanPhamNCKH } from '@/services/KhoaHoc/SanPhamNCKH/typings';
import { buildUpLoadMultiFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm, toISOString } from '@/utils/utils';
import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Col, Descriptions, Form, InputNumber, Popconfirm, Row, Tag, message } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FormRender from './FormRender';
import KetQuaSearch from './KetQuaSearch';
import TableThanhVien from './TableThanhVien';

const FormGiaoNopSanPham = (props: { isView?: boolean; getData: any; isDangThucHien?: boolean }) => {
	const [form] = Form.useForm();
	const { record } = useModel('khoahoc.loaihinhnckh');
	const {
		edit,
		formSubmiting,
		loading,
		setVisibleForm,
		record: recordSanPham,
		putModel,
		putSanPhamSauDuyetModel,
		postModel,
		visibleForm,
		setVisibleKetQuaSearch,
		setCurrent,
		// getByIdModel,
		quyDoiDiem,
		quyDoiGio,
		setLoading,
		isXacNhanHoanThanh,
		xacNhanHoanThanhModel,
		setRecord: setRecordSanPham,
		searchSanPhamModel,
		loadingSearchSanPham,
	} = useModel('khoahoc.sanphamnckh');

	const { record: recordNamHoc } = useModel('khoahoc.danhmuc.namhoc');

	const { createYeuCauQuyDoiGioModel } = useModel('khoahoc.yeucauquydoigio');
	const isAdminKhaiHo = recordSanPham?.nguoiKhaiBao?.hoVaTen?.toLowerCase()?.includes('admin');
	const soLuongThanhVien = Form.useWatch(['soLuongThanhVien'], form);

	const [formValues, setFormValues] = useState<any>({
		...recordSanPham,
		...recordSanPham?.thongTinKhaiBao,
		vaiTro: recordSanPham?.nguoiKhaiBao?.danhSachVaiTro,
		thoiGian: [moment(recordSanPham?.thongTinThoiGian?.start), moment(recordSanPham?.thongTinThoiGian?.end)],
	});
	const dataLocal = localStorage.getItem('sanPham');
	const sanPhamLocal = dataLocal ? JSON.parse(dataLocal) : {};
	const isDeTai = record?.ten?.toLowerCase()?.includes('thực hiện đề tài') ?? false;

	const tinhTrangDeTai = formValues?.tinhTrangCuaDeTai;
	const isDeTaiNghiemThu =
		tinhTrangDeTai &&
		[
			'Đã nghiệm thu và có Quyết định công nhận kết quả đề tài',
			'Đã nghiệm thu và chưa có Quyết định công nhận kết quả đề tài',
		].includes(tinhTrangDeTai);

	const initData = (paramSanPham: SanPhamNCKH.IRecord) => {
		const buildRecSanPham: any = {};
		paramSanPham?.thongTinKhaiBao?.map((item) => {
			buildRecSanPham[item.ma] = item.value;
		});

		const initValueForm = {
			...paramSanPham,
			...buildRecSanPham,
			vaiTro: paramSanPham?.nguoiKhaiBao?.danhSachVaiTro,
			thoiGian: [moment(paramSanPham?.thongTinThoiGian?.start), moment(paramSanPham?.thongTinThoiGian?.end)],
		};
		form.setFieldsValue(initValueForm);
		setFormValues(initValueForm);

		const gio: any = {};
		const diem: any = {};
		quyDoiDiem?.[recordNamHoc?._id ?? '']?.map((item) => {
			if (item.ssoId) diem[item.ssoId] = item.tongGio;
		});
		quyDoiGio?.[recordNamHoc?._id ?? '']?.map((item) => {
			if (item.ssoId) gio[item.ssoId] = item.tongGio;
		});

		form.setFieldsValue({
			diem,
			gio,
		});
	};

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (recordSanPham?._id) {
			initData(recordSanPham);
		}
	}, [recordSanPham?._id, visibleForm]);

	const getData = async () => {
		if (props?.getData) props.getData();
		// getByIdModel(recordSanPham?._id ?? '');
		if (record?.tinhTheoTungNam) {
			setCurrent(1);
		}
	};

	const isChinhSuaSauDuyet =
		recordSanPham?.trangThaiSanPham === ETrangThaiSanPham.DUYET &&
		record?.cauHinhChinhSuaSauDuyet.choPhepChinhSuaSauDuyet;

	const handleFinish = async () => {
		try {
			const formValuesFinal = form.getFieldsValue() || {};
			const danhSachKetQuaTinhGioThanhVien: SanPhamNCKH.KetQuaTinhGioThanhVien[] = [];
			const danhSachKetQuaTinhDiemThanhVien: SanPhamNCKH.KetQuaTinhGioThanhVien[] = [];
			recordSanPham?.danhSachThanhVien?.map((item) => {
				if (item?.ssoId) {
					danhSachKetQuaTinhGioThanhVien.push({
						ssoId: item?.ssoId,
						tongGio: formValuesFinal?.gio?.[item?.ssoId ?? ''] ? +formValuesFinal?.gio?.[item?.ssoId] : 0,
					});
					danhSachKetQuaTinhDiemThanhVien.push({
						ssoId: item?.ssoId,
						tongGio: formValuesFinal?.diem?.[item?.ssoId ?? ''] ? +formValuesFinal?.diem?.[item?.ssoId] : 0,
					});
				}
			});

			if (!props.isDangThucHien && record?.tinhDiem && formValuesFinal?.diem) {
				const tongDiem = danhSachKetQuaTinhDiemThanhVien?.reduce((pre, cur) => {
					return pre + cur.tongGio;
				}, 0);

				if (tongDiem > 5) {
					message.error('Tối đa 5 điểm cho một sản phẩm, vui lòng kiểm tra lại số điểm của các thành viên');
					return;
				}
			}

			setLoading(true);
			try {
				for (const item in formValuesFinal) {
					const value = formValuesFinal[item];
					if (value?.fileList?.length) {
						formValuesFinal[item] = await buildUpLoadMultiFile(formValuesFinal, item);
					}
				}
			} catch (err) {
				setLoading(false);
				message.error('Có lỗi trong quá trình uploadFile, vui lòng kiểm tra lại file');
				return;
			}

			const arrKey = Object.keys(formValuesFinal);

			const thongTinKhaiBao: any[] =
				record?.cauHinhLoaiHinh
					?.map((item) => ({
						ma: item?.ma,
						value: [EKieuDuLieu.TABLE, EKieuDuLieu.DANHSACH].includes(item?.kieuDuLieu)
							? recordSanPham?.thongTinKhaiBao?.find((ele) => ele?.ma === item?.ma)?.value
							: arrKey.includes(item.ma)
							? formValuesFinal?.[item?.ma ?? '']
							: recordSanPham?.thongTinKhaiBao?.find((ele) => ele?.ma === item?.ma)?.value,
					}))
					?.filter((item) => item?.value !== null && item?.value !== undefined) ?? [];
			let trangThaiSanPham = recordSanPham?.trangThaiSanPham;
			if (props.isDangThucHien && !recordSanPham?.trangThaiSanPham) {
				trangThaiSanPham = ETrangThaiSanPham.DANG_THUC_HIEN;
			}
			const payload = {
				...recordSanPham,
				trangThaiSanPham,
				dotId: recordNamHoc?._id,
				vaiTro: formValuesFinal?.vaiTro,
				thongTinKhaiBao: isChinhSuaSauDuyet
					? thongTinKhaiBao.filter((item) => record.cauHinhChinhSuaSauDuyet.allowedFieldList.includes(item.ma))
					: thongTinKhaiBao,
				soLuongThanhVien: formValuesFinal?.soLuongThanhVien ?? 1,
				danhSachMinhChung:
					isChinhSuaSauDuyet || props.isDangThucHien
						? recordSanPham?.danhSachMinhChung ?? []
						: formValuesFinal?.danhSachMinhChung ?? [],
				loaiHinhNckhId: record?._id ?? '',
				danhSachKetQuaQuyDoiDiem: _.uniqBy(
					recordSanPham?.danhSachKetQuaQuyDoiDiem?.sort(
						(a, b) => b?.danhSachKetQuaTinhGioThanhVien?.length - a?.danhSachKetQuaTinhGioThanhVien?.length,
					) ?? [],
					'namHocId',
				),
				danhSachKetQuaQuyDoiGio: _.uniqBy(
					recordSanPham?.danhSachKetQuaQuyDoiGio?.sort(
						(a, b) => b?.danhSachKetQuaTinhGioThanhVien?.length - a?.danhSachKetQuaTinhGioThanhVien?.length,
					) ?? [],
					'namHocId',
				),
				danhSachYeuCauQuyDoiDiem: _.uniqBy(recordSanPham?.danhSachYeuCauQuyDoiDiem ?? [], 'namHocId'),
				danhSachYeuCauQuyDoiGio: _.uniqBy(recordSanPham?.danhSachYeuCauQuyDoiGio ?? [], 'namHocId'),
				thongTinThoiGian: {
					loaiThoiGianThucHien: record?.loaiThoiGianThucHien,
					timeline: toISOString(formValuesFinal?.thongTinThoiGian?.timeline),
					start: toISOString(formValuesFinal?.thoiGian?.[0]),
					end: toISOString(formValuesFinal?.thoiGian?.[1]),
				},
			} as SanPhamNCKH.IRecord;
			let res;

			localStorage.setItem('sanPham', JSON.stringify(payload));
			if (edit && recordSanPham) {
				if (isChinhSuaSauDuyet) await putSanPhamSauDuyetModel(recordSanPham._id, payload, undefined, true);
				else {
					if (isXacNhanHoanThanh) {
						await xacNhanHoanThanhModel(recordSanPham._id, payload, undefined);
					} else await putModel(recordSanPham?._id, payload, undefined, true);
				}
			} else {
				res = await postModel(payload, () => {});
			}

			if (!props.isDangThucHien && ((edit && !isChinhSuaSauDuyet) || (!edit && res?._id) || isXacNhanHoanThanh)) {
				await createYeuCauQuyDoiGioModel(
					edit ? recordSanPham?._id ?? '' : res?._id ?? '',
					{
						namHocId: recordNamHoc?._id || recordSanPham?.dotId || '',
						danhSachKetQuaTinhGioThanhVien,
					},
					() => {},
					'GIO',
				);
				if (record?.tinhDiem && formValuesFinal?.diem) {
					await createYeuCauQuyDoiGioModel(
						edit ? recordSanPham?._id ?? '' : res?._id ?? '',
						{
							namHocId: recordNamHoc?._id || recordSanPham?.dotId || '',
							danhSachKetQuaTinhGioThanhVien: danhSachKetQuaTinhDiemThanhVien,
						},
						() => {},
						'DIEM',
					);
				}
			}
			getData();
			setVisibleKetQuaSearch(false);
		} catch (err) {
			setLoading(false);
		}
	};

	const initFromLocal = () => {
		form.setFieldsValue({ ...sanPhamLocal, ...sanPhamLocal });
		setRecordSanPham({ ...recordSanPham, ...sanPhamLocal });
		initData({ ...sanPhamLocal, ...sanPhamLocal });
	};

	return (
		// <Card title={`${!edit ? 'Thêm mới' : 'Chỉnh sửa'} ${record?.ten}`}>
		<Form
			scrollToFirstError
			labelCol={{ span: 24 }}
			form={form}
			onValuesChange={(changedValues, values) => {
				setFormValues(values);
			}}
			onFinish={async (values) => {
				if (!record) return;
				if (formValues?.soLuongThanhVien !== recordSanPham?.danhSachThanhVien?.length) {
					message.error('Vui lòng khai báo danh sách thành viên đúng với số lượng thành viên');
					return;
				}
				// if (!recordSanPham?.danhSachThanhVien?.find((item) => item.ssoId === initialState?.currentUser?.ssoId)?.ssoId) {
				// 	message.error(
				// 		'Cán bộ/giảng viên chưa có mặt trong danh sách thành viên, vui lòng kiểm tra lại danh sách thành viên',
				// 	);
				// 	return;
				// }
				let isTrung = false;
				if (record?.searchKey1 && values?.[record.searchKey1]) {
					isTrung = await searchSanPhamModel(values?.[record.searchKey1], recordSanPham?._id ?? '', record);
				}
				if (isTrung) return;
				handleFinish();
			}}
		>
			{!props.isDangThucHien && (
				<Descriptions column={{ xs: 3, sm: 3, md: 3, lg: 6, xl: 6, xxl: 6 }}>
					<Descriptions.Item span={3} label='Hướng dẫn'>
						<div>
							<div>
								Anh chị xem hướng dẫn tính điểm khoa học{' '}
								<a
									target='_blank'
									href='https://docs.google.com/document/d/1VVTBPYiIR_SyrehsRSTE2JdpiH6ce-uq/edit?usp=sharing&ouid=102830923442272648882&rtpof=true&sd=true'
									rel='noreferrer'
								>
									tại đây
								</a>
							</div>
							<div>
								Anh chị xem hướng dẫn thu thập minh chứng và hướng dẫn scan{' '}
								<a
									target='_blank'
									href='https://docs.google.com/document/d/1b3rpMR5D2GHDfs2Ny4SgT5J77ZznAxNW/edit?usp=sharing&ouid=110575303556275056947&rtpof=true&sd=true'
									rel='noreferrer'
								>
									tại đây
								</a>
							</div>
						</div>
					</Descriptions.Item>
				</Descriptions>
			)}

			{sanPhamLocal && sanPhamLocal?.loaiHinhNckhId === record?._id && (
				<Descriptions column={{ xs: 3, sm: 3, md: 3, lg: 6, xl: 6, xxl: 6 }}>
					<Descriptions.Item span={3} label='Dữ liệu lần gần nhất'>
						<div>
							<div>
								<Popconfirm
									onConfirm={() => {
										initFromLocal();
									}}
									title={
										<div style={{ width: 200 }}>
											Tất cả thông tin bạn vừa nhập sẽ bị ghi đè bằng dữ liệu đã lưu lần gần nhất, bạn có chắc chắn muốn
											lấy lại dữ liệu gần nhất?
										</div>
									}
								>
									<span>{sanPhamLocal?.searchKey1 ?? ''}</span>
									<a style={{ marginRight: 24 }} type='link'>
										Lấy lại dữ liệu gần nhất
									</a>
								</Popconfirm>
							</div>
						</div>
					</Descriptions.Item>
				</Descriptions>
			)}

			{recordSanPham?._id && (
				<Descriptions column={{ xs: 3, sm: 3, md: 3, lg: 6, xl: 6, xxl: 6 }}>
					<Descriptions.Item span={3} label='Trạng thái'>
						{recordSanPham?.trangThaiSanPham && (
							<Tag color={MapKeyColorTrangThaiSanPham[recordSanPham?.trangThaiSanPham]}>
								{MapKeyTextTrangThaiSanPham[recordSanPham?.trangThaiSanPham]}
							</Tag>
						)}
					</Descriptions.Item>
					<Descriptions.Item span={3} label='Ghi chú tiếp nhận'>
						{recordSanPham?.ghiChuTiepNhan ?? 'Không có ghi chú'}
					</Descriptions.Item>
					<Descriptions.Item span={3} label='Thông tin chung'>
						{''}
					</Descriptions.Item>
				</Descriptions>
			)}
			<Row gutter={[12, 0]}>
				{/* {!record?.danhSachCauHinhTruongThongTinTinh?.find(
					(item) => item.loaiTruongThongTinTinh === ELoaiTruongThongTinTinh.VAI_TRO,
				)?.maTruongThongTinDungSau && (
					<Col xs={24} sm={24} md={12}>
						<Form.Item
							extra={
								<div>
									Cán bộ/giảng viên có thể tự nhập vai trò nếu vai trò không thuộc các giá trị có sẵn mà hệ thống đưa ra
								</div>
							}
							name='vaiTro'
							label='Vai trò'
							rules={[...rules.required]}
						>
							<Select
								options={record?.danhSachVaiTroThanhVienKhaDung?.map((item) => ({ label: item, value: item }))}
								mode='multiple'
								placeholder='Vai trò'
							/>
						</Form.Item>
					</Col>
				)} */}
				{!record?.danhSachCauHinhTruongThongTinTinh?.find(
					(item) =>
						item.loaiTruongThongTinTinh === ELoaiTruongThongTinTinh.THOI_GIAN_BAT_DAU ||
						item.loaiTruongThongTinTinh === ELoaiTruongThongTinTinh.THOI_GIAN_KET_THUC,
				)?.maTruongThongTinDungSau &&
					record &&
					[ELoaiThoiGianThucHien.NAM, ELoaiThoiGianThucHien.NGAYTHANGNAM, ELoaiThoiGianThucHien.THANGNAM].includes(
						record?.loaiThoiGianThucHien,
					) && (
						<Col xs={24} sm={24} md={24}>
							<Form.Item
								name='thoiGian'
								label={`${record.startLabel} - ${record.endLabel}`}
								rules={[...rules.required]}
							>
								<MyDateRangePicker
									disabled={isAdminKhaiHo ? false : isChinhSuaSauDuyet}
									format={
										record.loaiThoiGianThucHien === ELoaiThoiGianThucHien.NAM
											? 'YYYY'
											: record.loaiThoiGianThucHien === ELoaiThoiGianThucHien.THANGNAM
											? 'MM/YYYY'
											: 'DD/MM/YYYY'
									}
									placeholder={['Từ', 'đến']}
									picker={
										record.loaiThoiGianThucHien === ELoaiThoiGianThucHien.NAM
											? 'year'
											: record.loaiThoiGianThucHien === ELoaiThoiGianThucHien.THANGNAM
											? 'month'
											: 'date'
									}
								/>
							</Form.Item>
						</Col>
					)}
				{!record?.danhSachCauHinhTruongThongTinTinh?.find(
					(item) => item.loaiTruongThongTinTinh === ELoaiTruongThongTinTinh.MOC_THOI_GIAN,
				)?.maTruongThongTinDungSau &&
					record &&
					[
						ELoaiThoiGianThucHien.THOIGIANCUTHE_DDMMYYYY,
						ELoaiThoiGianThucHien.THOIGIANCUTHE_MMYYYY,
						ELoaiThoiGianThucHien.THOIGIANCUTHE_YYYY,
					].includes(record?.loaiThoiGianThucHien) && (
						<Col xs={24} sm={24} md={24}>
							<Form.Item
								name={['thongTinThoiGian', 'timeline']}
								label={record.timelineLabel}
								rules={[...rules.required]}
							>
								<MyDatePicker
									disabled={isAdminKhaiHo ? false : isChinhSuaSauDuyet}
									format={
										record.loaiThoiGianThucHien === ELoaiThoiGianThucHien.THOIGIANCUTHE_YYYY
											? 'YYYY'
											: record.loaiThoiGianThucHien === ELoaiThoiGianThucHien.THOIGIANCUTHE_MMYYYY
											? 'MM/YYYY'
											: 'DD/MM/YYYY'
									}
									pickerStyle={
										record.loaiThoiGianThucHien === ELoaiThoiGianThucHien.THOIGIANCUTHE_YYYY
											? 'year'
											: record.loaiThoiGianThucHien === ELoaiThoiGianThucHien.THOIGIANCUTHE_MMYYYY
											? 'month'
											: 'date'
									}
									placeholder={'Chọn thời gian'}
								/>
							</Form.Item>
						</Col>
					)}
				{record?.cauHinhLoaiHinh
					?.filter((item) => {
						if (!item.cheDoHienThi) return item;
						if (props.isDangThucHien)
							return [ECheDoHienThi.THUC_HIEN, ECheDoHienThi.TAT_CA].includes(item.cheDoHienThi);
						else return [ECheDoHienThi.SAN_PHAM, ECheDoHienThi.TAT_CA].includes(item.cheDoHienThi);
					})
					?.map((item) => (
						<FormRender
							isDangThucHien={props.isDangThucHien}
							disable={
								isAdminKhaiHo
									? false
									: isChinhSuaSauDuyet && !record.cauHinhChinhSuaSauDuyet.allowedFieldList.includes(item.ma)
							}
							form={form}
							formValues={formValues}
							key={item.ma}
							cauHinh={item}
						/>
					))}
				{!record?.danhSachCauHinhTruongThongTinTinh?.find(
					(item) => item.loaiTruongThongTinTinh === ELoaiTruongThongTinTinh.DANH_SACH_THANH_VIEN,
				)?.maTruongThongTinDungSau && (
					<>
						<Col xs={24} sm={24} md={24}>
							<Form.Item name='soLuongThanhVien' label='Số lượng thành viên' rules={[...rules.required]}>
								<InputNumber
									// disabled={isChinhSuaSauDuyet}
									addonAfter='Thành viên'
									style={{ width: '100%' }}
									min={1}
									max={100}
									placeholder='Số lượng thành viên'
								/>
							</Form.Item>
						</Col>

						<Col span={24}>
							<div className='ant-descriptions-title' style={{ marginBottom: 12 }}>
								{props.isDangThucHien
									? 'Chủ biên và thành viên'
									: record?.danhSachCauHinhTruongThongTinTinh?.find(
											(item) => item.loaiTruongThongTinTinh === ELoaiTruongThongTinTinh.DANH_SACH_THANH_VIEN,
									  )?.label ?? 'Danh sách thành viên'}
							</div>
							<TableThanhVien
								isDangThucHien={props.isDangThucHien}
								form={form}
								formValues={formValues}
								mode={isChinhSuaSauDuyet ? 'view' : 'edit'}
							/>
						</Col>
						{!props.isDangThucHien &&
							soLuongThanhVien &&
							soLuongThanhVien > 1 &&
							record?.danhSachCauHinhTruongThongTinTinh?.find(
								(item) => item.loaiTruongThongTinTinh === ELoaiTruongThongTinTinh.MINH_CHUNG_CHIA_GIO,
							)?.display !== false &&
							!isChinhSuaSauDuyet && (
								<Col xs={24} sm={24} md={24}>
									<Form.Item
										name='danhSachMinhChung'
										label={record?.tinhDiem ? 'Minh chứng chia giờ, điểm' : 'Minh chứng chia giờ'}
										rules={
											!isAdminKhaiHo && (!isDeTai || (isDeTai && isDeTaiNghiemThu)) ? [...rules.required] : undefined
										}
									>
										<UploadFile
											// disabled={isChinhSuaSauDuyet}
											maxCount={5}
											otherProps={{
												accept: '.docx, .pdf, .xlsx, .xls, .png, .jpeg, .jpg',
												showUploadList: { showDownloadIcon: false },
											}}
										/>
									</Form.Item>
								</Col>
							)}
					</>
				)}
			</Row>

			{!props.isView && (
				<div className='form-footer'>
					<Button
						icon={<SaveOutlined />}
						loading={formSubmiting || loading || loadingSearchSanPham}
						htmlType='submit'
						type='primary'
					>
						{'Lưu lại'}
					</Button>
					<Button icon={<CloseOutlined />} onClick={() => setVisibleForm(false)}>
						Hủy
					</Button>
				</div>
			)}
			<KetQuaSearch handleSubmit={handleFinish} />
		</Form>
		// </Card>
	);
};

export default FormGiaoNopSanPham;
