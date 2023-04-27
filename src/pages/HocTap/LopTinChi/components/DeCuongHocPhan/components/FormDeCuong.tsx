import MyDatePicker from '@/components/MyDatePicker';
import TinyEditor from '@/components/TinyEditor';
import rules from '@/utils/rules';
import { Col, Form, Input, Row, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const FormDeCuong = (props: { afterAddNew: (rec: HocPhan.IDeCuongHocPhan) => void }) => {
  const [form] = Form.useForm();
  const { record } = useModel('hocphan.decuonghocphan');
  const [activeKey, setActiveKey] = useState('1');

  useEffect(() => {
    if (record?._id) form.setFieldsValue(record);
    else form.resetFields();
  }, [record?._id]);

  return (
    <Form form={form} layout="vertical">
      <Row gutter={[12, 0]}>
        <Col span={24} md={12}>
          <Form.Item name="ma" label="Phiên bản">
            <Input placeholder="Nhập phiên bản" />
          </Form.Item>
        </Col>
        <Col span={24} md={12}>
          <Form.Item name="nguoiBienSoan" label="Người biên soạn">
            <Input placeholder="Nhập người biên soạn" />
          </Form.Item>
        </Col>

        <Col span={24} md={12}>
          <Form.Item name="ngayApDung" label="Ngày áp dụng" rules={[...rules.required]}>
            <MyDatePicker />
          </Form.Item>
        </Col>
        {/* <Col span={24} md={12}>
          <Form.Item name="canCuId" label="Căn cứ pháp lý">
            <SelectVanBanQuyDinh hasDefault={!edit} />
          </Form.Item>
        </Col> */}
      </Row>

      <Tabs activeKey={activeKey} onChange={(tab) => setActiveKey(tab)}>
        <Tabs.TabPane key="1" tab="Mục tiêu học phần" />
        <Tabs.TabPane key="2" tab="Nội dung học phần" />
      </Tabs>

      {/* Dùng CSS để show/hide các div, tránh trường hợp un-render */}
      <div style={{ display: activeKey === '1' ? 'block' : 'none' }}>
        <Form.Item name="mucTieuHocPhan" label="" initialValue="">
          <TinyEditor hideMenubar miniToolbar />
        </Form.Item>
      </div>
      <div style={{ display: activeKey !== '1' ? 'block' : 'none' }}>
        <Form.Item name="noiDungTomTat" label="Nội dung tóm tắt" initialValue="">
          <TinyEditor hideMenubar miniToolbar />
        </Form.Item>
        <Form.Item name="noiDungChiTiet" label="Nội dung chi tiết" initialValue="">
          <TinyEditor hideMenubar miniToolbar />
        </Form.Item>
      </div>
    </Form>
  );
};

export default FormDeCuong;
