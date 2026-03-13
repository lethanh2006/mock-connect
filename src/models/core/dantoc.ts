import useInitModel from '@/hooks/useInitModel';
import { ipCore } from '@/utils/ip';

export default () => {
  const objInit = useInitModel<DanToc.IRecord>('dm-dan-toc', undefined, undefined, ipCore);

  return {
    ...objInit,
  };
};
