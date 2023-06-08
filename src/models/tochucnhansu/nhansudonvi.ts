import useInitModel from '@/hooks/useInitModel';
import { ipNhanSu } from '@/utils/ip';

export default () => {
  const objInit = useInitModel<ToChucNhanSu.IDonViCanBoViTri>(
    'don-vi-can-bo-vi-tri',
    undefined,
    undefined,
    ipNhanSu,
  );

  return {
    ...objInit,
  };
};
