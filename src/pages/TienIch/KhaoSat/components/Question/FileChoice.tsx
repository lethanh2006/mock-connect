import UploadFile from '@/components/Upload/UploadFile';
import { type BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import rules from '@/utils/rules';
import { Col, Form, InputNumber, Row } from 'antd';

const FileChoice = (props: { question: BieuMau.CauHoi; disabled?: boolean; isDiemSo?: boolean }) => {
	return (
		<Row gutter={[12, 0]}>
			<Col span={props.isDiemSo ? 20 : 24}>
				<Form.Item
					rules={props.question.batBuoc ? [...rules.fileRequired] : []}
					name={[props.question._id, 'listUrlFile']}
					extra={
						<i>
							<small>Định dạng cho phép: file ảnh, file PDF, file Word</small>
						</i>
					}
				>
					<UploadFile
						disabled={props.disabled}
						accept='image/*, .pdf, .doc, .docx, .png, .jpg'
						otherProps={{ showUploadList: { showDownloadIcon: false } }}
						maxCount={5}
					/>
				</Form.Item>
			</Col>
			{props.isDiemSo && (
				<Col span={4}>
					<Form.Item name={[props.question._id, 'diem']} label='Điểm số'>
						<InputNumber disabled style={{ width: '100%' }} placeholder='Chưa có điểm số' />
					</Form.Item>
				</Col>
			)}
		</Row>
	);
};

export default FileChoice;
