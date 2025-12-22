import { type BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import rules from '@/utils/rules';
import { Form, Input, Radio, type FormInstance } from 'antd';
import { useIntl } from 'umi';

const SingleChoice = (props: { question: BieuMau.CauHoi; form: FormInstance; disabled?: boolean }) => {
	const intl = useIntl();
	const check = Form.useWatch(props.question._id);

	return (
		<>
			<Form.Item rules={props.question.batBuoc ? [...rules.required] : []} name={props.question._id}>
				<Radio.Group disabled={props.disabled}>
					{props.question?.luaChon?.map((item) => (
						<div key={item._id}>
							<Radio value={item.noiDung}>{item.noiDung}</Radio>
						</div>
					))}
					{props.question.cauTraLoiKhac ? (
						<Radio value='traLoiKhac'>{intl.formatMessage({ id: 'khaosat.multipleChoice.form.cautlkhac' })}</Radio>
					) : null}
				</Radio.Group>
			</Form.Item>

			{check === 'traLoiKhac' ? (
				<Form.Item
					name={`${props.question._id}_otherAnswer`}
					rules={props.question.batBuoc ? [...rules.required] : []}
					label={intl.formatMessage({ id: 'khaosat.multipleChoice.form.cautlkhac' })}
				>
					<Input
						disabled={props.disabled}
						placeholder={intl.formatMessage({ id: 'khaosat.multipleChoice.form.cautlkhac.place' })}
					/>
				</Form.Item>
			) : null}
		</>
	);
};

export default SingleChoice;
