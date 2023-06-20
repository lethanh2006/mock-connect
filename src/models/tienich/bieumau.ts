import useInitModel from '@/hooks/useInitModel';
import {
  getIdBieuMauDaTraLoi,
  initBieuMauTracNghiem,
  traLoiBieuMau,
} from '@/services/TienIch/KhaoSat/BieuMau';
import { type BieuMau } from '@/services/TienIch/KhaoSat/BieuMau/typing';
import { ELoaiBieuMau } from '@/services/TienIch/KhaoSat/constants';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const objInit = useInitModel<BieuMau.Record>('khao-sat', undefined, {
    loai: ELoaiBieuMau.KHAO_SAT,
  });
  const { setLoading, condition, setVisibleForm, getModel } = objInit;
  const [listIdBieuMauDaTraLoi, setListIdBieuMauDaTraLoi] = useState<string[]>([]);

  const getBieuMauUserModel = async (loaiParam?: ELoaiBieuMau) =>
    getModel({ loai: loaiParam }, undefined, undefined, undefined, undefined, 'my/pageable');

  const getIdBieuMauDaTraLoiModel = async () => {
    setLoading(true);
    const response = await getIdBieuMauDaTraLoi(condition?.loai);
    setListIdBieuMauDaTraLoi(response?.data?.data ?? []);
    setLoading(false);
  };

  const initBieuMauTracNghiemModel = async (idDot: string, idKhaoSat: string) => {
    setLoading(true);
    await initBieuMauTracNghiem({ idKhaoSat, idDot });
    setLoading(false);
  };

  const traLoiBieuMauModel = async (payload: {
    idBieuMau: string;
    danhSachTraLoi: BieuMau.TraLoiRecord[];
    idDot: string;
  }) => {
    setLoading(true);
    await traLoiBieuMau(payload);
    message.success('Gửi câu trả lời thành công');
    getIdBieuMauDaTraLoiModel();
    setLoading(false);
    setVisibleForm(false);
  };

  return {
    ...objInit,
    getBieuMauUserModel,
    getIdBieuMauDaTraLoiModel,
    listIdBieuMauDaTraLoi,
    setListIdBieuMauDaTraLoi,
    initBieuMauTracNghiemModel,
    traLoiBieuMauModel,
  };
};
