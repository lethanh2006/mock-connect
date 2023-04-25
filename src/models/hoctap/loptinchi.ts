import useInitModel from '@/hooks/useInitModel';
import { getAllSinhVien, getThongTinChungLopTinChiByIdLop } from '@/services/LopTinChi';
import type { IResThongBaoLopTinChi, LopTinChi } from '@/services/LopTinChi/typings';
import { useState } from 'react';

export default () => {
  const objInit = useInitModel<LopTinChi.IRecord>('lop-hoc-phan');
  const { danhSach, setDanhSach, setRecord, setLoading } = objInit;
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

  const getThongTinChungLopTinChiByIdLopModel = async (idLop: string) => {
    setLoading(true);
    const response = await getThongTinChungLopTinChiByIdLop(idLop);
    console.log(response, 'res get');
    setLoading(false);
  };

  const getAllSinhVienLopHocPhanModel = async () => {
    setLoading(true);
    const response = await getAllSinhVien();
    setLoading(false);
  };
  return {
    ...objInit,
    getThongTinChungLopTinChiByIdLopModel,
    getAllSinhVienLopHocPhanModel,
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
