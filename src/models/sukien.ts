import useInitModel from '@/hooks/useInitModel';
import { getSuKienTrongKhoang } from '@/services/SuKien';
import { ELoaiSuKien } from '@/services/SuKien/constant';
import { type SuKien } from '@/services/SuKien/typings';
import { useState } from 'react';

export default () => {
  const objInit = useInitModel<SuKien.IRecord>('su-kien/me');
  const [selectSuKiens, setSelectSuKiens] = useState<ELoaiSuKien[]>([
    ELoaiSuKien.LICH_HOC,
    ELoaiSuKien.LICH_THI,
    ELoaiSuKien.CA_NHAN,
    ELoaiSuKien.CHUNG,
  ]);
  const { setLoading, setDanhSach } = objInit;

  /**
   * Get sự kiện trong khoảng thời gian
   * @param payload fromDate, toDate: ISO string
   * @returns
   */
  const getSuKienTrongKhoangModel = async (payload: {
    fromDate: string;
    toDate: string;
    types?: ELoaiSuKien[];
  }): Promise<SuKien.IRecord[]> => {
    setLoading(true);
    try {
      const response = await getSuKienTrongKhoang(payload);
      setDanhSach(response?.data?.data ?? []);
      return response?.data?.data;
    } catch (er) {
      return Promise.reject(er);
    } finally {
      setLoading(false);
    }
  };

  return {
    ...objInit,
    selectSuKiens,
    setSelectSuKiens,
    getSuKienTrongKhoangModel,
  };
};
