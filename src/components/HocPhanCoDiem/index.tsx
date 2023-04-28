import type { IRecordHocPhan } from '@/services/HocPhanCoDiem/typing';
import rules from '@/utils/rules';
import { includes } from '@/utils/utils';
import { useModel } from '@@/plugin-model/useModel';
import { Col, Form, Row, Select } from 'antd';
import type { FormInstance } from 'antd/es/form/Form';
import { useEffect, useState } from 'react';
type Props = {
  disabled?: boolean;
  form: FormInstance<any>;
  fields: {
    idHocKy: string[];
    idDiem: string[];
  };
  initialValue?: IRecordHocPhan.record;
};
const HocPhanCoDiem = (props: Props) => {
  const { getDsKyHoc, getDsDiemTheoKy, dsKyHoc, dsDiemTheoKy, loading } = useModel('hocphancodiem');
  const [idKy, setIdKy] = useState<string>(props?.initialValue?.idHocKy ?? '');
  useEffect(() => {
    getDsKyHoc();
  }, []);

  useEffect(() => {
    if (idKy) {
      getDsDiemTheoKy(idKy);
    }
  }, [idKy]);

  return (
    <Row gutter={[20, 0]}>
      <Col xs={24} md={12} lg={12}>
        <Form.Item
          initialValue={props?.initialValue?.idHocKy}
          name={props?.fields?.idHocKy ?? []}
          rules={[...rules.required]}
        >
          <Select
            disabled={props?.disabled}
            loading={loading}
            value={idKy}
            onChange={(val: string, option: any) => {
              setIdKy(val);
              const newValue = {};
              newValue[`${props?.fields?.idHocKy?.[0]}`] = {
                idDiem: undefined,
                tenHocKy: option?.key,
              };
              props.form.setFieldsValue(newValue);
            }}
            allowClear
            showSearch
            placeholder="Kỳ học"
            optionFilterProp="children"
            filterOption={(value, option) => includes(option?.props.children, value)}
          >
            {dsKyHoc?.map((item) => (
              <Select.Option value={item.id} key={item.ma_ky_nam_hoc}>
                {item.ma_ky_nam_hoc}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      <Col xs={24} md={12} lg={12}>
        <Form.Item
          initialValue={props?.initialValue?.idDiem}
          name={props?.fields?.idDiem ?? []}
          rules={[...rules.required]}
        >
          <Select
            notFoundContent={`${
              idKy ? 'Không có học phần nào thuộc học kỳ này' : 'Bạn chưa chọn Kỳ học'
            }`}
            disabled={props?.disabled}
            loading={loading}
            onChange={(val: string, option: any) => {
              console.log('option', option);
              // const record = {};
              // record[`${props?.fields?.tinh?.join('.')}`] = option?.key;
              // setTenTinh({ ...tenTinh, ...record });
              // props.setTen?.setTenTinh(option?.key);
              // setMaTinh(val);
              // setDanhSachXaPhuong([]);
              // const danhSachXaPhuongNew = {};
              // danhSachXaPhuongNew[`${props?.fields?.xaPhuong?.join('.')}`] = [];
              // setObjDanhSachXaPhuong({ ...objDanhSachXaPhuong, ...danhSachXaPhuongNew });
              const newValue = {};
              newValue[`${props?.fields?.idDiem?.[0]}`] = {
                maHocPhan: option?.key,
                tenHocPhan: option?.children,
              };
              props.form.setFieldsValue(newValue);
            }}
            allowClear
            showSearch
            placeholder="Học phần"
            optionFilterProp="children"
            filterOption={(value, option) => includes(option?.props.children, value)}
          >
            {dsDiemTheoKy?.map((item) => (
              <Select.Option value={item.id ?? 1} key={item.hoc_phan_id?.[1] ?? ''}>
                {item.ten_hoc_phan}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>
    </Row>
  );
};
export default HocPhanCoDiem;
