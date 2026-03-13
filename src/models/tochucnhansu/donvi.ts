import useInitModel from '@/hooks/useInitModel';
import { ipNhanSu } from '@/utils/ip';

export default () => {
  const objInit = useInitModel<ToChucNhanSu.IDonVi>('don-vi', undefined, undefined, ipNhanSu);

  return {
    ...objInit,
  };
};
