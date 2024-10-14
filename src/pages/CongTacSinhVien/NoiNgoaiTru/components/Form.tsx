import MyDatePicker from '@/components/MyDatePicker';
import UploadFile from '@/components/Upload/UploadFile';
import SelectDonViHanhChinhTheoTen from '@/pages/Core/DonViHanhChinh/SelectTheoTen';
import { getTinhThanhPho } from '@/services/Core/DonViHanhChinh';
import { type DonViHanhChinh } from '@/services/Core/DonViHanhChinh/typing';
import { EPhanLoaiCuTru, ETrangThaiKhaiBaoNoiNgoaiTru } from '@/services/CongTacSinhVien/NoiNgoaiTru/constant';
import { buildUpLoadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Radio, Row, Select } from 'antd';
import { useWatch } from 'antd/lib/form/Form';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const FormKhaiBao = (props: any) => {
	const [form] = Form.useForm();
	const { title } = props;
	const {
		record: recKhaiBao,
		getAllModel,
		formSubmiting,
		setVisibleForm,
		visibleForm,
		khaiBaoNoiNgoaiTruModel,
	} = useModel('noingoaitru.khaibao');
	const { record: recSinhVien, getThongTinCuaToiModel } = useModel('sinhvien.sinhvien');
	const [listTinh, setListTinh] = useState<DonViHanhChinh.IRecord[]>();
	const dangONoiTru = useWatch(['dangONoiTru'], form);

	const getData = () => getAllModel(undefined, undefined, undefined, undefined, 'me');

	useEffect(() => {
		if (!visibleForm) resetFieldsForm(form);
		else if (recKhaiBao?._id)
			form.setFieldsValue({
				...recKhaiBao,
				dangONoiTru: recKhaiBao.dangONoiTru ? EPhanLoaiCuTru.NOI_TRU : EPhanLoaiCuTru.NGOAI_TRU,
			});
	}, [recKhaiBao?._id, visibleForm]);

	useEffect(() => {
		getThongTinCuaToiModel();
		getTinhThanhPho().then((data) => {
			setListTinh(data.data.data);
		});
	}, []);

	const onFinish = async (values: any) => {
		const urlTaiLieu = await buildUpLoadFile(values, 'urlAnhThe');
		const data = {
			...values,
			dotKhaiBaoId: recKhaiBao?.dotKhaiBaoId,
			urlAnhThe: urlTaiLieu,
			thongTinSinhVien: {
				...values.thongTinSinhVien,
				maSinhVien: recSinhVien?.ma,
				sinhVienSsoId: recSinhVien?.ssoId,
			},
			dangONoiTru: dangONoiTru === EPhanLoaiCuTru.NOI_TRU ? true : false,
			noiONoiTru: values.noiONoiTru,
		};
		khaiBaoNoiNgoaiTruModel(recKhaiBao?._id ?? '', data)
			.then(() => getData())
			.catch((err) => console.log(err));
	};

	return (
		<Card
			title={`${
				recKhaiBao?.trangThai === ETrangThaiKhaiBaoNoiNgoaiTru.DA_KHAI_BAO ? 'Chỉnh sửa' : 'Khai báo'
			} ${title?.toLowerCase()}`}
			bodyStyle={{ padding: 16 }}
		>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
					<Col span={24}>
						<div className='ant-descriptions-title'>Thông tin sinh viên</div>
					</Col>

					<Col xs={24} md={8}>
						<Form.Item name={['thongTinSinhVien', 'hoTen']} label='Họ tên' rules={[...rules.required]}>
							<Input placeholder='Nhập họ tên' />
						</Form.Item>
					</Col>
					<Col xs={24} md={8}>
						<Form.Item name={['thongTinSinhVien', 'ngaySinh']} label='Ngày sinh' rules={[...rules.required]}>
							<MyDatePicker />
						</Form.Item>
					</Col>
					<Col xs={24} md={8}>
						<Form.Item name={['thongTinSinhVien', 'gioiTinh']} label='Giới tính' rules={[...rules.required]}>
							<Radio.Group>
								<Radio value={'Nam'}>Nam</Radio>
								<Radio value={'Nữ'}>Nữ</Radio>
							</Radio.Group>
						</Form.Item>
					</Col>
					<Col xs={24} md={8}>
						<Form.Item
							name={['thongTinSinhVien', 'soDienThoai']}
							label='Số điện thoại'
							rules={[...rules.required, ...rules.soDienThoai]}
						>
							<Input placeholder='Nhập số điện thoại' />
						</Form.Item>
					</Col>
					<Col xs={24} md={8}>
						<Form.Item name={['thongTinSinhVien', 'cmtCccd']} label='Căn cước công dân' rules={[...rules.required]}>
							<Input placeholder='Nhập căng cước công dân' />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<Col md={8}>
							<Form.Item name='urlAnhThe' label='Ảnh chân dung' rules={[...rules.required, ...rules.fileRequired]}>
								<UploadFile isAvatarSmall resize />
							</Form.Item>
						</Col>
					</Col>
					<Col span={24}>
						<div className='ant-descriptions-title'>Quê quán</div>
					</Col>
					<Col xs={24}>
						<SelectDonViHanhChinhTheoTen
							form={form}
							listTinh={listTinh}
							hasLabel
							hasSoNha
							prefix={['thongTinSinhVien', 'queQuan']}
							notRequiredXaPhuong
						/>
					</Col>
					<Col span={24}>
						<div className='ant-descriptions-title'>Hộ khẩu thường trú</div>
					</Col>
					<Col xs={24}>
						<SelectDonViHanhChinhTheoTen
							form={form}
							listTinh={listTinh}
							hasLabel
							hasSoNha
							prefix={['thongTinSinhVien', 'hoKhauThuongTru']}
							notRequiredXaPhuong
						/>
					</Col>
					<Col xs={24}>
						<Form.Item name='dangONoiTru' label='Phân loại cư trú' rules={[...rules.required]}>
							<Select
								placeholder='Chọn phân loại cư trú'
								options={Object.values(EPhanLoaiCuTru).map((item) => ({
									key: item,
									value: item,
									label: item,
								}))}
							/>
						</Form.Item>
					</Col>

					{dangONoiTru === EPhanLoaiCuTru.NOI_TRU ? (
						<>
							<Col span={24}>
								<div className='ant-descriptions-title'>Nơi ở hiện nay</div>
							</Col>
							<Col xs={24}>
								<Form.Item name='noiONoiTru' label='Thông tin nơi ở (Ghi rõ số phòng)' rules={[...rules.required]}>
									<Input.TextArea placeholder='Nhập địa chỉ nội trú' />
								</Form.Item>
							</Col>
						</>
					) : dangONoiTru === EPhanLoaiCuTru.NGOAI_TRU ? (
						<>
							<Col span={24}>
								<div className='ant-descriptions-title'>Nơi ở hiện nay</div>
							</Col>
							<Col xs={24}>
								<SelectDonViHanhChinhTheoTen
									form={form}
									listTinh={listTinh}
									hasLabel
									hasSoNha
									prefix={['noiONgoaiTru']}
									notRequiredXaPhuong
								/>
							</Col>
						</>
					) : null}

					<Col span={24}>
						<div className='ant-descriptions-title'>Thông tin người thân</div>
					</Col>
					<Col xs={24} md={8}>
						<Form.Item name={['thongTinNguoiThan', 'hoTen']} label='Họ tên' rules={[...rules.required]}>
							<Input placeholder='Nhập họ tên' />
						</Form.Item>
					</Col>
					<Col xs={24} md={8}>
						<Form.Item name={['thongTinNguoiThan', 'namSinh']} label='Năm sinh' rules={[...rules.required]}>
							<MyDatePicker />
						</Form.Item>
					</Col>
					<Col xs={24} md={8}>
						<Form.Item
							name={['thongTinNguoiThan', 'soDienThoai']}
							label='Số điện thoại'
							rules={[...rules.required, ...rules.soDienThoai]}
						>
							<Input style={{ width: '100%' }} placeholder='Nhập số điện thoại' />
						</Form.Item>
					</Col>
					<Col xs={24}>
						<SelectDonViHanhChinhTheoTen
							form={form}
							listTinh={listTinh}
							hasLabel
							hasSoNha
							prefix={['thongTinNguoiThan', 'diaChiThuongTru']}
							notRequiredXaPhuong
						/>
					</Col>
					<Col xs={24} md={8}>
						<Form.Item name={['thongTinNguoiThan', 'ngheNghiep']} label='Nghề nghiệp' rules={[...rules.required]}>
							<Input placeholder='Nhập nghề nghiệp' />
						</Form.Item>
					</Col>
					<Col xs={24} md={8}>
						<Form.Item name={['thongTinNguoiThan', 'noiLamViec']} label='Nơi làm việc' rules={[...rules.required]}>
							<Input placeholder='Nhập nơi làm việc' />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button loading={formSubmiting} htmlType='submit' type='primary'>
						{recKhaiBao?.trangThai === ETrangThaiKhaiBaoNoiNgoaiTru.CHUA_KHAI_BAO ? 'Khai báo' : 'Chỉnh sửa'}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormKhaiBao;
