import UploadFile from '@/components/Upload/UploadFile';
import type { ThoiKhoaBieu } from '@/services/DaoTao/ThoiKhoaBieu/typing';
import { buildUpLoadMultiFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { Button, Col, Form, Input, message, Modal, Row } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';

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
				urlMinhChung: Array.isArray(urlMinhChung) ? urlMinhChung.join(',') : (urlMinhChung ?? ''),
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
		<Modal title='Đăng ký xin nghỉ' open={visible} onCancel={onClose} footer={null} destroyOnClose centered>
			<Form form={form} layout='vertical' onFinish={onFinish}>
				<Row gutter={[16, 0]}>
					<Col xs={24} md={24}>
						<Form.Item label='Tên lớp học phần'>
							<Input value={buoiHoc?.tenLopHocPhan ?? ''} disabled />
						</Form.Item>
					</Col>
					<Col xs={24} md={24}>
						<Form.Item label='Ngày nghỉ'>
							<Input value={buoiHoc?.ngay ? moment(buoiHoc.ngay).format('DD/MM/YYYY') : ''} disabled />
						</Form.Item>
					</Col>
					<Col xs={24} md={24}>
						<Form.Item label='Ca nghỉ'>
							<Input
								value={buoiHoc ? `Tiết: ${buoiHoc.tietBatDau ?? ''} - ${buoiHoc.tietKetThuc ?? ''}` : ''}
								disabled
							/>
						</Form.Item>
					</Col>
				</Row>
				<Form.Item name='lyDo' label='Lý do' rules={[...rules.required]}>
					<Input.TextArea rows={4} placeholder='Nhập lý do xin nghỉ...' />
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
				<div
					style={{
						textAlign: 'center',
						display: 'flex',
						justifyContent: 'center',
						gap: 8,
					}}
				>
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
