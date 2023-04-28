import type { DichVuMotCuaV2 } from '@/services/DichVuMotCuaV2/typing';
import { Card, Tabs } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import TableQuanLyDon from './components/TableQuanLyDonChuyenVien';

const { TabPane } = Tabs;

const QuanLyDon = () => {
  const {
    trangThaiQuanLyDon,
    setTrangThaiQuanLyDon,
    getAllBieuMauChuyenVienDieuPhoiModel,
    getAllBieuMauChuyenVienTiepNhanModel,
    setRecord,
    setDanhSach,
    setCondition,
    setFilterInfo,
    setLoaiDichVu,
    isDonCanXuLy,
    setPage,
    setTypeTraKetQua,
    getAllBieuMauVPSModel,
  } = useModel('dichvumotcuav2');

  const { chuyenVienDieuPhoiGetTongSoDonDVMCModel, chuyenVienXuLyGetTongSoDonDVMCModel, idDichVu } =
    useModel('dashboard');

  const { pathname } = window.location;
  const isDVMC = pathname?.includes('dichvumotcua') ?? false;

  useEffect(() => {
    setLoaiDichVu(isDVMC ? 'DVMC' : 'VAN_PHONG_SO');
    if (pathname?.includes('quanlydondieuphoi')) {
      if (isDVMC) getAllBieuMauChuyenVienDieuPhoiModel(isDVMC ? 'DVMC' : 'VAN_PHONG_SO');
      else getAllBieuMauVPSModel();
    } else {
      if (isDVMC) getAllBieuMauChuyenVienTiepNhanModel(isDVMC ? 'DVMC' : 'VAN_PHONG_SO');
      else getAllBieuMauVPSModel();
    }

    return () => {
      setDanhSach([]);
      setRecord({} as DichVuMotCuaV2.BieuMau);
      setCondition({});
      setFilterInfo({});
    };
  }, []);

  useEffect(() => {
    if (pathname?.includes('quanlydondieuphoi')) {
      if (isDVMC)
        chuyenVienDieuPhoiGetTongSoDonDVMCModel(isDonCanXuLy, isDVMC ? 'DVMC' : 'VAN_PHONG_SO');
      else getAllBieuMauVPSModel();
    } else {
      if (isDVMC)
        chuyenVienXuLyGetTongSoDonDVMCModel(isDonCanXuLy, isDVMC ? 'DVMC' : 'VAN_PHONG_SO');
      else getAllBieuMauVPSModel();
    }
  }, [idDichVu]);

  return (
    <Card bodyStyle={{ padding: '8px 24px 24px 24px' }} title="Quản lý đơn">
      <Tabs
        onChange={(key: string) => {
          setPage(1);
          if (key === 'DA_TRA_KQ' || key === 'CHUA_TRA_KQ') {
            setTypeTraKetQua(key);
          } else {
            setTypeTraKetQua('');
          }
          if (pathname?.includes('quanlydondieuphoi')) {
            chuyenVienDieuPhoiGetTongSoDonDVMCModel(isDonCanXuLy);
          } else {
            chuyenVienXuLyGetTongSoDonDVMCModel(isDonCanXuLy);
          }
          setTrangThaiQuanLyDon(key);
        }}
        activeKey={trangThaiQuanLyDon}
      >
        <TabPane
          // tab={`Chờ xử lý (${
          //   recordTongSoDon?.find((item) => item.trangThai === 'PROCESSING')?.soLuong ?? 0
          // })`}
          tab="Chờ xử lý"
          key="PROCESSING"
        />
        <TabPane
          // tab={`Duyệt (${recordTongSoDon?.find((item) => item.trangThai === 'OK')?.soLuong ?? 0})`}
          tab="Duyệt"
          key="OK"
        />
        <TabPane
          // tab={`Không duyệt (${
          //   recordTongSoDon?.find((item) => item.trangThai === 'NOT_OK')?.soLuong ?? 0
          // })`}
          tab="Không duyệt"
          key="NOT_OK"
        />
        {isDVMC && (
          <>
            <TabPane tab="Chưa trả kết quả" key="CHUA_TRA_KQ" />
            <TabPane tab="Đã trả kết quả" key="DA_TRA_KQ" />
          </>
        )}
      </Tabs>
      <TableQuanLyDon />
    </Card>
  );
};

export default QuanLyDon;
