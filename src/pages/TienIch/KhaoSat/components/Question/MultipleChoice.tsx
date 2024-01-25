import { type BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import rules from '@/utils/rules';
import { Checkbox, Form, type FormInstance } from 'antd';
import { useEffect, useState } from 'react';

const MultipleChoice = (props: {
	question: BieuMau.CauHoi;
	indexKhoi: number;
	indexCauHoi: number;
	traLoi?: any;
	form: FormInstance;
}) => {
	const [idCauTraLoi, setIdCauTraLoi] = useState<string>();

	const handleRenderTraLoi = () => {
		if (props.traLoi) {
			props.question?.luaChon?.forEach((val) => {
				if (props?.traLoi?.listLuaChon?.includes(val?.noiDung)) {
					setIdCauTraLoi(val?._id);
				}
			});
		} else {
			setIdCauTraLoi(undefined);
		}
	};

	useEffect(() => {
		handleRenderTraLoi();
	}, [props.traLoi]);

	useEffect(() => {
		props.form.setFieldsValue({
			[`${props.indexKhoi}||${props.indexCauHoi}`]: idCauTraLoi ? idCauTraLoi : undefined,
		});
	}, [idCauTraLoi]);

	return (
		<Form.Item
			rules={props.question.batBuoc ? [...rules.required] : []}
			name={`${props.indexKhoi}||${props.indexCauHoi}`}
		>
			<Checkbox.Group>
				{props.question.luaChon?.map((item) => (
					<div key={item._id}>
						<Checkbox value={item._id}>{item.noiDung}</Checkbox>
					</div>
				))}
			</Checkbox.Group>
		</Form.Item>
	);
};

export default MultipleChoice;
