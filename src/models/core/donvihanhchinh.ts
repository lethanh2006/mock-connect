import useInitModel from '@/hooks/useInitModel';
import { getTinhThanhPho } from '@/services/Core/DonViHanhChinh';
import { type DonViHanhChinh } from '@/services/Core/DonViHanhChinh/typing';
import { ipCore } from '@/utils/ip';
import { useState } from 'react';

export default () => {
  const objInit = useInitModel<DonViHanhChinh.IRecord>(
    'don-vi-hanh-chinh',
    undefined,
    undefined,
    ipCore,
  );
  const { setLoading } = objInit;

  const [danhSachTinh, setDanhSachTinh] = useState<DonViHanhChinh.IRecord[]>([]);

  const getTinhThanhPhoModel = async () => {
    setLoading(true);
    const response = await getTinhThanhPho();
    console.log(response, 'res');
    setDanhSachTinh(response?.data?.data ?? [])
    setLoading(false);
  };

  return {
    ...objInit,
    danhSachTinh,
    getTinhThanhPhoModel,
  };
};
