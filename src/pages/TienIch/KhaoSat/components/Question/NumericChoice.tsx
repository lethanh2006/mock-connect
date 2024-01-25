import { type BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import rules from '@/utils/rules';
import { Radio, Form, type FormInstance } from 'antd';
import { useEffect } from 'react';

const NumericChoice = (props: {
	question: BieuMau.CauHoi;
	indexKhoi: number;
	indexCauHoi: number;
	traLoi?: any;
	form: FormInstance;
}) => {
	const arrValue: number[] = [];
	for (let i = props.question?.gioiHanDuoiTuyenTinh; i <= props.question?.gioiHanTrenTuyenTinh; i++) arrValue.push(i);

	useEffect(() => {
		props.form.setFieldsValue({
			[`${props.indexKhoi}||${props.indexCauHoi}`]: props?.traLoi?.luaChonTuyenTinh
				? props?.traLoi?.luaChonTuyenTinh
				: undefined,
		});
	}, [props?.traLoi?.luaChonTuyenTinh]);

	return (
		<Form.Item
			rules={props.question.batBuoc ? [...rules.required] : []}
			name={`${props.indexKhoi}||${props.indexCauHoi}`}
		>
			<Radio.Group>
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
