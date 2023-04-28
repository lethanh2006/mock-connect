import { LoaiDoiTuongXuLyQuyTrinh } from '@/utils/constants';
import rules from '@/utils/rules';
import { includes } from '@/utils/utils';
import type { FormInstance } from 'antd';
import { Spin } from 'antd';
import { Col, Form, Input, InputNumber, Row, Select } from 'antd';
import _ from 'lodash';
import mm from 'moment-timezone';
import { useState } from 'react';
import { useModel } from 'umi';

mm.tz.setDefault('Asia/Ho_Chi_Minh');

const BieuMauThaoTac = (props: {
  field: { name: number; key: number; isListField?: boolean };
  step: number;
  form: FormInstance;
}) => {
  const { danhSach } = useModel('donvi');
  const { record } = useModel('dichvumotcuav2');
  const { getChuyenVienXuLyDonModel, danhSachChuyenVienXuLy, loading, setDanhSachChuyenVienXuLy } =
    useModel('phanquyen');
  const [loaiDoiTuong, setLoaiDoiTuong] = useState<string>(
    record?.quyTrinh?.danhSachBuoc?.[props?.step]?.danhSachThaoTac?.[props.field.name]
      ?.loaiDoiTuongXuLy ?? '',
  );
  const [idDonVi, setIdDonVi] = useState<string>(
    record?.quyTrinh?.danhSachBuoc?.[props?.step]?.danhSachThaoTac?.[props.field.name]?.idDonVi ??
      '',
  );

  return (
    <Row gutter={[20, 0]}>
      <Col xs={24} lg={12}>
        <Form.Item
          style={{ marginBottom: 8 }}
          labelCol={{ span: 24 }}
          name={[props.field.name, 'tenThaoTac']}
          label="Tên thao tác"
          rules={[...rules.required, ...rules.text, ...rules.length(200)]}
        >
          <Input placeholder="Tên thao tác" />
        </Form.Item>
      </Col>
      <Col xs={24} lg={12}>
        <Form.Item
          style={{ marginBottom: 8 }}
          labelCol={{ span: 24 }}
          name={[props.field.name, 'soNgayXuLy']}
          label="Số ngày xử lý"
          rules={[...rules.required]}
        >
          <InputNumber style={{ width: '100%' }} placeholder="Số ngày xử lý" min={0} max={300} />
        </Form.Item>
      </Col>
      <Col xs={24} lg={12}>
        <Form.Item
          style={{ marginBottom: 8 }}
          labelCol={{ span: 24 }}
          name={[props.field.name, 'loaiDoiTuongXuLy']}
          label="Loại đối tượng"
          rules={[...rules.required]}
        >
          <Select
            onChange={(val: string) => setLoaiDoiTuong(val)}
            placeholder="Chọn loại đối tượng"
          >
            {Object.keys(LoaiDoiTuongXuLyQuyTrinh)?.map((item) => (
              <Select.Option key={item} value={LoaiDoiTuongXuLyQuyTrinh[item]}>
                {LoaiDoiTuongXuLyQuyTrinh[item]}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
      {loaiDoiTuong === 'Đơn vị cụ thể' && (
        <Col xs={24} lg={12}>
          <Form.Item
            style={{ marginBottom: 8 }}
            labelCol={{ span: 24 }}
            name={[props.field.name, 'idDonVi']}
            label="Đơn vị"
            rules={[...rules.required]}
          >
            <Select
              filterOption={(value, option) => includes(option?.props.children, value)}
              showSearch
              placeholder="Chọn đơn vị"
              onChange={(val: string) => {
                setIdDonVi(val);
                const recordTemp = props.form.getFieldsValue(true);
                const path = `quyTrinh.danhSachBuoc[${props.step}].danhSachThaoTac[${props.field.name}].idNguoiDieuPhoiMacDinh`;
                props.form.setFieldsValue(_.set(recordTemp, path, undefined));
              }}
            >
              {danhSach?.map((item) => (
                <Select.Option key={item._id} value={item._id}>
                  {item.ten} ({item.maDonVi})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      )}
      <Col xs={24} lg={12}>
        <Form.Item
          style={{ marginBottom: 8 }}
          labelCol={{ span: 24 }}
          name={[props.field.name, 'idNguoiDieuPhoiMacDinh']}
          label="Người xử lý"
        >
          <Select
            notFoundContent={
              loading ? (
                <Spin spinning />
              ) : (
                'Không có cán bộ nào được phân quyền là chuyên viên xử lý đơn'
              )
            }
            allowClear
            filterOption={(value, option) => includes(option?.props.children, value)}
            showSearch
            placeholder="Chọn người xử lý"
            // onMouseEnter={() => {
            //   getChuyenVienXuLyDonModel(idDonVi);
            // }}
          >
            {danhSachChuyenVienXuLy?.map((item) => (
              <Select.Option key={item.id} value={item.id.toString()}>
                {item.ma_dinh_danh} - {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
    </Row>
  );
};

export default BieuMauThaoTac;
