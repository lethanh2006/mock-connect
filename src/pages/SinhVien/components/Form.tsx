import MyDatePicker from '@/components/MyDatePicker';
import UploadFile from '@/components/Upload/UploadFile';
import SelectDanToc from '@/pages/Core/DanToc/SelectDanToc';
import SelectQuocTich from '@/pages/Core/QuocTich/SelectQuocTich';
import SelectTonGiao from '@/pages/Core/TonGiao/SelectTonGiao';
import { getTinhThanhPho } from '@/services/Core/DonViHanhChinh';
import { type DonViHanhChinh } from '@/services/Core/DonViHanhChinh/typing';
import rules from '@/utils/rules';
import { Checkbox, Col, Collapse, Divider, Form, Input, InputNumber, Row, Select } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import SelectDonViHanhChinh from '../../Core/DonViHanhChinh/SelectDonViHanhChinh';
import { EGioiTinh } from '@/services/DaoTao/constant';

const FormSinhVien = () => {
  const [form] = Form.useForm();
  const { getThongTinCuaToiModel } = useModel('sinhvien.sinhvien');
  const [listTinh, setListTinh] = useState<DonViHanhChinh.IRecord[]>();

  useEffect(() => {
    getTinhThanhPho().then((data) => {
      setListTinh(data.data.data);
    });
  }, []);

  useEffect(() => {
    getThongTinCuaToiModel().then((rec) => form.setFieldsValue(rec));
  }, []);

  return (
    <Form form={form} layout="vertical">
      <div className="button-section">
        {/* <Button
          loading={formSubmiting}
          htmlType="submit"
          type="primary"
          icon={edit ? <SaveOutlined /> : <PlusOutlined />}
        >
          {!edit ? <>Thêm mới và Tiếp tục</> : <>Lưu lại</>}
        </Button>

        {edit ? (
          <Button icon={<PrinterOutlined />} onClick={onExport} loading={formSubmiting}>
            In hồ sơ
          </Button>
        ) : null} */}
      </div>

      <Divider orientation="center">Thông tin chung</Divider>
      <Row gutter={[12, 0]} style={{ marginBottom: 12 }}>
        <Col span={24} md={6}>
          <Form.Item name="anhDaiDienUrl" label=" ">
            <UploadFile isAvatar otherProps={{ disabled: true }} />
          </Form.Item>
        </Col>

        <Col span={24} md={18}>
          <Row gutter={[12, 0]}>
            <Col span={24}>
              <Form.Item
                name="ma"
                label="Mã sinh viên"
                rules={[...rules.required, ...rules.text, ...rules.length(20)]}
              >
                <Input placeholder="Mã sinh viên" disabled />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[12, 0]}>
            <Col span={24} md={8}>
              <Form.Item
                name="ten"
                label="Họ và tên"
                rules={[...rules.required, ...rules.text, ...rules.length(250)]}
              >
                <Input placeholder="Nhập họ tên sinh viên" disabled />
              </Form.Item>
            </Col>
            <Col span={12} md={8}>
              <Form.Item
                name="ngaySinh"
                label="Ngày sinh"
                rules={[...rules.required, ...rules.ngaySinh]}
              >
                <MyDatePicker style={{ width: '100%' }} disabled />
              </Form.Item>
            </Col>
            <Col span={12} md={8}>
              <Form.Item
                name="gioiTinh"
                label="Giới tính"
                rules={[...rules.required, ...rules.text]}
              >
                <Select
                  placeholder="Chọn giới tính"
                  options={Object.values(EGioiTinh).map((item) => ({
                    key: item,
                    value: item,
                    label: item,
                  }))}
                  disabled
                />
              </Form.Item>
            </Col>

            <Col span={12} md={8}>
              <Form.Item
                name="cccd"
                label="Số CMTND/CCCD/Hộ chiếu"
                rules={[...rules.required, ...rules.CMND]}
              >
                <Input placeholder="Nhập số CMTND/CCCD/Hộ chiếu" disabled />
              </Form.Item>
            </Col>
            <Col span={12} md={8}>
              <Form.Item
                name="noiCapCccd"
                label="Nơi cấp"
                rules={[...rules.text, ...rules.length(250)]}
              >
                <Input placeholder="Nhập nơi cấp" disabled />
              </Form.Item>
            </Col>
            <Col span={12} md={8}>
              <Form.Item name="ngayCapCccd" label="Ngày cấp" rules={[...rules.truocHomNay]}>
                <MyDatePicker placeholder="Chọn ngày cấp" allowClear disabled />
              </Form.Item>
            </Col>

            <Col span={12} md={8}>
              <Form.Item name="quocTich" label="Quốc tịch">
                <SelectQuocTich allowClear />
              </Form.Item>
            </Col>
            <Col span={12} md={8}>
              <Form.Item name="danToc" label="Dân tộc">
                <SelectDanToc allowClear />
              </Form.Item>
            </Col>
            <Col span={12} md={8}>
              <Form.Item name="tonGiao" label="Tôn giáo">
                <SelectTonGiao allowClear />
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>

      <Collapse>
        <Collapse.Panel forceRender header="Thông tin cá nhân chi tiết" key={'1'}>
          <Divider orientation="center" style={{ marginTop: 0 }}>
            Nơi sinh
          </Divider>
          <Row gutter={[12, 0]}>
            <Col span={12} md={12}>
              <Form.Item
                name="loaiNoiSinh"
                label="Loại nơi sinh"
                rules={[...rules.text, ...rules.length(250)]}
              >
                <Input placeholder="Nhập loại nơi sinh" />
              </Form.Item>
            </Col>
            <Col span={12} md={12}>
              <Form.Item name="quocGiaNoiSinh" label="Quốc gia">
                <SelectQuocTich allowClear placeholder="Chọn quốc gia" loadData={false} />
              </Form.Item>
            </Col>
          </Row>
          <SelectDonViHanhChinh form={form} listTinh={listTinh} suffix="NoiSinh" />

          <Divider orientation="center">Quê quán</Divider>
          <SelectDonViHanhChinh form={form} listTinh={listTinh} suffix="QueQuan" />

          <Divider orientation="center">Hộ khẩu thường trú</Divider>
          <SelectDonViHanhChinh form={form} listTinh={listTinh} suffix="ThuongTru" hasSoNha />

          <Divider orientation="center">Thông tin liên lạc</Divider>
          <Row gutter={[12, 0]}>
            <Col span={24} md={6}>
              <Form.Item
                name="soDienThoai"
                label="Số điện thoại"
                rules={[...rules.required, ...rules.soDienThoai]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
            <Col span={24} md={6}>
              <Form.Item name="email" label="Email" rules={[...rules.required, ...rules.email]}>
                <Input placeholder="Nhập email" />
              </Form.Item>
            </Col>
            <Col span={24} md={6}>
              <Form.Item name="soDienThoai2" label="Số điện thoại 2" rules={[...rules.soDienThoai]}>
                <Input placeholder="Nhập số điện thoại 2" />
              </Form.Item>
            </Col>
            <Col span={24} md={6}>
              <Form.Item name="email2" label="Email 2" rules={[...rules.email]}>
                <Input placeholder="Nhập email 2" />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item
                name="nguoiLienLac"
                label="Người liên lạc"
                rules={[...rules.text, ...rules.length(250)]}
              >
                <Input placeholder="Nhập họ tên người liên lạc" />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item name="soDienThoaiNguoiLienLac" label="SĐT" rules={[...rules.soDienThoai]}>
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="center">Thông tin tài khoản ngân hàng</Divider>
          <Row gutter={[12, 0]}>
            <Col span={24} md={8}>
              <Form.Item
                name="soTaiKhoanNganHang"
                label="Số tài khoản ngân hàng"
                rules={[...rules.sotaikhoan]}
              >
                <Input placeholder="Nhập số tài khoản" />
              </Form.Item>
            </Col>
            <Col span={24} md={8}>
              <Form.Item
                name="tenNganHang"
                label="Tên ngân hàng"
                rules={[...rules.text, ...rules.length(250)]}
              >
                <Input placeholder="Nhập tên ngân hàng" />
              </Form.Item>
            </Col>
            <Col span={24} md={8}>
              <Form.Item name="chiNhanhNganHang" label="Chi nhánh ngân hàng">
                <Input placeholder="Nhập chi nhánh" />
              </Form.Item>
            </Col>
          </Row>
        </Collapse.Panel>

        <Collapse.Panel forceRender header="Thông tin gia đình" key={'4'}>
          <Divider orientation="center">Thông tin của cha</Divider>
          <Row gutter={[12, 0]}>
            <Col span={24} md={6}>
              <Form.Item name="tenCha" label="Họ tên" rules={[...rules.text, ...rules.length(250)]}>
                <Input placeholder="Nhập họ tên cha" />
              </Form.Item>
            </Col>
            <Col span={24} md={6}>
              <Form.Item name="ngaySinhCha" label="Ngày sinh">
                <MyDatePicker allowClear style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={24} md={6}>
              <Form.Item name="soDienThoaiCha" label="SĐT" rules={[...rules.soDienThoai]}>
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
            <Col span={24} md={6}>
              <Form.Item name="emailCha" label="Email" rules={[...rules.email]}>
                <Input placeholder="Nhập email" />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item
                name="ngheNghiepCha"
                label="Nghề nghiệp"
                rules={[...rules.text, ...rules.length(250)]}
              >
                <Input placeholder="Nhập nghề nghiệp" />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item
                name="noiCongTacCha"
                label="Nơi công tác"
                rules={[...rules.text, ...rules.length(250)]}
              >
                <Input placeholder="Nhập nơi công tác" />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item
                name="nguyenQuanCha"
                label="Nguyên quán"
                rules={[...rules.text, ...rules.length(250)]}
              >
                <Input placeholder="Nhập nguyên quán" />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item
                name="diaChiCha"
                label="Địa chỉ"
                rules={[...rules.text, ...rules.length(250)]}
              >
                <Input placeholder="Nhập địa chỉ" />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item name="chaDaMat" valuePropName="checked">
                <Checkbox>Cha đã mất</Checkbox>
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="center">Thông tin của mẹ</Divider>
          <Row gutter={[12, 0]}>
            <Col span={24} md={6}>
              <Form.Item name="tenMe" label="Họ tên" rules={[...rules.text, ...rules.length(250)]}>
                <Input placeholder="Nhập họ tên mẹ" />
              </Form.Item>
            </Col>
            <Col span={24} md={6}>
              <Form.Item name="ngaySinhMe" label="Ngày sinh">
                <MyDatePicker allowClear style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={24} md={6}>
              <Form.Item name="soDienThoaiMe" label="SĐT" rules={[...rules.soDienThoai]}>
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
            <Col span={24} md={6}>
              <Form.Item name="emailMe" label="Email" rules={[...rules.email]}>
                <Input placeholder="Nhập email" />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item
                name="ngheNghiepMe"
                label="Nghề nghiệp"
                rules={[...rules.text, ...rules.length(250)]}
              >
                <Input placeholder="Nhập nghề nghiệp" />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item
                name="noiCongTacMe"
                label="Nơi công tác"
                rules={[...rules.text, ...rules.length(250)]}
              >
                <Input placeholder="Nhập nơi công tác" />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item
                name="nguyenQuanMe"
                label="Nguyên quán"
                rules={[...rules.text, ...rules.length(250)]}
              >
                <Input placeholder="Nhập nguyên quán" />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item
                name="diaChiMe"
                label="Địa chỉ"
                rules={[...rules.text, ...rules.length(250)]}
              >
                <Input placeholder="Nhập địa chỉ" />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item name="meDaMat" valuePropName="checked">
                <Checkbox>Mẹ đã mất</Checkbox>
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="center">Thông tin người giám hộ</Divider>
          <Row gutter={[12, 0]}>
            <Col span={24} md={6}>
              <Form.Item
                name="tenGiamHo"
                label="Họ tên"
                rules={[...rules.text, ...rules.length(250)]}
              >
                <Input placeholder="Nhập họ tên người giám hộ" />
              </Form.Item>
            </Col>
            <Col span={24} md={6}>
              <Form.Item name="ngaySinhGiamHo" label="Ngày sinh">
                <MyDatePicker allowClear style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={24} md={6}>
              <Form.Item name="soDienThoaiGiamHo" label="SĐT" rules={[...rules.soDienThoai]}>
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
            <Col span={24} md={6}>
              <Form.Item name="emailGiamHo" label="Email" rules={[...rules.email]}>
                <Input placeholder="Nhập email" />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item
                name="ngheNghiepGiamHo"
                label="Nghề nghiệp"
                rules={[...rules.text, ...rules.length(250)]}
              >
                <Input placeholder="Nhập nghề nghiệp" />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item
                name="noiCongTacGiamHo"
                label="Nơi công tác"
                rules={[...rules.text, ...rules.length(250)]}
              >
                <Input placeholder="Nhập nơi công tác" />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item
                name="nguyenQuanGiamHo"
                label="Nguyên quán"
                rules={[...rules.text, ...rules.length(250)]}
              >
                <Input placeholder="Nhập nguyên quán" />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item
                name="diaChiGiamHo"
                label="Địa chỉ"
                rules={[...rules.text, ...rules.length(250)]}
              >
                <Input placeholder="Nhập địa chỉ" />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item
                name="tenChuHo"
                label="Tên chủ hộ"
                rules={[...rules.text, ...rules.length(250)]}
              >
                <Input placeholder="Nhập tên chủ hộ" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="center">Thông tin vợ/chồng</Divider>
          <Row gutter={[12, 0]}>
            <Col span={24} md={8}>
              <Form.Item
                name="tenVoChong"
                label="Họ tên"
                rules={[...rules.text, ...rules.length(250)]}
              >
                <Input placeholder="Nhập họ tên vợ/chồng" />
              </Form.Item>
            </Col>
            <Col span={24} md={8}>
              <Form.Item name="soDienThoaiVoChong" label="SĐT" rules={[...rules.soDienThoai]}>
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
            <Col span={24} md={8}>
              <Form.Item name="emailVoChong" label="Email" rules={[...rules.email]}>
                <Input placeholder="Nhập Email" />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item
                name="ngheNghiepVoChong"
                label="Nghề nghiệp"
                rules={[...rules.text, ...rules.length(250)]}
              >
                <Input placeholder="Nhập nghề nghiệp" />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item
                name="diaChiVoChong"
                label="Địa chỉ"
                rules={[...rules.text, ...rules.length(250)]}
              >
                <Input placeholder="Nhập địa chỉ vợ/chồng" />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="center">Thông tin anh/chị/em</Divider>
          <Row gutter={[12, 0]}>
            <Col span={24}>
              <Form.Item
                name="thongTinAnhChiEm"
                label=""
                rules={[...rules.text, ...rules.length(2000)]}
              >
                <Input.TextArea placeholder="Nhập thông tin anh/chị/em" rows={3} />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="center">Thông tin các con</Divider>
          <Row gutter={[12, 0]}>
            <Col span={24}>
              <Form.Item
                name="thongTinCacCon"
                label=""
                rules={[...rules.text, ...rules.length(200)]}
              >
                <Input.TextArea placeholder="Nhập thông tin các con" rows={3} />
              </Form.Item>
            </Col>
          </Row>
        </Collapse.Panel>

        <Collapse.Panel forceRender header="Thông tin Đoàn / Đảng" key={'2'}>
          <Divider orientation="center">Thông tin Đoàn</Divider>
          <Row gutter={[12, 0]}>
            <Col span={24} md={12}>
              <Form.Item name="laDoanVien" label=" " valuePropName="checked">
                <Checkbox>Là đoàn viên</Checkbox>
              </Form.Item>
            </Col>
            <Col span={12} md={12}>
              <Form.Item name="ngayVaoDoan" label="Ngày vào đoàn" rules={[...rules.truocHomNay]}>
                <MyDatePicker allowClear style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="center">Thông tin Đảng</Divider>
          <Row gutter={[12, 0]}>
            <Col span={24} md={12}>
              <Form.Item name="daHocLopCamTinhDang" label="" valuePropName="checked">
                <Checkbox>Đã học lớp cảm tình Đảng</Checkbox>
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item name="laDangVien" label="" valuePropName="checked">
                <Checkbox>Là Đảng viên</Checkbox>
              </Form.Item>
            </Col>

            <Col span={12} md={12}>
              <Form.Item name="ngayVaoDang" label="Ngày vào đảng" rules={[...rules.truocHomNay]}>
                <MyDatePicker allowClear style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12} md={12}>
              <Form.Item
                name="ngayVaoDangChinhThuc"
                label="Ngày vào đảng chính thức"
                rules={[...rules.truocHomNay]}
              >
                <MyDatePicker allowClear style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </Collapse.Panel>

        <Collapse.Panel forceRender header="Thông tin sức khoẻ và bảo hiểm" key={'3'}>
          <Row gutter={[12, 0]}>
            <Col span={12} md={8}>
              <Form.Item name="chieuCao" label="Chiều cao (cm)" rules={[...rules.number(300, 0)]}>
                <InputNumber placeholder="Nhập chiều cao" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12} md={8}>
              <Form.Item name="canNang" label="Cân nặng (kg)" rules={[...rules.number(300, 0)]}>
                <InputNumber placeholder="Nhập cân nặng" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12} md={8}>
              <Form.Item
                name="loaiKhuyetTat"
                label="Loại khuyết tật"
                rules={[...rules.text, ...rules.length(250)]}
              >
                <Input placeholder="Nhập loại khuyết tật" />
              </Form.Item>
            </Col>

            <Col span={12} md={12}>
              <Form.Item
                name="soBaoHiemSinhVien"
                label="Số bảo hiểm sinh viên"
                rules={[...rules.text, ...rules.length(20)]}
              >
                <Input placeholder="Nhập số bảo hiểm sinh viên" />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item
                name="maBenhVienKhamChuaBenh"
                label="Mã bệnh viện khám chữa bệnh"
                rules={[...rules.text, ...rules.length(20)]}
              >
                <Input placeholder="Nhập mã bệnh viện" />
              </Form.Item>
            </Col>
          </Row>
        </Collapse.Panel>
      </Collapse>
    </Form>
  );
};

export default FormSinhVien;
