import UploadOne from '@/components/Upload/UploadFile';
import { uploadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { renderFileListUrlWithName } from '@/utils/utils';
import { Button, Card, Form, Input } from 'antd';
import { useModel } from 'umi';

const FormFile = () => {
  const [form] = Form.useForm();

  const { loading, record, setVisibleFormFile, editFile, putModel, recordFile, setLoading } =
    useModel('vanbanhuongdan');
  return (
    <Card title={editFile ? 'Chỉnh sửa' : 'Thêm mới'}>
      <Form
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          setLoading(true);
          if (values?.taiLieu?.fileList?.[0]?.url) {
            values.url = values?.taiLieu?.fileList?.[0]?.url;
          } else {
            const response = await uploadFile({
              file: values?.taiLieu?.fileList?.[0]?.originFileObj,
              // filename: 'fileName',
              public: '1',
            });
            values.url = response?.data?.data?.url;
          }
          delete values.taiLieu;
          if (editFile) {
            const index = recordFile?.index ? recordFile.index - 1 : 0;
            if (record) record.danhSachTep[index] = values;
          } else {
            if (record) record.danhSachTep.push(values);
          }
          if (record) putModel(record?._id ?? '', record);
        }}
        form={form}
      >
        <Form.Item
          name="ten"
          label="Tên văn bản"
          rules={[...rules.required, ...rules.text, ...rules.length(200)]}
          initialValue={recordFile?.ten}
        >
          <Input placeholder="Tên văn bản" />
        </Form.Item>
        <Form.Item
          name="moTa"
          label="Mô tả"
          rules={[...rules.text, ...rules.length(200)]}
          initialValue={recordFile?.moTa}
        >
          <Input.TextArea rows={3} placeholder="Mô tả" />
        </Form.Item>
        <Form.Item
          name="taiLieu"
          rules={[...rules.fileRequired]}
          initialValue={renderFileListUrlWithName(recordFile?.url ?? '', recordFile?.ten)}
          label="Tài liệu"
        >
          <UploadOne maxCount={1} />
        </Form.Item>
        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
            {!editFile ? 'Thêm mới' : 'Lưu'}
          </Button>
          <Button onClick={() => setVisibleFormFile(false)}>Đóng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormFile;
