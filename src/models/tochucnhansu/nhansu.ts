import useInitModel from '@/hooks/useInitModel';
import { ipNhanSu } from '@/utils/ip';

export default () => {
  const objInit = useInitModel<ToChucNhanSu.INhanSu>(
    'thong-tin-nhan-su',
    undefined,
    undefined,
    ipNhanSu,
  );

  return {
    ...objInit,
  };
};
