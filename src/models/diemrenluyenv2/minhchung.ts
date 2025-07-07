import useInitModel from '@/hooks/useInitModel';
import { ipTaiChinh } from '@/utils/ip';
import {useState} from "react";

export default () => {
  const objInit = useInitModel<ThanhToan.Product>('khoan-thu', 'condition', undefined, ipTaiChinh);




  return {
    ...objInit,
  };
};
