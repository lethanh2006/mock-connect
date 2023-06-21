import useInitModel from '@/hooks/useInitModel';
import { type DotKhaoSat } from '@/services/TienIch/KhaoSat/DotKhaoSat/typing';
import { EThoiGianDot } from '@/services/TienIch/KhaoSat/constants';
import { useState } from 'react';

export default () => {
  const objInit = useInitModel<DotKhaoSat.IRecord>('dot-khao-sat');
  const [thoiGian, setThoiGian] = useState<EThoiGianDot>(EThoiGianDot.DANG_DIEN_RA);
  const { getModel } = objInit;

  const getDotMeModel = () =>
    getModel(undefined, undefined, undefined, undefined, undefined, 'my/page', { thoiGian });

  return {
    ...objInit,
    getDotMeModel,
    thoiGian,
    setThoiGian,
  };
};
