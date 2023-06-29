import UploadFile from '@/components/Upload/UploadFile';
import { type BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import rules from '@/utils/rules';
import { Form } from 'antd';

const FileChoice = (props: {
  question: BieuMau.CauHoi;
  indexKhoi: number;
  indexCauHoi: number;
}) => {
  return (
    <Form.Item
      rules={props.question.batBuoc ? [...rules.fileRequired] : []}
      name={`${props.indexKhoi}||${props.indexCauHoi}`}
      extra="Tối đa 5 file, định dạng cho phép: File ảnh, .pdf, .doc, .docx."
    >
      <UploadFile
        otherProps={{
          multiple: true,
          accept: 'image/*, .pdf, .doc, .docx',
          showUploadList: { showDownloadIcon: false },
        }}
        maxCount={5}
      />
    </Form.Item>
  );
};

export default FileChoice;
