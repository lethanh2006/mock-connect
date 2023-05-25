import useInitModel from '@/hooks/useInitModel';
import { getAllChuDe } from '@/services/ChuDe/chude';
import { ip3 } from '@/utils/ip';
import { useState } from 'react';

export default () => {
  const objInit = useInitModel<ChuDe.Record>('common-topic', undefined, undefined, ip3);
  const { setLoading, condition, setDanhSach, setTotal } = objInit;
  const [loaiChuDe, setLoaiChuDe] = useState<string>();
  const [phamVi, setPhamVi] = useState<'Tất cả' | 'Hình thức đào tạo'>();

  const getAllChuDeModel = async (cond?: any): Promise<ChuDe.Record[]> => {
    setLoading(true);
    const response = await getAllChuDe({
      condition: { ...condition, ...(cond ?? {}) },
      idHinhThuc: condition?.hinhThucDaoTaoId,
    });
    setDanhSach(response?.data?.data ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
    return response?.data?.data ?? [];
  };

  return {
    ...objInit,
    setDanhSach,
    phamVi,
    setPhamVi,
    getAllChuDeModel,
    setLoaiChuDe,
    loaiChuDe,
  };
};
