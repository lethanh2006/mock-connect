import useInitModel from '@/hooks/useInitModel';
import { type HocPhan } from '@/services/DanhMucHeThong/HocPhan/typings';

export default () => {
  const objInit = useInitModel<HocPhan.IRecord>('hoc-phan');

  return {
    ...objInit,
  };
};
