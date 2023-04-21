import useInitModel from '@/hooks/useInitModel';
import type { IResThongBaoLopTinChi, LopTinChi } from '@/services/LopTinChi/typings';
import { useState } from 'react';

export default () => {
  const objInit = useInitModel<LopTinChi.Record>('lop-tin-chi');
  const [danhSachNhomLop, setDanhSachNhomLop] = useState<LopTinChi.NhomLopTinChi[]>();
  const [danhSachDiemThanhPhanTheoKy, setDanhSachDiemThanhPhanTheoKy] = useState<
    LopTinChi.DiemThanhPhan[]
  >([]);
  const [recordDiemTongKet, setRecordDiemTongKet] = useState<LopTinChi.DiemTongKet>();
  const [danhSachDiemTongKet, setDanhSachDiemTongKet] = useState<LopTinChi.DiemTongKet[]>([]);
  const [danhSachKetQuaHocTap, setDanhSachKetQuaHocTap] = useState<LopTinChi.KetQuaHocTap[]>([]);
  const [idNhomLop, setIdNhomLop] = useState<number>(-1);
  const [infoMonHoc, setInfoMonHoc] = useState<LopTinChi.InfoMonHoc>();
  const [danhSachMonHoc, setDanhSachMonHoc] = useState<LopTinChi.InfoMonHoc[]>([]);
  const [ketQuaHocTap, setKetQuaHocTap] = useState<LopTinChi.KetQuaHocTap>(
    {} as LopTinChi.KetQuaHocTap,
  );
  const [hinhThucDaoTao, setHinhThucDaoTao] = useState<number>();
  const [dataDotDanhGia, setDataDotDanhGia] = useState<LopTinChi.DotDanhGia>();
  const [flagDaDanhGia, setFlagDaDanhGia] = useState(false);
  // const [dataBieuMau, setDataBieuMau] = useState<BieuMau.Record>({} as BieuMau.Record);

  const [thongTinChung, setThongTinChung] = useState<LopTinChi.ThongTinChungLopTinChiRecord>(
    {} as any,
  );
  const [thongTinNhomLop, setThongTinNhomLop] = useState<LopTinChi.ThongTinChungLopTinChiRecord>(
    {} as any,
  );
  const [thongBao, setThongBao] = useState<IResThongBaoLopTinChi.Result[]>({} as any);

  return {
    ...objInit,
    danhSachNhomLop,
    setDanhSachNhomLop,
    danhSachDiemThanhPhanTheoKy,
    setDanhSachDiemThanhPhanTheoKy,
    recordDiemTongKet,
    setRecordDiemTongKet,
    danhSachDiemTongKet,
    setDanhSachDiemTongKet,
    danhSachKetQuaHocTap,
    setDanhSachKetQuaHocTap,
    idNhomLop,
    setIdNhomLop,
    infoMonHoc,
    setInfoMonHoc,
    danhSachMonHoc,
    setDanhSachMonHoc,
    ketQuaHocTap,
    setKetQuaHocTap,
    hinhThucDaoTao,
    setHinhThucDaoTao,
    dataDotDanhGia,
    setDataDotDanhGia,
    flagDaDanhGia,
    setFlagDaDanhGia,
    thongTinChung,
    setThongTinChung,
    thongTinNhomLop,
    setThongTinNhomLop,
    thongBao,
    setThongBao,
  };
};
