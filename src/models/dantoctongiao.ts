import useInitModel from '@/hooks/useInitModel';
import { getDanToc, getTonGiao } from '@/services/DanTocTonGiao/dantoctongiao';
import { useState } from 'react';

export default () => {
  const objInit = useInitModel<DanTocTonGiao.DanToc>('dm-ton-giao');
  const [danhSachDanToc, setDanhSachDanToc] = useState<DanTocTonGiao.DanToc[]>([]);
  const [danhSachTonGiao, setDanhSachTonGiao] = useState<DanTocTonGiao.TonGiao[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getAllDanToc = async () => {
    setLoading(true);
    const response = await getDanToc();
    setDanhSachDanToc(response?.data?.data ?? []);
    setLoading(false);
  };

  const getAllTonGiao = async () => {
    setLoading(true);
    const response = await getTonGiao();
    setDanhSachTonGiao(response?.data?.data ?? []);
    setLoading(false);
  };

  return {
    ...objInit,
    getAllDanToc,
    getAllTonGiao,
    loading,
    setLoading,
    danhSachDanToc,
    setDanhSachDanToc,
    danhSachTonGiao,
    setDanhSachTonGiao,
  };
};
