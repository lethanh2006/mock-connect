import useInitModel from '@/hooks/useInitModel';
import { ipDaoTao } from '@/utils/ip';

export default () => {
  const objInit = useInitModel<KhoaSinhVien.IRecord>(
    'khoa-sinh-vien',
    undefined,
    undefined,
    ipDaoTao,
  );

  return {
    ...objInit,
  };
};
