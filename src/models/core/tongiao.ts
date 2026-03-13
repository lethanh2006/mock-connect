import useInitModel from '@/hooks/useInitModel';
import { ipCore } from '@/utils/ip';

export default () => {
  const objInit = useInitModel<TonGiao.IRecord>('dm-ton-giao', undefined, undefined, ipCore);

  return {
    ...objInit,
  };
};
