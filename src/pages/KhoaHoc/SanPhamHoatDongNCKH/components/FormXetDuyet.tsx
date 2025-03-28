import { ETrangThaiSanPham } from '@/services/KhoaHoc/SanPhamNCKH/constants';
import rules from '@/utils/rules';
import { Button, Form, Input } from 'antd';
import { useModel } from 'umi';

const FormXetDuyet = (props: { trangThai: ETrangThaiSanPham; onCancel: any; getData: any }) => {
	const { tiepNhanSanPhamNCKHModel, formSubmiting, record } = useModel('khoahoc.sanphamnckh');

	return (
		<Form
			onFinish={(values) => {
				if (!record?._id) return;
				tiepNhanSanPhamNCKHModel(record._id, { ketQuaTiepNhan: props.trangThai, ...values }, props.getData);
				props.onCancel();
			}}
		>
			<Form.Item
				name='ghiChuTiepNhan'
				label='Ghi chú'
				rules={props.trangThai === ETrangThaiSanPham.DUYET ? [] : [...rules.required, ...rules.text]}
			>
				<Input.TextArea rows={3} placeholder='Ghi chú' />
			</Form.Item>
			<div className='form-footer'>
				<Button loading={formSubmiting} htmlType='submit' type='primary'>
					{'Lưu lại'}
				</Button>
				<Button onClick={() => props.onCancel()}>Hủy</Button>
			</div>
		</Form>
	);
};

export default FormXetDuyet;
