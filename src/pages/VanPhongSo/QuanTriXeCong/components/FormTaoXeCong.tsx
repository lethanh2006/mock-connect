import { Form, Spin, Card, Button, Input, Select } from 'antd';
import { useModel } from 'umi';
import rules from '@/utils/rules';
import { ECsvc, ELoaiXeCong } from '@/utils/constants';

const FormTao = () => {
  const { loading, edit, setVisibleForm, postXeCongModel, record, putXeCongModel } =
    useModel('quantrixecong');
  const [form] = Form.useForm();

  return (
    <Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
      <Spin spinning={loading}>
        <Form
          layout="vertical"
          onFinish={async (values) => {
            if (!edit) {
              postXeCongModel({ xe: values, loai: ECsvc.XE });
            } else {
              putXeCongModel({
                id: record?._id,
                values: { xe: values, loai: ECsvc.XE },
              });
            }
            setVisibleForm(false);
          }}
          form={form}
        >
          <Form.Item
            name="tenXe"
            label="Tên xe"
            rules={[...rules.required, ...rules.text, ...rules.length(200)]}
            initialValue={record?.info?.tenXe ?? ''}
          >
            <Input placeholder=" Nhập tên xe" />
          </Form.Item>

          <Form.Item
            name="bienSoXe"
            label="Biển số xe"
            rules={[...rules.required, ...rules.text, ...rules.length(10)]}
            initialValue={record?.info?.bienSoXe ?? ''}
          >
            <Input placeholder="Nhập biển số xe" />
          </Form.Item>
          <Form.Item
            name="loaiXe"
            label="Loại xe"
            rules={[...rules.required]}
            initialValue={record?.info?.loaiXe ?? ''}
          >
            <Select placeholder="Chọn loại xe">
              {Object.keys(ELoaiXeCong)?.map((item, index) => (
                <Select.Option key={index} value={ELoaiXeCong?.[item]}>
                  {ELoaiXeCong?.[item] ?? ''}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="ghiChu"
            label="Ghi chú"
            rules={[...rules.text, ...rules.length(500)]}
            initialValue={record?.info?.ghiChu ?? ''}
          >
            <Input.TextArea rows={3} placeholder="Nhập ghi chú" />
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

export default FormTao;
