import { type BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import { ELoaiCauHoi } from '@/services/TienIch/KhaoSat/constants';
import rules from '@/utils/rules';
import { Col, Form, Input, InputNumber, Row } from 'antd';

const Text = (props: { question: BieuMau.CauHoi; disabled?: boolean; isDiemSo?: boolean }) => {
	return (
		<Row gutter={[12, 0]}>
			<Col span={props.isDiemSo ? 20 : 24}>
				<Form.Item
					rules={props.question.batBuoc ? [...rules.required, ...rules.text, ...rules.length(500)] : []}
					name={[props.question._id, 'traLoiText']}
				>
					{props?.question?.loai === ELoaiCauHoi.RENDER_INPUT ? (
						<Input disabled={props.disabled} placeholder='Nhập câu trả lời' />
					) : (
						<Input.TextArea disabled={props.disabled} placeholder='Nhập câu trả lời' rows={3} />
					)}
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

export default Text;
