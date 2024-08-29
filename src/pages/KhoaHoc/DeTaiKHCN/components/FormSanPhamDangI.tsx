import { EDangSanPham } from '@/services/KhoaHoc/DeTaiKHCN/constants';
import type { DeTaiKHCN } from '@/services/KhoaHoc/DeTaiKHCN/typings';
import rules from '@/utils/rules';
import { Button, Card, Form, Input, message } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormSanPhamDangI = (props: {
	onCancel: any;
	record?: DeTaiKHCN.SanPhamThuyetMinh;
	edit: boolean;
	type: 'deCuongKhcn' | 'nghiemThuKhcn';
}) => {
	const [form] = Form.useForm();
	const { record, edit } = props;
	const { record: recDeTai, setRecord: setRecDeTai } = useModel('khoahoc.detaikhcn');

	useEffect(() => {
		if (record && edit) {
			form.setFieldsValue({
				...record,
			});
		} else {
			form.setFieldsValue({ ...form });
		}
	}, [record]);

	const onFinish = async (values: DeTaiKHCN.SanPhamThuyetMinh) => {
		const payload = {
			...values,
			dangSanPham: EDangSanPham.DANG_SAN_PHAM_I,
		};

		if (edit && record && recDeTai) {
			const index = recDeTai?.[props.type]?.sanPhamDeCuongDangI
				.map((item, indexTemp: number) => item.tenSanPham)
				.indexOf(record.tenSanPham);
			const sanPhamDeCuongDangI = [...recDeTai?.[props.type]?.sanPhamDeCuongDangI];
			sanPhamDeCuongDangI.splice(index, 1, { ...record, ...payload });
			setRecDeTai({
				...recDeTai,
				[props.type]: {
					...recDeTai?.[props.type],
					sanPhamDeCuongDangI,
				},
			});
		} else {
			const length = recDeTai?.[props.type]?.sanPhamDeCuongDangI?.length;
			setRecDeTai({
				...(recDeTai || {}),
				[props.type]: {
					...recDeTai?.[props.type],
					sanPhamDeCuongDangI: [
						...(recDeTai?.[props.type]?.sanPhamDeCuongDangI ?? []),
						{ ...payload, index: length ? length + 1 : 1 },
					],
				},
			} as DeTaiKHCN.IRecord);
		}

		message.success(edit ? 'Sửa thành công' : 'Thêm thành công');
		props.onCancel();
	};

	return (
		<Card title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + 'sản phẩm dạng I'}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item
					rules={[...rules.required, ...rules.text]}
					style={{ marginBottom: 10 }}
					label='Tên sản phẩm cụ thể và chỉ tiêu chất lượng chủ yếu của sản phẩm'
					name={'tenSanPham'}
				>
					<Input.TextArea rows={5} placeholder='Nhập nội dung' />
				</Form.Item>
				<Form.Item
					rules={[...rules.required, ...rules.text]}
					style={{ marginBottom: 10 }}
					label='Đơn vị đo'
					name={'donViTinh'}
				>
					<Input placeholder='Đơn vị đo' />
				</Form.Item>
				<Form.Item
					name={['mucChatLuongThamKhaoLoai1']}
					label='Mức chất lượng cần đạt'
					rules={[...rules.required, ...rules.text]}
					style={{ marginBottom: 10 }}
				>
					<Input.TextArea rows={3} placeholder='Nhập nội dung' />
				</Form.Item>
				<Form.Item
					name={['mauTuongTuTrongNuoc']}
					label='Mẫu tương tự trong nước'
					rules={[...rules.required, ...rules.text]}
					style={{ marginBottom: 10 }}
				>
					<Input.TextArea rows={3} placeholder='Nhập nội dung' />
				</Form.Item>
				<Form.Item
					name={['mauTuongTuNgoaiNuoc']}
					label='Mẫu tương tự trên thế giới'
					rules={[...rules.required, ...rules.text]}
					style={{ marginBottom: 10 }}
				>
					<Input.TextArea rows={3} placeholder='Nhập nội dung' />
				</Form.Item>
				<Form.Item
					name={['duKienNoiCongBo']}
					label='Dự kiến số lượng/quy mô sản phẩm tạo ra'
					rules={[...rules.required, ...rules.text]}
					style={{ marginBottom: 10 }}
				>
					<Input.TextArea rows={3} placeholder='Nhập nội dung' />
				</Form.Item>

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

export default FormSanPhamDangI;
