import type { DichVuMotCuaV2 } from '@/services/DichVuMotCuaV2/typing';
import { Card, Tabs } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import TableQuanLyDon from './components/TableQuanLyDonChuyenVien';
import { MaDichVuVps } from '@/utils/constants';

const { TabPane } = Tabs;

const QuanLyDon = () => {
  const {
    trangThaiQuanLyDon,
    setTrangThaiQuanLyDon,
    setRecord,
    setDanhSach,
    setCondition,
    setFilterInfo,
    setLoaiDichVu,
    setPage,
    getAllBieuMauVPSModel,
    condition,
  } = useModel('dichvumotcuav2');

  useEffect(() => {
    // setLoaiDichVu('VAN_PHONG_SO');
    setCondition({ ...condition, 'thongTinDichVu.maDichVu': MaDichVuVps.MUON_OTO });
    getAllBieuMauVPSModel();
    return () => {
      setDanhSach([]);
      setRecord({} as DichVuMotCuaV2.BieuMau);
      setCondition({});
      setFilterInfo({});
    };
  }, []);

  return (
    <Card bodyStyle={{ padding: '8px 24px 24px 24px' }} title="Quản lý đơn">
      <Tabs
        onChange={(key: string) => {
          setPage(1);
          setTrangThaiQuanLyDon(key);
        }}
        activeKey={trangThaiQuanLyDon}
      >
        <TabPane tab="Chờ xử lý" key="PROCESSING" />
        <TabPane tab="Duyệt" key="OK" />
        <TabPane tab="Không duyệt" key="NOT_OK" />
      </Tabs>
      <TableQuanLyDon />
    </Card>
  );
};

export default QuanLyDon;
