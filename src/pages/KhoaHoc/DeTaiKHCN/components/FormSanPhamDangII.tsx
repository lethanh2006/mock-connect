import { EDangSanPham } from '@/services/KhoaHoc/DeTaiKHCN/constants';
import type { DeTaiKHCN } from '@/services/KhoaHoc/DeTaiKHCN/typings';
import rules from '@/utils/rules';
import { Button, Card, Form, Input, message } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormSanPhamDangII = (props: {
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
			dangSanPham: EDangSanPham.DANG_SAN_PHAM_II,
		};

		if (edit && record && recDeTai) {
			const index = recDeTai?.[props.type].sanPhamDeCuongDangII
				.map((item, indexTemp: number) => item.tenSanPham)
				.indexOf(record.tenSanPham);
			const sanPhamDeCuongDangII = [...recDeTai?.[props.type].sanPhamDeCuongDangII];
			sanPhamDeCuongDangII.splice(index, 1, { ...record, ...payload });
			setRecDeTai({
				...recDeTai,
				[props.type]: {
					...recDeTai?.[props.type],
					sanPhamDeCuongDangII,
				},
			});
		} else {
			const length = recDeTai?.[props.type]?.sanPhamDeCuongDangII?.length;
			setRecDeTai({
				...(recDeTai || {}),
				[props.type]: {
					...recDeTai?.[props.type],
					sanPhamDeCuongDangII: [
						...(recDeTai?.[props.type]?.sanPhamDeCuongDangII ?? []),
						{ ...payload, index: length ? length + 1 : 1 },
					],
				},
			} as DeTaiKHCN.IRecord);
		}

		message.success(edit ? 'Sửa thành công' : 'Thêm thành công');
		props.onCancel();
	};

	return (
		<Card title={(edit ? 'Chỉnh sửa ' : 'Thêm mới ') + 'sản phẩm dạng II'}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Form.Item
					rules={[...rules.required, ...rules.text]}
					style={{ marginBottom: 10 }}
					label='Tên sản phẩm'
					name={'tenSanPham'}
				>
					<Input.TextArea rows={5} placeholder='Nhập nội dung' />
				</Form.Item>
				<Form.Item
					rules={[...rules.required, ...rules.text]}
					style={{ marginBottom: 10 }}
					label='Yêu cầu khoa học cần đạt'
					name={'yeuCauLoai23'}
				>
					<Input.TextArea rows={3} placeholder='Nhập nội dung' />
				</Form.Item>

				<Form.Item name={['chuThichYeuCau']} label='Ghi chú' rules={[...rules.text]} style={{ marginBottom: 10 }}>
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

export default FormSanPhamDangII;
