import TinyEditor from '@/components/TinyEditor';
import UploadFile from '@/components/Upload/UploadFile';
import rules from '@/utils/rules';
import { Button, Form, Input } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';

const FormNoiDungBuoiHoc = (props: { getData?: any }) => {
  const { record } = useModel('hoctap.loptinchi');
  const [form] = Form.useForm();
  const [formSubmitting, setFormSubmitting] = useState(false);

  const onFinish = async (values: any) => {
    console.log(values, 'values');
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        name={'tieu_de_bai_hoc'}
        label="Tiêu đề bài học:"
        rules={[...rules.text, ...rules.length(200)]}
      >
        <Input placeholder="Nhập tiêu đề bài học" />
      </Form.Item>

      <Form.Item
        name={'noi_dung_bai_hoc'}
        label="Nội dung:"
        // rules={[...rules.requiredHtml]}
      >
        <TinyEditor height={350} />
      </Form.Item>

      <Form.Item name={'url_bai_hoc'} label="File đính kèm:" rules={[...rules.fileLimit(5)]}>
        <UploadFile
          otherProps={{
            // maxCount: 5,
            accept: '.pdf, .doc, .docx, .png, .jpg, .jpeg, .pptx, .zip, .rar',
            multiple: true,
            showUploadList: { showDownloadIcon: false },
          }}
          // limit={5}
        />
      </Form.Item>

      <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
        <Button loading={formSubmitting} htmlType="submit" type="primary">
          Cập nhật
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormNoiDungBuoiHoc;
