import { type BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import rules from '@/utils/rules';
import { Form, Radio } from 'antd';

const SingleChoice = (props: { question: BieuMau.CauHoi }) => {
	return (
		<Form.Item rules={props.question.batBuoc ? [...rules.required] : []} name={props.question._id}>
			<Radio.Group>
				{props.question?.luaChon?.map((item) => (
					<div key={item._id}>
						<Radio value={item.noiDung}>{item.noiDung}</Radio>
					</div>
				))}
			</Radio.Group>
		</Form.Item>
	);
};

export default SingleChoice;
