import ThongTinTongHop from './components/ThongTinTongHop';
import { useEffect } from 'react';
import { useModel } from 'umi';
import TableQuanLyDonAdmin from '../QuanLyDon/components/TableQuanLyDonAdmin';
import { Card } from 'antd';

const ThongTinTongHopAdmin = () => {
  const { adminGetTongSoDonDVMCModel, idDichVu } = useModel('dashboard');
  const { setTrangThaiQuanLyDon } = useModel('dichvumotcuav2');
  const { pathname } = window.location;
  const isDvmc = pathname?.includes('dichvumotcua') ?? false;

  useEffect(() => {
    adminGetTongSoDonDVMCModel(isDvmc);
  }, [idDichVu]);

  useEffect(() => {
    setTrangThaiQuanLyDon(undefined);
    return () => {
      setTrangThaiQuanLyDon('PROCESSING');
    };
  }, []);

  return (
    <>
      <ThongTinTongHop />
      <Card title="Danh sách đơn">
        <TableQuanLyDonAdmin />
      </Card>
    </>
  );
};

export default ThongTinTongHopAdmin;
