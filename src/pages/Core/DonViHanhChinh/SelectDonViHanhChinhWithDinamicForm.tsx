/* eslint-disable react-hooks/exhaustive-deps */
import type { IRecordTinh } from '@/services/DonViHanhChinh/typing';
import rules from '@/utils/rules';
import { Col, Form, Input, Row, Select } from 'antd';
import type { FormInstance } from 'antd/es/form/Form';
import { useEffect, useState } from 'react';
import { getPhuongXa, getQuanHuyen } from '@/services/Core/DonViHanhChinh';
import { DonViHanhChinh } from '@/services/Core/DonViHanhChinh/typing';

type Props = {
  disabled?: boolean;
  form: FormInstance<any>;
  listTinh?: DonViHanhChinh.IRecord[];
  hideTinh?: boolean;
  hideQuanHuyen?: boolean;
  hideXaPhuong?: boolean;
  hideDiaChiCuThe?: boolean;
  notRequiredTinh?: boolean;
  notRequiredQuanHuyen?: boolean;
  notRequiredXaPhuong?: boolean;
  notRequiredDiaChiCuThe?: boolean;
  fields: {
    tinh: string[];
    quanHuyen: string[];
    xaPhuong: string[];
    diaChiCuThe: string[];
  };
  initialValue?: IRecordTinh.DonViHanhChinhRecord;
  setTen?: {
    setTenTinh?: any;
    setTenQuanHuyen?: any;
    setTenXaPhuong?: any;
  };
};

const SelectDonViHanhChinhWithDinamicForm = (props: Props) => {
  const {listTinh} = props;
  const [idTinh, setIdTinh] = useState<string | undefined>(props?.initialValue?.tinhTp);
  const [idHuyen, setIdHuyen] = useState<string | undefined>(props?.initialValue?.quanHuyen);
  const [listHuyen, setListHuyen] = useState<DonViHanhChinh.IRecord[]>([]);
  const [listXa, setListXa] = useState<DonViHanhChinh.IRecord[]>([]);

  useEffect(() => {
    if (idTinh)
      getQuanHuyen(idTinh).then((data) => {
        setListHuyen(data.data.data);
      });
  }, [idTinh]);

  useEffect(() => {
    if (idHuyen)
      getPhuongXa(idHuyen).then((data) => {
        setListXa(data.data.data);
      });
  }, [idHuyen]);

  return (
    <Row gutter={[20, 12]}>
      {!props.hideTinh && (
        <Col
          xs={24}
          md={props.hideQuanHuyen && props.hideXaPhuong ? 12 : 24}
          lg={props.hideQuanHuyen && props.hideXaPhuong ? 24 : 8}
        >
          <Form.Item
            style={{ marginBottom: props.hideDiaChiCuThe ? 0 : 8 }}
            initialValue={props?.initialValue?.maTinh}
            name={props?.fields?.tinh ?? []}
            rules={props.notRequiredTinh ? [] : [...rules.required]}
          >
            <Select
              disabled={props?.disabled}
              onChange={(val: string, option: any) => {
                const record = {};
                // @ts-ignore
                record[`${props?.fields?.tinh?.join('.')}`] = option?.key;
                props.setTen?.setTenTinh(option?.key);
                const newValue = {};
                // @ts-ignore
                newValue[`${props?.fields?.quanHuyen?.[0]}`] = {
                  maQuanHuyen: undefined,
                  maPhuongXa: undefined,
                };
                setIdTinh(option?.key);
                props.form.setFieldsValue(newValue);
              }}
              placeholder={"Chọn tỉnh/ Thành phố"}
              options={listTinh?.map((item) => ({
                key: item.ma,
                value: item.tenDonVi,
                label: item.tenDonVi,
              }))}
              allowClear
              showSearch
              optionFilterProp="label"
            />
          </Form.Item>
        </Col>
      )}
      {!props.hideQuanHuyen && (
        <Col xs={24} md={12} lg={8}>
          <Form.Item
            style={{ marginBottom: props.hideDiaChiCuThe ? 0 : 8 }}
            initialValue={props?.initialValue?.maQuanHuyen}
            name={props?.fields?.quanHuyen ?? []}
            rules={props.notRequiredQuanHuyen ? [] : [...rules.required]}
          >
            <Select
              notFoundContent="Bạn chưa chọn Tỉnh"
              disabled={props?.disabled}
              onChange={(val: string, option: any) => {
                props.setTen?.setTenQuanHuyen(option?.key);

                const newValue = {};
                // @ts-ignore
                newValue[`${props?.fields?.quanHuyen?.[0]}`] = {
                  maPhuongXa: undefined,
                };
                setIdHuyen(option?.key);
                props.form.setFieldsValue(newValue);
              }}
              placeholder="Chọn quận/huyện"
              options={(listHuyen ?? []).map((item) => ({
                key: item.ma,
                value: item.tenDonVi,
                label: item.tenDonVi,
              }))}
              allowClear
              showSearch
              optionFilterProp="label"
            ></Select>
          </Form.Item>
        </Col>
      )}
      {!props.hideXaPhuong && (
        <Col xs={24} md={12} lg={8}>
          <Form.Item
            style={{ marginBottom: props.hideDiaChiCuThe ? 0 : 8 }}
            initialValue={props?.initialValue?.maPhuongXa}
            name={props?.fields?.xaPhuong ?? []}
            rules={props?.notRequiredXaPhuong ? [] : [...rules.required]}
          >
            <Select
              notFoundContent="Bạn chưa chọn Quận huyện"
              disabled={props?.disabled}
              onChange={(val: string, option: any) => {
                props.setTen?.setTenXaPhuong(option?.key);
              }}
              placeholder="Chọn phường/xã"
              allowClear
              showSearch
              options={(listXa ?? []).map((item) => ({
                key: item.ma,
                value: item.tenDonVi,
                label: item.tenDonVi,
              }))}
              optionFilterProp="label"
            ></Select>
          </Form.Item>
        </Col>
      )}
      {props.hideDiaChiCuThe && (
        <Col span={24}>
          <Form.Item
            initialValue={props?.initialValue?.soNhaTenDuong}
            rules={
              props?.notRequiredDiaChiCuThe ? [...rules.text] : [...rules.required, ...rules.text]
            }
            name={props?.fields?.diaChiCuThe ?? []}
            style={{ marginBottom: 0 }}
          >
            <Input.TextArea
              disabled={props?.disabled}
              maxLength={400}
              placeholder="Địa chỉ cụ thể"
              style={{ marginTop: 0 }}
            />
          </Form.Item>
        </Col>
      )}
    </Row>
  );
};

export default SelectDonViHanhChinhWithDinamicForm;
