import useInitModel from '@/hooks/useInitModel';

export default () => {
  const objInit = useInitModel<TinTuc.IChuDe>('common-topic');

  return {
    ...objInit,
  };
};
