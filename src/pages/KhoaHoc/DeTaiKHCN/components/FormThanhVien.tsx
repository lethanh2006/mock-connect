import MyDatePicker from '@/components/MyDatePicker';
import SelectSinhVienDebounce from '@/pages/SinhVien/components/Select';
import SelectDonVi from '@/pages/ToChucNhanSu/DonVi/Select';
import { EVaiTroDeTai } from '@/services/KhoaHoc/DeTaiKHCN/constants';
import type { DeTaiKHCN } from '@/services/KhoaHoc/DeTaiKHCN/typings';
import { ELoaiThanhVien } from '@/services/QuyTrinh/HoiDong/constant';
import rules from '@/utils/rules';
import { Button, Card, Col, Form, Input, Row, Select, message } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const FormThanhVien = (props: { onCancel: any; record?: DeTaiKHCN.ThanhVienDeTai; edit: boolean }) => {
	const [form] = Form.useForm();
	const { record, edit } = props;
	const { record: recDeTai, setRecord: setRecDeTai } = useModel('khoahoc.detaikhcn');

	const [loai, setLoai] = useState<ELoaiThanhVien>(
		record?.userId ? ELoaiThanhVien.TRONG_HE_THONG : ELoaiThanhVien.NGOAI_HE_THONG,
	);

	const { danhSach } = useModel('sinhvien.sinhvien');
	const { danhSach: danhSachDonVi } = useModel('tochucnhansu.donvi');

	useEffect(() => {
		if (record && edit) {
			form.setFieldsValue({
				...record,
				loai: record?.userId ? ELoaiThanhVien.TRONG_HE_THONG : ELoaiThanhVien.NGOAI_HE_THONG,
			});
		} else {
			form.setFieldsValue({ ...form, loai: ELoaiThanhVien.TRONG_HE_THONG });
			setLoai(ELoaiThanhVien.TRONG_HE_THONG);
		}
	}, [record?.userId, record?.ten]);

	const onFinish = async (values: DeTaiKHCN.ThanhVienDeTai) => {
		const recSinhVien = danhSach?.find((item) => item.ssoId === values?.userId);
		const recDonVi = danhSachDonVi?.find((item) => item.maDonVi === values?.maDonVi);
		const payload = {
			...record,
			...values,
			maDonVi: values?.maDonVi || recSinhVien?.nganh?.maDonVi || '',
			maDinhDanh: values?.maDinhDanh || recSinhVien?.ma || '',
			ten: values?.ten || recSinhVien?.ten || `${recSinhVien?.lastName ?? ''} ${recSinhVien?.firstName ?? ''}`,
			tenDonVi: recDonVi?.ten || '',
		};

		if (edit && record && recDeTai) {
			const index = recDeTai.dangKyKhcn.danhSachCTV
				.map((item, indexTemp: number) => indexTemp + 1)
				.indexOf(record.index);
			const danhSachCTV = [...recDeTai.dangKyKhcn.danhSachCTV];
			danhSachCTV.splice(index, 1, { ...record, ...payload });
			setRecDeTai({
				...recDeTai,
				dangKyKhcn: {
					...recDeTai?.dangKyKhcn,
					danhSachCTV,
				},
			});
		} else {
			const length = recDeTai?.dangKyKhcn?.danhSachCTV?.length;
			setRecDeTai({
				...(recDeTai || {}),
				dangKyKhcn: {
					...recDeTai?.dangKyKhcn,
					danhSachCTV: [...(recDeTai?.dangKyKhcn?.danhSachCTV ?? []), { ...payload, index: length ? length + 1 : 1 }],
				},
			} as DeTaiKHCN.IRecord);
		}

		message.success(edit ? 'Sửa thành công' : 'Thêm thành công');
		props.onCancel();
	};

	return (
		<Card title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + 'thành viên'}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item rules={[...rules.required]} name='loai' label='Loại'>
					<Select
						placeholder='Loại'
						onChange={(val) => setLoai(val)}
						options={Object.values(ELoaiThanhVien).map((item) => ({ value: item, label: item }))}
					/>
				</Form.Item>

				{loai === ELoaiThanhVien.TRONG_HE_THONG ? (
					<>
						<Form.Item name={['userId']} label='Họ và tên' rules={[...rules.required]}>
							<SelectSinhVienDebounce
								// recNhanSu={record}
								//@ts-ignore
								onChange={(val: string) => {
									if (!val) return;
									const recSinhVien = danhSach.find((item) => item.ssoId === val);
									form.setFieldsValue({
										tenLopHanhChinh: recSinhVien?.lopHanhChinhList?.[0]?.ten || props?.record?.tenLopHanhChinh,
										maDinhDanh: recSinhVien?.ma || props.record?.maDinhDanh,
										maDonVi: recSinhVien?.nganh?.maDonVi || props.record?.maDonVi,
										email: recSinhVien?.email || props?.record?.email,
										soDienThoai: recSinhVien?.soDienThoai || props?.record?.soDienThoai,
										ngaySinh: recSinhVien?.ngaySinh || props.record?.ngaySinh,
									});
								}}
							/>
						</Form.Item>
					</>
				) : (
					<>
						<Form.Item
							name={['ten']}
							label='Họ và tên'
							rules={[...rules.required, ...rules.ten]}
							style={{ marginBottom: 10 }}
						>
							<Input placeholder='Nhập họ và tên' />
						</Form.Item>
					</>
				)}

				<Form.Item
					name={['maDinhDanh']}
					label='Mã sinh viên'
					rules={[...rules.required, ...rules.text]}
					style={{ marginBottom: 10 }}
				>
					<Input placeholder='Nhập mã sinh viên' />
				</Form.Item>

				<Form.Item
					name={'danhSachVaiTroDeTai'}
					label='Vai trò'
					rules={[...rules.required]}
					style={{ marginBottom: 10 }}
				>
					<Select
						mode='multiple'
						placeholder='Chọn hoặc nhập Vai trò của thành viên'
						options={Object.values(EVaiTroDeTai)?.map((item) => ({
							value: item,
							label: item,
						}))}
					/>
				</Form.Item>

				<Form.Item
					rules={[...rules.required, ...rules.text, ...rules.length(200)]}
					style={{ marginBottom: 10 }}
					label='Khoa'
					name={'maDonVi'}
				>
					<SelectDonVi />
				</Form.Item>

				<Row gutter={[10, 0]}>
					<Col xs={24}>
						<Form.Item name={['ngaySinh']} label='Ngày sinh' rules={[...rules.required]} style={{ marginBottom: 10 }}>
							<MyDatePicker placeholder='Ngày sinh' format={'DD/MM/YYYY'} />
						</Form.Item>
					</Col>
					<Col xs={24} sm={12}>
						<Form.Item
							name={['soDienThoai']}
							label='Số điện thoại'
							rules={[...rules.soDienThoai]}
							style={{ marginBottom: 10 }}
						>
							<Input placeholder='Nhập Số điện thoại' />
						</Form.Item>
					</Col>
					<Col xs={24} sm={12}>
						<Form.Item name={['email']} label='Email' rules={[...rules.email]} style={{ marginBottom: 10 }}>
							<Input placeholder='Nhập Email' />
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
					<Button htmlType='submit' type='primary'>
						{!edit ? 'Thêm mới' : 'Lưu lại'}
					</Button>
					<Button onClick={() => props.onCancel()}>Hủy</Button>
				</div>
			</Form>
		</Card>
	);
};

export default FormThanhVien;
