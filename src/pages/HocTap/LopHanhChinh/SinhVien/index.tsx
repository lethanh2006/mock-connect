import type { APILopHanhChinh } from '@/services/LopHanhChinh';
import { Card, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import ThongTinChungLopHanhChinh from '../components/ThongTinChung';

const LopHanhChinh = () => {
  const isNhanVien = localStorage.getItem('vaiTro') === 'nhan_vien';
  const [dataLopHanhChinh, setdataLopHanhChinh] = useState<APILopHanhChinh.Data>(
    {} as APILopHanhChinh.Data,
  );
  const {
    danhSachSinhVien,
    canBo,
    ten_lop_hanh_chinh,
    diemTichLuyLonNhat,
    diemTichLuyNhoNhat,
    diemTichLuyTB,
  } = dataLopHanhChinh;

  // useEffect(() => {
  //   const getData = async () => {
  //     const res = await getDataLopHanhChinh(isNhanVien ? 'can-bo' : 'sinh-vien');
  //     setdataLopHanhChinh(res?.data?.data ?? {});
  //   };
  //   getData();
  // }, []);

  return (
    <Card bodyStyle={{ paddingTop: 4 }} title={`Lớp hành chính ${ten_lop_hanh_chinh || ''}`}>
      <Tabs>
        <Tabs.TabPane tab="Thông tin chung" key={0}>
          <ThongTinChungLopHanhChinh
            danhSachSinhVien={danhSachSinhVien || []}
            giangVien={canBo}
            diemTichLuyLonNhat={diemTichLuyLonNhat}
            diemTichLuyNhoNhat={diemTichLuyNhoNhat}
            diemTichLuyTB={diemTichLuyTB}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Thông báo" key={1}>
          {/* <ThongBao isNhanVien={isNhanVien} id={dataLopHanhChinh?.id} typeLop="LopHanhChinh" /> */}
          Thông báo
        </Tabs.TabPane>
      </Tabs>
    </Card>
  );
};

export default LopHanhChinh;
