import { FormItem } from '@/components/FormItem';
import { getPhuongXa, getQuanHuyen } from '@/services/Core/DonViHanhChinh';
import { type DonViHanhChinh } from '@/services/Core/DonViHanhChinh/typing';
import rules from '@/utils/rules';
import { Col, Input, Row, Select, type FormInstance } from 'antd';
import { useEffect, useState } from 'react';

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
  initialValue?: DonViHanhChinh.IDataInit;
}) => {
  const { form, suffix, listTinh, hasSoNha, hideTinh, hideQuanHuyen, hideXaPhuong } = props;
  const [idTinh, setIdTinh] = useState<string | undefined>(props?.initialValue?.tinhTp);
  const [idHuyen, setIdHuyen] = useState<string | undefined>(props?.initialValue?.quanHuyen);
  const [listHuyen, setListHuyen] = useState<DonViHanhChinh.IRecord[]>([]);
  const [listXa, setListXa] = useState<DonViHanhChinh.IRecord[]>([]);

  const onchangeTinhThanhPho = (e: string) => {
    setIdTinh(e);
    form.setFieldsValue({
      [suffix ? 'quanHuyen' + suffix : 'quanHuyen']: undefined,
      [suffix ? 'xaPhuong' + suffix : 'xaPhuong']: undefined,
    });
  };

  const onchangeQuanHuyen = (e: string) => {
    setIdHuyen(e);
    form.setFieldsValue({ [suffix ? 'xaPhuong' + suffix : 'xaPhuong']: undefined });
  };

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
    <Row gutter={[12, 0]}>
      {!hideTinh && (
        <Col span={8}>
          <FormItem
            name={suffix ? 'tinhTp' + suffix : 'tinhTp'}
            // label="Tỉnh/Thành phố"
            initialValue={props.initialValue?.tinhTp}
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
              onChange={(val, opt: any) => onchangeTinhThanhPho(opt?.key)}
              optionFilterProp="label"
            />
          </FormItem>
        </Col>
      )}
      {!hideQuanHuyen && (
        <Col span={8}>
          <FormItem
            initialValue={props.initialValue?.quanHuyen}
            name={suffix ? 'quanHuyen' + suffix : 'quanHuyen'}
            rules={props.notRequiredQuanHuyen === true ? [] : [...rules.required]}
            // label="Quận/Huyện"
          >
            <Select
              placeholder="Chọn quận/huyện"
              options={(listHuyen ?? []).map((item) => ({
                key: item.ma,
                value: item.tenDonVi,
                label: item.tenDonVi,
              }))}
              allowClear
              showSearch
              onChange={(val, opt: any) => onchangeQuanHuyen(opt?.key)}
              optionFilterProp="label"
            />
          </FormItem>
        </Col>
      )}

      {!hideXaPhuong && (
        <Col span={8}>
          <FormItem
            initialValue={props.initialValue?.xaPhuong}
            name={suffix ? 'xaPhuong' + suffix : 'xaPhuong'}
            rules={props.notRequiredXaPhuong === true ? [] : [...rules.required]}
            // label="Phường/Xã"
          >
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
          </FormItem>
        </Col>
      )}
      {hasSoNha ? (
        <Col span={24}>
          <FormItem
            name={suffix ? 'soNhaTenDuong' + suffix : 'soNhaTenDuong'}
            initialValue={props.initialValue?.soNhaTenDuong}
            rules={[
              ...(props.notRequiredDiaChiCuThe ? [] : rules.required),
              ...rules.text,
              ...rules.length(250),
            ]}
          >
            <Input.TextArea placeholder="Nhập số nhà/tên đường" />
          </FormItem>
        </Col>
      ) : null}
    </Row>
  );
};

export default SelectDonViHanhChinh;
