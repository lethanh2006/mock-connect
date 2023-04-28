import useInitModel from '@/hooks/useInitModel';
import {
  getAllSinhVienLopHocPhan,
  sinhVienGetLopTinChiById,
  sinhVienGetThoiKhoaBieu,
} from '@/services/LopTinChi';
import type { LopTinChi } from '@/services/LopTinChi/typings';
import { useState } from 'react';

export default () => {
  const objInit = useInitModel<LopTinChi.IRecord>('lop-hoc-phan');
  const { setDanhSach, setRecord, setLoading, setTotal, sort, filters } = objInit;
  const [listTkbSinhVien, setListTkbSinhVien] = useState<LopTinChi.IBuoiHoc[]>([]);

  const [idNhomLop, setIdNhomLop] = useState<number>(-1);
  const [hinhThucDaoTao, setHinhThucDaoTao] = useState<number>();
  const [flagDaDanhGia, setFlagDaDanhGia] = useState(false);
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

  const sinhVienGetAllLopHocPhanModel = async () => {
    setLoading(true);
    const response = await getAllSinhVienLopHocPhan({
      sort,
      filters: filters?.filter((item) => item.active)?.map(({ active, ...item }) => item),
    });
    setDanhSach(response?.data?.data ?? []);
    setTotal(response?.data?.data?.length ?? 0);
    setLoading(false);
  };

  const sinhVienGetLopTinChiByIdModel = async (idLop: string) => {
    setLoading(true);
    const response = await sinhVienGetLopTinChiById(idLop);
    setRecord(response?.data?.data ?? {});
    setLoading(false);
  };

  const sinhVienGetThoiKhoaBieuModel = async (idLop: string) => {
    setLoading(true);
    const response = await sinhVienGetThoiKhoaBieu(idLop);
    setListTkbSinhVien(response?.data?.data ?? []);
    console.log(response, 'res');
    setLoading(false);
  };

  return {
    ...objInit,
    sinhVienGetAllLopHocPhanModel,
    sinhVienGetLopTinChiByIdModel,
    sinhVienGetThoiKhoaBieuModel,
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
    danhSachDiemThanhPhanTheoKy,
    setDanhSachDiemThanhPhanTheoKy,
  };
};
