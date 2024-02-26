import useInitModel from '@/hooks/useInitModel';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { ipDaoTao } from '@/utils/ip';

export default () => {
  const objInit = useInitModel<LopHocPhan.IRecordNhanSuLopHP>(
    'lop-hp-ns',
    undefined,
    undefined,
    ipDaoTao,
  );

  return {
    ...objInit,
  };
};
