import useInitModel from '@/hooks/useInitModel';
import { type VanBanHuongDan } from '@/services/TienIch/VanBanHuongDan/typing';

export default () => {
  const objInit = useInitModel<VanBanHuongDan.IRecord>('van-ban-huong-dan');

  return {
    ...objInit,
  };
};
