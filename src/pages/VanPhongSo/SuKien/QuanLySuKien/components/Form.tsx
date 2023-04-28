import type { LopTinChi } from '@/services/LopTinChi/typings';
import type { SuKien } from '@/services/sukien/typings';
import {
  ECanBoNhanVien,
  EKieuLapSuKien,
  ELoaiDoiTuongSuKien,
  ELoaiSuKien,
} from '@/utils/constants';
import rules from '@/utils/rules';
import { includes } from '@/utils/utils';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
} from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useModel } from 'umi';
const FormSuKien = () => {
  const [form] = Form.useForm();

  const {
    postSuKienAdminModel,
    loading,
    edit,
    setEdit,
    record,
    setRecord,
    setVisibleForm,
    putSuKienAdminModel,
  } = useModel('sukien');

  const { danhSach: danhSachDonVi } = useModel('donvi');
  const { danhSach: danhSachLopHanhChinh } = useModel('lophanhchinh');
  const { danhSach: danhSachNganh } = useModel('nganh');
  const { danhSachNguoiDungCuThe, setConditionNguoiDungCuThe, conditionNguoiDungCuThe } =
    useModel('user');
  const { danhSach: danhSachLopTinChi } = useModel('loptinchi');
  const { danhSach: danhSachKhoaHoc } = useModel('khoahoc');
  const [chonKieuLap, setChonKieuLap] = useState<boolean>(false);
  const [nguoiNhan, setNguoiNhan] = useState<ELoaiDoiTuongSuKien[]>(record?.loaiDoiTuong ?? []);
  const isNguoiDungCuThe = nguoiNhan.includes(ELoaiDoiTuongSuKien.NGUOI_DUNG_CU_THE);
  const [kieuUpdate, setKieuUpdate] = useState<'updateSingle' | 'updateAll' | 'updateFuture'>(
    'updateSingle',
  );

  const onFinish = async (values: SuKien.Record) => {
    if (isNguoiDungCuThe) {
      values.lopHanhChinhList = [];
      values.lopTinChiList = [];
      values.nganhList = [];
      values.donViList = [];
      values.khoaList = [];
      values.roles = [];
    }
    if (values.kieuLapSuKien === '') {
      delete values.kieuLapSuKien;
    } else {
      if (Number(moment(values.thoiGianKetThuc).diff(moment(values.thoiGianBatDau), 'days')) > 0) {
        message.info(
          'Trong trường hợp sự kiện này lặp, thời gian chỉ được phép kéo dài trong ngày!',
        );
        return;
      }
    }
    if (
      Number(moment(values.thoiGianKetThuc).diff(moment(values.thoiGianBatDau), 'minutes')) <= 0
    ) {
      message.info('Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc!');
    } else {
      if (!edit) {
        postSuKienAdminModel({ ...values, loaiSuKien: ELoaiSuKien.TAT_CA });
      } else {
        putSuKienAdminModel(
          record?._id ?? '',
          { ...values, loaiSuKien: ELoaiSuKien.TAT_CA },
          kieuUpdate,
        );
        setEdit(false);
        setRecord({} as SuKien.Record);
      }
    }
  };

  return (
    <Card title={edit ? 'Chỉnh sửa sự kiện' : 'Thêm mới sự kiện'} bordered={false}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {edit && record?.lapLai && (
          <>
            <p style={{ fontSize: '15px', marginBottom: '7px' }}>Chọn kiểu cập nhật sự kiện:</p>
            <Select
              placeholder="Kiểu cập nhật sự kiện"
              style={{ width: '100%', marginBottom: '25px' }}
              onChange={(value) => {
                setKieuUpdate(value);
              }}
              defaultValue="updateSingle"
            >
              <Select.Option value="updateSingle">Cập nhật sự kiện hiện tại</Select.Option>
              <Select.Option value="updateAll">Cập nhật tất cả</Select.Option>
              <Select.Option value="updateFuture">
                Cập nhật sự kiện này trong tương lai
              </Select.Option>
            </Select>
          </>
        )}

        <Form.Item
          rules={[...rules.required, ...rules.text, ...rules.length(2000)]}
          initialValue={record?.tenSuKien}
          name="tenSuKien"
          label="Tên sự kiện"
        >
          <Input placeholder="Nội dung công việc" />
        </Form.Item>
        <Form.Item
          rules={[...rules.required]}
          initialValue={record?.loaiDoiTuong}
          name="loaiDoiTuong"
          label="Đối tượng áp dụng"
        >
          <Select
            mode="multiple"
            placeholder="Chọn đối tượng áp dụng"
            // allowClear
            onChange={(val: any[]) => {
              if (val.includes(ELoaiDoiTuongSuKien.TAT_CA)) {
                form.setFieldsValue({
                  loaiDoiTuong: ELoaiDoiTuongSuKien.TAT_CA,
                });
                setNguoiNhan([ELoaiDoiTuongSuKien.TAT_CA]);
                return;
              }
              if (val.includes(ELoaiDoiTuongSuKien.NGUOI_DUNG_CU_THE)) {
                form.setFieldsValue({
                  lopHanhChinhList: [],
                  lopTinChiList: [],
                  nganhList: [],
                  khoaList: [],
                  roles: [],
                  donViList: [],
                  loaiDoiTuong: ELoaiDoiTuongSuKien.NGUOI_DUNG_CU_THE,
                });
                setNguoiNhan([ELoaiDoiTuongSuKien.NGUOI_DUNG_CU_THE]);
                return;
              }
              setNguoiNhan(val);
            }}
          >
            {Object.keys(ELoaiDoiTuongSuKien)?.map((item) => {
              return (
                <Select.Option value={ELoaiDoiTuongSuKien[item]} key={item}>
                  {ELoaiDoiTuongSuKien[item]}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>

        {(nguoiNhan.includes(ELoaiDoiTuongSuKien.VAI_TRO) || isNguoiDungCuThe) && (
          <Form.Item
            style={{ marginBottom: 8 }}
            rules={isNguoiDungCuThe ? [] : [...rules.required]}
            name="roles"
            label={isNguoiDungCuThe ? 'Lọc theo vai trò' : 'Vai trò'}
            initialValue={record?.roles}
          >
            <Select
              onChange={(val: string[]) => {
                if (!isNguoiDungCuThe) return;
                setConditionNguoiDungCuThe({
                  ...conditionNguoiDungCuThe,
                  vaiTroList: val?.length > 0 ? val : undefined,
                });
              }}
              mode="multiple"
              allowClear
              placeholder="Chọn vai trò"
            >
              {Object.keys(ECanBoNhanVien).map((item) => {
                return (
                  <Select.Option value={item} key={item}>
                    {ECanBoNhanVien[item]}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
        )}

        {(nguoiNhan.includes(ELoaiDoiTuongSuKien.DON_VI) || isNguoiDungCuThe) && (
          <Form.Item
            style={{ marginBottom: 8 }}
            name="donViList"
            rules={isNguoiDungCuThe ? [] : [...rules.required]}
            label={isNguoiDungCuThe ? 'Lọc theo đơn vị' : 'Đơn vị'}
            initialValue={record?.donViList}
          >
            <Select
              // maxTagCount={8}
              onChange={(val: number[]) => {
                if (!isNguoiDungCuThe) return;
                setConditionNguoiDungCuThe({
                  ...conditionNguoiDungCuThe,
                  donViIds: val.length > 0 ? val?.map((item) => item.toString()) : undefined,
                });
              }}
              showSearch
              allowClear
              filterOption={(value, option) => includes(option?.props.children, value)}
              mode="multiple"
              placeholder="Chọn đơn vị"
            >
              {danhSachDonVi.map((item: DonVi.Record) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.ten_don_vi}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {(nguoiNhan.includes(ELoaiDoiTuongSuKien.KHOA) || isNguoiDungCuThe) && (
          <Form.Item
            style={{ marginBottom: 8 }}
            rules={isNguoiDungCuThe ? [] : [...rules.required]}
            name="khoaList"
            label={isNguoiDungCuThe ? 'Lọc theo khóa' : 'Khóa'}
            initialValue={record?.khoaList}
          >
            <Select
              // maxTagCount={8}
              filterOption={(value, option) => includes(option?.props.children, value)}
              showSearch
              allowClear
              mode="multiple"
              placeholder="Chọn khóa"
              onChange={(val: number[]) => {
                if (!isNguoiDungCuThe) return;
                setConditionNguoiDungCuThe({
                  ...conditionNguoiDungCuThe,
                  khoaSinhVienIds: val.length > 0 ? val?.map((item) => item.toString()) : undefined,
                });
              }}
            >
              {danhSachKhoaHoc?.map((item: KhoaHoc.Record) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.display_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {(nguoiNhan.includes(ELoaiDoiTuongSuKien.NGANH) || isNguoiDungCuThe) && (
          <Form.Item
            style={{ marginBottom: 8 }}
            name="nganhList"
            rules={isNguoiDungCuThe ? [] : [...rules.required]}
            label={isNguoiDungCuThe ? 'Lọc theo ngành học' : 'Ngành học'}
            initialValue={record?.nganhList}
          >
            <Select
              // maxTagCount={8}
              filterOption={(value, option) => includes(option?.props.children, value)}
              showSearch
              allowClear
              mode="multiple"
              placeholder="Chọn ngành học"
              onChange={(val: number[]) => {
                if (!isNguoiDungCuThe) return;
                setConditionNguoiDungCuThe({
                  ...conditionNguoiDungCuThe,
                  nganhIds: val.length > 0 ? val?.map((item) => item.toString()) : undefined,
                });
              }}
            >
              {danhSachNganh.map((item: NganhHoc.Record) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.ten_nganh} ({item.ten_nganh_viet_tat})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {(nguoiNhan.includes(ELoaiDoiTuongSuKien.LOP_HANH_CHINH) || isNguoiDungCuThe) && (
          <Form.Item
            style={{ marginBottom: 8 }}
            rules={isNguoiDungCuThe ? [] : [...rules.required]}
            name="lopHanhChinhList"
            label={isNguoiDungCuThe ? 'Lọc theo lớp hành chính' : 'Lớp hành chính'}
            initialValue={record?.lopHanhChinhList}
          >
            <Select
              // maxTagCount={8}
              filterOption={(value, option) => includes(option?.props.children, value)}
              showSearch
              allowClear
              mode="multiple"
              placeholder="Chọn lớp hành chính"
              onChange={(val: number[]) => {
                if (!isNguoiDungCuThe) return;
                setConditionNguoiDungCuThe({
                  ...conditionNguoiDungCuThe,
                  lopHanhChinhIds: val.length > 0 ? val?.map((item) => item.toString()) : undefined,
                });
              }}
            >
              {danhSachLopHanhChinh.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.ten_lop_hanh_chinh}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {(nguoiNhan.includes(ELoaiDoiTuongSuKien.LOP_TIN_CHI) || isNguoiDungCuThe) && (
          <Form.Item
            style={{ marginBottom: 8 }}
            rules={isNguoiDungCuThe ? [] : [...rules.required]}
            name="lopTinChiList"
            label={isNguoiDungCuThe ? 'Lọc theo lớp tín chỉ' : 'Lớp tín chỉ'}
            initialValue={record?.lopTinChiList}
          >
            <Select
              // maxTagCount={8}
              filterOption={(value, option) => includes(option?.props.children, value)}
              showSearch
              allowClear
              mode="multiple"
              placeholder="Chọn lớp tín chỉ"
              onChange={(val: number[]) => {
                if (!isNguoiDungCuThe) return;
                setConditionNguoiDungCuThe({
                  ...conditionNguoiDungCuThe,
                  lopTinChiIds: val.length > 0 ? val?.map((item) => item.toString()) : undefined,
                });
              }}
            >
              {danhSachLopTinChi.map((item: LopTinChi.Record) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.ten_lop_tin_chi}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {isNguoiDungCuThe && (
          <Form.Item
            initialValue={record?.userCodeList ?? []}
            rules={[...rules.required]}
            name="userCodeList"
            label="Đối tượng cụ thể"
          >
            <Select
              allowClear
              tokenSeparators={[',']}
              mode="tags"
              showSearch
              filterOption={(value, option) => includes(option?.label ?? '', value)}
              placeholder="Đối tượng cụ thể"
              options={danhSachNguoiDungCuThe.map((item: User.NguoiDungCuThe) => ({
                label: `${item.name}-${item.code}`,
                value: item.code,
              }))}
              // notFoundContent={loadingUser ? <Spin size="small" /> : null}
            />
          </Form.Item>
        )}

        <Row gutter={[12, 12]}>
          <Col xs={24} md={24} lg={12} xl={12}>
            <Form.Item
              initialValue={record?.thoiGianBatDau ? moment(record?.thoiGianBatDau) : undefined}
              rules={[...rules.required, ...rules.sauHomNay]}
              name="thoiGianBatDau"
              label="Thời gian bắt đầu"
            >
              <DatePicker style={{ width: '100%' }} showTime format="HH:mm DD/MM/YYYY" />
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={12} xl={12}>
            <Form.Item
              initialValue={record?.thoiGianKetThuc ? moment(record?.thoiGianKetThuc) : undefined}
              rules={[...rules.required, ...rules.sauHomNay]}
              name="thoiGianKetThuc"
              label="Thời gian kết thúc"
            >
              <DatePicker style={{ width: '100%' }} showTime format="HH:mm DD/MM/YYYY" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="kieuLapSuKien"
          initialValue={record?.kieuLapSuKien ? record?.kieuLapSuKien : ''}
          label="Lặp lại sự kiện"
        >
          <Select
            placeholder="Kiểu lặp lại sự kiện"
            onChange={(value) => (value === '' ? setChonKieuLap(false) : setChonKieuLap(true))}
            disabled={edit ? true : false}
          >
            <Select.Option value="">Không lặp</Select.Option>
            {Object.keys(EKieuLapSuKien)?.map((item) => (
              <Select.Option value={item} key={item}>
                {EKieuLapSuKien[item]}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        {chonKieuLap || record?.soLanLap ? (
          <Form.Item
            initialValue={record?.soLanLap}
            name="soLanLap"
            rules={[...rules.required]}
            label="Số lần lặp"
          >
            <InputNumber
              disabled={edit ? true : false}
              placeholder="Số lần lặp"
              min={1}
              max={100}
              style={{ width: '100%' }}
            />
          </Form.Item>
        ) : (
          ''
        )}
        <Form.Item
          initialValue={record?.diaDiem}
          rules={[...rules.required, ...rules.text, ...rules.length(2000)]}
          name="diaDiem"
          label="Địa điểm"
        >
          <Input placeholder="Địa điểm" />
        </Form.Item>
        <Form.Item
          initialValue={record?.ghiChu}
          rules={[...rules.text, ...rules.length(5000)]}
          name="ghiChu"
          label="Ghi chú"
        >
          <Input.TextArea placeholder="Ghi chú" rows={3} />
        </Form.Item>

        <Form.Item style={{ textAlign: 'center', marginBottom: 0, marginTop: '10px' }}>
          <Button loading={loading} style={{ marginRight: 8 }} htmlType="submit" type="primary">
            {edit ? 'Cập nhật' : 'Thêm mới'}
          </Button>
          <Button onClick={() => setVisibleForm(false)}>Đóng</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default FormSuKien;
