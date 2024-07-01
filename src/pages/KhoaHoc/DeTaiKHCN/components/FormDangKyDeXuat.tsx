import MyDatePicker from '@/components/MyDatePicker';
import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';
import TinyEditor from '@/components/TinyEditor';
import UploadFile from '@/components/Upload/UploadFile';
import SelectSinhVienDebounce from '@/pages/SinhVien/components/Select';
import SelectDonVi from '@/pages/ToChucNhanSu/DonVi/Select';
import SelectNhanSuDebounce from '@/pages/ToChucNhanSu/NhanSu/Select';
import {
	ELoaiDeTaiCaNhan,
	EMenhGia,
	EPhaseDeTaiKHCN,
	ETrangThaiDangKy,
	ETrangThaiXetDuyetDangKy,
	ETypeTableDeTai,
} from '@/services/KhoaHoc/DeTaiKHCN/constants';
import { ELoaiDeTai } from '@/services/KhoaHoc/KeHoachDeTai/constants';
import { primaryColor } from '@/services/base/constant';
import { buildUpLoadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import TableThanhVien from './TableThanhVien';

const FormDangKyDeXuat = (props: { getData: any; type: ETypeTableDeTai }) => {
	const [form] = Form.useForm();
	const {
		record,
		setVisibleForm,
		edit,
		postModel,
		putModel,
		formSubmiting,
		visibleForm,
		setLoading,
		loading,
		giangVienPutMyDeTaiPhaseXetDuyetOrDeCuongOrNghiemThuModel,
	} = useModel('khoahoc.detaikhcn');
	const { record: recKeHoach } = useModel('khoahoc.kehoachdetai');
	const { danhSach } = useModel('sinhvien.sinhvien');
	const { danhSach: danhSachDonVi } = useModel('tochucnhansu.donvi');
	const { danhSach: danhSachCanBo } = useModel('tochucnhansu.nhansu');

	const [menhGia, setMenhGia] = useState(record?.dangKyKhcn?.kinhPhi?.menhGia ?? EMenhGia.VND);
	const loaiCaNhan = Form.useWatch('loaiCaNhan', form);
	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) {
			const rec = {
				...record?.dangKyKhcn,
				thoiGianDuKienThucHien: [record.dangKyKhcn.thoiGianThucHienBatDau, record.dangKyKhcn.thoiGianThucHienKetThuc],
			};

			form.setFieldsValue(rec);
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		try {
			setLoading(true);
			const urlPhieuDangKyDeXuat = await buildUpLoadFile(values, 'urlPhieuDangKyDeXuat');
			const recSinhVien = danhSach.find((item) => item.ssoId === values?.chuTriDeTai?.userId);
			const recCanBo = danhSachCanBo.find((item) => item.ssoId === values?.nguoiHuongDan?.userId);
			const recDonVi = danhSachDonVi?.find((item) => item.maDonVi === values?.chuTriDeTai?.maDonVi);
			const dangKyKhcn = {
				...record?.dangKyKhcn,
				...values,
				donViChuTri: danhSachDonVi?.find((item) => item.maDonVi === values?.maDonViChuTri)?.ten,
				urlPhieuDangKyDeXuat,
				kinhPhi: values?.kinhPhi
					? {
							...values?.kinhPhi,
							menhGia,
					  }
					: undefined,
				chuTriDeTai: {
					...values?.chuTriDeTai,
					ten: recSinhVien
						? recSinhVien?.ten || `${recSinhVien?.lastName} ${recSinhVien?.firstName}`
						: record?.dangKyKhcn?.chuTriDeTai?.ten,
					maDinhDanh: recSinhVien?.ma,
					tenDonVi: recDonVi?.ten || '',
				},
				nguoiHuongDan: values?.nguoiHuongDan
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
				loaiDeTai: ELoaiDeTai.SINH_VIEN_HOC_VIEN,
			};
			const payload = {
				...record,
				dangKyKhcn,
				dotDangKyId: recKeHoach?._id,
			};

			if (edit) {
				if (props.type === ETypeTableDeTai.DangKyDeXuat) {
					putModel(
						record?._id ?? '',
						payload,
						props.getData,
						undefined,
						undefined,
						undefined,
						`me/${record?._id}/dang-ky`,
					)
						.then()
						.catch((er) => console.log(er));
				} else {
					giangVienPutMyDeTaiPhaseXetDuyetOrDeCuongOrNghiemThuModel(
						record?._id ?? '',
						{
							dangKyKhcn,
						},
						'xet-duyet',
						props.getData,
					)
						.then()
						.catch((er) => console.log(er));
				}
			} else
				postModel(payload, props.getData, undefined, undefined, 'me')
					.then(() => form.resetFields())
					.catch((er) => {
						setLoading(false);
						console.log(er);
					});
		} catch (err) {
			setLoading(false);
		}
	};

	return (
		<Card title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + 'đăng ký đề xuất'}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				{record?.phaseDeTaiKhcn === EPhaseDeTaiKHCN.DANG_KY &&
					record?.trangThaiDangKy !== ETrangThaiDangKy.CHUA_TIEP_NHAN && (
						<div>
							<b>Ghi chú của phòng QLKH:</b>
							<span style={{ color: primaryColor }}> {record?.dangKyKhcn?.comment}</span>
						</div>
					)}
				{record?.phaseDeTaiKhcn === EPhaseDeTaiKHCN.XET_DUYET_DANG_KY &&
					record?.trangThaiXetDuyetDangKy !== ETrangThaiXetDuyetDangKy.CHUA_DUYET && (
						<div>
							<b>Kết luận của Hội đồng:</b>
							<span style={{ color: primaryColor }}> {record?.xetDuyetKhcn?.commentHoiDong}</span>
						</div>
					)}
				<Row gutter={[16, 0]}>
					<Col xs={24}>
						<Form.Item name='ten' label='Tên đề tài' rules={[...rules.required, ...rules.text]}>
							<Input.TextArea placeholder='Tên đề tài' />
						</Form.Item>
					</Col>
					<Col xs={24} lg={12}>
						<Form.Item name='loaiCaNhan' label='Đề tài cá nhân/tập thể' rules={[...rules.required]}>
							<Select
								placeholder='Chọn loại'
								options={Object.values(ELoaiDeTaiCaNhan).map((item) => ({ value: item, label: item }))}
							/>
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

					<Col xs={24} lg={8}>
						<Form.Item name={['chuTriDeTai', 'ngaySinh']} label='Ngày sinh' rules={[...rules.required]}>
							<MyDatePicker format={'DD/MM/YYYY'} placeholder='Ngày sinh' />
						</Form.Item>
					</Col>
					<Col xs={24} lg={8}>
						<Form.Item name={['chuTriDeTai', 'noiSinh']} label='Nơi sinh' rules={[...rules.required]}>
							<Input placeholder='Nơi sinh' />
						</Form.Item>
					</Col>
					<Col xs={24} lg={8}>
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
					<Col xs={24} md={24}>
						<Form.Item
							extra={'Sinh viên nhập đầy đủ số tài khoản và tên chi nhánh ngân hàng'}
							name={['chuTriDeTai', 'soTaiKhoanNganHang']}
							label='Số tài khoản ngân hàng'
							rules={[...rules.required, ...rules.text]}
						>
							<Input placeholder='Số tài khoản ngân hàng' />
						</Form.Item>
					</Col>
					<Col xs={24} md={24}>
						<Form.Item name={'maDonViChuTri'} label='Cơ quan chủ trì đề tài' rules={[...rules.required, ...rules.text]}>
							<SelectDonVi />
						</Form.Item>
					</Col>
					<Col xs={24} lg={24}>
						<Form.Item
							name={['mucTieuDeTai']}
							label='Mục tiêu thực hiện đề tài NCKH'
							rules={[...rules.required, ...rules.text]}
						>
							<TinyEditor height={300} />
						</Form.Item>
					</Col>
					<Col xs={24} lg={24}>
						<Form.Item
							name={['tinhCanThietVaMoi']}
							label='Tính cấp thiết và tính mới của đề tài NCKH'
							rules={[...rules.required, ...rules.text]}
						>
							<TinyEditor height={300} />
						</Form.Item>
					</Col>
					{/* <Col xs={24} lg={24}>
						<Form.Item
							name={'tomTatDeXuat'}
							label='Tóm tắt các đề xuất, giải pháp'
							rules={[...rules.required, ...rules.text]}
						>
							<TinyEditor height={300} />
						</Form.Item>
					</Col> */}
					{loaiCaNhan === ELoaiDeTaiCaNhan.TAP_THE && (
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
					<Col xs={24} lg={12}>
						<Form.Item
							name={['thoiGianDuKienThucHien']}
							label='Thời gian dự kiến thực hiện đề tài'
							rules={[...rules.required]}
						>
							<MyDateRangePicker picker='month' format={'MM/YYYY'} placeholder={['Từ tháng', 'đến tháng']} />
						</Form.Item>
					</Col>
					<Col xs={24} lg={12}>
						<Form.Item
							name={['nguoiHuongDan', 'userId']}
							label='Đề xuất người hướng dẫn (nếu có)'
							// rules={[...rules.required]}
						>
							<SelectNhanSuDebounce />
						</Form.Item>
					</Col>
					{/* <Col xs={24} lg={12}>
						<Form.Item name={['kinhPhi', 'kinhPhi']} label='Kinh phí đề xuất' rules={[...rules.required]}>
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
					</Col> */}
					<Col xs={24} sm={12}>
						<Form.Item rules={[...rules.required]} label='Phiếu đăng ký đề xuất đề tài' name='urlPhieuDangKyDeXuat'>
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

export default FormDangKyDeXuat;
