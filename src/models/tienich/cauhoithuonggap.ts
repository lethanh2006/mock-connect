import useInitModel from '@/hooks/useInitModel';
import { type CauHoiThuongGap } from '@/services/TienIch/CauHoiThuongGap/typing';

export default () => {
  const objInit = useInitModel<CauHoiThuongGap.IRecord>('cau-hoi-thuong-gap');

  return {
    ...objInit,
  };
};
