import useInitModel from '@/hooks/useInitModel';

export default () => {
  const objInit = useInitModel<HocKy.IRecord>('hoc-ky');

  return {
    ...objInit,
  };
};
