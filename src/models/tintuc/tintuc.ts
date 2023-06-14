import useInitModel from '@/hooks/useInitModel';

export default () => {
  const objInit = useInitModel<TinTuc.IRecord>('tin-tuc');

  return {
    ...objInit,
  };
};
