import useInitModel from '@/hooks/useInitModel';
import { ipCsvc } from '@/utils/ip';
import { DangKyKyTucXa } from '@/services/KyTucXa/typings';

export default () => {
  const objInit = useInitModel<DangKyKyTucXa.IPhongKTXSinhVien>('phong/ktx/sinh-vien/available', undefined, undefined, ipCsvc);

  return {
    ...objInit,
  };
};