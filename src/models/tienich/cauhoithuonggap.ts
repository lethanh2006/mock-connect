import useInitModel from '@/hooks/useInitModel';
import type { CauHoiThuongGap } from '@/services/CauHoiThuongGap/typing';

export default () => {
  const objInit = useInitModel<CauHoiThuongGap.IRecord>('cau-hoi-thuong-gap');
  return {
    ...objInit,
  };
};
