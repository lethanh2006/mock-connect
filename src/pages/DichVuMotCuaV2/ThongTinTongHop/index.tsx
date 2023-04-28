import { Card } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import TableQuanLyDon from '../QuanLyDon/components/TableQuanLyDonChuyenVien';
import ThongTinTongHop from './components/ThongTinTongHop';

const ThongTinTongHopChuyenVienDieuPhoi = () => {
  const { idDichVu, chuyenVienDieuPhoiGetTongSoDonDVMCModel } = useModel('dashboard');
  const { setTrangThaiQuanLyDon, getAllBieuMauChuyenVienDieuPhoiModel } =
    useModel('dichvumotcuav2');

  useEffect(() => {
    chuyenVienDieuPhoiGetTongSoDonDVMCModel();
  }, [idDichVu]);

  useEffect(() => {
    setTrangThaiQuanLyDon(undefined);
    getAllBieuMauChuyenVienDieuPhoiModel('DVMC');
    return () => {
      setTrangThaiQuanLyDon('PROCESSING');
    };
  }, []);

  return (
    <>
      <ThongTinTongHop />
      <Card bodyStyle={{ padding: 0 }} title="Danh sách đơn">
        <TableQuanLyDon hideFilter />
      </Card>
    </>
  );
};

export default ThongTinTongHopChuyenVienDieuPhoi;
