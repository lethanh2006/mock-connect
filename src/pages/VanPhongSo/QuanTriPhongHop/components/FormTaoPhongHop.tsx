import { Form, Spin, Card, Button, Input, InputNumber } from 'antd';
import { useModel } from 'umi';
import rules from '@/utils/rules';
import { ECsvc } from '@/utils/constants';

const FormTaoPhongHop = () => {
  const { loading, edit, setVisibleForm, postPhongHopModel, putPhongHopModel, record } =
    useModel('quantriphonghop');
  const [form] = Form.useForm();

  return (
    <Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
      <Spin spinning={loading}>
        <Form
          layout="vertical"
          onFinish={async (values) => {
            if (!edit) {
              postPhongHopModel({ phongHop: values, loai: ECsvc.PHONG });
            } else {
              putPhongHopModel({
                id: record?._id,
                values: { phongHop: values, loai: ECsvc.PHONG },
              });
            }
            setVisibleForm(false);
          }}
          form={form}
        >
          <Form.Item
            name="toaNha"
            label="Tòa nhà"
            rules={[...rules.required, ...rules.text, ...rules.length(200)]}
            initialValue={record?.info?.toaNha ?? ''}
          >
            <Input placeholder="Nhập tòa nhà" />
          </Form.Item>
          <Form.Item
            name="tenPhong"
            label="Tên phòng"
            rules={[...rules.required, ...rules.text, ...rules.length(200)]}
            initialValue={record?.info?.tenPhong ?? ''}
          >
            <Input placeholder="Nhập tên phòng" />
          </Form.Item>

          <Form.Item
            name="soPhong"
            label="Số phòng"
            rules={[...rules.required, ...rules.text, ...rules.length(20)]}
            initialValue={record?.info?.soPhong ?? ''}
          >
            <Input placeholder="Nhập số phòng" />
          </Form.Item>

          <Form.Item
            name="soCho"
            label="Số chỗ ngồi"
            rules={[...rules.required, ...rules.number(10000, 0)]}
            initialValue={record?.info?.soCho ?? ''}
          >
            <InputNumber
              min={0}
              max={10000}
              placeholder=" Nhập số chỗ ngồi"
              style={{ width: '100%' }}
            />
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

export default FormTaoPhongHop;
