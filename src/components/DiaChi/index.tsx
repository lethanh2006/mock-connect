import type { IRecordTinh } from '@/services/DonViHanhChinh/typing';
import rules from '@/utils/rules';
import { includes } from '@/utils/utils';
import { Col, Form, Input, Row, Select } from 'antd';
import type { FormInstance } from 'antd/es/form/Form';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

type Props = {
  disabled?: boolean;
  form: FormInstance<any>;
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

const DiaChi = (props: Props) => {
  const {
    setDanhSachXaPhuong,
    getDanhSachQuanHuyenModel,
    getDanhSachTinhModel,
    getDanhSachXaPhuongModel,
    setTenTinh,
    setTenXaPhuong,
    setTenQuanHuyen,
    loading,
    tenTinh,
    tenQuanHuyen,
    tenPhuongXa,
    objDanhSachQuanHuyen,
    objDanhSachXaPhuong,
    setObjDanhSachXaPhuong,
    danhSachTinh,
  } = useModel('donvihanhchinh');

  const { typeForm } = useModel('dichvumotcuav2');
  const add = typeForm === 'add';

  const [maQuanHuyen, setMaQuanHuyen] = useState<string>(props?.initialValue?.maQuanHuyen ?? '');
  const [maTinh, setMaTinh] = useState<string>(props?.initialValue?.maTinh ?? '');

  useEffect(() => {
    getDanhSachTinhModel();
  }, []);

  useEffect(() => {
    if (maTinh) {
      getDanhSachQuanHuyenModel(maTinh, props?.fields?.quanHuyen?.join('.'));
    }
  }, [maTinh]);

  useEffect(() => {
    if (maQuanHuyen) {
      getDanhSachXaPhuongModel(maQuanHuyen, props?.fields?.xaPhuong?.join('.'));
    }
  }, [maQuanHuyen]);

  return (
    <Row gutter={[20, 0]}>
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
              loading={loading}
              value={maTinh}
              onChange={(val: string, option: any) => {
                const record = {};
                record[`${props?.fields?.tinh?.join('.')}`] = option?.key;
                setTenTinh({ ...tenTinh, ...record });
                props.setTen?.setTenTinh(option?.key);
                setMaTinh(val);
                setDanhSachXaPhuong([]);
                const danhSachXaPhuongNew = {};
                danhSachXaPhuongNew[`${props?.fields?.xaPhuong?.join('.')}`] = [];
                setObjDanhSachXaPhuong({ ...objDanhSachXaPhuong, ...danhSachXaPhuongNew });
                const newValue = {};
                newValue[`${props?.fields?.quanHuyen?.[0]}`] = {
                  maQuanHuyen: undefined,
                  maPhuongXa: undefined,
                };
                props.form.setFieldsValue(newValue);
              }}
              allowClear
              showSearch
              placeholder="Thành phố/Tỉnh"
              optionFilterProp="children"
              filterOption={(value, option) => includes(option?.props.children, value)}
            >
              {danhSachTinh?.map((item) => (
                <Select.Option value={item.ma} key={item.tenDonVi}>
                  {item.tenDonVi}
                </Select.Option>
              ))}
            </Select>
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
              loading={loading}
              onChange={(val: string, option: any) => {
                props.setTen?.setTenQuanHuyen(option?.key);
                const record = {};
                record[`${props?.fields?.quanHuyen?.join('.')}`] = option?.key;
                setTenQuanHuyen({ ...tenQuanHuyen, ...record });
                setMaQuanHuyen(val);
                const newValue = {};
                newValue[`${props?.fields?.quanHuyen?.[0]}`] = {
                  maPhuongXa: undefined,
                };
                props.form.setFieldsValue(newValue);
              }}
              onMouseEnter={async () => {
                if (add) return;
                const maTinhCurrent = props.form.getFieldValue(props.fields.tinh);
                if (maTinhCurrent) getDanhSachQuanHuyenModel(maTinhCurrent);
              }}
              showSearch
              allowClear
              placeholder="Quận/Huyện"
              optionFilterProp="children"
              filterOption={(value, option) => includes(option?.props.children, value)}
            >
              {objDanhSachQuanHuyen?.[`${props?.fields?.quanHuyen?.join('.')}`]?.map((item) => (
                <Select.Option value={item.ma} key={item.tenDonVi}>
                  {item.tenDonVi}
                </Select.Option>
              ))}
            </Select>
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
              onMouseEnter={async () => {
                if (add) return;
                const maQuanHuyenCurrent = props.form.getFieldValue(props.fields.quanHuyen);
                if (maQuanHuyenCurrent) getDanhSachXaPhuongModel(maQuanHuyenCurrent);
              }}
              loading={loading}
              onChange={(val: string, option: any) => {
                props.setTen?.setTenXaPhuong(option?.key);
                const record = {};
                record[`${props?.fields?.xaPhuong?.join('.')}`] = option?.key;
                setTenXaPhuong({ ...tenPhuongXa, ...record });
              }}
              showSearch
              allowClear
              placeholder="Xã/Phường"
              optionFilterProp="children"
              filterOption={(value, option) => includes(option?.props.children, value)}
            >
              {objDanhSachXaPhuong?.[`${props?.fields?.xaPhuong?.join('.')}`]?.map((item) => (
                <Select.Option value={item.ma} key={item.tenDonVi}>
                  {item.tenDonVi}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      )}
      {!props.hideDiaChiCuThe && (
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

export default DiaChi;
