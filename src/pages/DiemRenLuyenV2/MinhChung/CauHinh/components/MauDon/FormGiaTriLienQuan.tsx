import {EKieuDuLieu, ELoaiPhepToan } from '@/services/FormDong/LoaiHinh/constants';
import { LoaiHinh } from '@/services/FormDong/LoaiHinh/typing';
import rules from '@/utils/rules';
import { Form, Input, InputNumber, Radio, Select } from 'antd';
import { useModel } from 'umi';

const FormGiaTriLienQuan = (props: {
	truongThongTinLienQuan: LoaiHinh.TruongThongTin | LoaiHinh.Cot;
	fieldName?: string;
	loaiPhepToan?: ELoaiPhepToan;
}) => {
	let component = null;
	const { danhSach } = useModel('quytrinh.danhmuc');
	const rule = [...rules.required];

	switch (props.truongThongTinLienQuan.kieuDuLieu) {
		case EKieuDuLieu.NUMBER:
			component = <InputNumber style={{ width: '100%' }} placeholder='Nhập giá trị' />;
			break;
		case EKieuDuLieu.DECIMAL:
			component = <InputNumber style={{ width: '100%' }} placeholder='Nhập giá trị' />;
			break;
		case EKieuDuLieu.BOOLEAN:
			component = (
				<Radio.Group
					options={[
						{ value: true, label: 'Có' },
						{ value: false, label: 'Không' },
					]}
				/>
			);
			break;
		case EKieuDuLieu.DANHMUC:
			component = (
				<Select
					placeholder='Chọn giá trị'
					mode={
						!props.loaiPhepToan || [ELoaiPhepToan.NAM_TRONG, ELoaiPhepToan.KHONG_NAM_TRONG].includes(props.loaiPhepToan)
							? 'multiple'
							: undefined
					}
					options={danhSach
						?.find((item) => item.maDanhMuc === props.truongThongTinLienQuan.maDanhMuc)
						?.danhSachGiaTri?.map((item: { value: string }) => ({ value: item.value, label: item.value }))}
				/>
			);
			break;

		case EKieuDuLieu.TEXT:
			component = <Input placeholder='Nhập giá trị' />;
			break;
		default:
			break;
	}

	return (
		<>
			{component ? (
				<Form.Item name={props?.fieldName ?? 'giaTriLienQuan'} label='Giá trị liên quan' rules={rule}>
					{component}
				</Form.Item>
			) : null}
		</>
	);
};

export default FormGiaTriLienQuan;
