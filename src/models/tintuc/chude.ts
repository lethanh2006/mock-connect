import useInitModel from '@/hooks/useInitModel';
import { type TinTuc } from '@/services/TinTuc/typing';

export default () => {
  const objInit = useInitModel<TinTuc.IChuDe>('common-topic');

  return {
    ...objInit,
  };
};
