import useInitModel from '@/hooks/useInitModel';

export default () => {
  const objInit = useInitModel<KhaiBaoDRL.IRecord>('khai-bao-minh-chung');



  return {
    ...objInit,
  };
};
