import useInitModel from '@/hooks/useInitModel';
import { type HocPhan } from '@/services/DanhMucHeThong/HocPhan/typings';

export default () => {
  const objInit = useInitModel<HocPhan.IGiangVienDeCuong>('de-cuong-gv');

  return {
    ...objInit,
  };
};
