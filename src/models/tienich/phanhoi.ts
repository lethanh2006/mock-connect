import useInitModel from '@/hooks/useInitModel';
import { type PhanHoi } from '@/services/TienIch/PhanHoi/typing';

export default () => {
  const objInit = useInitModel<PhanHoi.IRecord>('phan-hoi');

  return {
    ...objInit,
  };
};
