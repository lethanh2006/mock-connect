import { type BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import rules from '@/utils/rules';
import { Checkbox, Form } from 'antd';

const MultipleChoice = (props: { question: BieuMau.CauHoi }) => {
	// const [idCauTraLoi, setIdCauTraLoi] = useState<string[]>([]);

	// const handleRenderTraLoi = () => {
	// 	if (props.traLoi) {
	// 		const arr = [...idCauTraLoi];
	// 		props.question?.luaChon?.forEach((val) => {
	// 			if (props?.traLoi?.listLuaChon?.includes(val?.noiDung)) {
	// 				arr.push(val?._id);
	// 			}
	// 		});
	// 		setIdCauTraLoi(arr);
	// 	} else {
	// 		setIdCauTraLoi([]);
	// 	}
	// };

	// useEffect(() => {
	// 	handleRenderTraLoi();
	// }, [props.traLoi]);

	// useEffect(() => {
	// 	props.form.setFieldsValue({
	// 		[props.question._id]: idCauTraLoi ? idCauTraLoi : undefined,
	// 	});
	// }, [idCauTraLoi]);

	return (
		<Form.Item rules={props.question.batBuoc ? [...rules.required] : []} name={[props.question._id, 'listLuaChon']}>
			<Checkbox.Group>
				{props.question.luaChon?.map((item) => (
					<div key={item._id}>
						<Checkbox value={item.noiDung}>{item.noiDung}</Checkbox>
					</div>
				))}
			</Checkbox.Group>
		</Form.Item>
	);
};

export default MultipleChoice;
