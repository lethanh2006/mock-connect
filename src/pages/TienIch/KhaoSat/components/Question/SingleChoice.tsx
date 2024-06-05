import { type BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import { Form, Input, Radio, type FormInstance } from 'antd';

const SingleChoice = (props: { question: BieuMau.CauHoi; form: FormInstance }) => {
	const customRequiredRule = () => ({
		validator() {
			const otherAnswer = props.form.getFieldValue(`${props.question._id}_otherAnswer`);
			const radioAnswer = props.form.getFieldValue(props.question._id);
			if (otherAnswer || radioAnswer) {
				return Promise.resolve();
			}
			return Promise.reject(new Error('Bắt buộc'));
		},
	});

	return (
		<>
			<Form.Item rules={props.question.batBuoc ? [customRequiredRule()] : []} name={props.question._id}>
				<Radio.Group>
					{props.question?.luaChon?.map((item) => (
						<div key={item._id}>
							<Radio value={item.noiDung}>{item.noiDung}</Radio>
						</div>
					))}
				</Radio.Group>
			</Form.Item>
			{props.question.cauTraLoiKhac ? (
				<Form.Item
					name={`${props.question._id}_otherAnswer`}
					rules={props.question.batBuoc ? [customRequiredRule()] : []}
					label='Câu trả lời khác'
				>
					<Input placeholder='Nhập câu trả lời khác' />
				</Form.Item>
			) : null}
		</>
	);
};

export default SingleChoice;
