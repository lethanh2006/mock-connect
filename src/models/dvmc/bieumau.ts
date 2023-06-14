import {
  addBieuMau,
  delBieuMau,
  exportKetQuaKhaoSat,
  getAllBieuMau,
  getBieuMauAdmin,
  getBieuMauById,
  getBieuMauThongKe,
  getBieuMauUser,
  getIdBieuMauDaTraLoi,
  initBieuMauTracNghiem,
  kichHoatBieuMau,
  putBieuMau,
  traLoiBieuMau,
} from '@/services/DVMC/BieuMau/bieumau';
import { type ELoaiBieuMau } from '@/services/DVMC/BieuMau/constants';
import type { BieuMau } from '@/services/DVMC/BieuMau/typings';
import { message } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import FileDownload from 'js-file-download';
import { useState } from 'react';
import useInitModel from '@/hooks/useInitModel';
import { ip3 } from '@/utils/ip';

export default () => {
  const objInit = useInitModel<BieuMau.Record>('khao-sat', undefined, undefined, ip3);
  const {
    setLoading,
    page,
    limit,
    condition,
    setTotal,
    setDanhSach,
    setPage,
    setVisibleForm,
    setRecord,
  } = objInit;
  const [loaiBieuMau, setLoaiBieuMau] = useState<ELoaiBieuMau>();
  const [listIdBieuMauDaTraLoi, setListIdBieuMauDaTraLoi] = useState<string[]>([]);
  const [thongKe, setThongKe] = useState<BieuMau.ThongKe>();
  const [current, setCurrent] = useState<number>(0);
  const [phamVi, setPhamVi] = useState<'Tất cả' | 'Hình thức đào tạo'>('Tất cả');
  const [formCauHinhBieuMau] = useForm();
  const getBieuMauAdminModel = async (loaiParam?: string) => {
    try {
      setLoading(true);
      const response = await getBieuMauAdmin({
        page,
        limit,
        condition: { ...condition, loai: condition?.loai || loaiParam || loaiBieuMau },
        sort: { _id: -1 },
      });
      if (page > 1 && response?.data?.data?.result?.length === 0) {
        setPage(page - 1);
        return;
      }
      setDanhSach(response?.data?.data?.result ?? []);
      setTotal(response?.data?.data?.total || response?.data?.data?.length);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const getBieuMauUserModel = async (loaiParam?: string) => {
    setLoading(true);
    const response = await getBieuMauUser({ page, limit, loai: loaiParam || loaiBieuMau });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const getBieuMauByIdModel = async (id: string) => {
    setLoading(true);
    const response = await getBieuMauById({ id });
    setRecord(response?.data?.data ?? {});
    setLoading(false);
    return response?.data?.data ?? {};
  };

  const addBieuMauModel = async (payload: BieuMau.Record, getData?: any) => {
    try {
      setLoading(true);
      await addBieuMau(payload);
      message.success('Thêm thành công');
      setLoading(false);
      if (getData) {
        getData();
      } else {
        getBieuMauAdminModel();
      }

      setVisibleForm(false);
    } catch (error) {
      setLoading(false);
    }
  };
  const putBieuMauModel = async (payload: { id: string; data: BieuMau.Record }, getData?: any) => {
    try {
      setLoading(true);
      await putBieuMau(payload);
      message.success('Sửa thành công');
      setLoading(false);
      if (getData) {
        getData();
      } else {
        getBieuMauAdminModel();
      }
      setVisibleForm(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const kichHoatBieuMauModel = async (payload: { id: string; data: { kichHoat: boolean } }) => {
    setLoading(true);
    await kichHoatBieuMau(payload);
    message.success('Xử lý thành công');
    setLoading(false);
    getBieuMauAdminModel();
  };

  const delBieuMauModel = async (payload: { id: string }) => {
    try {
      setLoading(true);
      await delBieuMau(payload);
      message.success('Xóa thành công');
      getBieuMauAdminModel();
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const getBieuMauThongKeModel = async (id: string) => {
    setLoading(true);
    const response = await getBieuMauThongKe({ id });
    setThongKe(response?.data?.data ?? {});
    setLoading(false);
  };

  const getIdBieuMauDaTraLoiModel = async () => {
    setLoading(true);
    const response = await getIdBieuMauDaTraLoi(loaiBieuMau);
    setListIdBieuMauDaTraLoi(response?.data?.data ?? []);
    setLoading(false);
  };

  const traLoiBieuMauModel = async (payload: {
    idBieuMau: string;
    danhSachTraLoi: KhaiBaoSucKhoe.TraLoiRecord[];
    idDot: string;
  }) => {
    setLoading(true);
    await traLoiBieuMau(payload);
    message.success('Gửi câu trả lời thành công');
    getIdBieuMauDaTraLoiModel();
    setLoading(false);
    setVisibleForm(false);
  };

  const exportKetQuaKhaoSatModel = async (payload: { idKhaoSat: string }) => {
    try {
      setLoading(true);
      const response = await exportKetQuaKhaoSat(payload);
      FileDownload(response.data, 'ketquakhaosat.xlsx');
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const getAllBieuMauModel = async (paramCondition?: any) => {
    setLoading(true);
    try {
      const res = await getAllBieuMau({ ...condition, ...paramCondition });
      setDanhSach(res?.data?.data ?? []);
    } catch (err) {
      setLoading(false);
    }
    setLoading(false);
  };

  const initBieuMauTracNghiemModel = async (idDot: string, idKhaoSat: string) => {
    setLoading(true);
    await initBieuMauTracNghiem({ idKhaoSat, idDot });
    setLoading(false);
  };

  return {
    ...objInit,
    initBieuMauTracNghiemModel,
    getAllBieuMauModel,
    exportKetQuaKhaoSatModel,
    phamVi,
    setPhamVi,
    current,
    setCurrent,
    getIdBieuMauDaTraLoiModel,
    listIdBieuMauDaTraLoi,
    setListIdBieuMauDaTraLoi,
    traLoiBieuMauModel,
    getBieuMauThongKeModel,
    thongKe,
    setThongKe,
    getBieuMauAdminModel,
    kichHoatBieuMauModel,
    getBieuMauByIdModel,
    getBieuMauUserModel,
    addBieuMauModel,
    putBieuMauModel,
    delBieuMauModel,
    setLoaiBieuMau,
    loaiBieuMau,
    formCauHinhBieuMau,
  };
};
