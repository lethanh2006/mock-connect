import { type BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import rules from '@/utils/rules';
import { Form, Radio } from 'antd';

const NumericChoice = (props: { question: BieuMau.CauHoi; disabled?: boolean }) => {
	const arrValue: number[] = [];
	for (let i = props.question?.gioiHanDuoiTuyenTinh; i <= props.question?.gioiHanTrenTuyenTinh; i++) arrValue.push(i);

	return (
		<Form.Item
			rules={props.question.batBuoc ? [...rules.required] : []}
			name={[props.question._id, 'luaChonTuyenTinh']}
		>
			<Radio.Group disabled={props.disabled}>
				{arrValue.map((item) => (
					<Radio key={item} value={item}>
						{item}
					</Radio>
				))}
			</Radio.Group>
		</Form.Item>
	);
};

export default NumericChoice;
