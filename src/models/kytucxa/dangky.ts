import useInitModel from '@/hooks/useInitModel';
import { ipCsvc } from '@/utils/ip';
import { DangKyKyTucXa } from '@/services/KyTucXa/typings';

export default () => {
  const objInit = useInitModel<DangKyKyTucXa.IThongTinDangKyKTX>('dang-ky-ky-tuc-xa/me', undefined, undefined, ipCsvc);

  return {
    ...objInit,
  };
};