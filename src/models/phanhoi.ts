import useInitModel from '@/hooks/useInitModel';
import type { PhanHoi } from '@/services/PhanHoi/typing';
import { ipSlink } from '@/utils/ip';

export default () => {
  const objInit = useInitModel<PhanHoi.IRecord>('phan-hoi', 'condition', undefined, ipSlink);

  return {
    ...objInit,
  };
};
