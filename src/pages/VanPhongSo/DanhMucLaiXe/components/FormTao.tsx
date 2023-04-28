import { Form, Spin, Card, Button, Input } from 'antd';
import { useModel } from 'umi';
import rules from '@/utils/rules';

const FormTaoLaiXe = () => {
  const { edit, loading, record, setVisibleForm, postLaiXeModel, putLaiXeModel, setEdit } =
    useModel('quanlylaixe');

  const [form] = Form.useForm();

  return (
    <Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
      <Spin spinning={loading}>
        <Form
          layout="vertical"
          onFinish={async (values) => {
            if (!edit) {
              postLaiXeModel(values);
            } else {
              putLaiXeModel(record?._id ?? '', values);
              setEdit(false);
            }
            setVisibleForm(false);
            form.resetFields();
          }}
          form={form}
        >
          <Form.Item
            name="hoTen"
            label="Họ và tên"
            rules={[...rules.required, ...rules.text, ...rules.length(50)]}
            initialValue={record?.hoTen ?? ''}
          >
            <Input placeholder="Nhập họ và tên lái xe" />
          </Form.Item>

          <Form.Item
            name="soDienThoai"
            label="Số điện thoại"
            rules={[...rules.required, ...rules.soDienThoai]}
            initialValue={record?.soDienThoai ?? ''}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
          <Form.Item
            name="khac"
            label="Thông tin khác"
            rules={[...rules.text, ...rules.length(500)]}
            initialValue={record?.khac ?? ''}
          >
            <Input.TextArea rows={3} placeholder="Nhập thông tin khác" />
          </Form.Item>

          <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
              Lưu
            </Button>
            <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
          </Form.Item>
        </Form>
      </Spin>
    </Card>
  );
};

export default FormTaoLaiXe;
