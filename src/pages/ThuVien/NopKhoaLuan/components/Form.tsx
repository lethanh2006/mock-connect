import MyDatePicker from '@/components/MyDatePicker';
import UploadFile from '@/components/Upload/UploadFile';
import SelectNganhCoSo from '@/pages/DaoTao/Nganh/SelectNganh';
import { ETrangThaiNopThuVien } from '@/services/QuanLyThuVien/constant';
import { EFileScope, uploadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormThuVien = (props: any) => {
	const { title, loai, getData } = props;
	const [form] = Form.useForm();
	const { edit, record, formSubmiting, visibleForm, setVisibleForm, putModel, postModel, setFormSubmiting } =
		useModel('thuvien.danhsachdot');
	const { record: recSinhVien } = useModel('sinhvien.sinhvien');

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else if (record?._id) {
			form.setFieldsValue({
				...record,
				ngaySinh: record?.sinhVien?.ngaySinh,
				soDienThoai: record?.sinhVien?.soDienThoai,
			});
		} else {
			form.setFieldsValue({
				thoiGianNop: moment().toISOString(),
				ssoId: recSinhVien?.ssoId,
				maSinhVien: recSinhVien?.ma,
				hoTenTacGia: recSinhVien?.ten,
				ngaySinh: recSinhVien?.ngaySinh,
				soDienThoai: recSinhVien?.soDienThoai,
				chucDanh: '',
				noiCongTac: '',
				hocVi: recSinhVien?.trinhDoDaoTao?.ten,
				maNganh: recSinhVien?.maNganh,
			});
		}
	}, [record?._id, visibleForm]);

	const onFinish = async (values: any) => {
		const filesToUpload: { field: any; idField: any }[] = [
			{ field: 'urlTaiLieu', idField: 'idTaiLieu' },
			{ field: 'urlTomTat', idField: 'idTomTat' },
			{ field: 'urlTaiLieuMinhChung', idField: 'idTaiLieuMinhChung' },
		];

		setFormSubmiting(true);

		// Tạo danh sách các promise tải file
		const uploadPromises = filesToUpload.map(async ({ field, idField }) => {
			const fileData = values[field]?.fileList?.[0];
			if (fileData?.originFileObj) {
				const res = await uploadFile({
					file: fileData.originFileObj,
					scope: EFileScope.PUBLIC,
				});
				values[field] = res?.data?.data?.url;
				values[idField] = res?.data?.data?.file?._id;
			} else {
				values[field] = fileData?.url;
			}
		});

		await Promise.allSettled(uploadPromises);
		setFormSubmiting(false);

		values.trangThai = ETrangThaiNopThuVien.CHO_XY_LY;

		const data = {
			...values,
			loai,
		};

		if (edit) {
			putModel(record?._id ?? '', data as any, getData)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel(data as any, getData)
				.then()
				.catch((er) => console.log(er));
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} ${title?.toLowerCase()}`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={16}>
					<Col span={24}>
						<Form.Item label='Tên đề tài' name='tenDeTai' rules={[...rules.required, ...rules.text]}>
							<Input.TextArea placeholder='Tên đề tài' style={{ width: '100%' }} disabled={edit} />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							label='Người hướng dẫn'
							name='nguoiHuongDan'
							rules={[...rules.required, ...rules.text, ...rules.length(200)]}
						>
							<Input placeholder='Nhập họ tên người hướng dẫn' style={{ width: '100%' }} />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item label='Thời gian nộp' name='thoiGianNop' rules={[...rules.required]}>
							<MyDatePicker disabled />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item name='ssoId' hidden />
						<Form.Item name='maSinhVien' hidden />
						<Form.Item label='Họ và tên' name='hoTenTacGia'>
							<Input placeholder='Nhập họ và tên' disabled />
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item label='Ngày sinh' name='ngaySinh'>
							<MyDatePicker disabled />
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item label='Số điện thoại' name='soDienThoai'>
							<Input placeholder='Nhập số điện thoại' disabled />
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item label='Chức danh' name='chucDanh'>
							<Input placeholder='Nhập chức danh' disabled />
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item label='Nơi công tác' name='noiCongTac'>
							<Input placeholder='Nhập nơi công tác' disabled />
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item label='Học vị' name='hocVi'>
							<Input placeholder='Nhập học vị' disabled />
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item label='Chuyên ngành' name='maNganh'>
							<SelectNganhCoSo selectMa disabled />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							rules={[...rules.required, ...rules.fileRequired]}
							name='urlTaiLieu'
							label='Tài liệu toàn bộ đề tài (docx)'
						>
							<UploadFile
								otherProps={{
									maxCount: 1,
									accept: '.docx',
									multiple: false,
									showUploadList: { showDownloadIcon: false },
								}}
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							rules={[...rules.required, ...rules.fileRequired]}
							name='urlTomTat'
							label='Tài liệu tóm tắt đề tài (docx)'
						>
							<UploadFile
								otherProps={{
									maxCount: 1,
									accept: '.docx',
									multiple: false,
									showUploadList: { showDownloadIcon: false },
								}}
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item
							rules={[...rules.required, ...rules.fileRequired]}
							name='urlTaiLieuMinhChung'
							label='Tài liệu minh chứng đề tài (pdf)'
						>
							<UploadFile
								otherProps={{
									maxCount: 1,
									accept: '.pdf',
									multiple: false,
									showUploadList: { showDownloadIcon: false },
								}}
							/>
						</Form.Item>
					</Col>
				</Row>
				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{!edit ? 'Thêm mới' : 'Chỉnh sửa'}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormThuVien;
