import MyDatePicker from '@/components/MyDatePicker';
import SelectDanToc from '@/pages/Core/DanToc/SelectDanToc';
import SelectDiaChiHoSoFormItem from '@/pages/Core/DonViHanhChinh/SelectDiaChiHoSo';
import SelectQuocTich from '@/pages/Core/QuocTich/SelectQuocTich';
import SelectTonGiao from '@/pages/Core/TonGiao/SelectTonGiao';
import { getTinhThanhPho } from '@/services/Core/DonViHanhChinh';
import type { DonViHanhChinh } from '@/services/Core/DonViHanhChinh/typing';
import { ELoaiThanhVienGiaDinh, ETrangThaiThanhVienGiaDinh } from '@/services/DaoTao/SinhVien/constants';
import type { SinhVien } from '@/services/DaoTao/SinhVien/typings';

import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Input, Row, Select } from 'antd';
import { useEffect, useState } from 'react';

const FormThongTinGiaDinh = (props: {
	visible: boolean;
	onOk: (rec: SinhVien.TThongTinGiaDinh) => void;
	onCancel: () => void;
	record?: SinhVien.TThongTinGiaDinh;
}) => {
	const { visible, onCancel, onOk, record } = props;
	const [listTinh, setListTinh] = useState<DonViHanhChinh.IRecord[]>();
	const [form] = Form.useForm();
	const trangThaiThanhVien: ETrangThaiThanhVienGiaDinh = Form.useWatch('trangThaiThanhVien', form);

	useEffect(() => {
		getTinhThanhPho().then((data) => {
			setListTinh(data.data.data);
		});
	}, []);

	useEffect(() => {
		if (!visible) resetFieldsForm(form);
		else if (record?.key !== undefined) form.setFieldsValue(record);
	}, [record?.key, visible]);

	const onFinish = async (values: SinhVien.TThongTinGiaDinh) => {
		if (onOk) onOk(values);
	};

	return (
		<Card title={`${record?.key !== undefined ? 'Chỉnh sửa' : 'Thêm mới'} thành viên gia đình`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					<Col span={12} md={6}>
						<Form.Item name='loaiThanhVien' label='Loại thành viên' rules={[...rules.required]}>
							<Select
								placeholder='Chọn loại thành viên gia đình'
								options={Object.values(ELoaiThanhVienGiaDinh).map((item) => ({ key: item, value: item, label: item }))}
							/>
						</Form.Item>
					</Col>
					<Col span={12} md={6}>
						<Form.Item name='trangThaiThanhVien' label='Trạng thái' rules={[...rules.required]}>
							<Select
								placeholder='Chọn trạng thái'
								options={Object.values(ETrangThaiThanhVienGiaDinh).map((item) => ({
									key: item,
									value: item,
									label: item,
								}))}
							/>
						</Form.Item>
					</Col>

					{trangThaiThanhVien !== ETrangThaiThanhVienGiaDinh.KHONG_CO_THONG_TIN ? (
						<>
							<Col span={12} md={6}>
								<Form.Item name='hoDem' label='Họ đệm' rules={[...rules.required, ...rules.ten]}>
									<Input placeholder='Nhập họ đệm' />
								</Form.Item>
							</Col>
							<Col span={12} md={6}>
								<Form.Item name='ten' label='Tên' rules={[...rules.required, ...rules.ten]}>
									<Input placeholder='Nhập tên' />
								</Form.Item>
							</Col>

							<Col span={12} md={6}>
								<Form.Item name='ngaySinh' label='Ngày sinh'>
									<MyDatePicker placeholder='Chọn ngày sinh' />
								</Form.Item>
							</Col>
							<Col span={12} md={6}>
								<Form.Item name='quocTich' label='Quốc tịch'>
									<SelectQuocTich />
								</Form.Item>
							</Col>
							<Col span={12} md={6}>
								<Form.Item name='danToc' label='Dân tộc'>
									<SelectDanToc />
								</Form.Item>
							</Col>
							<Col span={12} md={6}>
								<Form.Item name='tonGiao' label='Tôn giáo'>
									<SelectTonGiao />
								</Form.Item>
							</Col>

							<Col span={12} md={6}>
								<Form.Item
									name='soDienThoai'
									label='Số điện thoại'
									rules={
										trangThaiThanhVien === ETrangThaiThanhVienGiaDinh.DA_MAT
											? [...rules.soDienThoai]
											: [...rules.required, ...rules.soDienThoai]
									}
								>
									<Input placeholder='Nhập số điện thoại' />
								</Form.Item>
							</Col>
							<Col span={12} md={6}>
								<Form.Item name='email' label='Email' rules={[...rules.email]}>
									<Input placeholder='Nhập email' />
								</Form.Item>
							</Col>
							<Col span={12} md={6}>
								<Form.Item
									name='ngheNghiep'
									label='Nghề nghiệp'
									rules={
										trangThaiThanhVien === ETrangThaiThanhVienGiaDinh.DA_MAT
											? [...rules.text, ...rules.length(250)]
											: [...rules.text, ...rules.length(250), ...rules.required]
									}
								>
									<Input placeholder='Nhập nghề nghiệp' />
								</Form.Item>
							</Col>
							<Col span={12} md={6}>
								<Form.Item name='coQuanCongTac' label='Cơ quan công tác' rules={[...rules.text, ...rules.length(250)]}>
									<Input placeholder='Nhập cơ quan công tác' />
								</Form.Item>
							</Col>

							<Col span={24}>
								<Form.Item
									name='hoKhauThuongTru'
									label='Hộ khẩu thường trú'
									rules={trangThaiThanhVien === ETrangThaiThanhVienGiaDinh.DA_MAT ? undefined : [...rules.required]}
								>
									<SelectDiaChiHoSoFormItem listTinh={listTinh} required />
								</Form.Item>
							</Col>
							<Col span={24}>
								<Form.Item name='diaChiHienNay' label='Địa chỉ hiện nay'>
									<SelectDiaChiHoSoFormItem listTinh={listTinh} hasSoNha />
								</Form.Item>
							</Col>

							<Col span={24} md={6}>
								<Form.Item name='soTheBHYT' label='Số thẻ BHYT' rules={[...rules.text, ...rules.length(50)]}>
									<Input placeholder='Nhập số thẻ BHYT' />
								</Form.Item>
							</Col>
							<Col span={24} md={18}>
								<Form.Item
									name='hoatDongChinhTriXaHoi'
									label='Hoạt động chính trị xã hội'
									rules={[...rules.text, ...rules.length(250)]}
								>
									<Input placeholder='Nhập hoạt động chính trị xã hội' />
								</Form.Item>
							</Col>
						</>
					) : null}
				</Row>

				<div className='form-footer'>
					<Button htmlType='submit' type='primary'>
						{record?.key === undefined ? 'Thêm mới ' : 'Lưu lại'}
					</Button>
					<Button onClick={onCancel}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormThongTinGiaDinh;
