import useInitModel from '@/hooks/useInitModel';
import { ipDaoTao } from '@/utils/ip';

export default () => {
  const objInit = useInitModel<DauDiemHocPhan.IRecord>(
    'hinh-thuc-danh-gia',
    undefined,
    undefined,
    ipDaoTao,
  );

  return {
    ...objInit,
  };
};
