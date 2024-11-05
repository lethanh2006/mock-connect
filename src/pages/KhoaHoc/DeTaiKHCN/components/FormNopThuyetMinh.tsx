import MyDatePicker from '@/components/MyDatePicker';
import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';
import UploadFile from '@/components/Upload/UploadFile';

import {
	EDangSanPham,
	ELoaiDeTaiCaNhan,
	EMenhGia,
	EPhaseDeTaiKHCN,
	ETrangThaiNopDeCuong,
	ETrangThaiXetDuyetDeCuong,
} from '@/services/KhoaHoc/DeTaiKHCN/constants';

import SelectSinhVienDebounce from '@/pages/SinhVien/components/Select';
import SelectDonVi from '@/pages/ToChucNhanSu/DonVi/Select';
import SelectNhanSuDebounce from '@/pages/ToChucNhanSu/NhanSu/Select';
import { primaryColor } from '@/services/base/constant';
import { buildUpLoadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import TableSanPham from './TableSanPham';
import TableThanhVien from './TableThanhVien';
import TableTimeline from './TableTimeline';

const FormNopThuyetMinh = (props: { getData: any }) => {
	const [form] = Form.useForm();
	const {
		record,
		setVisibleForm,
		edit,
		formSubmiting,
		visibleForm,
		setLoading,
		loading,
		giangVienPutMyDeTaiPhaseXetDuyetOrDeCuongOrNghiemThuModel,
	} = useModel('khoahoc.detaikhcn');

	const { danhSach, getModel } = useModel('sinhvien.sinhvien');
	const { danhSach: danhSachDonVi } = useModel('tochucnhansu.donvi');
	const { danhSach: danhSachCanBo, getModel: getModelCanBo } = useModel('tochucnhansu.nhansu');
	const [menhGia, setMenhGia] = useState(record?.dangKyKhcn?.kinhPhi?.menhGia ?? EMenhGia.VND);
	const isDeTaiTapThe = record?.dangKyKhcn?.loaiCaNhan === ELoaiDeTaiCaNhan.TAP_THE;
	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) {
			const rec = {
				...record?.dangKyKhcn,
				...record?.deCuongKhcn,
				chuTriDeTai: {
					...record?.dangKyKhcn?.chuTriDeTai,
				},
				thoiGianDuKienThucHien: [record.dangKyKhcn.thoiGianThucHienBatDau, record.dangKyKhcn.thoiGianThucHienKetThuc],
			};

			form.setFieldsValue(rec);
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		try {
			if (!record) return;
			setLoading(true);
			const deCuongUrl = await buildUpLoadFile(values, 'deCuongUrl');
			const banGiaiTrinhUrl = await buildUpLoadFile(values, 'banGiaiTrinhUrl');
			let recSinhVien = danhSach.find((item) => item.ssoId === values?.chuTriDeTai?.userId);
			const recDonVi = danhSachDonVi?.find((item) => item.maDonVi === values?.chuTriDeTai?.maDonVi);
			if (!recSinhVien?.ssoId) {
				const res = await getModel(
					{ ssoId: values?.chuTriDeTai?.userId },
					undefined,
					undefined,
					undefined,
					undefined,
					'sinh-vien/pageable',
				);
				recSinhVien = res?.[0] ?? {};
			}
			let recCanBo = danhSachCanBo.find((item) => item.ssoId === values?.nguoiHuongDan?.userId);
			if (!recCanBo?.ssoId) {
				const res = await getModelCanBo(
					{ ssoId: values?.chuTriDeTai?.userId },
					undefined,
					undefined,
					undefined,
					undefined,
					'sinh-vien/page',
				);
				recCanBo = res?.[0] ?? {};
			}
			const payload = {
				deCuongKhcn: {
					...record?.deCuongKhcn,
					...values,
					danhSachCTV: record?.dangKyKhcn?.danhSachCTV ?? [],
					deCuongUrl,
					banGiaiTrinhUrl,
					kinhPhi: {
						...values?.kinhPhi,
						menhGia,
					},
					donViChuTri: 'Học viện Phụ nữ Việt Nam',
					chuTriDeTai: {
						...values?.chuTriDeTai,
						ten: recSinhVien
							? recSinhVien?.ten || `${recSinhVien?.lastName} ${recSinhVien?.firstName}`
							: record?.dangKyKhcn?.chuTriDeTai?.ten,
						maDinhDanh: recSinhVien?.ma,
						tenDonVi: recDonVi?.ten || '',
					},
					nguoiHuongDan: values?.nguoiHuongDan?.userId
						? {
								...values?.nguoiHuongDan,
								ten: recCanBo ? `${recCanBo?.hoDem} ${recCanBo?.ten}` : record?.dangKyKhcn?.nguoiHuongDan?.ten,
								maDinhDanh: recCanBo?.maCanBo,
								maDonVi: recCanBo?.donViChinh?.maDonVi,
								tenDonVi: recCanBo?.donViChinh?.ten,
								hocHam: recCanBo?.hocHam || record?.dangKyKhcn?.nguoiHuongDan?.hocHam,
								hocVi: recCanBo?.hocVi || record?.dangKyKhcn?.nguoiHuongDan?.hocVi,
						  }
						: null,
					thoiGianThucHienBatDau: values?.thoiGianDuKienThucHien?.[0],
					thoiGianThucHienKetThuc: values?.thoiGianDuKienThucHien?.[1],
					sanPhamDeCuong: [
						...(record?.deCuongKhcn?.sanPhamDeCuongDangI ?? []),
						...(record?.deCuongKhcn?.sanPhamDeCuongDangII ?? []),
						...(record?.deCuongKhcn?.sanPhamDeCuongDangIII ?? []),
					],
					sanPhamDeCuongDangI: undefined,
					sanPhamDeCuongDangII: undefined,
					sanPhamDeCuongDangIII: undefined,
				},
			};
			giangVienPutMyDeTaiPhaseXetDuyetOrDeCuongOrNghiemThuModel(record?._id, payload, 'de-cuong', props.getData)
				.then(() => {})
				.catch((er) => {
					setLoading(false);
					console.log(er);
				});
		} catch (err) {
			setLoading(false);
		}
	};

	return (
		<Card title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + 'đề cương'}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				{record?.phaseDeTaiKhcn === EPhaseDeTaiKHCN.NOP_DE_CUONG &&
					record?.trangThaiNopDeCuong !== ETrangThaiNopDeCuong.CHUA_TIEP_NHAN && (
						<div>
							<b>Ghi chú của phòng QLKH:</b>
							<span style={{ color: primaryColor }}> {record?.commentNopDeCuong}</span>
						</div>
					)}
				{record?.phaseDeTaiKhcn === EPhaseDeTaiKHCN.XET_DUYET_DE_CUONG &&
					record?.trangThaiXetDuyetDeCuong !== ETrangThaiXetDuyetDeCuong.CHUA_DUYET && (
						<div>
							<b>Kết luận của Hội đồng:</b>
							<span style={{ color: primaryColor }}> {record?.deCuongKhcn?.comment}</span>
						</div>
					)}
				<Row gutter={[16, 0]}>
					<Col xs={24}>
						<Form.Item name='ten' label='Tên đề tài' rules={[...rules.required, ...rules.text]}>
							<Input.TextArea placeholder='Tên đề tài' />
						</Form.Item>
					</Col>

					<Col xs={24} lg={12}>
						<Form.Item
							name={['chuTriDeTai', 'userId']}
							label='Sinh viên chịu trách nhiệm thực hiện chính'
							rules={[...rules.required]}
						>
							<SelectSinhVienDebounce
								onChange={(val) => {
									const recSinhVien = danhSach.find((item) => item.ssoId === val);
									form.setFieldsValue({
										chuTriDeTai: {
											ngaySinh: recSinhVien?.ngaySinh || record?.dangKyKhcn?.chuTriDeTai?.ngaySinh,
											maDonVi: recSinhVien?.nganh?.maDonVi || record?.dangKyKhcn?.chuTriDeTai?.maDonVi,
											noiSinh: recSinhVien?.tinhTpNoiSinh || record?.dangKyKhcn?.chuTriDeTai?.noiSinh,
											maDinhDanh: recSinhVien?.ma || record?.dangKyKhcn?.chuTriDeTai?.maDinhDanh,
											tenLopHanhChinh:
												recSinhVien?.lopHanhChinhList?.[0]?.ten || record?.dangKyKhcn?.chuTriDeTai?.tenLopHanhChinh,
											diaChi:
												[
													recSinhVien?.hoKhauThuongTru?.diaChi,
													recSinhVien?.hoKhauThuongTru?.tenXaPhuong,
													recSinhVien?.hoKhauThuongTru?.tenQH,
													recSinhVien?.hoKhauThuongTru?.tenTP,
												]
													?.filter((item) => item)
													?.join(', ')
													?.trim() || record?.dangKyKhcn?.chuTriDeTai?.diaChi,
											soDienThoai: recSinhVien?.soDienThoai || record?.dangKyKhcn?.chuTriDeTai?.soDienThoai,
											email: recSinhVien?.email || record?.dangKyKhcn?.chuTriDeTai?.email,
											cccd: recSinhVien?.cccd || record?.dangKyKhcn?.chuTriDeTai?.cccd,
											soTaiKhoanNganHang:
												recSinhVien?.soTaiKhoanNganHang || record?.dangKyKhcn?.chuTriDeTai?.soTaiKhoanNganHang,
										},
									});
								}}
							/>
						</Form.Item>
					</Col>

					<Col xs={24} lg={12}>
						<Form.Item name={['chuTriDeTai', 'ngaySinh']} label='Ngày sinh' rules={[...rules.required]}>
							<MyDatePicker format={'DD/MM/YYYY'} placeholder='Ngày sinh' />
						</Form.Item>
					</Col>
					<Col xs={24} lg={12}>
						<Form.Item name={['chuTriDeTai', 'noiSinh']} label='Nơi sinh' rules={[...rules.required]}>
							<Input placeholder='Nơi sinh' />
						</Form.Item>
					</Col>
					<Col xs={24} lg={12}>
						<Form.Item name={['chuTriDeTai', 'maDinhDanh']} label='Mã sinh viên' rules={[...rules.required]}>
							<Input placeholder='Mã sinh viên' />
						</Form.Item>
					</Col>
					<Col xs={24} lg={12}>
						<Form.Item name={['chuTriDeTai', 'tenLopHanhChinh']} label='Lớp' rules={[...rules.required]}>
							<Input placeholder='Lớp' />
						</Form.Item>
					</Col>
					<Col xs={24} lg={12}>
						<Form.Item name={['chuTriDeTai', 'maDonVi']} label='Khoa' rules={[...rules.required]}>
							<SelectDonVi />
						</Form.Item>
					</Col>
					<Col xs={24} lg={12}>
						<Form.Item name={['chuTriDeTai', 'diaChi']} label='Địa chỉ liên hệ' rules={[...rules.required]}>
							<Input placeholder='Địa chỉ liên hệ' />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item
							name={['chuTriDeTai', 'soDienThoai']}
							label='Số điện thoại'
							rules={[...rules.required, ...rules.soDienThoai]}
						>
							<Input placeholder='Số điện thoại' />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name={['chuTriDeTai', 'email']} label='Email' rules={[...rules.required, ...rules.email]}>
							<Input placeholder='Email' />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name={['chuTriDeTai', 'cccd']} label='Số CCCD' rules={[...rules.required, ...rules.CMND]}>
							<Input placeholder='Số CCCD' />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item
							extra={'Sinh viên nhập đầy đủ số tài khoản và tên chi nhánh ngân hàng'}
							name={['chuTriDeTai', 'soTaiKhoanNganHang']}
							label='Số tài khoản ngân hàng'
							rules={[...rules.required, ...rules.text]}
						>
							<Input placeholder='Số tài khoản ngân hàng' />
						</Form.Item>
					</Col>
					<Col xs={24} lg={12}>
						<Form.Item
							name={['nguoiHuongDan', 'userId']}
							label='Người hướng dẫn'
							// rules={[...rules.required]}
						>
							<SelectNhanSuDebounce />
						</Form.Item>
					</Col>
					{/* <Col xs={24} md={24}>
						<Form.Item name={'maDonViChuTri'} label='Cơ quan chủ trì đề tài' rules={[...rules.required, ...rules.text]}>
							<SelectDonVi />
						</Form.Item>
					</Col> */}
					{isDeTaiTapThe && (
						<Col span={24}>
							<div>Thành viên đề tài:</div>
							<TableThanhVien
								type='DeTai'
								fieldName='danhSachCTV'
								mode='edit'
								data={record?.dangKyKhcn?.danhSachCTV ?? []}
							/>
						</Col>
					)}
					<Col span={24}>
						<div>Kế hoạch/Phân công thực hiện:</div>
						<TableTimeline mode='edit' data={record?.deCuongKhcn?.timeline ?? []} />
						<br />
					</Col>
					{/* <Col span={24}>
						<div>
							Sản phẩm chính của đề tài (Dạng I){' '}
							<i>
								Mẫu (model, maket); Sản phẩm (là hàng hoá, có thể được tiêu thụ trên thị trường); Vật liệu; Thiết bị,
								máy móc; Dây chuyền công nghệ và các loại khác
							</i>
						</div>
						<TableSanPham
							phase='deCuongKhcn'
							type={EDangSanPham.DANG_SAN_PHAM_I}
							mode='edit'
							data={record?.deCuongKhcn?.sanPhamDeCuongDangI ?? []}
						/>
						<br />
					</Col> */}
					{/* <Col span={24}>
						<div>
							Sản phẩm chính của đề tài (Dạng II){' '}
							<i>
								Nguyên lý ứng dụng; Phương pháp; Tiêu chuẩn; Quy phạm; Phần mềm máy tính; Bản vẽ thiết kế; Quy trình
								công nghệ; Sơ đồ, bản đồ; Số liệu, Cơ sở dữ liệu; Báo cáo phân tích; Tài liệu dự báo (phương pháp, quy
								trình, mô hình,...); Đề án, qui hoạch; Luận chứng kinh tế-kỹ thuật, Báo cáo nghiên cứu khả thi và các
								sản phẩm khác
							</i>
						</div>
						<TableSanPham
							phase='deCuongKhcn'
							type={EDangSanPham.DANG_SAN_PHAM_II}
							mode='edit'
							data={record?.deCuongKhcn?.sanPhamDeCuongDangII ?? []}
						/>
						<br />
					</Col> */}
					<Col span={24}>
						<div>Sản phẩm dự kiến và sản phẩm ứng dụng của đề tài</div>
						<TableSanPham
							phase='deCuongKhcn'
							type={EDangSanPham.DANG_SAN_PHAM_III}
							mode='edit'
							data={record?.deCuongKhcn?.sanPhamDeCuongDangIII ?? []}
						/>
						<br />
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name={['thoiGianDuKienThucHien']} label='Thời gian thực hiện đề tài' rules={[...rules.required]}>
							<MyDateRangePicker picker='month' format={'MM/YYYY'} placeholder={['Từ tháng', 'đến tháng']} />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name={['kinhPhi', 'kinhPhi']} label='Kinh phí thực hiện' rules={[...rules.required]}>
							<InputNumber
								formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
								style={{ width: '100%' }}
								min={0}
								placeholder='Kinh phí'
								addonAfter={
									<Select
										value={menhGia}
										onChange={(val) => setMenhGia(val)}
										style={{ width: 90 }}
										options={Object.values(EMenhGia).map((item) => ({ value: item, label: item }))}
									/>
								}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} sm={12}>
						<Form.Item rules={[...rules.required]} label='Thuyết minh đề tài NCKH' name='deCuongUrl'>
							<UploadFile
								maxCount={1}
								accept='.doc, .docx, .pdf'
								otherProps={{
									multiple: false,
									showUploadList: { showDownloadIcon: false },
								}}
							/>
						</Form.Item>
					</Col>
					{record?.phaseDeTaiKhcn === EPhaseDeTaiKHCN.XET_DUYET_DE_CUONG &&
						record.trangThaiXetDuyetDeCuong === ETrangThaiXetDuyetDeCuong.YEU_CAU_CHINH_SUA && (
							<Col xs={24} sm={12}>
								<Form.Item
									rules={[...rules.required]}
									label='Bản giải trình nội dung chỉnh sửa và bổ sung thuyết minh'
									name='banGiaiTrinhUrl'
								>
									<UploadFile
										maxCount={1}
										accept='.doc, .docx, .pdf'
										otherProps={{
											multiple: false,
											showUploadList: { showDownloadIcon: false },
										}}
									/>
								</Form.Item>
							</Col>
						)}
				</Row>

				<div className='form-footer'>
					<Button loading={loading || formSubmiting} htmlType='submit' type='primary'>
						{!edit ? 'Thêm mới' : 'Lưu lại'}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormNopThuyetMinh;
