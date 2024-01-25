import UploadFile from '@/components/Upload/UploadFile';
import { type BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import rules from '@/utils/rules';
import { Form, type FormInstance } from 'antd';
import { useEffect } from 'react';

const FileChoice = (props: {
	question: BieuMau.CauHoi;
	indexKhoi: number;
	indexCauHoi: number;
	traLoi?: any;
	form: FormInstance;
}) => {
	useEffect(() => {
		props.form.setFieldsValue({
			[`${props.indexKhoi}||${props.indexCauHoi}`]: props?.traLoi?.listUrlFile ? props?.traLoi?.listUrlFile : undefined,
		});
	}, [props?.traLoi?.listUrlFile]);

	return (
		<Form.Item
			rules={props.question.batBuoc ? [...rules.fileRequired] : []}
			name={`${props.indexKhoi}||${props.indexCauHoi}`}
			extra='Tối đa 5 file, định dạng cho phép: File ảnh, .pdf, .doc, .docx.'
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
