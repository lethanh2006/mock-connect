import useInitModel from '@/hooks/useInitModel';
import { getDiemLopHocPhan } from '@/services/HocTap/LopHocPhan';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { ipDaoTao } from '@/utils/ip';
import { useState } from 'react';

export default () => {
  const objInit = useInitModel<LopHocPhan.IRecord>('lop-hoc-phan', undefined, undefined, ipDaoTao);
  const { getByIdModel, getModel, setLoading } = objInit;
  const [sinhVienLopHocPhan, setSinhVienLopHocPhan] = useState<LopHocPhan.IRecordSinhVienLopHP>();

  const sinhVienGetModel = async (params: any): Promise<LopHocPhan.IRecord[]> =>
    getModel(params, undefined, undefined, undefined, undefined, 'sinh-vien/page');

  const sinhVienGetByIdModel = async (idLop: string): Promise<LopHocPhan.IRecord> =>
    getByIdModel(`${idLop}/sinh-vien`);

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

  return {
    ...objInit,
    sinhVienGetModel,
    sinhVienGetByIdModel,
    sinhVienLopHocPhan,
    setSinhVienLopHocPhan,
    sinhVienGetDiemLopHocPhanModel,
  };
};
