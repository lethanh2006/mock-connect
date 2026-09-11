import useInitModel from '@/hooks/useInitModel';
import { KhaiBaoDRL } from '@/services/DiemRenLuyenV2/MinhChung/KhaiBao/typing';

export default () => {
  const objInit = useInitModel<KhaiBaoDRL.IRecord>('khai-bao-minh-chung');



  return {
    ...objInit,
  };
};
