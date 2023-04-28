import rules from '@/utils/rules';
import { toRegex } from '@/utils/utils';
import { Button, Card, Col, Form, Row, Select, Spin } from 'antd';
import _ from 'lodash';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormChuTri = (props: any) => {
  const { onCancel } = props;
  const { danhSachChuTri, postChuTriModel, getAllChuTriModel } = useModel('lichtuan');
  const {
    danhSachNguoiDungCuThe,
    loading: loadingUser,
    setConditionNguoiDungCuThe,
    conditionNguoiDungCuThe,
    getUserMetaDataFilterModel,
  } = useModel('user');
  const [form] = Form.useForm();

  const debouncedSearchCanBo = _.debounce((value) => {
    setConditionNguoiDungCuThe({
      ...conditionNguoiDungCuThe,
      name: toRegex(value),
    });
  }, 800);

  useEffect(() => {
    getUserMetaDataFilterModel(1, 20);
  }, [conditionNguoiDungCuThe]);

  const onFinish = (values: any) => {
    const listIds = danhSachChuTri.map((item) => item.id);
    if (!listIds.includes(values.canBo)) listIds.push(values.canBo);
    postChuTriModel({ listIds }).then(() => {
      getAllChuTriModel();
      onCancel();
    });
  };

  return (
    <Card title="Thêm mới">
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Row style={{ marginBottom: 12 }}>
          <Col span={24}>
            <Form.Item label="Chọn cán bộ" name={'canBo'} rules={[...rules.required]}>
              <Select
                onSearch={(value) => debouncedSearchCanBo(value)}
                showSearch
                placeholder="Tìm kiếm theo Họ tên cán bộ"
                optionFilterProp="label"
                options={danhSachNguoiDungCuThe.map((item) => ({
                  key: item?._id,
                  value: item?.odooInfo?.employeeId,
                  label: `${item.name} - ${item.code}`,
                }))}
                notFoundContent={loadingUser ? <Spin size="small" /> : null}
              />
            </Form.Item>
          </Col>
        </Row>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Button type="primary" htmlType="submit">
            Thêm cán bộ chủ trì
          </Button>
          <Button onClick={() => onCancel()}>Đóng</Button>
        </div>
      </Form>
    </Card>
  );
};

export default FormChuTri;
