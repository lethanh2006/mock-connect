import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';
import UploadFile from '@/components/Upload/UploadFile';
import {
	ELoaiDeTai,
	EMocThoiGianDot,
	MapKeyNameLoaiDeTai,
	MapKeyNameMocThoiGianDot,
} from '@/services/KhoaHoc/KeHoachDeTai/constants';
import { buildUpLoadFile, buildUpLoadMultiFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm, toISOString } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row, Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormKeHoachDeTai = () => {
	const [form] = Form.useForm();
	const { record, setVisibleForm, edit, postModel, putModel, formSubmiting, visibleForm, setLoading } =
		useModel('khoahoc.kehoachdetai');
	const loaiDeTai = Form.useWatch('loaiDeTai', form);
	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (record?._id)
			form.setFieldsValue({
				...record,
				thoiGianDangKy: [record.ngayBatDauDangKy, record.ngayKetThucDangKy],
				thoiGianXetDuyetDangKy: [record.ngayBatDauXetDuyet, record.ngayKetThucXetDuyet],
				thoiGianThuyetMinh: [record.ngayBatDauDeCuong, record.ngayKetThucDeCuong],
				thoiGianXetDuyetThuyetMinh: [record.ngayBatDauXetDuyetDeCuong, record.ngayKetThucXetDuyetDeCuong],
				thoiGianNghiemThu: [record.ngayBatDauNghiemThu, record.ngayKetThucNghiemThu],
			});
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		try {
			setLoading(true);
			const vanBanKemTheoUrl = await buildUpLoadMultiFile(values, 'vanBanKemTheoUrl');
			const mauSinhVienKhoa = await buildUpLoadFile(values, 'mauSinhVienKhoa');
			const mauSinhVienHocVien = await buildUpLoadFile(values, 'mauSinhVienHocVien');
			const mauGiangVien = await buildUpLoadFile(values, 'mauGiangVien');
			const payload = {
				...record,
				...values,
				ngayBatDauDangKy: toISOString(values?.thoiGianDangKy?.[0]),
				ngayKetThucDangKy: toISOString(values?.thoiGianDangKy?.[1]),
				ngayBatDauXetDuyet: toISOString(values?.thoiGianXetDuyetDangKy?.[0]),
				ngayKetThucXetDuyet: toISOString(values?.thoiGianXetDuyetDangKy?.[1]),
				ngayBatDauDeCuong: toISOString(values?.thoiGianThuyetMinh?.[0]),
				ngayKetThucDeCuong: toISOString(values?.thoiGianThuyetMinh?.[1]),
				ngayBatDauXetDuyetDeCuong: toISOString(values?.thoiGianXetDuyetThuyetMinh?.[0]),
				ngayKetThucXetDuyetDeCuong: toISOString(values?.thoiGianXetDuyetThuyetMinh?.[1]),
				ngayBatDauNghiemThu: toISOString(values?.thoiGianNghiemThu?.[0]),
				ngayKetThucNghiemThu: toISOString(values?.thoiGianNghiemThu?.[1]),
				vanBanKemTheoUrl,
				mauGiangVien,
				mauSinhVienHocVien,
				mauSinhVienKhoa,
				thoiGianDangKy: undefined,
				thoiGianXetDuyetDangKy: undefined,
				thoiGianThuyetMinh: undefined,
				thoiGianXetDuyetThuyetMinh: undefined,
				thoiGianNghiemThu: undefined,
			};

			if (edit) {
				putModel(record?._id ?? '', payload)
					.then()
					.catch((er) => console.log(er));
			} else
				postModel(payload)
					.then(() => form.resetFields())
					.catch((er) => console.log(er));
		} catch (err) {
			setLoading(false);
		}
	};

	return (
		<Card title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + 'đợt đăng ký đề tài KHCN'}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[16, 0]}>
					<Col xs={24}>
						<Form.Item name='ten' label='Tên đợt' rules={[...rules.required, ...rules.text, ...rules.length(250)]}>
							<Input placeholder='Tên đợt' />
						</Form.Item>
					</Col>
					<Col xs={24} lg={24}>
						<Form.Item name='loaiDeTai' label='Loại đề tài' rules={[...rules.required]}>
							<Select
								placeholder='Loại đề tài'
								options={Object.values(ELoaiDeTai).map((item) => ({ value: item, label: MapKeyNameLoaiDeTai[item] }))}
							/>
						</Form.Item>
					</Col>
					{Object.values(EMocThoiGianDot).map((item) => (
						<Col key={item} xs={24} lg={12}>
							<Form.Item name={item} label={MapKeyNameMocThoiGianDot[item]} rules={[...rules.required]}>
								<MyDateRangePicker format={'DD/MM/YYYY'} placeholder={['Từ ngày', 'đến ngày']} />
							</Form.Item>
						</Col>
					))}

					<Col xs={24} sm={12}>
						<Form.Item label='Văn bản kèm theo (nếu có)' name='vanBanKemTheoUrl'>
							<UploadFile
								maxCount={5}
								accept='.doc, .docx, .pdf'
								otherProps={{
									multiple: true,
									showUploadList: { showDownloadIcon: false },
								}}
							/>
						</Form.Item>
					</Col>
					{loaiDeTai === ELoaiDeTai.SINH_VIEN_KHOA && (
						<Col xs={24} sm={12}>
							<Form.Item label='Mẫu phiếu đăng ký đề xuất đề tài sinh viên cấp khoa' name='mauSinhVienKhoa'>
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
					{loaiDeTai === ELoaiDeTai.SINH_VIEN_HOC_VIEN && (
						<Col xs={24} sm={12}>
							<Form.Item label='Mẫu phiếu đăng ký đề xuất đề tài sinh viên cấp HV' name='mauSinhVienHocVien'>
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
					{loaiDeTai === ELoaiDeTai.GIANG_VIEN && (
						<Col xs={24} sm={12}>
							<Form.Item label='Mẫu phiếu đăng ký đề xuất đề tài cán bộ giảng viên' name='mauGiangVien'>
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
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit ? 'Thêm mới' : 'Lưu lại'}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormKeHoachDeTai;
