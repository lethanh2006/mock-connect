import { congDiemSinhVien } from '@/services/LopTinChi/ketquahoctap';
import type { LopTinChi } from '@/services/LopTinChi/typings';
import rules from '@/utils/rules';
import { Button, Card, Col, Form, Input, InputNumber, message, Row } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';

const FormDiemCong = (props: {
  lop_tin_chi_id: number;
  ma_dinh_danh: string;
  onCancel?: any;
  edit?: boolean;
  recordDiemCong?: LopTinChi.IDiemCong;
  getData?: any;
}) => {
  // const { danhSach, getDanhSachBuoiHocByIdLopTinChiModel } = useModel('diemdanh');
  const { lop_tin_chi_id, ma_dinh_danh, onCancel, edit, recordDiemCong, getData } = props;
  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);
  const [form] = Form.useForm();

  // useEffect(() => {
  //   getDanhSachBuoiHocByIdLopTinChiModel(lop_tin_chi_id);
  // }, [lop_tin_chi_id]);

  useEffect(() => {
    if (edit && recordDiemCong?._id) form.setFieldsValue(recordDiemCong);
    else {
      form.resetFields();
      form.setFieldsValue({ soDiemCong: 1, thoiGian: moment().format('DD/MM/YYYY HH:mm') });
    }
  }, [recordDiemCong?._id, edit]);

  const onFinish = async (values: any) => {
    if (formSubmitting) return;
    setFormSubmitting(true);
    await congDiemSinhVien(lop_tin_chi_id, ma_dinh_danh, values)
      .then((response) => {
        message.success(edit ? 'Chỉnh sửa thành công' : 'Thêm mới thành công');
        if (getData) getData();
        if (onCancel) onCancel();
      })
      .catch((error) => console.log(error));
  };

  return (
    <Card title={edit ? 'Sửa điểm' : 'Thêm điểm'}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={12}>
          {/* <Col span={12}>
            <Form.Item name="idBuoiHoc" label="Buổi học" rules={[...rules.required]}>
              <Select
                disabled={edit}
                options={danhSach.map((item) => ({
                  key: item.id,
                  value: item.id,
                  label:
                    'Ngày ' +
                    (item?.ngay_gio_hoc &&
                      moment(item.ngay_gio_hoc, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm')),
                }))}
              />
            </Form.Item>
          </Col> */}
          <Col span={12}>
            <Form.Item name="thoiGian" label="Thời gian" rules={[...rules.required]}>
              <Input disabled />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="soDiemCong" label="Số điểm cộng / trừ" rules={[...rules.required]}>
              <InputNumber min={-10} max={10} step={1} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="ghiChu" label="Ghi chú" rules={[...rules.text, ...rules.length(200)]}>
          <Input />
        </Form.Item>

        <Row gutter={[12, 0]} justify="center">
          <Col>
            <Button type="primary" htmlType="submit">
              {edit ? 'Lưu lại' : 'Thêm'}
            </Button>
          </Col>
          <Col>
            <Button onClick={() => onCancel && onCancel()}>Đóng</Button>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default FormDiemCong;
