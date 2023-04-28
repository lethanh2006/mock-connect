import type { DichVuMotCuaV2 } from '@/services/DichVuMotCuaV2/typing';
import { Card, Tabs } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import TableQuanLyDonAdmin from './components/TableQuanLyDonAdmin';
const { TabPane } = Tabs;

const QuanLyDonAdmin = () => {
  const {
    trangThaiQuanLyDon,
    setTrangThaiQuanLyDon,
    setDanhSach,
    setRecord,
    setCondition,
    setFilterInfo,
    setPage,
    setTypeTraKetQua,
  } = useModel('dichvumotcuav2');
  const { adminGetTongSoDonDVMCModel, recordTongSoDon, setIdDichVu, idDichVu, setRecordTongSoDon } =
    useModel('dashboard');
  const { pathname } = window.location;
  const isDVMC = pathname?.includes('dichvumotcua') ?? false;

  // useEffect(() => {
  //   adminGetTongSoDonDVMCModel(isDVMC);
  // }, [idDichVu]);

  useEffect(() => {
    return () => {
      setDanhSach([]);
      setRecord({} as DichVuMotCuaV2.BieuMau);
      setCondition({ phamVi: 'Tất cả' });
      setFilterInfo({});
      setIdDichVu(undefined);
      setRecordTongSoDon([]);
    };
  }, []);

  return (
    <Card bodyStyle={{ padding: '8px 24px 24px 24px' }} title="Quản lý đơn">
      <Tabs
        onChange={(key: string) => {
          setPage(1);
          setTrangThaiQuanLyDon(key);
          if (key === 'DA_TRA_KQ' || key === 'CHUA_TRA_KQ') {
            setTypeTraKetQua(key);
          } else {
            setTypeTraKetQua('');
          }
          // adminGetTongSoDonDVMCModel(isDVMC);
        }}
        activeKey={trangThaiQuanLyDon}
        defaultActiveKey="PROCESSING"
      >
        <TabPane
          // tab={`Chờ xử lý (${
          //   recordTongSoDon?.find((item: { trangThai: string }) => item.trangThai === 'PROCESSING')
          //     ?.soLuong ?? 0
          // })`}
          tab="Chờ xử lý"
          key="PROCESSING"
        />
        <TabPane
          // tab={`Duyệt (${
          //   recordTongSoDon?.find((item: { trangThai: string }) => item.trangThai === 'OK')
          //     ?.soLuong ?? 0
          // })`}
          tab="Duyệt"
          key="OK"
        />
        <TabPane
          // tab={`Không duyệt (${
          //   recordTongSoDon?.find((item: { trangThai: string }) => item.trangThai === 'NOT_OK')
          //     ?.soLuong ?? 0
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
      <TableQuanLyDonAdmin />
    </Card>
  );
};

export default QuanLyDonAdmin;
