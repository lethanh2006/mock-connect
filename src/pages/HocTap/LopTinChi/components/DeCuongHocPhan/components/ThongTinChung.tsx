import TinyEditor from '@/components/TinyEditor';
import { Descriptions, Form, Tabs } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';

const ThongTinChungPage = () => {
  const [form] = Form.useForm();
  const { record } = useModel('hocphan.decuonghocphan');
  const [activeKey, setActiveKey] = useState('1');

  return (
    <Form form={form} layout="vertical">
      <Descriptions
        style={{ marginBottom: '15px', marginTop: '5px' }}
        size="small"
        title="Thông tin học phần"
        column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
      >
        <Descriptions.Item label="Tên học phần">
          {record?.tenHocPhan ?? 'Chưa cập nhật'}
        </Descriptions.Item>
        <Descriptions.Item label="Tên học phần (tiếng Anh)">
          {record?.tenTiengAnh ?? 'Chưa cập nhật'}
        </Descriptions.Item>
        <Descriptions.Item label="Mã học phần">
          {record?.maHocPhan ?? 'Chưa cập nhật'}
        </Descriptions.Item>
        <Descriptions.Item label="Số tín chỉ">
          {record?.soTinChi ?? 'Chưa cập nhật'}
        </Descriptions.Item>
      </Descriptions>
      <Descriptions
        style={{ marginBottom: '15px', marginTop: '5px' }}
        size="small"
        title="Thông tin đề cương"
        bordered={false}
        column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
      >
        <Descriptions.Item label=" Người biên soạn">
          {record?.nguoiBienSoan ?? 'Chưa cập nhật'}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày áp dụng">
          {record?.ngayApDung ?? 'Chưa cập nhật'}
        </Descriptions.Item>
        <Descriptions.Item label="Căn cứ pháp lý">
          <a>{record?.canCuPhapLy ?? 'Chưa cập nhật'}</a>
        </Descriptions.Item>
      </Descriptions>

      <Tabs activeKey={activeKey} onChange={(tab) => setActiveKey(tab)}>
        <Tabs.TabPane key="1" tab="Mục tiêu học phần" />
        <Tabs.TabPane key="2" tab="Nội dung học phần" />
      </Tabs>

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

export default ThongTinChungPage;
