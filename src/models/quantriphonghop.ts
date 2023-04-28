import type { DichVuMotCuaV2 } from '@/services/DichVuMotCuaV2/typing';
import type { VanphongsoCsvc } from '@/services/VanPhongSo/typings';
import {
  getAllDonMuonPhongByIdDon,
  getAllPhong,
  getAllPhongKhaDung,
  getAllPhongKhongKhaDung,
  getCsvcById,
  getCsvcPageable,
  getCsvcTheoLoai,
  postCsvc,
  putCsvc,
  putMeHuyMuonPhong,
} from '@/services/VanPhongSo/vanphongso';
import type { ETrangThaiDonVps } from '@/utils/constants';
import { ECsvc } from '@/utils/constants';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const [danhSach, setDanhSach] = useState<VanphongsoCsvc.PhongHopRecord[]>([]);
  const [record, setRecord] = useState<VanphongsoCsvc.PhongHopRecord>();
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [condition, setCondition] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [dataDonPhongHop, setDataDonPhongHop] = useState<DichVuMotCuaV2.Don[]>([]);

  const getPhongHopModel = async () => {
    setLoading(true);
    const response = await getCsvcTheoLoai({ loaiCsvc: ECsvc.PHONG, condition });
    setDanhSach(response?.data?.data ?? []);
    setTotal(response?.data?.data?.length ?? 0);
    setLoading(false);
  };

  const getAllPhongModel = async () => {
    setLoading(true);
    const response = await getAllPhong();
    setDanhSach(response?.data?.data ?? []);
    setLoading(false);
  };

  const getPhongHopPageable = async () => {
    setLoading(true);
    const response = await getCsvcPageable({
      page,
      limit,
      condition: { ...condition, loai: ECsvc.PHONG },
    });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const postPhongHopModel = async (payload: any) => {
    setLoading(true);
    try {
      await postCsvc(payload);
      message.success('Tạo thành công!');
      getPhongHopPageable();
    } catch (err) {
      setLoading(false);
    }
    setLoading(false);
  };

  const putPhongHopModel = async (payload: { id: string; values: any }) => {
    if (!payload?.id) return;
    setLoading(true);
    try {
      await putCsvc(payload?.id, payload?.values);
      message.success('Cập nhật thành công!');
      getPhongHopPageable();
    } catch (err) {
      setLoading(false);
    }
    setLoading(false);
  };

  const getCsvcByIdModel = async (id: string) => {
    setLoading(true);
    const response = await getCsvcById(id);
    setRecord(response?.data?.data ?? {});
    setLoading(false);
  };

  const putMeHuyMuonPhongModel = async (payload: { trangThai: ETrangThaiDonVps; id: string }) => {
    setLoading(true);
    try {
      await putMeHuyMuonPhong(payload);
      message.success('Thành công!');
    } catch (err) {
      message.error('Không thể hủy đơn!');
      setLoading(false);
    }
    setLoading(false);
  };

  const getAllPhongKhaDungModel = async (payload: { thoiGianBd: string; thoiGianKt: string }) => {
    setLoading(true);
    const response = await getAllPhongKhaDung(payload);
    setDanhSach(response?.data?.data ?? []);
    setLoading(false);
  };

  const getAllPhongKhongKhaDungModel = async (payload: {
    thoiGianBd?: string;
    thoiGianKt?: string;
  }) => {
    setLoading(true);
    const response = await getAllPhongKhongKhaDung(payload);
    setDanhSach(response?.data?.data ?? []);
    setLoading(false);
  };

  const getAllDonMuonPhongByIdDonModel = async (idDon: string) => {
    if (!idDon) return;
    setLoading(true);
    const response = await getAllDonMuonPhongByIdDon(idDon);
    setDataDonPhongHop(response?.data?.data ?? []);
    setLoading(false);
  };

  // const getCheckPhongKhaDungTheoIdDonModel = async (idDon: string) => {
  //   if (!idDon) return;
  //   setLoading(true);
  //   const response = await getCheckPhongKhaDungTheoIdDon(idDon);
  //   setLoading(false);
  // };

  return {
    getPhongHopModel,
    getPhongHopPageable,
    postPhongHopModel,
    putPhongHopModel,
    getCsvcByIdModel,
    putMeHuyMuonPhongModel,
    getAllPhongKhaDungModel,
    getAllPhongKhongKhaDungModel,
    getAllDonMuonPhongByIdDonModel,
    getAllPhongModel,
    dataDonPhongHop,
    danhSach,
    record,
    setRecord,
    loading,
    setLoading,
    visibleForm,
    setVisibleForm,
    edit,
    setEdit,
    total,
    setTotal,
    page,
    setPage,
    limit,
    setLimit,
    filterInfo,
    setFilterInfo,
    condition,
    setCondition,
  };
};
