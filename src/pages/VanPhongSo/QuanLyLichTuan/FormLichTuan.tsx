import type { LichTuan } from '@/services/LichTuan/typings';
import type { VanphongsoCsvc } from '@/services/VanPhongSo/typings';
import rules from '@/utils/rules';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Radio,
  Row,
  Select,
  Spin,
} from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const FormLichTuan = (props: { onCancel: any }) => {
  const { addModel, updModel, edit, record, loading, getAllChuTriModel, danhSachChuTri } =
    useModel('lichtuan');
  const { danhSach, loading: loadingUser, setCondition, condition } = useModel('tochuccanbo');
  const { danhSach: danhSachDonVi } = useModel('donvi');
  const { danhSach: danhSachPhong, loading: loadingPhong } = useModel('quantriphonghop');
  const [form] = Form.useForm();
  const [chuTri, setChuTri] = useState<any>(record?.chuTri ?? []);
  const [listNguoiThamDu, setListNguoiThamDu] = useState<LichTuan.User[]>(
    record?.thanhPhanNguoiThamDu ?? [],
  );
  const [donViChuTri, setDonViChuTri] = useState<any>(record?.donViChuanBi ?? {});
  const listUserProfileNguoiThamDu: any[] = listNguoiThamDu.map((nguoi) => ({
    id: nguoi.id,
    ma_dinh_danh: nguoi.maDinhDanh,
    name: nguoi.ten,
    chuc_danh: nguoi.chucDanh,
    ten_don_vi: nguoi.tenDonVi,
  }));

  //  1 là địa điểm ở cơ sở vật chất, 2 là địa điểm ngoài học viện (nhập text)
  const [optionDiaDiem, setOptionDiaDiem] = useState<'1' | '2'>(
    record?.diaDiem?._id !== -1 ? '1' : '2',
  );
  // 1 là nhập ngoài, 2 là list thành phần chủ trì
  const [optionChuTri, setOptionChuTri] = useState<'1' | '2'>(
    record && record?.chuTri?.[0]?.id !== -1 ? '2' : '1',
  );
  // đơn vị chủ trì
  const [optionDvChuTri, setOptionDvChuTri] = useState<'1' | '2'>(
    record?.donViChuanBi?.id !== -1 ? '1' : '2',
  );
  const [diaDiem, setDiaDiem] = useState<{
    value: string;
    _id: any;
  }>(record?.diaDiem ?? { value: '', _id: '' });

  useEffect(() => {
    getAllChuTriModel();
  }, []);

  const debouncedSearchCanBo = _.debounce((value) => {
    setCondition({
      ...condition,
      ma_dinh_danh_ten: value?.trim(),
    });
  }, 800);

  const onFinish = async (values: LichTuan.Record) => {
    if (values.thoiGianKetThuc) {
      if (
        Number(moment(values.thoiGianKetThuc).diff(moment(values.thoiGianBatDau), 'minutes')) <= 0
      ) {
        message.info('Thời gian kết thúc phải sau thời gian bắt đầu!');
        return;
      } else {
        const weekStartNumber = moment(values?.thoiGianBatDau, 'DD-MM-YYYY').week();
        const weekEndNumber = moment(values?.thoiGianKetThuc, 'DD-MM-YYYY').week();
        if (weekStartNumber !== weekEndNumber) {
          message.info('Chỉ được phép tạo lịch trong tuần, vui lòng thử lại!');
          return;
        }
      }
    } else {
      values.thoiGianKetThuc = moment(values.thoiGianBatDau).add(2, 'hours').toISOString();
    }

    values.thanhPhanNguoiThamDu = listNguoiThamDu;
    if (
      !values?.thanhPhanThamDu?.length &&
      !values.thanhPhanNguoiThamDu?.length &&
      !values?.thanhPhanThamDuKhac
    ) {
      message.info('Vui lòng chọn ít nhất một thành phần tham dự!');
      return;
    }
    values.chuTri =
      optionChuTri === '2'
        ? chuTri
        : [{ ten: values.chuTri, id: -1, maDinhDanh: '', tenDonVi: '' }];
    values.diaDiem =
      optionDiaDiem === '1'
        ? diaDiem
        : { value: values?.diaDiem?.value ?? values.diaDiem, _id: -1 };
    values.donViChuanBi =
      optionDvChuTri === '1' ? donViChuTri : { value: values?.donViChuanBi, id: -1 };
    if (!edit) {
      await addModel(values);
    } else {
      await updModel(record?._id ?? '', values);
    }
    form.resetFields();
    if (edit) props.onCancel();
  };

  return (
    <Card title={edit ? 'Chỉnh sửa cuộc họp' : 'Thêm mới cuộc họp'}>
      <Form labelCol={{ span: 24 }} onFinish={onFinish} form={form} layout="vertical">
        <Form.Item
          rules={[...rules.required, ...rules.text, ...rules.length(500)]}
          initialValue={record?.noiDungCongViec ?? ''}
          name="noiDungCongViec"
          label="Nội dung công việc"
        >
          <Input.TextArea placeholder="Nội dung công việc" rows={3} />
        </Form.Item>
        <Row gutter={[12, 12]}>
          <Col xs={24} md={24} lg={12} xl={12}>
            <Form.Item
              rules={[...rules.required]}
              initialValue={record?.thoiGianBatDau ? moment(record?.thoiGianBatDau) : undefined}
              name="thoiGianBatDau"
              label="Thời gian bắt đầu"
            >
              <DatePicker
                style={{ width: '100%' }}
                showTime
                minuteStep={15}
                format="HH:mm DD/MM/YYYY"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={12} xl={12}>
            <Form.Item
              initialValue={record?.thoiGianKetThuc ? moment(record?.thoiGianKetThuc) : undefined}
              name="thoiGianKetThuc"
              label="Thời gian kết thúc"
            >
              <DatePicker
                style={{ width: '100%' }}
                showTime
                minuteStep={15}
                format="HH:mm DD/MM/YYYY"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          initialValue={
            record?.chuTri?.[0]?.id === -1
              ? record?.chuTri?.[0]?.ten
              : record?.chuTri?.map((item) => item?.id ?? undefined)
          }
          name="chuTri"
          rules={[...rules.required]}
          label={
            <>
              <Radio.Group
                onChange={(e) => {
                  setOptionChuTri(e.target.value);
                  form.setFieldsValue({ chuTri: undefined });
                }}
                value={optionChuTri}
              >
                <Radio value={'1'}>Chủ trì cuộc họp</Radio>
                <Radio value={'2'}>Lãnh đạo Học viện</Radio>
              </Radio.Group>
            </>
          }
        >
          {optionChuTri === '2' ? (
            <Select
              showSearch
              mode="multiple"
              optionFilterProp="label"
              placeholder="Chọn lãnh đạo Học viện"
              options={danhSachChuTri?.map((user: Login.Profile) => ({
                ...user,
                key: user.id,
                value: user.id,
                label: `${user.name} - ${user?.chuc_danh || ''}`,
              }))}
              onChange={(value, options: any) => {
                setChuTri(
                  options?.map((item: any) => {
                    return {
                      id: item.id,
                      ten: item.name,
                      chucDanh: item?.chuc_danh || '',
                      maDinhDanh: item?.ma_dinh_danh || '',
                      tenDonVi: item?.ten_don_vi || '',
                    };
                  }),
                );
              }}
            />
          ) : (
            <Input placeholder="Nhập chủ trì cuộc họp" />
          )}
        </Form.Item>

        <div className="ant-form-item-label" style={{ fontWeight: 500, padding: 0 }}>
          <label className="ant-form-item-required">Thành phần tham dự</label>
        </div>
        <Form.Item
          initialValue={record?.thanhPhanThamDu?.map((item: string) => item)}
          name="thanhPhanThamDu"
          label="Phòng ban"
        >
          <Select
            tokenSeparators={[',']}
            mode="tags"
            showSearch
            optionFilterProp="label"
            placeholder="Thành phần tham dự (Phòng ban)"
            options={danhSachDonVi.map((item: DonVi.Record) => ({
              key: item.id,
              label: `${item.ten_don_vi} (${item.ma_don_vi})`,
              value: `${item.ten_don_vi} (${item.ma_don_vi})`,
            }))}
          />
        </Form.Item>
        <Form.Item
          initialValue={record?.thanhPhanNguoiThamDu?.map((item: LichTuan.User) => item.id)}
          name="thanhPhanNguoiThamDu"
          label="Cá nhân"
        >
          <Select
            mode="multiple"
            showSearch
            optionFilterProp="label"
            placeholder="Thành phần tham dự (Cá nhân)"
            options={[...danhSach, ...listUserProfileNguoiThamDu]?.map((user: Login.Profile) => ({
              ...user,
              key: user.ma_dinh_danh,
              label: `${user.name} (${user.ma_dinh_danh} - ${user?.ten_don_vi})`,
              value: user.id,
            }))}
            notFoundContent={loadingUser ? <Spin spinning={true} /> : undefined}
            onSearch={(val) => debouncedSearchCanBo(val)}
            onChange={(val, options: any[]) => {
              setListNguoiThamDu(
                options?.map((item: any) => ({
                  id: item.id || '',
                  ten: item.name || '',
                  chucDanh: item?.chuc_danh || '',
                  maDinhDanh: item?.ma_dinh_danh || '',
                  tenDonVi: item?.ten_don_vi || '',
                })),
              );
            }}
          />
        </Form.Item>
        <Form.Item
          initialValue={record?.thanhPhanThamDuKhac ?? ''}
          name="thanhPhanThamDuKhac"
          label="Khác"
        >
          <Input.TextArea rows={2} placeholder="Thành phần tham dự (Khác)" />
        </Form.Item>

        <Form.Item
          initialValue={record?.diaDiem?._id === -1 ? record?.diaDiem?.value : record?.diaDiem?._id}
          rules={[...rules.required]}
          name="diaDiem"
          label={
            <>
              Địa điểm
              <Radio.Group
                onChange={(e) => {
                  setOptionDiaDiem(e.target.value);
                  form.setFieldsValue({ diaDiem: undefined });
                }}
                defaultValue={'1'}
                value={optionDiaDiem}
                style={{ marginLeft: '20px' }}
              >
                <Radio value={'1'}>Trong học viện</Radio>
                <Radio value={'2'}>Khác</Radio>
              </Radio.Group>
            </>
          }
        >
          {optionDiaDiem === '1' ? (
            <Select
              showSearch
              optionFilterProp="label"
              placeholder="Địa điểm"
              options={danhSachPhong.map((item: VanphongsoCsvc.PhongHopRecord) => ({
                _id: item?._id,
                value: item?._id,
                label: `${item?.info?.tenPhong} (Nhà ${item?.info?.toaNha})`,
              }))}
              notFoundContent={loadingPhong ? <Spin spinning={true} /> : undefined}
              onChange={(value, options: any) => {
                setDiaDiem({
                  value: options?.label,
                  _id: options?._id,
                });
              }}
            />
          ) : (
            <Input placeholder="Nhập địa điểm" />
          )}
        </Form.Item>

        <Form.Item
          name="donViChuanBi"
          label={
            <>
              Đơn vị chủ trì
              <Radio.Group
                onChange={(e) => {
                  setOptionDvChuTri(e.target.value);
                  form.setFieldsValue({ donViChuanBi: undefined });
                }}
                defaultValue={'1'}
                value={optionDvChuTri}
                style={{ marginLeft: '20px' }}
              >
                <Radio value={'1'}>Trong học viện</Radio>
                <Radio value={'2'}>Khác</Radio>
              </Radio.Group>
            </>
          }
          rules={[...rules.required]}
          initialValue={
            record?.donViChuanBi?.id == -1 ? record?.donViChuanBi?.value : record?.donViChuanBi?.id
          }
        >
          {optionDvChuTri === '1' ? (
            <Select
              showSearch
              optionFilterProp="label"
              placeholder="Đơn vị chủ trì"
              options={danhSachDonVi.map((item: DonVi.Record) => ({
                ...item,
                key: item?.id,
                label: `${item.ten_don_vi} (${item?.ma_don_vi})`,
                value: item.id,
              }))}
              onChange={(value, options: any) => {
                setDonViChuTri({
                  id: options.id,
                  value: `${options.ten_don_vi} (${options?.ma_don_vi})`,
                });
              }}
            />
          ) : (
            <Input placeholder="Nhập đơn vị chủ trì" />
          )}
        </Form.Item>

        <div className="ant-form-item-label" style={{ fontWeight: 500, padding: 0 }}>
          <label>Đơn vị phối hợp</label>
        </div>
        <Form.Item
          name="donViPhoiHop"
          label="Trong học viện"
          initialValue={record?.donViPhoiHop?.map((item: string) => item)}
        >
          <Select
            allowClear
            tokenSeparators={[',']}
            mode="tags"
            showSearch
            optionFilterProp="label"
            placeholder="Đơn vị phối hợp (Trong học viện)"
            options={danhSachDonVi.map((item: DonVi.Record) => ({
              key: item.id,
              label: `${item.ten_don_vi} (${item.ma_don_vi})`,
              value: `${item.ten_don_vi} (${item.ma_don_vi})`,
            }))}
          />
        </Form.Item>

        <Form.Item
          name="donViPhoiHopKhac"
          label="Khác"
          initialValue={record?.donViPhoiHopKhac ?? ''}
        >
          <Input.TextArea rows={2} placeholder="Đơn vị phối hợp (Khác)" />
        </Form.Item>

        <Form.Item
          name="ghiChu"
          label="Ghi chú khác"
          initialValue={record?.ghiChu}
          rules={[...rules.text, ...rules.length(500)]}
        >
          <Input.TextArea placeholder="Ghi chú khác (nếu có)" rows={3} />
        </Form.Item>
        <Form.Item style={{ textAlign: 'center', marginBottom: 0 }}>
          <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
            {edit ? 'Lưu' : 'Thêm mới và tiếp tục'}
          </Button>
          <Button
            onClick={() => {
              props?.onCancel();
            }}
          >
            Đóng
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormLichTuan;
