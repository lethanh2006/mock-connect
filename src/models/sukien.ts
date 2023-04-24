import useInitModel from '@/hooks/useInitModel';

export default () => {
  const objInit = useInitModel<SuKien.IRecord>('su-kien');

  return {
    ...objInit,
  };
};
