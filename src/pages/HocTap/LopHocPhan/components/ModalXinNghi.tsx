import { Modal, Form, Input, Button, message } from 'antd';
import { useModel } from 'umi';
import type { ThoiKhoaBieu } from '@/services/DaoTao/ThoiKhoaBieu/typing';
import UploadFile from '@/components/Upload/UploadFile';
import rules from '@/utils/rules';
import { buildUpLoadMultiFile } from '@/services/uploadFile';
import moment from 'moment';

const ModalXinNghi = (props: {
	visible: boolean;
	onClose: () => void;
	buoiHoc?: ThoiKhoaBieu.IRecord;
	onSuccess?: () => void;
}) => {
	const { visible, onClose, buoiHoc, onSuccess } = props;
	const [form] = Form.useForm();
	const { postModel, formSubmiting, setFormSubmiting } = useModel('daotao.dangkynghihoc');

	const onFinish = async (values: any) => {
		if (!buoiHoc) return;
		setFormSubmiting(true);
		try {
			const urlMinhChung = await buildUpLoadMultiFile(values, 'files');
			const payload = {
				tenLopHocPhan: buoiHoc.tenLopHocPhan,
				thoiKhoaBieuId: buoiHoc._id,
				lyDo: values.lyDo.trim(),
				urlMinhChung: Array.isArray(urlMinhChung) ? urlMinhChung.join(',') : urlMinhChung ?? '',
			};
			await postModel(payload);
			form.resetFields();
			onSuccess?.();
			onClose();
		} catch (er) {
			message.error('Đã xảy ra lỗi, vui lòng thử lại!');
		} finally {
			setFormSubmiting(false);
		}
	};

	return (
		<Modal title='Đăng ký xin nghỉ' visible={visible} onCancel={onClose} footer={null} destroyOnClose>
			<Form form={form} layout='vertical' onFinish={onFinish}>
				<Form.Item label='Buổi học'>
					<Input
						value={
							buoiHoc
								? `${buoiHoc.tenLopHocPhan ?? ''} - ${
										buoiHoc.ngay ? moment(buoiHoc.ngay).format('DD/MM/YY') : ''
								  } - ca (${buoiHoc.tietBatDau ?? ''} - ${buoiHoc.tietKetThuc ?? ''})`
								: ''
						}
						disabled
					/>
				</Form.Item>
				<Form.Item name='lyDo' label='Lý do' rules={[...rules.required]}>
					<Input.TextArea rows={4} />
				</Form.Item>
				<Form.Item name='files' label='Minh chứng' rules={[...rules.required, ...rules.fileRequired]}>
					<UploadFile
						maxCount={1}
						otherProps={{
							multiple: false,
							accept: '.pdf,.jpg,.jpeg,.png',
						}}
					/>
				</Form.Item>
				<div style={{ textAlign: 'center', gap: 8, display: 'flex', justifyContent: 'center' }}>
					<Button loading={formSubmiting} type='primary' htmlType='submit'>
						Gửi
					</Button>
					<Button onClick={onClose}>Hủy</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ModalXinNghi;
