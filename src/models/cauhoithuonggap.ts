import useInitModel from '@/hooks/useInitModel';
import type { CauHoiThuongGap } from '@/services/CauHoiThuongGap/typing';
import { ipSlink } from '@/utils/ip';

export default () => {
  const objInit = useInitModel<CauHoiThuongGap.IRecord>(
    'cau-hoi-thuong-gap',
    'condition',
    undefined,
    ipSlink,
  );
  return {
    ...objInit,
  };
};
