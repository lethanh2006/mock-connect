import useInitModel from '@/hooks/useInitModel';
import { getDotMe, kichHoatDot } from '@/services/KhaoSat/DotKhaoSat/DotKhaoSat';
import { EThoiGianDot } from '@/services/KhaoSat/DotKhaoSat/constants';
import { type DotKhaoSat } from '@/services/KhaoSat/DotKhaoSat/typings';
import { ip3 } from '@/utils/ip';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const objInit = useInitModel<DotKhaoSat.Record>('dot-khao-sat', undefined, undefined, ip3);
  const { setLoading, page, limit, condition, setTotal, sort, setDanhSach } = objInit;
  const [thoiGian, setThoiGian] = useState<EThoiGianDot>(EThoiGianDot.DANG_DIEN_RA);

  const kichHoatDotModel = async (idDot: string, getData: any) => {
    if (!idDot) return;
    setLoading(true);
    try {
      await kichHoatDot(idDot);
      message.success('Xử lý thành công');
      getData();
    } catch (err) {
      setLoading(false);
    }
    setLoading(false);
  };

  const getDotMeModel = async () => {
    setLoading(true);
    const res = await getDotMe({ thoiGian, condition, page, limit, sort });
    setDanhSach(res?.data?.data?.result ?? []);
    setTotal(res?.data?.data?.total ?? 0);
    setLoading(false);
  };

  return {
    ...objInit,
    thoiGian,
    setThoiGian,
    getDotMeModel,
    kichHoatDotModel,
  };
};
