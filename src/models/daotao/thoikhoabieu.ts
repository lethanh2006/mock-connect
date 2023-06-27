import {
  getThoiKhoaBieuById,
  getThoiKhoaBieuByTrongKhoang,
  sinhVienGetThoiKhoaBieu,
} from '@/services/DaoTao/ThoiKhoaBieu';
import { type ThoiKhoaBieu } from '@/services/DaoTao/ThoiKhoaBieu/typing';
import { type ELoaiHinhHocTap } from '@/services/HocTap/LopHocPhan/constant';
import { useState } from 'react';

export default () => {
  const [danhSach, setDanhSach] = useState<ThoiKhoaBieu.IRecord[]>([]);
  const [record, setRecord] = useState<ThoiKhoaBieu.IRecord>();
  const [loading, setLoading] = useState<boolean>();
  const [visibleForm, setVisibleForm] = useState<boolean>();

  const getByIdModel = async (id: string, isSetRecord?: boolean): Promise<ThoiKhoaBieu.IRecord> => {
    if (!id) return Promise.reject();
    setLoading(true);
    try {
      const response = await getThoiKhoaBieuById(id);
      if (isSetRecord !== false) setRecord(response?.data?.data ?? null);
      return response?.data?.data;
    } catch (er) {
      return Promise.reject(er);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get thời khóa biểu trong khoảng thời gian
   * @param payload fromDate, toDate: ISO string
   * @returns
   */
  const getTrongKhoangModel = async (payload: {
    fromDate: string;
    toDate: string;
  }): Promise<ThoiKhoaBieu.IRecord[]> => {
    setLoading(true);
    try {
      const response = await getThoiKhoaBieuByTrongKhoang(payload);
      setDanhSach(response?.data?.data ?? []);
      return response?.data?.data;
    } catch (er) {
      return Promise.reject(er);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get thời khóa biểu theo lớp học phần, bao gồm cả lớp Thực hành
   * @returns
   */
  const getTheoLopHocPhan = async (
    tenLop: string,
    loaiHinhHocTap?: ELoaiHinhHocTap,
  ): Promise<ThoiKhoaBieu.IRecord[]> => {
    setLoading(true);
    try {
      const response = await sinhVienGetThoiKhoaBieu(tenLop, { loaiHinhHocTap });
      setDanhSach(response?.data?.data ?? []);
      return response?.data?.data;
    } catch (er) {
      return Promise.reject(er);
    } finally {
      setLoading(false);
    }
  };

  return {
    danhSach,
    setDanhSach,
    record,
    setRecord,
    loading,
    setLoading,
    getByIdModel,
    getTrongKhoangModel,
    visibleForm,
    setVisibleForm,
    getTheoLopHocPhan,
  };
};
