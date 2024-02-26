import { getAllDiemLopHocPhan, getDiemLopHocPhan } from '@/services/HocTap/LopHocPhan';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { useState } from 'react';

export default () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [sinhVienLopHocPhan, setSinhVienLopHocPhan] = useState<LopHocPhan.IRecordSinhVienLopHP>();
  const [danhSach, setDanhSach] = useState<LopHocPhan.IRecordSinhVienLopHP[]>([]);

  const sinhVienGetDiemLopHocPhanModel = async (
    lopHocPhanId: string,
  ): Promise<LopHocPhan.IRecordSinhVienLopHP> => {
    setLoading(true);
    try {
      const response = await getDiemLopHocPhan(lopHocPhanId);
      setSinhVienLopHocPhan(response?.data?.data ?? null);
      return response?.data?.data;
    } catch (er) {
      return Promise.reject(er);
    } finally {
      setLoading(false);
    }
  };

  const sinhVienGetAllDiemLopHocPhanModel = async (): Promise<
    LopHocPhan.IRecordSinhVienLopHP[]
  > => {
    setLoading(true);
    try {
      const response = await getAllDiemLopHocPhan();
      setDanhSach(response?.data?.data ?? []);
      return response?.data?.data;
    } catch (er) {
      return Promise.reject(er);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    setLoading,
    sinhVienLopHocPhan,
    setSinhVienLopHocPhan,
    sinhVienGetDiemLopHocPhanModel,
    danhSach,
    setDanhSach,
    sinhVienGetAllDiemLopHocPhanModel,
  };
};
