/* eslint-disable no-param-reassign */
import { EDoiTuong } from '@/services/VanBanHuongDan/constant';
import type { VanBanHuongDan } from '@/services/VanBanHuongDan/typing';
import rules from '@/utils/rules';
import { Button, Card, Form, Input } from 'antd';
import { useModel } from 'umi';

const FormBaiHoc = () => {
  const [form] = Form.useForm();

  const { loading, record, setVisibleForm, edit, postModel, putModel, getModel } =
    useModel('vanbanhuongdan');
  // const { danhSachHinhThucDaoTao } = useModel('lophanhchinh');
  // const [phamVi, setPhamVi] = useState<string>(record?.phamVi ?? '');
  // const [doiTuong, setDoiTuong] = useState<string>(record?.doiTuong ?? 'Tất cả');

  const getData = () => {
    getModel(undefined, undefined, undefined, undefined, undefined, 'page');
  };

  return (
    <Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
      <Form
        labelCol={{ span: 24 }}
        onFinish={async (values: VanBanHuongDan.IRecord) => {
          if (edit) putModel(record?._id ?? '', { ...values, doiTuong: EDoiTuong.TAT_CA }, getData);
          else postModel({ ...values, doiTuong: EDoiTuong.TAT_CA }, getData);
        }}
        form={form}
      >
        <Form.Item
          name="ten"
          label="Tên thư mục"
          rules={[...rules.required, ...rules.text, ...rules.length(200)]}
          initialValue={record?.ten}
        >
          <Input placeholder="Tên thư mục" />
        </Form.Item>
        <Form.Item
          name="moTa"
          label="Mô tả"
          rules={[...rules.text, ...rules.length(200)]}
          initialValue={record?.moTa}
        >
          <Input.TextArea rows={3} placeholder="Mô tả" />
        </Form.Item>
        {/* <Form.Item
          rules={[...rules.required]}
          name="doiTuong"
          label="Đối tượng"
          initialValue={doiTuong}
        >
          <Select
            onChange={(val: string) => {
              setDoiTuong(val);
            }}
            placeholder="Chọn đối tượng"
          >
            {['Tất cả', 'Vai trò'].map((item) => (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
        </Form.Item> */}
        {/* {doiTuong === 'Vai trò' && (
          <Form.Item
            rules={[...rules.required]}
            name="vaiTro"
            label="Vai trò"
            initialValue={record?.vaiTro}
          >
            <Select mode="multiple" placeholder="Chọn vai trò">
              {[
                { value: 'nhan_vien', name: 'Cán bộ, giảng viên' },
                { value: 'sinh_vien', name: 'Sinh viên' },
              ].map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )} */}

        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
            {!edit ? 'Thêm mới' : 'Lưu'}
          </Button>
          <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormBaiHoc;
