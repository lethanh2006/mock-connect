import useInitModel from '@/hooks/useInitModel';
import { ipDaoTao } from '@/utils/ip';

export default () => {
  const objInit = useInitModel<LoaiHoatDongTuan.IRecord>(
    'loai-hoat-dong-tuan',
    undefined,
    undefined,
    ipDaoTao,
  );

  return {
    ...objInit,
  };
};
