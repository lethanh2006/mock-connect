import type { SanPhamNCKH } from '@/services/KhoaHoc/SanPhamNCKH/typings';
import rules from '@/utils/rules';
import { Button, Card, Form, Input, InputNumber, message } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormThongTinGio = (props: {
	onCancel: any;
	fieldName: 'danhSachKetQuaQuyDoiGio' | 'danhSachKetQuaQuyDoiDiem';
}) => {
	const { editThongTinGio, recordThongTinGio, recordKetQuaTinhGioThanhVien, setRecordKetQuaTinhGioThanhVien } =
		useModel('khoahoc.sanphamnckh');

	const [form] = Form.useForm();
	const isGio = props.fieldName === 'danhSachKetQuaQuyDoiGio';
	useEffect(() => {
		if (recordThongTinGio?.index && editThongTinGio) form.setFieldsValue(recordThongTinGio);
	}, [recordThongTinGio?.index]);

	return (
		<Card title={(editThongTinGio ? 'Chỉnh sửa ' : 'Thêm mới ') + `thông tin tính ${isGio ? 'giờ' : 'điểm'}`}>
			<Form
				labelCol={{ span: 24 }}
				form={form}
				onFinish={(values) => {
					const payload = {
						...recordThongTinGio,
						...values,
						// tongGio: values.soGio * values.heSo,
					};

					if (editThongTinGio && recordKetQuaTinhGioThanhVien && recordThongTinGio) {
						const index =
							recordKetQuaTinhGioThanhVien?.danhSachThongTinGio
								?.map((item, indexTemp) => ({ ...item, index: indexTemp + 1 }))
								?.map((item) => item.index)
								?.indexOf(recordThongTinGio.index) ?? 0;
						const danhSachThongTinGio = [...(recordKetQuaTinhGioThanhVien?.danhSachThongTinGio ?? [])];
						danhSachThongTinGio.splice(index, 1, payload);
						setRecordKetQuaTinhGioThanhVien({ ...recordKetQuaTinhGioThanhVien, danhSachThongTinGio });
					} else {
						setRecordKetQuaTinhGioThanhVien({
							...(recordKetQuaTinhGioThanhVien || {}),
							danhSachThongTinGio: [...(recordKetQuaTinhGioThanhVien?.danhSachThongTinGio ?? []), payload],
						} as SanPhamNCKH.KetQuaTinhGioThanhVien);
					}
					message.success(editThongTinGio ? 'Sửa thành công' : 'Thêm thành công');
					props.onCancel();
				}}
			>
				<Form.Item name='tongGio' label={`Số ${isGio ? 'giờ' : 'điểm'} quy đổi được`} rules={[...rules.required]}>
					<InputNumber
						style={{ width: '100%' }}
						min={0}
						max={100000000}
						placeholder={`Tổng ${isGio ? 'giờ' : 'điểm'}`}
						addonAfter={`${isGio ? 'Giờ' : 'Điểm'}`}
					/>
				</Form.Item>
				{/* <Form.Item name='heSo' label='Hệ số' rules={[...rules.required]}>
					<InputNumber min={0} max={1} placeholder='Hệ số' />
				</Form.Item> */}

				<Form.Item name={'moTa'} label='Mô tả' rules={[...rules.required, ...rules.text]}>
					<Input.TextArea placeholder='Mô tả' />
				</Form.Item>
				<Form.Item name={'ghiChu'} label='Ghi chú' rules={[...rules.text]}>
					<Input.TextArea placeholder='Ghi chú' />
				</Form.Item>

				<div className='form-footer'>
					<Button htmlType='submit' type='primary'>
						{!editThongTinGio ? 'Thêm mới' : 'Lưu lại'}
					</Button>

					<Button onClick={() => props.onCancel()}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormThongTinGio;
