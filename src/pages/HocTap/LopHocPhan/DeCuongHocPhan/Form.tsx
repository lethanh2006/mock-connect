import rules from '@/utils/rules';
import { Button, Col, Form, Input, InputNumber, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormHocPhan = (props: { afterAddNew: (rec: HocPhan.IRecord) => void }) => {
  const [form] = Form.useForm();
  const { afterAddNew } = props;
  const {
    record,
    setRecord,
    setVisibleForm,
    edit,
    setEdit,
    postModel,
    putModel,
    getModel,
    formSubmiting,
  } = useModel('hocphan.hocphan');

  useEffect(() => {
    if (record?._id) form.setFieldsValue(record);
    else form.resetFields();
  }, [record?._id]);

  const onFinish = async (values: HocPhan.IRecord) => {
    if (edit) {
      putModel(record?._id ?? '', values, getModel, undefined, false)
        .then()
        .catch((er) => console.log(er));
    } else
      postModel(values, getModel, false)
        .then((rec) => {
          setRecord(rec);
          setEdit(true);
          if (afterAddNew) afterAddNew(rec);
        })
        .catch((er) => console.log(er));
  };

  return (
    <Form onFinish={onFinish} form={form} layout="vertical" aria-readonly>
      <Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
        <Col xs={24}>
          <Form.Item
            name="ten"
            label="Tên học phần (tiếng Việt)"
            rules={[...rules.required, ...rules.text, ...rules.length(250)]}
          >
            <Input placeholder="Nhập tên học phần" />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item
            name="tenTiengAnh"
            label="Tên học phần (tiếng Anh)"
            rules={[...rules.text, ...rules.length(250)]}
          >
            <Input placeholder="Nhập tên học phần" />
          </Form.Item>
        </Col>
        {/* <Col xs={24}>
          <Form.Item name="donVi" label="Đơn vị quản lý">
            <SelectDonVi />
          </Form.Item>
        </Col> */}

        <Col xs={24} md={12}>
          <Form.Item
            name="ma"
            label="Mã học phần"
            rules={[...rules.required, ...rules.text, ...rules.length(20)]}
          >
            <Input placeholder="Nhập mã học phần" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            name="soTinChi"
            label="Số tín chỉ"
            rules={[...rules.required, ...rules.number(10, 1, false)]}
          >
            <InputNumber placeholder="Nhập số tín chỉ" min={1} max={10} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default FormHocPhan;
