import { getQuanHuyenS, getTinhS, getXaPhuongS } from '@/services/DonViHanhChinh/donvihanhchinh';
import type { IRecordTinh } from '@/services/DonViHanhChinh/typing';
import { useState } from 'react';

export default () => {
  const [danhSachTinh, setDanhSachTinh] = useState<IRecordTinh.Datum[]>([]);
  const [danhSachQuanHuyen, setDanhSachQuanHuyen] = useState<IRecordTinh.Datum[]>([]);
  const [danhSachXaPhuong, setDanhSachXaPhuong] = useState<IRecordTinh.Datum[]>([]);
  const [objDanhSachQuanHuyen, setObjDanhSachQuanHuyen] = useState<
    Record<string, IRecordTinh.Datum[]>
  >({});
  const [objDanhSachXaPhuong, setObjDanhSachXaPhuong] = useState<
    Record<string, IRecordTinh.Datum[]>
  >({});
  const [tenTinh, setTenTinh] = useState<Record<string, string>>({});
  const [tenQuanHuyen, setTenQuanHuyen] = useState<Record<string, string>>({});
  const [tenPhuongXa, setTenXaPhuong] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const getDanhSachTinhModel = async () => {
    setLoading(true);
    const response = await getTinhS();
    setDanhSachTinh(response?.data?.data ?? []);
    setLoading(false);
  };

  const getDanhSachQuanHuyenModel = async (maTinh: string, propertyName?: string) => {
    setLoading(true);
    const response = await getQuanHuyenS({ maTinh });
    if (propertyName) {
      const record = {};
      record[propertyName] = response?.data?.data ?? [];
      setObjDanhSachQuanHuyen({ ...objDanhSachQuanHuyen, ...record });
    } else setDanhSachQuanHuyen(response?.data?.data ?? []);
    setLoading(false);
  };

  const getDanhSachXaPhuongModel = async (maQH: string, propertyName?: string) => {
    setLoading(true);
    const response = await getXaPhuongS({ maQH });
    if (propertyName) {
      const record = {};
      record[propertyName] = response?.data?.data ?? [];
      setObjDanhSachXaPhuong({ ...objDanhSachXaPhuong, ...record });
    } else setDanhSachXaPhuong(response?.data?.data ?? []);
    setLoading(false);
  };

  return {
    objDanhSachXaPhuong,
    objDanhSachQuanHuyen,
    setObjDanhSachXaPhuong,
    setObjDanhSachQuanHuyen,
    tenTinh,
    tenQuanHuyen,
    tenPhuongXa,
    setTenTinh,
    setTenQuanHuyen,
    setTenXaPhuong,
    getDanhSachXaPhuongModel,
    getDanhSachQuanHuyenModel,
    loading,
    setLoading,
    getDanhSachTinhModel,
    danhSachQuanHuyen,
    danhSachTinh,
    danhSachXaPhuong,
    setDanhSachQuanHuyen,
    setDanhSachTinh,
    setDanhSachXaPhuong,
  };
};
