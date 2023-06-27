import useInitModel from '@/hooks/useInitModel';
import { type DiemHocPhan } from '@/services/DaoTao/DiemHocPhan/typing';
import { ipDaoTao } from '@/utils/ip';

export default () => {
  const objInit = useInitModel<DiemHocPhan.IRecord>(
    'diem-hoc-phan',
    undefined,
    undefined,
    ipDaoTao,
  );

  return {
    ...objInit,
  };
};
