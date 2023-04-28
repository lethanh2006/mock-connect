import { useEffect } from 'react';
import { Form, Card, Button, Select, Input, Row, Col, AutoComplete } from 'antd';
import rules from '@/utils/rules';
import { useModel } from 'umi';
import { ELoaiXe } from '@/utils/constants';
import _ from 'lodash';

const FormOto = () => {
  const [form] = Form.useForm();
  const { edit, setEdit, setVisibleForm, record, loading, postQuanLyOtoModel, putQuanLyOtoModel } =
    useModel('quanlyoto');
  const { getAllDonViLaModel, danhSach } = useModel('donvi');
  const { getUserModel, danhSach: danhSachCanBo, setCondition, condition } = useModel('user');

  useEffect(() => {
    getAllDonViLaModel();
    return () => {
      setCondition({});
    };
  }, []);

  useEffect(() => {
    getUserModel({ vaiTroParam: 'nhan_vien' });
  }, [condition]);

  const debouncedSearchUser = _.debounce((value) => {
    setCondition({ ...condition, name: value });
  }, 800);

  return (
    <Card title={edit ? 'Chỉnh sửa' : 'Thêm mới'}>
      <Form
        labelCol={{ span: 24 }}
        onFinish={async (values) => {
          if (!edit) {
            postQuanLyOtoModel(values);
          } else {
            putQuanLyOtoModel(record?._id ?? '', values);
            setEdit(false);
          }
          setCondition({});
          form.resetFields();
        }}
        form={form}
      >
        <Row gutter={[12, 0]}>
          <Col span={24} md={12}>
            <Form.Item
              rules={[...rules.required, ...rules.text]}
              initialValue={record?.hoTen}
              name="hoTen"
              label="Cán bộ"
            >
              <AutoComplete
                allowClear
                options={danhSachCanBo?.map((user: Login.Profile) => ({
                  ...user,
                  key: user.ma_dinh_danh,
                  value: `${user.name} (${user.ma_dinh_danh})`,
                  label: `${user.name} (${user.ma_dinh_danh})`,
                }))}
                placeholder="Tìm kiếm họ tên cán bộ"
                onSearch={(value) => debouncedSearchUser(value)}
                onSelect={(value: string, option: Login.Profile) => {
                  if (value) {
                    form.setFieldsValue({
                      donVi: option.ten_don_vi,
                      email:
                        option.email_to_chuc.toString() !== 'false' ? option.email_to_chuc : '',
                      soDienThoai:
                        option.so_dien_thoai.toString() !== 'false' ? option.so_dien_thoai : '',
                      hoTen: option.name,
                    });
                  } else {
                    form.resetFields(['donVi', 'email', 'soDienThoai']);
                  }
                }}
                filterOption={(inputValue, option) =>
                  option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                }
              />
            </Form.Item>
          </Col>
          <Col span={24} md={12}>
            <Form.Item
              rules={[...rules.required, ...rules.text]}
              initialValue={record?.donVi}
              name="donVi"
              label="Đơn vị"
            >
              <AutoComplete
                options={danhSach?.map((donvi) => ({
                  key: donvi.id,
                  value: donvi.ten_don_vi,
                  label: donvi.ten_don_vi,
                }))}
                placeholder="Nhập đơn vị"
                filterOption={(inputValue, option) =>
                  option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                }
              />
            </Form.Item>
          </Col>

          <Col span={24} md={12}>
            <Form.Item
              rules={[...rules.soDienThoai]}
              initialValue={record?.soDienThoai}
              name="soDienThoai"
              label="Số điện thoại"
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>
          </Col>
          <Col span={24} md={12}>
            <Form.Item
              rules={[...rules.text]}
              initialValue={record?.email}
              name="email"
              label="Email"
            >
              <Input placeholder="Nhập Email" />
            </Form.Item>
          </Col>
          <Col span={24} md={12}>
            <Form.Item
              rules={[...rules.required]}
              initialValue={edit ? record?.loaiXe : 'Khách'}
              name="loaiXe"
              label="Loại xe"
            >
              <Select
                placeholder="Nhập loại xe"
                options={Object.keys(ELoaiXe).map((key) => ({
                  key,
                  value: ELoaiXe[key],
                  label: ELoaiXe[key],
                }))}
              />
            </Form.Item>
          </Col>

          <Col span={24} md={12}>
            <Form.Item
              rules={[...rules.required, ...rules.text]}
              initialValue={record?.bienSoXe}
              name="bienSoXe"
              label="Biển số"
            >
              <Input placeholder="Nhập biển số" />
            </Form.Item>
          </Col>

          <Col span={24} md={12}>
            <Form.Item
              rules={[...rules.required, ...rules.text]}
              initialValue={record?.hangXe}
              name="hangXe"
              label="Hãng xe"
            >
              <Input placeholder="Nhập hãng xe" />
            </Form.Item>
          </Col>
          <Col span={24} md={12}>
            <Form.Item
              rules={[...rules.text]}
              initialValue={record?.tenXe}
              name="tenXe"
              label="Tên xe"
            >
              <Input placeholder="Nhập tên xe" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
            {edit ? 'Cập nhật' : 'Tạo'}
          </Button>
          <Button
            onClick={() => {
              setVisibleForm(false);
              form.resetFields();
            }}
          >
            Đóng
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormOto;
