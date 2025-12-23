import { type BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import { ELoaiCauHoi } from '@/services/TienIch/KhaoSat/constants';
import rules from '@/utils/rules';
import { Col, Form, Input, InputNumber, Row } from 'antd';
import { useIntl } from 'umi';

const Text = (props: { question: BieuMau.CauHoi; disabled?: boolean; isDiemSo?: boolean }) => {
	const intl = useIntl();

	return (
		<Row gutter={[12, 0]}>
			<Col span={props.isDiemSo ? 20 : 24}>
				<Form.Item
					rules={
						props.question.batBuoc
							? [
									...rules.required,
									...(props.question?.loai === ELoaiCauHoi.RENDER_INPUT_RATING
										? rules.number(props.question.gioiHanTrenTuyenTinh, props.question.gioiHanDuoiTuyenTinh)
										: [...rules.text, ...rules.length(500)]),
								]
							: [
									...(props.question?.loai === ELoaiCauHoi.RENDER_INPUT_RATING
										? rules.number(props.question.gioiHanTrenTuyenTinh, props.question.gioiHanDuoiTuyenTinh)
										: []),
								]
					}
					name={[props.question._id, 'traLoiText']}
					extra={
						props.question?.loai === ELoaiCauHoi.RENDER_INPUT_RATING
							? intl.formatMessage(
									{ id: 'khaosat.text.form.extra' },
									{
										gioiHanDuoiTuyenTinh: props.question.gioiHanDuoiTuyenTinh,
										gioiHanTrenTuyenTinh: props.question.gioiHanTrenTuyenTinh,
									},
								)
							: undefined
					}
				>
					{props?.question?.loai === ELoaiCauHoi.RENDER_INPUT ? (
						<Input
							disabled={props.disabled}
							placeholder={intl.formatMessage({ id: 'khaosat.text.form.cautl.place' })}
						/>
					) : props.question?.loai === ELoaiCauHoi.RENDER_INPUT_RATING ? (
						<InputNumber
							placeholder={intl.formatMessage({ id: 'khaosat.text.form.cautl.place' })}
							style={{ width: '100%' }}
						/>
					) : (
						<Input.TextArea
							disabled={props.disabled}
							placeholder={intl.formatMessage({ id: 'khaosat.text.form.cautl.place' })}
							rows={2}
						/>
					)}
				</Form.Item>
			</Col>

			{props.isDiemSo && (
				<Col span={4}>
					<Form.Item name={[props.question._id, 'diem']} label={intl.formatMessage({ id: 'khaosat.text.form.diemso' })}>
						<InputNumber
							disabled
							style={{ width: '100%' }}
							placeholder={intl.formatMessage({ id: 'khaosat.text.form.diemso.place' })}
						/>
					</Form.Item>
				</Col>
			)}
		</Row>
	);
};

export default Text;
