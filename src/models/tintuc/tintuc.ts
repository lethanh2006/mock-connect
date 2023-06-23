import useInitModel from '@/hooks/useInitModel';
import { type TinTuc } from '@/services/TinTuc/typing';

export default () => {
  const objInit = useInitModel<TinTuc.IRecord>('tin-tuc', undefined, undefined, undefined, {
    ngayDang: -1,
  });

  return {
    ...objInit,
  };
};
