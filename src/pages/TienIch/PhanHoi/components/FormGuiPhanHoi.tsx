import UploadFile from '@/components/Upload/UploadFile';
import { ELoaiPhanHoi } from '@/services/TienIch/PhanHoi/constant';
import { type PhanHoi } from '@/services/TienIch/PhanHoi/typing';
import { buildUpLoadFile } from '@/services/uploadFile';
import rules from '@/utils/rules';
import { Button, Card, Form, Input } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormGuiPhanHoi = () => {
  const [form] = Form.useForm();
  const { loading, setVisibleForm, postModel, record, getModel, setFormSubmiting, formSubmiting } =
    useModel('tienich.phanhoi');

  useEffect(() => {
    if (record?._id) form.setFieldsValue(record);
    else form.resetFields();
  }, [record?._id]);

  const onFinish = async (values: PhanHoi.IRecord) => {
    setFormSubmiting(true);
    try {
      const urlPhanAnh = await buildUpLoadFile(values, 'urlPhanAnh');
      values.urlPhanAnh = urlPhanAnh;
      setFormSubmiting(false);

      values.loaiPhanHoi = ELoaiPhanHoi.KHAC;
      postModel(values)
        .then(() => getModel(undefined, undefined, undefined, undefined, undefined, 'me'))
        .catch((er) => console.log(er));
    } catch (er) {
      console.log(er);
    } finally {
      setFormSubmiting(false);
    }
  };

  return (
    <Card loading={loading} title="Gửi phản hồi">
      <Form layout="vertical" onFinish={onFinish} form={form}>
        <Form.Item
          name="noiDungPhanHoi"
          label="Nội dung phản hồi"
          rules={[...rules.required, ...rules.text, ...rules.length(2000)]}
        >
          <Input.TextArea rows={4} placeholder="Nhập nội dung" />
        </Form.Item>

        <Form.Item name="urlPhanAnh" label="File đính kèm">
          <UploadFile
            otherProps={{
              maxCount: 1,
              multiple: false,
              showUploadList: { showDownloadIcon: false },
            }}
          />
        </Form.Item>

        <div className="form-footer">
          <Button loading={formSubmiting} htmlType="submit" type="primary">
            Gửi
          </Button>
          <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
        </div>
      </Form>
    </Card>
  );
};

export default FormGuiPhanHoi;
