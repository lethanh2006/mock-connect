import useInitModel from '@/hooks/useInitModel';
import { ipDaoTao } from '@/utils/ip';

export default () => {
  const objInit = useInitModel<DotCapNhatHoSo.IRecord>('dot-cap-nhat-ho-so', undefined, undefined, ipDaoTao);

  return {
    ...objInit,
  };
};
