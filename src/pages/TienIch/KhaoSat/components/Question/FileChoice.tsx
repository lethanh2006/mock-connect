import UploadFile from '@/components/Upload/UploadFile';
import { type BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import rules from '@/utils/rules';
import { Form, type FormInstance } from 'antd';
import { useEffect } from 'react';

const FileChoice = (props: { question: BieuMau.CauHoi; traLoi?: BieuMau.TraLoiRecord; form: FormInstance }) => {
	useEffect(() => {
		props.form.setFieldsValue({
			[props.question._id]: props?.traLoi?.listUrlFile ? props?.traLoi?.listUrlFile : undefined,
		});
	}, [props?.traLoi?.listUrlFile]);

	return (
		<Form.Item
			rules={props.question.batBuoc ? [...rules.fileRequired] : []}
			name={props.question._id}
			extra={
				<i>
					<small>Định dạng cho phép: file ảnh, file PDF, file Word</small>
				</i>
			}
		>
			<UploadFile
				otherProps={{
					multiple: true,
					accept: 'image/*, .pdf, .doc, .docx, .png, .jpg',
					showUploadList: { showDownloadIcon: false },
				}}
				maxCount={5}
			/>
		</Form.Item>
	);
};

export default FileChoice;
