import { type BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import rules from '@/utils/rules';
import { Input, Form, type FormInstance } from 'antd';
import { useEffect } from 'react';

const Text = (props: {
	question: BieuMau.CauHoi;
	indexKhoi: number;
	indexCauHoi: number;
	traLoi?: any;
	form: FormInstance;
}) => {
	useEffect(() => {
		props.form.setFieldsValue({
			[`${props.indexKhoi}||${props.indexCauHoi}`]: props?.traLoi?.traLoiText ? props?.traLoi?.traLoiText : undefined,
		});
	}, [props?.traLoi?.traLoiText]);

	return (
		<Form.Item
			rules={props.question.batBuoc ? [...rules.required, ...rules.text, ...rules.length(500)] : []}
			name={`${props.indexKhoi}||${props.indexCauHoi}`}
		>
			<Input.TextArea placeholder='Nhập câu trả lời' rows={3} />
		</Form.Item>
	);
};

export default Text;
