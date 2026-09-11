import useInitModel from '@/hooks/useInitModel';
import { ThanhToan } from '@/services/DVMC/ThanhToan/typings';
import { ipTaiChinh } from '@/utils/ip';

export default () => {
  const objInit = useInitModel<ThanhToan.Product>('khoan-thu', 'condition', undefined, ipTaiChinh);




  return {
    ...objInit,
  };
};
