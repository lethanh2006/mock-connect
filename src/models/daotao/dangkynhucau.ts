import useInitModel from '@/hooks/useInitModel';
import { type DangKyNhuCau } from '@/services/DaoTao/DangKyNhuCau/typing';
import { ipDaoTao } from '@/utils/ip';

export default () => {
  const objInit = useInitModel<DangKyNhuCau.IDangKyNhuCau>(
    'ban-dk-nhu-cau',
    undefined,
    undefined,
    ipDaoTao,
  );

  return {
    ...objInit,
  };
};
