import UploadFile from '@/components/Upload/UploadFile';
import { buildUpLoadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { Button, Form, Modal } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const ModalCapNhatAnhNhanDien = (props: { visible: boolean; setVisible: (val: boolean) => void }) => {
	const { formSubmiting, updateFaceRegModel, record, setFormSubmiting } = useModel('sinhvien.sinhvien');
	const [form] = Form.useForm();
	const { visible, setVisible } = props;

	useEffect(() => {
		if (visible) form.setFieldsValue(record);
	}, [visible]);

	const onFinish = async (values: any) => {
		if (!!values.faceRegImgUrl && typeof values.faceRegImgUrl !== 'string') {
			setFormSubmiting(true);
			await buildUpLoadFile(values, 'faceRegImgUrl')
				.then((faceRegImgUrl) => (values.faceRegImgUrl = faceRegImgUrl))
				.catch(() => (values.faceRegImgUrl = null))
				.finally(() => setFormSubmiting(false));
		}
		if (!!values.faceRegImgUrl && typeof values.faceRegImgUrl === 'string')
			updateFaceRegModel(values, () => {})
				.then(() => setVisible(false))
				.catch(console.log);
	};

	return (
		<Modal
			title='Cập nhật ảnh nhận diện khuôn mặt'
			visible={visible}
			onCancel={() => setVisible(false)}
			footer={null}
			width={800}
		>
			<div style={{ marginBottom: 12 }}>
				Cập nhật ảnh nhận diện khuôn mặt phục vụ việc checkin tự động khi ra vào Thư viện
			</div>

			<div className='fw500'>Điều kiện với ảnh:</div>
			<ol>
				<li>
					<b>Ánh sáng:</b> Ánh sáng đồng đều, không quá sáng hoặc quá tối. Tránh chụp ngược sáng. Nên chụp trong điều
					kiện ánh sáng tự nhiên hoặc ánh sáng nhân tạo ổn định.
				</li>
				<li>
					<b>Tư thế khuôn mặt:</b> Nhìn thẳng vào camera. Giữ đầu thẳng, không nghiêng hoặc quay sang bên. Mắt mở to tự
					nhiên Biểu cảm trung tính.
				</li>
				<li>
					<b>Khoảng cách và góc chụp:</b> Khoảng cách từ mặt đến camera khoảng 40-80cm. Chụp ở tầm ngang mắt Khuôn mặt
					chiếm khoảng 70-80% khung hình.
				</li>
				<li>
					<b>Yêu cầu về hình ảnh:</b> Không đeo kính râm hoặc kính phản quang. Không đeo khẩu trang Không đội mũ che
					khuất trán. Tóc không che khuất mặt Nền đơn giản, tương phản với khuôn mặt.
				</li>
				<li>
					<b>Chất lượng ảnh:</b> Độ phân giải tối thiểu 640x480 pixel. Ảnh rõ nét, không bị mờ. Định dạng ảnh JPG/JPEG.
				</li>
			</ol>

			<Form form={form} layout='vertical' onFinish={onFinish}>
				<Form.Item name='faceRegImgUrl' label='Ảnh nhận diện' rules={[...rules.required, ...rules.fileRequired]}>
					<UploadFile isAvatar resize />
				</Form.Item>

				<div className='form-footer'>
					<Button htmlType='submit' type='primary' loading={formSubmiting}>
						Xác nhận
					</Button>
					<Button onClick={() => setVisible(false)}>Hủy</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ModalCapNhatAnhNhanDien;
