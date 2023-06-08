import useInitModel from '@/hooks/useInitModel';
import {
  getAllMonHocSinhVien,
  sinhVienAllGetDiemTongKet,
  sinhVienGetThoiKhoaBieu,
} from '@/services/HocTap/LopTinChi';
import { type LopTinChi } from '@/services/HocTap/LopTinChi/typings';
import { ipDaoTao } from '@/utils/ip';
import { useState } from 'react';

export default () => {
  const objInit = useInitModel<LopTinChi.IRecord>('lop-hoc-phan', undefined, undefined, ipDaoTao);
  const { getByIdModel, setLoading, getModel } = objInit;

  const [listTkbSinhVien, setListTkbSinhVien] = useState<LopTinChi.IBuoiHoc[]>([]);
  const [danhSachMonHoc, setDanhSachMonHoc] = useState<LopTinChi.InfoMonHoc[]>([]);
  const [idNhomLop, setIdNhomLop] = useState<number>(-1);
  const [hinhThucDaoTao, setHinhThucDaoTao] = useState<number>();
  const [flagDaDanhGia, setFlagDaDanhGia] = useState(false);
  const [danhSachDiemTongKet, setDanhSachDiemTongKet] = useState<LopTinChi.DiemTongKet[]>([]);
  // const [dataBieuMau, setDataBieuMau] = useState<BieuMau.Record>({} as BieuMau.Record);
  const [danhSachDiemThanhPhanTheoKy, setDanhSachDiemThanhPhanTheoKy] = useState<any[]>([]);
  const [thongTinChung, setThongTinChung] = useState<LopTinChi.ThongTinChungLopTinChiRecord>(
    {} as any,
  );
  const [thongTinNhomLop, setThongTinNhomLop] = useState<LopTinChi.ThongTinChungLopTinChiRecord>(
    {} as any,
  );
  const [recordBuoiHoc, setRecordBuoiHoc] = useState<LopTinChi.IBuoiHoc>();

  // const getThongTinChungLopTinChiByIdLopModel = async (idLop: string) => {
  //   setLoading(true);
  //   const response = await getThongTinChungLopTinChiByIdLop(idLop);
  //   setLoading(false);
  // };

  const sinhVienGetDiemTongKetModel = async () => {
    setLoading(true);
    const response = await sinhVienAllGetDiemTongKet();
    setDanhSachDiemTongKet(response?.data?.data ?? []);
    setLoading(false);
    return response?.data?.data ?? [];
  };

  const sinhVienGetModel = async (params: any): Promise<LopTinChi.IRecord[]> =>
    getModel(params, undefined, undefined, undefined, undefined, 'sinh-vien/page');

  const sinhVienGetByIdModel = async (idLop: string): Promise<LopTinChi.IRecord> =>
    getByIdModel(`${idLop}/sinh-vien`);

  const sinhVienGetThoiKhoaBieuModel = async (idLop: string): Promise<LopTinChi.IBuoiHoc[]> => {
    try {
      setLoading(true);
      const response = await sinhVienGetThoiKhoaBieu(idLop);

      setListTkbSinhVien(response?.data?.data ?? []);
      return response?.data?.data ?? [];
    } catch (er) {
      return Promise.reject(er);
    } finally {
      setLoading(false);
    }
  };

  const getAllMonHocSinhVienModel = async (idHocKy?: number) => {
    const response = await getAllMonHocSinhVien({ condition: { idHocKy } });
    setDanhSachMonHoc(response?.data?.data ?? []);
  };

  return {
    ...objInit,
    sinhVienGetModel,
    sinhVienGetByIdModel,
    sinhVienGetThoiKhoaBieuModel,
    getAllMonHocSinhVienModel,
    sinhVienGetDiemTongKetModel,
    idNhomLop,
    setIdNhomLop,
    hinhThucDaoTao,
    setHinhThucDaoTao,
    flagDaDanhGia,
    setFlagDaDanhGia,
    thongTinChung,
    setThongTinChung,
    thongTinNhomLop,
    setThongTinNhomLop,
    listTkbSinhVien,
    setListTkbSinhVien,
    recordBuoiHoc,
    setRecordBuoiHoc,
    danhSachMonHoc,
    setDanhSachMonHoc,
    danhSachDiemThanhPhanTheoKy,
    setDanhSachDiemThanhPhanTheoKy,
    danhSachDiemTongKet,
  };
};
