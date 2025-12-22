import UploadFile from '@/components/Upload/UploadFile';
import { type BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import rules from '@/utils/rules';
import { Col, Form, InputNumber, Row } from 'antd';
import { useIntl } from 'umi';

const FileChoice = (props: { question: BieuMau.CauHoi; disabled?: boolean; isDiemSo?: boolean }) => {
	const intl = useIntl();

	return (
		<Row gutter={[12, 0]}>
			<Col span={props.isDiemSo ? 20 : 24}>
				<Form.Item
					rules={props.question.batBuoc ? [...rules.fileRequired] : []}
					name={[props.question._id, 'listUrlFile']}
					extra={
						<i>
							<small>{intl.formatMessage({ id: 'khaosat.filechoice.form.upload' })}</small>
						</i>
					}
				>
					<UploadFile
						accept='image/*, .pdf, .doc, .docx, .png, .jpg'
						otherProps={{ showUploadList: { showDownloadIcon: false }, disabled: props?.disabled }}
						maxCount={5}
						resize
					/>
				</Form.Item>
			</Col>
			{props.isDiemSo && (
				<Col span={4}>
					<Form.Item
						name={[props.question._id, 'diem']}
						label={intl.formatMessage({ id: 'khaosat.filechoice.form.diemso' })}
					>
						<InputNumber
							disabled
							style={{ width: '100%' }}
							placeholder={intl.formatMessage({ id: 'khaosat.filechoice.form.diemso.place' })}
						/>
					</Form.Item>
				</Col>
			)}
		</Row>
	);
};

export default FileChoice;
