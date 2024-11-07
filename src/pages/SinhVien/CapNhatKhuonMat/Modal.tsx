import UploadFile from '@/components/Upload/UploadFile';
import { buildUpLoadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Form, Modal, Segmented } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import WebcamNhanDienKhuonMat from './Webcam';

const ModalCapNhatAnhNhanDien = (props: { visible: boolean; setVisible: (val: boolean) => void }) => {
	const { formSubmiting, updateFaceRegModel, record, setFormSubmiting, setRecord } = useModel('sinhvien.sinhvien');
	const [segmentValue, setSegmentValue] = useState('upload');
	const [form] = Form.useForm();
	const { visible, setVisible } = props;

	useEffect(() => {
		if (visible) form.setFieldsValue(record);
		else resetFieldsForm(form);
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
				.then(() => {
					if (record?._id) setRecord({ ...record, faceRegImgUrl: values.faceRegImgUrl });
					setVisible(false);
				})
				.catch(console.log);
	};

	return (
		<Modal
			title='Cập nhật ảnh nhận diện khuôn mặt'
			visible={visible}
			onCancel={() => setVisible(false)}
			footer={null}
			width={800}
			destroyOnClose
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
				<Segmented
					value={segmentValue}
					onChange={(val) => setSegmentValue(val as string)}
					options={[
						{ value: 'upload', label: 'Tải ảnh lên' },
						{ value: 'webcam', label: 'Sử dụng webcam' },
					]}
					style={{ marginBottom: 12 }}
				/>

				<Form.Item name='faceRegImgUrl' label='Ảnh nhận diện' rules={[...rules.required, ...rules.fileRequired]}>
					{segmentValue === 'upload' ? <UploadFile isAvatar resize /> : <WebcamNhanDienKhuonMat />}
				</Form.Item>

				<div className='form-footer'>
					<Button htmlType='submit' type='primary' loading={formSubmiting}>
						Lưu lại
					</Button>
					<Button onClick={() => setVisible(false)}>Hủy</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default ModalCapNhatAnhNhanDien;
