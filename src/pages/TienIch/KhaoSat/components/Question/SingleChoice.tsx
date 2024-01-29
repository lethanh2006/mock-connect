import { type BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import rules from '@/utils/rules';
import { Radio, Form, type FormInstance } from 'antd';
import { useEffect, useState } from 'react';

const SingleChoice = (props: {
	question: BieuMau.CauHoi;
	// indexKhoi: number;
	// indexCauHoi: number;
	traLoi?: BieuMau.TraLoiRecord;
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
			[props.question._id]: idCauTraLoi ? idCauTraLoi : undefined,
		});
	}, [idCauTraLoi]);

	return (
		<Form.Item rules={props.question.batBuoc ? [...rules.required] : []} name={props.question._id}>
			<Radio.Group>
				{props.question?.luaChon?.map((item) => (
					<div key={item._id}>
						<Radio value={item._id}>{item.noiDung}</Radio>
					</div>
				))}
			</Radio.Group>
		</Form.Item>
	);
};

export default SingleChoice;
