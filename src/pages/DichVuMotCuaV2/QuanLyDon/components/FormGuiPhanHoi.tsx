import { ELoaiPhanHoi } from '@/pages/TienIch/PhanHoi/constants';
import { type DichVuMotCuaV2 } from '@/services/DVMC/DichVuMotCuaV2/typing';
import rules from '@/utils/rules';
import { Button, Card, Form, Input } from 'antd';
import { useModel } from 'umi';

const FormGuiPhanHoi = (props: { record?: DichVuMotCuaV2.Don & { index?: number } }) => {
  const [form] = Form.useForm();
  const { loading, setVisibleForm, postModel } = useModel('tienich.phanhoi');
  const { getDonSinhVienModel } = useModel('dvmc.dichvumotcuav2');
  return (
    <Card loading={loading} title="Gửi phản hồi">
      <Form
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          postModel(
            { ...values, idDonDVMC: props.record?._id, loaiPhanHoi: ELoaiPhanHoi.DVMC },
            getDonSinhVienModel,
            true,
          );
        }}
        form={form}
      >
        <Form.Item
          name="noiDungPhanHoi"
          label="Nội dung phản hồi"
          rules={[...rules.required, ...rules.text, ...rules.length(2000)]}
        >
          <Input.TextArea rows={4} placeholder="Nhập nội dung" />
        </Form.Item>
        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
            Gửi
          </Button>

          <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormGuiPhanHoi;
