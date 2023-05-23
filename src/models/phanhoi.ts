import useInitModel from '@/hooks/useInitModel';
import type { PhanHoi } from '@/services/PhanHoi/typing';
import { ip3 } from '@/utils/ip';

export default () => {
  const objInit = useInitModel<PhanHoi.IRecord>('phan-hoi', 'condition', undefined, ip3);

  return {
    ...objInit,
  };
};
