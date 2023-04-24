import rules from '@/utils/rules';
import { Button, Card, Col, DatePicker, Form, Input, Row } from 'antd';
import moment from 'moment';
import mm from 'moment-timezone';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
mm.tz.setDefault('Asia/Ho_Chi_Minh');

const FormLichCaNhan = () => {
  const [form] = Form.useForm();
  const { record, edit, setVisibleForm, postModel, putModel, getModel, formSubmiting } =
    useModel('sukien');
  const [startDate, setStartDate] = useState<string>();

  useEffect(() => {
    if (record?._id) form.setFieldsValue(record);
    else form.resetFields();
  }, [record?._id]);

  const onFinish = async (values: SuKien.IRecord) => {
    if (edit) {
      putModel(record?._id ?? '', values, getModel)
        .then()
        .catch((er) => console.log(er));
    } else
      postModel(values, getModel)
        .then(() => form.resetFields())
        .catch((er) => console.log(er));
  };

  return (
    <Card title={edit ? 'Chỉnh sửa sự kiện' : 'Thêm sự kiện'}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={[12, 12]}>
          <Col xs={24}>
            <Form.Item
              rules={[...rules.required, ...rules.text, ...rules.length(300)]}
              name="tenSuKien"
              label="Tên sự kiện"
            >
              <Input placeholder="Tên sự kiện" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item rules={[...rules.required]} name="thoiGianBatDau" label="Thời gian bắt đầu">
              <DatePicker
                style={{ width: '100%' }}
                showTime
                format="HH:mm DD/MM/YYYY"
                onChange={(e: any) => {
                  setStartDate(e);
                  form.setFieldsValue({ thoiGianKetThuc: undefined });
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              rules={[...rules.required]}
              name="thoiGianKetThuc"
              label="Thời gian kết thúc"
            >
              <DatePicker
                style={{ width: '100%' }}
                showTime
                format="HH:mm DD/MM/YYYY"
                disabledDate={
                  startDate ? (cur) => moment(cur).isBefore(startDate, 'day') : undefined
                }
              />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item
              rules={[...rules.text, ...rules.length(200)]}
              name="diaDiem"
              label="Địa điểm"
            >
              <Input placeholder="Địa điểm" />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item rules={[...rules.text, ...rules.length(1000)]} name="ghiChu" label="Ghi chú">
              <Input.TextArea placeholder="Ghi chú" rows={3} />
            </Form.Item>
          </Col>
        </Row>

        <div className="form-footer">
          <Button loading={formSubmiting} htmlType="submit" type="primary">
            {!edit ? 'Thêm mới' : 'Lưu lại'}
          </Button>
          <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
        </div>
      </Form>
    </Card>
  );
};

export default FormLichCaNhan;
