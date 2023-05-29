import useInitModel from '@/hooks/useInitModel';
import { ipCore } from '@/utils/ip';

export default () => {
  const objInit = useInitModel<QuocTich.IRecord>('dm-quoc-tich', undefined, undefined, ipCore);

  return {
    ...objInit,
  };
};
