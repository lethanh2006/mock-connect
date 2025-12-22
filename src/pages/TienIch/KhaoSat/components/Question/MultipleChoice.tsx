import { type BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import rules from '@/utils/rules';
import { Checkbox, Form, Input } from 'antd';
import { useIntl } from 'umi';

const MultipleChoice = (props: { question: BieuMau.CauHoi; disabled?: boolean }) => {
	const intl = useIntl();
	const check = Form.useWatch(props.question._id);
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
		<>
			<Form.Item rules={props.question.batBuoc ? [...rules.required] : []} name={[props.question._id, 'listLuaChon']}>
				<Checkbox.Group disabled={props.disabled}>
					{props.question.luaChon?.map((item) => (
						<div key={item._id}>
							<Checkbox value={item.noiDung}>{item.noiDung}</Checkbox>
						</div>
					))}

					{props.question.cauTraLoiKhac ? (
						<Checkbox value='traLoiKhac'>
							{intl.formatMessage({ id: 'khaosat.multipleChoice.form.cautlkhac' })}
						</Checkbox>
					) : null}
				</Checkbox.Group>
			</Form.Item>

			{check?.listLuaChon?.find((item: any) => item === 'traLoiKhac') ? (
				<Form.Item
					name={`${props.question._id}_otherAnswer`}
					rules={props.question.batBuoc ? [...rules.required] : []}
					label={intl.formatMessage({ id: 'khaosat.multipleChoice.form.cautlkhac' })}
				>
					<Input placeholder={intl.formatMessage({ id: 'khaosat.multipleChoice.form.cautlkhac.place' })} />
				</Form.Item>
			) : null}
		</>
	);
};

export default MultipleChoice;
