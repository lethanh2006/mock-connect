import useInitService from '@/hooks/useInitService';
import { type DiemHocPhan } from '@/services/DaoTao/DiemHocPhan/typing';
import { ipDaoTao } from '@/utils/ip';
import { useState } from 'react';

export default () => {
  // const objInit = useInitModel<DiemHocPhan.IRecord>(
  //   'diem-hoc-phan',
  //   undefined,
  //   undefined,
  //   ipDaoTao,
  // );
  const [loading, setLoading] = useState<boolean>();
  const [tongTuChon, setTongTuChon] = useState<number>(0);
  const { getAllService } = useInitService('diem-hoc-phan', ipDaoTao);

  const getDiemSinhVienModel = async (): Promise<DiemHocPhan.IDiemSinhVien[]> => {
    setLoading(true);
    try {
      const response = await getAllService(undefined, 'sinh-vien');
      const data: DiemHocPhan.IDiemSinhVien[] = response.data?.data?.dsDiem ?? [];
      setTongTuChon(response.data?.data?.tongSoTinChiTuChon ?? 0);

      return data;
    } catch (er) {
      return Promise.reject(er);
    } finally {
      setLoading(false);
    }
  };

  return {
    // ...objInit,
    loading,
    setLoading,
    tongTuChon,
    setTongTuChon,
    getDiemSinhVienModel,
  };
};
