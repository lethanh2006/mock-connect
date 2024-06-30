import MyDatePicker from '@/components/MyDatePicker';
import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';
import UploadFile from '@/components/Upload/UploadFile';

import {
	EDangSanPham,
	ELinhVucDeTai,
	EMenhGia,
	EPhaseDeTaiKHCN,
	ETrangThaiNopDeCuong,
	ETrangThaiXetDuyetDeCuong,
} from '@/services/KhoaHoc/DeTaiKHCN/constants';

import SelectSinhVienDebounce from '@/pages/SinhVien/components/Select';
import SelectDonVi from '@/pages/ToChucNhanSu/DonVi/Select';
import { primaryColor } from '@/services/base/constant';
import { buildUpLoadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { AutoComplete, Button, Card, Col, Form, Input, InputNumber, Row, Select } from 'antd';
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

	const { danhSachAllSinhVien } = useModel('sinhvien.sinhvien');

	const [menhGia, setMenhGia] = useState(record?.dangKyKhcn?.kinhPhi?.menhGia ?? EMenhGia.VND);

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id) {
			const recChuTri = danhSachAllSinhVien?.find((item) => item.ssoId === record?.dangKyKhcn?.chuTriDeTai?.userId);
			const rec = {
				...record?.dangKyKhcn,
				...record?.deCuongKhcn,
				chuTriDeTai: {
					...record?.dangKyKhcn?.chuTriDeTai,
					email: record?.dangKyKhcn?.chuTriDeTai?.email || recChuTri?.email,
					soDienThoai: record?.dangKyKhcn?.chuTriDeTai?.soDienThoai || recChuTri?.sdtCaNhan,
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
			const recSinhVien = danhSachAllSinhVien.find((item) => item.ssoId === values?.chuTriDeTai?.userId);
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
					chuTriDeTai: {
						...values?.chuTriDeTai,
						ten: recSinhVien ? `${recSinhVien?.hoDem} ${recSinhVien?.ten}` : record?.dangKyKhcn?.chuTriDeTai?.ten,
						maDinhDanh: recSinhVien?.maCanBo,
						maDonVi: recSinhVien?.donViChinh?.maDonVi,
						tenDonVi: recSinhVien?.donViChinh?.ten,
					},
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
		<Card title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + 'thuyết minh'}>
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

					<Col xs={24} md={12}>
						<Form.Item
							name={['chuTriDeTai', 'userId']}
							label='Sinh viên chịu trách nhiệm thực hiện chính'
							rules={[...rules.required]}
						>
							<SelectSinhVienDebounce
								onChange={(val) => {
									const recChuTri = danhSachAllSinhVien.find((item) => item.ssoId === val);
									form.setFieldsValue({
										chuTriDeTai: {
											hocHam: recChuTri?.hocHam || record?.dangKyKhcn?.chuTriDeTai?.hocHam,
											hocVi: recChuTri?.hocVi || record?.dangKyKhcn?.chuTriDeTai?.hocVi,
											ngaySinh: recChuTri?.ngaySinh || record?.dangKyKhcn?.chuTriDeTai?.ngaySinh,
											idDonVi: recChuTri?.donViChinhId || record?.dangKyKhcn?.chuTriDeTai?.idDonVi,
											email: recChuTri?.email || record?.dangKyKhcn?.chuTriDeTai?.email,
											soDienThoai: recChuTri?.sdtCaNhan || record?.dangKyKhcn?.chuTriDeTai?.soDienThoai,
										},
									});
								}}
							/>
						</Form.Item>
					</Col>

					<Col xs={24} md={12}>
						<Form.Item
							name={['chuTriDeTai', 'chuyenNganhDaoTaoCaoNhat']}
							label='Chuyên ngành đào tạo cao nhất'
							rules={[...rules.required]}
						>
							<Input placeholder='Chuyên ngành' />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name={['chuTriDeTai', 'ngaySinh']} label='Ngày sinh' rules={[...rules.required]}>
							<MyDatePicker format={'DD/MM/YYYY'} placeholder='Ngày sinh' />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name={['chuTriDeTai', 'idDonVi']} label='Đơn vị công tác' rules={[...rules.required]}>
							<SelectDonVi />
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
					<Col span={24}>
						<div>Thư ký và những người thực hiện đề tài:</div>
						<TableThanhVien
							type='DeTai'
							fieldName='danhSachCTV'
							mode='edit'
							data={record?.dangKyKhcn?.danhSachCTV ?? []}
						/>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name={'donViChuTri'} label='Cơ quan chủ trì đề tài' rules={[...rules.required, ...rules.text]}>
							<Input placeholder='Cơ quan chủ trì đề tài' />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name={'thuocLinhVuc'} label='Lĩnh vực khoa học' rules={[...rules.required]}>
							<AutoComplete
								options={Object.values(ELinhVucDeTai).map((item) => ({ value: item, label: item }))}
								placeholder='Lĩnh vực khoa học (chọn hoặc nhập lĩnh vực khác)'
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<div>Kế hoạch, phương án tổ chức thực hiện:</div>
						<TableTimeline mode='edit' data={record?.deCuongKhcn?.timeline ?? []} />
						<br />
					</Col>
					<Col span={24}>
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
					</Col>
					<Col span={24}>
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
					</Col>
					<Col span={24}>
						<div>
							Sản phẩm chính của đề tài (Dạng III) <i>Bài báo; Sách chuyên khảo và các sản phẩm khác</i>
						</div>
						<TableSanPham
							phase='deCuongKhcn'
							type={EDangSanPham.DANG_SAN_PHAM_III}
							mode='edit'
							data={record?.deCuongKhcn?.sanPhamDeCuongDangIII ?? []}
						/>
						<br />
					</Col>
					<Col xs={24} md={12}>
						<Form.Item
							name={['thoiGianDuKienThucHien']}
							label='Thời gian dự kiến thực hiện đề tài'
							rules={[...rules.required]}
						>
							<MyDateRangePicker picker='month' format={'MM/YYYY'} placeholder={['Từ tháng', 'đến tháng']} />
						</Form.Item>
					</Col>
					<Col xs={24} md={12}>
						<Form.Item name={['kinhPhi', 'kinhPhi']} label='Tổng kinh phí' rules={[...rules.required]}>
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
