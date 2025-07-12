import MyDatePicker from '@/components/MyDatePicker';
import UploadFile from '@/components/Upload/UploadFile';
import SelectDanToc from '@/pages/Core/DanToc/SelectDanToc';
import SelectQuocTich from '@/pages/Core/QuocTich/SelectQuocTich';
import SelectTonGiao from '@/pages/Core/TonGiao/SelectTonGiao';
import { getTinhThanhPho } from '@/services/Core/DonViHanhChinh';
import { type DonViHanhChinh } from '@/services/Core/DonViHanhChinh/typing';
import { EGioiTinh } from '@/services/DaoTao/constant';
import { ELoaiNoiSinh, TenLoaiNoiSinh } from '@/services/DaoTao/SinhVien/constants';
import { buildUpLoadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { Button, Col, Collapse, Divider, Form, Input, InputNumber, message, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import SelectDonViHanhChinh from '../../Core/DonViHanhChinh/SelectDonViHanhChinh';
import FormSucKhoe from './FormSucKhoe';
import ThongTinGiaDinhFormItem from './GiaDinh';

const FormSinhVien = (props: { onCancel?: () => void }) => {
	const [form] = Form.useForm();
	const { getThongTinCuaToiModel, putModel, formSubmiting, setFormSubmiting } = useModel('sinhvien.sinhvien');
	const [listTinh, setListTinh] = useState<DonViHanhChinh.IRecord[]>();
	const loaiNoiSinh = Form.useWatch('loaiNoiSinh', form) ?? ELoaiNoiSinh.TRONG_NUOC;

	useEffect(() => {
		getTinhThanhPho().then((data) => setListTinh(data.data.data));

		getThongTinCuaToiModel().then((rec) => form.setFieldsValue(rec));
	}, []);

	const onFinish = async (values: any) => {
		if (!values.thanhVienGiaDinh || !values.thanhVienGiaDinh.length) {
			message.error('Vui lòng khai thông tin thành viên gia đình');
			return;
		}

		try {
			setFormSubmiting(true);
			const urlImg = await buildUpLoadFile(values, 'anhDaiDienUrl').catch(console.log);
			setFormSubmiting(false);
			const payload = { ...values, anhDaiDienUrl: urlImg };
			putModel('me', payload, getThongTinCuaToiModel).then(() => {
				if (props?.onCancel) props?.onCancel();
			});
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<Form
			form={form}
			layout='vertical'
			onFinish={onFinish}
			scrollToFirstError={{ behavior: 'smooth', block: 'center', inline: 'center' }}
			onFinishFailed={() => {
				message.warning('Một số trường thông tin còn thiếu vui lòng kiểm tra lại');
			}}
		>
			<Row gutter={[12, 0]}>
				<Col span={24} sm={9} lg={6} style={{ display: 'flex', justifyContent: 'center' }}>
					<Form.Item className='alignUploadCenter' name='anhDaiDienUrl' label={''}>
						<UploadFile otherProps={{ style: { textAlign: 'center' } }} isAvatar resize />
					</Form.Item>
				</Col>

				<Col span={24} md={18}>
					<Row gutter={[12, 0]}>
						<Col span={24} md={8}>
							<Form.Item name='ma' label='Mã sinh viên' rules={[...rules.required, ...rules.text, ...rules.length(20)]}>
								<Input disabled placeholder='Mã sinh viên' />
							</Form.Item>
						</Col>
						<Col span={24} md={8}>
							<Form.Item name='ten' label='Họ tên' rules={[...rules.required, ...rules.text, ...rules.length(250)]}>
								<Input placeholder='Nhập họ tên sinh viên' />
							</Form.Item>
						</Col>
						<Col span={12} md={8}>
							<Form.Item name='ngaySinh' label='Ngày sinh' rules={[...rules.required, ...rules.ngaySinh]}>
								<MyDatePicker style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col span={12} md={8}>
							<Form.Item name='gioiTinh' label='Giới tính' rules={[...rules.required, ...rules.text]}>
								<Select
									placeholder='Chọn giới tính'
									options={Object.values(EGioiTinh).map((item) => ({
										key: item,
										value: item,
										label: item,
									}))}
								/>
							</Form.Item>
						</Col>

						<Col span={12} md={8}>
							<Form.Item name='cccd' label='Số CMTND/CCCD/Hộ chiếu' rules={[...rules.required, ...rules.CMND]}>
								<Input placeholder='Nhập số CMTND/CCCD/Hộ chiếu' />
							</Form.Item>
						</Col>
						<Col span={12} md={8}>
							<Form.Item
								name='noiCapCccd'
								label='Nơi cấp'
								rules={[...rules.required, ...rules.text, ...rules.length(250)]}
							>
								<Input placeholder='Nhập nơi cấp' />
							</Form.Item>
						</Col>
						<Col span={12} md={8}>
							<Form.Item name='ngayCapCccd' label='Ngày cấp' rules={[...rules.required, ...rules.truocHomNay]}>
								<MyDatePicker placeholder='Chọn ngày cấp' allowClear />
							</Form.Item>
						</Col>

						<Col span={12} md={8}>
							<Form.Item name='quocTich' label='Quốc tịch' rules={[...rules.required]}>
								<SelectQuocTich allowClear />
							</Form.Item>
						</Col>
						<Col span={12} md={8}>
							<Form.Item name='danToc' label='Dân tộc' rules={[...rules.required]}>
								<SelectDanToc allowClear />
							</Form.Item>
						</Col>
					</Row>
				</Col>
			</Row>
			<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
				<Col span={12} md={6}>
					<Form.Item name='tonGiao' label='Tôn giáo' rules={[...rules.required]}>
						<SelectTonGiao allowClear />
					</Form.Item>
				</Col>
				<Col span={12} md={6}>
					<Form.Item name='chieuCao' label='Chiều cao (cm)' rules={[...rules.number(300, 0), ...rules.required]}>
						<InputNumber placeholder='Nhập chiều cao' style={{ width: '100%' }} />
					</Form.Item>
				</Col>
				<Col span={12} md={6}>
					<Form.Item name='canNang' label='Cân nặng (kg)' rules={[...rules.number(300, 0), ...rules.required]}>
						<InputNumber placeholder='Nhập cân nặng' style={{ width: '100%' }} />
					</Form.Item>
				</Col>
				<Col span={12} md={6}>
					<Form.Item name='soBaoHiemSinhVien' label='Số thẻ BHYT' rules={[...rules.text, ...rules.length(20)]}>
						<Input placeholder='Nhập số thẻ BHYT' />
					</Form.Item>
				</Col>
			</Row>
			<Collapse style={{ marginBottom: 12 }} defaultActiveKey={['1', '4']}>
				<Collapse.Panel forceRender header={'Thông tin cá nhân chi tiết'} key={'1'}>
					<Divider orientation='center'>Nơi sinh</Divider>
					<Row gutter={[12, 0]}>
						<Col span={12} md={12}>
							<Form.Item rules={[...rules.required]} name='loaiNoiSinh' label='Loại nơi sinh'>
								<Select
									placeholder='Chọn loại nơi sinh'
									allowClear
									options={Object.values(ELoaiNoiSinh).map((item) => ({
										key: item,
										value: item,
										label: TenLoaiNoiSinh[item],
									}))}
								/>
							</Form.Item>
						</Col>
						<Col span={12} md={12}>
							{loaiNoiSinh === ELoaiNoiSinh.TRONG_NUOC ? (
								<Form.Item name='tinhTpNoiSinh' label='Tỉnh/Thành phố' rules={[...rules.required]}>
									<Select
										placeholder='Chọn tỉnh/thành phố'
										options={listTinh?.map((item) => ({
											key: item.ma,
											value: item.tenDonVi,
											label: item.tenDonVi,
										}))}
										allowClear
										showSearch
										optionFilterProp='label'
									/>
								</Form.Item>
							) : (
								<Form.Item name='quocGiaNoiSinh' label='Quốc gia'>
									<Input placeholder='Nhập quốc gia nơi sinh' />
								</Form.Item>
							)}
						</Col>
					</Row>

					<Divider orientation='center'>Quê quán</Divider>
					<SelectDonViHanhChinh form={form} listTinh={listTinh} suffix='QueQuan' hasLabel />

					<Divider orientation='center'>Hộ khẩu thường trú</Divider>
					<SelectDonViHanhChinh form={form} listTinh={listTinh} suffix='ThuongTru' hasSoNha hasLabel />

					<Divider orientation='center'>Thông tin liên lạc</Divider>
					<Row gutter={[12, 0]}>
						<Col span={12}>
							<Form.Item name='soDienThoai' label='Số điện thoại' rules={[...rules.required, ...rules.soDienThoai]}>
								<Input placeholder='Nhập số điện thoại' />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item name='email2' label='Email liên lạc' rules={[...rules.required, ...rules.email]}>
								<Input placeholder='Nhập email' />
							</Form.Item>
						</Col>
						{/* <Col span={24} md={6}>
							<Form.Item name='soDienThoai2' label='Số điện thoại 2' rules={[...rules.soDienThoai]}>
								<Input placeholder='Nhập số điện thoại 2' />
							</Form.Item>
						</Col>
						<Col span={24} md={6}>
							<Form.Item name='email2' label='Email 2' rules={[...rules.email]}>
								<Input placeholder='Nhập email 2' />
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item name='nguoiLienLac' label='Người liên lạc' rules={[...rules.text, ...rules.length(250)]}>
								<Input placeholder='Nhập họ tên người liên lạc' />
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item name='soDienThoaiNguoiLienLac' label='SĐT' rules={[...rules.soDienThoai]}>
								<Input placeholder='Nhập số điện thoại người liên lạc' />
							</Form.Item>
						</Col> */}
					</Row>

					<Divider orientation='center'>Thông tin tài khoản ngân hàng</Divider>
					<Row gutter={[12, 0]}>
						<Col span={24} md={8}>
							<Form.Item name='soTaiKhoanNganHang' label='Số tài khoản ngân hàng' rules={[...rules.sotaikhoan]}>
								<Input placeholder='Nhập số tài khoản' />
							</Form.Item>
						</Col>
						<Col span={24} md={8}>
							<Form.Item name='tenNganHang' label='Tên ngân hàng' rules={[...rules.text, ...rules.length(250)]}>
								<Input placeholder='Nhập tên ngân hàng' />
							</Form.Item>
						</Col>
						<Col span={24} md={8}>
							<Form.Item
								name='chiNhanhNganHang'
								label='Chi nhánh ngân hàng'
								rules={[...rules.text, ...rules.length(250)]}
							>
								<Input placeholder='Nhập chi nhánh' />
							</Form.Item>
						</Col>
					</Row>
				</Collapse.Panel>

				<Collapse.Panel forceRender header={'Thông tin gia đình'} key={'4'}>
					<Row gutter={[12, 0]}>
						<Col span={24}>
							<Form.Item name='thanhVienGiaDinh' label=''>
								<ThongTinGiaDinhFormItem />
							</Form.Item>
						</Col>
					</Row>
				</Collapse.Panel>

				<Collapse.Panel forceRender header={'Thông tin Đoàn/Đảng'} key={'2'}>
					{/* <Divider orientation='center'>Thông tin Đoàn</Divider> */}
					<Row gutter={[12, 0]}>
						{/* <Col span={24} md={12}>
							<Form.Item name='laDoanVien' label=' ' valuePropName='checked'>
								<Checkbox>Là đoàn viên</Checkbox>
							</Form.Item>
						</Col> */}
						<Col span={12} md={8}>
							<Form.Item name='ngayVaoDoan' label='Ngày vào đoàn' rules={[...rules.truocHomNay]}>
								<MyDatePicker allowClear style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col span={12} md={8}>
							<Form.Item name='ngayVaoDang' label='Ngày vào đảng' rules={[...rules.truocHomNay]}>
								<MyDatePicker allowClear style={{ width: '100%' }} />
							</Form.Item>
						</Col>
						<Col span={24} md={8}>
							<Form.Item name='ngayVaoDangChinhThuc' label='Ngày vào đảng chính thức' rules={[...rules.truocHomNay]}>
								<MyDatePicker allowClear style={{ width: '100%' }} />
							</Form.Item>
						</Col>
					</Row>

					{/* <Divider orientation='center'>Thông tin Đảng</Divider> */}
					{/* <Row gutter={[12, 0]}> */}
					{/* <Col span={24} md={12}>
							<Form.Item name='daHocLopCamTinhDang' label='' valuePropName='checked'>
								<Checkbox>Đã học lớp cảm tình Đảng</Checkbox>
							</Form.Item>
						</Col>
						<Col span={24} md={12}>
							<Form.Item name='laDangVien' label='' valuePropName='checked'>
								<Checkbox>Là Đảng viên</Checkbox>
							</Form.Item>
						</Col> */}

					{/* </Row> */}
				</Collapse.Panel>

				<Collapse.Panel forceRender header={'Thông tin sức khoẻ và bảo hiểm'} key={'3'}>
					<FormSucKhoe />
				</Collapse.Panel>
			</Collapse>

			<div className='form-footer'>
				<Button type='primary' htmlType='submit' loading={formSubmiting}>
					Lưu lại
				</Button>
			</div>
		</Form>
	);
};

export default FormSinhVien;
