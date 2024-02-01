import { type BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import rules from '@/utils/rules';
import { Form, Input } from 'antd';

const Text = (props: { question: BieuMau.CauHoi }) => {
	return (
		<Form.Item
			rules={props.question.batBuoc ? [...rules.required, ...rules.text, ...rules.length(500)] : []}
			name={[props.question._id, 'traLoiText']}
		>
			<Input.TextArea placeholder='Nhập câu trả lời' rows={3} />
		</Form.Item>
	);
};

export default Text;
