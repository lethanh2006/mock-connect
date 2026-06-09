import useInitModel from '@/hooks/useInitModel';
import { ipCsvc } from '@/utils/ip';
import { KyTucXa } from '@/services/KyTucXa/typings';

export default () => {
  const objInit = useInitModel<KyTucXa.IPhong>('phong/ktx/sinh-vien/available', undefined, undefined, ipCsvc);

  return {
    ...objInit,
  };
};