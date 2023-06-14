import { type DichVuMotCuaV2 } from '@/services/DVMC/DichVuMotCuaV2/typing';
import { ELoaiPhanHoi } from '@/services/TienIch/PhanHoi/constant';
import rules from '@/utils/rules';
import { Button, Card, Form, Input } from 'antd';
import { useModel } from 'umi';

const FormGuiPhanHoi = (props: { record?: DichVuMotCuaV2.Don & { index?: number } }) => {
  const [form] = Form.useForm();
  const { loading, setVisibleForm, postModel, formSubmiting } = useModel('tienich.phanhoi');
  const { getDonSinhVienModel } = useModel('dvmc.dichvumotcuav2');

  return (
    <Card loading={loading} title="Gửi phản hồi">
      <Form
        layout="vertical"
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
