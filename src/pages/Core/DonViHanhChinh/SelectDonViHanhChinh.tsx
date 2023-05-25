import { getPhuongXa, getQuanHuyen } from '@/services/Core/DonViHanhChinh';
import { type DonViHanhChinh } from '@/services/Core/DonViHanhChinh/typing';
import rules from '@/utils/rules';
import { Col, Form, type FormInstance, Select, Input, Row } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const SelectDonViHanhChinh = (props: {
  form: FormInstance<any>;
  suffix?: 'NoiSinh' | 'ThuongTru' | 'QueQuan';
  listTinh?: DonViHanhChinh.IRecord[];
  hasSoNha?: boolean;
  disabled?: boolean;
  hideTinh?: boolean;
  hideQuanHuyen?: boolean;
  hideXaPhuong?: boolean;
  notRequiredTinh?: boolean;
  notRequiredQuanHuyen?: boolean;
  notRequiredXaPhuong?: boolean;
  notRequiredDiaChiCuThe?: boolean;
  initialValue?: DonViHanhChinh.IRecord;

}) => {
  const { form, suffix, listTinh, hasSoNha, hideTinh, hideQuanHuyen, hideXaPhuong, initialValue } = props;
  // const { record: recSinhVien } = useModel('sinhvien.sinhvien');
  console.log(initialValue, 'initial value')
  const [idTinh, setIdTinh] = useState<string>();
  const [idHuyen, setIdHuyen] = useState<string>();
  const [listHuyen, setListHuyen] = useState<DonViHanhChinh.IRecord[]>([]);
  const [listXa, setListXa] = useState<DonViHanhChinh.IRecord[]>([]);

  const onchangeTinhThanhPho = (e: string) => {
    setIdTinh(e);
    form.setFieldsValue({ ['quanHuyen' + suffix]: undefined, ['xaPhuong' + suffix]: undefined });
  };

  const onchangeQuanHuyen = (e: string) => {
    setIdHuyen(e);
    form.setFieldsValue({ ['xaPhuong' + suffix]: undefined });
  };

  // useEffect(() => {
  //   setIdTinh(_.get(recSinhVien, 'tinhTp' + suffix));
  //   setIdHuyen(_.get(recSinhVien, 'quanHuyen' + suffix));
  // }, [recSinhVien?._id, suffix]);

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
    <Row gutter={[12, 12]}>
      {!hideTinh && (
        <Col span={12} md={hasSoNha ? 6 : 8}>
          <Form.Item
            name={'tinhTp' + suffix}
            label="Tỉnh/Thành phố"
            rules={props.notRequiredTinh === true ? [] : [...rules.required]}
          >
            <Select
              placeholder="Chọn tỉnh/thành phố"
              options={listTinh?.map((item) => ({
                key: item.ma,
                value: item.tenDonVi,
                label: item.tenDonVi,
              }))}
              allowClear
              showSearch
              onChange={(val, opt: any) => onchangeTinhThanhPho(opt.key)}
              optionFilterProp="label"
            />
          </Form.Item>
        </Col>
      )}
      {!hideQuanHuyen && (
        <Col span={12} md={hasSoNha ? 6 : 8}>
          <Form.Item name={'quanHuyen' + suffix} label="Quận/Huyện">
            <Select
              placeholder="Chọn quận/huyện"
              options={(listHuyen ?? []).map((item) => ({
                key: item.ma,
                value: item.tenDonVi,
                label: item.tenDonVi,
              }))}
              allowClear
              showSearch
              onChange={(val, opt: any) => onchangeQuanHuyen(opt.key)}
              optionFilterProp="label"
            />
          </Form.Item>
        </Col>
      )}

      {!hideXaPhuong && (
        <Col span={12} md={hasSoNha ? 6 : 8}>
          <Form.Item name={'xaPhuong' + suffix} label="Phường/Xã">
            <Select
              placeholder="Chọn phường/xã"
              allowClear
              showSearch
              options={(listXa ?? []).map((item) => ({
                key: item.ma,
                value: item.tenDonVi,
                label: item.tenDonVi,
              }))}
              optionFilterProp="label"
            />
          </Form.Item>
        </Col>
      )}
      {hasSoNha ? (
        <Col span={12} md={6}>
          <Form.Item
            name={'soNhaTenDuong' + suffix}
            label="Số nhà/Tên đường"
            rules={[...rules.text, ...rules.length(250)]}
          >
            <Input placeholder="Nhập số nhà/tên đường" />
          </Form.Item>
        </Col>
      ) : null}
    </Row>
  );
};

export default SelectDonViHanhChinh;
