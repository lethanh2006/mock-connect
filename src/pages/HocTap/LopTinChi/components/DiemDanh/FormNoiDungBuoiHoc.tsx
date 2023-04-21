import TinyEditor from '@/components/TinyEditor/Tiny';
import Upload from '@/components/Upload/UploadMultiFile';
import rules from '@/utils/rules';
import { renderFileList, uploadMultiFile } from '@/utils/utils';
import { Button, Form, Input } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';

const FormNoiDungBuoiHoc = (props: { getData?: any }) => {
  const { record, giangVienLuuThongTinBuoiHocModel } = useModel('diemdanh');
  const [form] = Form.useForm();
  const [formSubmitting, setFormSubmitting] = useState(false);

  const onFinish = async (values: any) => {
    if (formSubmitting) return;
    setFormSubmitting(true);

    const urlFileDinhKem = await uploadMultiFile(values?.url_bai_hoc?.fileList);

    await giangVienLuuThongTinBuoiHocModel({
      ...values,
      noi_dung_bai_hoc:
        values.noi_dung_bai_hoc?.text && values.noi_dung_bai_hoc?.text !== ''
          ? values.noi_dung_bai_hoc?.text
          : '',
      url_bai_hoc: urlFileDinhKem,
    })
      ?.then(() => {
        if (props.getData) props.getData();
      })
      ?.catch(console.error)
      .finally(() => {
        setFormSubmitting(false);
      });
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        name={'tieu_de_bai_hoc'}
        label="Tiêu đề bài học:"
        initialValue={
          record?.tieu_de_bai_hoc &&
          record?.tieu_de_bai_hoc !== '' &&
          record?.tieu_de_bai_hoc !== 'false'
            ? record?.tieu_de_bai_hoc
            : ''
        }
        rules={[...rules.text, ...rules.length(200)]}
      >
        <Input placeholder="Nhập tiêu đề bài học" />
      </Form.Item>

      <Form.Item
        name={'noi_dung_bai_hoc'}
        label="Nội dung:"
        initialValue={{ text: record?.noi_dung_bai_hoc ?? '' }}
        // rules={[...rules.requiredHtml]}
      >
        <TinyEditor height={350} />
      </Form.Item>

      <Form.Item
        name={'url_bai_hoc'}
        label="File đính kèm:"
        initialValue={
          record?.url_bai_hoc ? renderFileList(record?.url_bai_hoc ?? []) : { fileList: [] }
        }
        rules={[...rules.fileLimit(5)]}
      >
        <Upload
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
