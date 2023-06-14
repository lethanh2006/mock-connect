import { ip3 } from '@/utils/ip';
import axios from 'axios';
import { type EThoiGianDot } from './constants';

export async function kichHoatDot(idDot: string) {
  return axios.put(`${ip3}/dot-khao-sat/${idDot}/kich-hoat`);
}

export async function checkUnfinished(condition?: any) {
  return axios.get(`${ip3}/dot-khao-sat/exist/unfinished`, { params: { condition } });
}

export const getDotMe = (payload: {
  thoiGian: EThoiGianDot;
  condition?: any;
  page: number;
  limit: number;
  sort?: any;
}) => {
  return axios.get(`${ip3}/dot-khao-sat/page`, {
    params: { ...payload, sort: { ...(payload?.sort ?? {}), createdAt: -1 } },
  });
};
