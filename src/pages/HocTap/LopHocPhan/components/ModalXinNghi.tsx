import UploadFile from '@/components/Upload/UploadFile';
import { YeuCauNghiHoc } from '@/services/DaoTao/YeuCauNghiHoc/typing';
import { buildUpLoadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Col, Form, Input, message, Modal, Row } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useModel } from 'umi';

const ModalXinNghi = (props: { visible: boolean; onClose: () => void }) => {
	const { visible, onClose } = props;
	const [form] = Form.useForm();
	const { record: recTKB } = useModel('daotao.thoikhoabieu');
	const { postModel, formSubmiting, setFormSubmiting } = useModel('daotao.dangkynghihoc');

	useEffect(() => {
		if (!visible) resetFieldsForm(form);
	}, [visible]);

	const onFinish = async (values: YeuCauNghiHoc.IRecord) => {
		try {
			setFormSubmiting(true);
			const urlMinhChung = await buildUpLoadFile(values, 'urlMinhChung');
			setFormSubmiting(false);

			const payload = {
				...values,
				tenLopHocPhan: recTKB?.tenLopHocPhan,
				thoiKhoaBieuId: recTKB?._id,
				urlMinhChung: urlMinhChung,
			};
			await postModel(payload).then(() => onClose());
		} catch (er) {
			message.error('Đã xảy ra lỗi, vui lòng thử lại!');
		}
	};

	return (
		<Modal title='Đăng ký xin nghỉ' open={visible} onCancel={onClose} footer={null} destroyOnClose centered>
			<Form form={form} layout='vertical' onFinish={onFinish}>
				<Row gutter={[12, 12]}>
					<Col span={24}>
						<Form.Item label='Tên lớp học phần'>
							<Input value={recTKB?.tenLopHocPhan ?? ''} disabled />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item label='Ngày nghỉ'>
							<Input value={recTKB?.ngay ? dayjs(recTKB?.ngay).format('DD/MM/YYYY') : ''} disabled />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item label='Ca nghỉ'>
							<Input
								value={recTKB?._id ? `Tiết: ${recTKB?.tietBatDau ?? ''} - ${recTKB?.tietKetThuc ?? ''}` : ''}
								disabled
							/>
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name='lyDo' label='Lý do' rules={[...rules.required]}>
							<Input.TextArea rows={4} placeholder='Nhập lý do xin nghỉ...' />
						</Form.Item>
					</Col>
					<Col span={24}>
						<Form.Item name='urlMinhChung' label='Minh chứng' rules={[...rules.required, ...rules.fileRequired]}>
							<UploadFile
								maxCount={1}
								otherProps={{
									multiple: false,
									accept: '.pdf, .jpg, .jpeg, .png',
								}}
							/>
						</Form.Item>
					</Col>
				</Row>

				<div className='form-footer'>
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
