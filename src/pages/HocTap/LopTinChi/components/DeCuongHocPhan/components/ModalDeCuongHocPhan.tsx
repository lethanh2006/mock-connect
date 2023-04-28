import { Tabs } from 'antd';
import { useState } from 'react';
import GiangVienDeCuongPage from '../GiangVienDeCuong';
import LichTrinhCuTheList from '../LichTrinhCuThe';
import HocLieuDeCuongPage from '../HocLieuDeCuong';
import TrongSoHocPhanPage from '../TrongSoHocPhan';
import ThongTinChungPage from './ThongTinChung';
import { useEffect } from 'react';

const TabsDeCuongHocPhan = () => {
  const [activeKey, setActiveKey] = useState<string>('1');

  useEffect(() => {
    setActiveKey('0');
  }, []);

  return (
    <div>
      <Tabs activeKey={activeKey} onChange={(tab) => setActiveKey(tab)}>
        <Tabs.TabPane key="0" tab="Thông tin chung" />
        <Tabs.TabPane key="1" tab="Giảng viên" />
        <Tabs.TabPane key="2" tab="Lịch trình cụ thể" />
        <Tabs.TabPane key="3" tab="Học liệu" />
        <Tabs.TabPane key="4" tab="Đánh giá KQHT" />
      </Tabs>

      {activeKey === '0' ? (
        <ThongTinChungPage />
      ) : activeKey === '1' ? (
        <GiangVienDeCuongPage />
      ) : activeKey === '2' ? (
        <LichTrinhCuTheList />
      ) : activeKey === '3' ? (
        <HocLieuDeCuongPage />
      ) : activeKey === '4' ? (
        <TrongSoHocPhanPage />
      ) : null}
    </div>
  );
};

export default TabsDeCuongHocPhan;
