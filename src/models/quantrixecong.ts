import { ECsvc, type ETrangThaiDonVps } from '@/utils/constants';
import { message } from 'antd';
import {
  getCsvcTheoLoai,
  postCsvc,
  getThongTinMuonXe,
  getMeThongTinMuonXe,
  putTrangThaiDonMuonXe,
  putMeHuyMuonXe,
  putCsvc,
  getXeKhaDung,
  getXeKhongKhaDung,
  getCsvcPageable,
  deleteCsvc,
} from '@/services/VanPhongSo/vanphongso';
import { type VanphongsoCsvc } from '@/services/VanPhongSo/typings';
import { useState } from 'react';

export default () => {
  const [danhSach, setDanhSach] = useState<VanphongsoCsvc.XeRecord[]>([]);
  const [danhSachDon, setDanhSachDon] = useState<VanphongsoCsvc.DonPhongHopRecord[]>([]);
  const [record, setRecord] = useState<VanphongsoCsvc.XeRecord>();
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [condition, setCondition] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [laiXe, setLaiXe] = useState<{
    hoTen: string;
    sdt: number;
  }>();
  const [xeChon, setXeChon] = useState<{
    tenXe: string;
    bienSoXe: string;
    loaiXe: string;
    ghiChu: string;
    i: number;
    id: string;
  }>();

  const getXeCongModel = async () => {
    setLoading(true);
    const response = await getCsvcTheoLoai({ loaiCsvc: ECsvc.XE, condition });
    setDanhSach(response?.data?.data ?? []);
    setTotal(response?.data?.data?.length ?? 0);
    setLoading(false);
  };

  const getXeCongPageable = async () => {
    setLoading(true);
    const response = await getCsvcPageable({
      page,
      limit,
      condition: { ...condition, loai: ECsvc.XE },
    });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const postXeCongModel = async (payload: any) => {
    setLoading(true);
    try {
      await postCsvc(payload);
      message.success('Tạo thành công!');
      getXeCongPageable();
    } catch (err) {
      setLoading(false);
    }
    setLoading(false);
  };

  const putXeCongModel = async (payload: { id: string; values: any }) => {
    if (!payload?.id) return;
    setLoading(true);
    try {
      await putCsvc(payload?.id, payload?.values);
      message.success('Cập nhật thành công!');
      getXeCongPageable();
    } catch (err) {
      setLoading(false);
    }
    setLoading(false);
  };

  const thongTinMuonXeModel = async () => {
    setLoading(true);
    const response = await getThongTinMuonXe({ page, limit, condition });
    setDanhSachDon(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const getMeThongTinMuonXeModel = async () => {
    setLoading(true);
    const response = await getMeThongTinMuonXe({ page, limit, condition });
    setDanhSachDon(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const putTrangThaiDonMuonXeModel = async (payload: {
    trangThai: ETrangThaiDonVps;
    id: string;
  }) => {
    if (!payload?.id) return;
    setLoading(true);
    try {
      await putTrangThaiDonMuonXe(payload);
      // thongTinMuonXeModel();
      message.success('Thành công!');
    } catch (err) {
      setLoading(false);
    }
    setLoading(false);
  };

  const putMeHuyMuonXeModel = async (payload: { trangThai: ETrangThaiDonVps; id: string }) => {
    setLoading(true);
    try {
      await putMeHuyMuonXe(payload);
      // getMeThongTinMuonXeModel();
      message.success('Thành công!');
    } catch (err) {
      message.error('Không thể hủy đơn!');
      setLoading(false);
    }
    setLoading(false);
  };

  const deleteXeCongModel = async (id: string) => {
    if (!id) return;
    try {
      setLoading(true);
      await deleteCsvc(id);
      getXeCongPageable();
      const maxPage = Math.ceil((total - 1) / limit);
      let newPage = page;
      if (newPage > maxPage) {
        newPage = maxPage || 1;
        setPage(newPage);
      }
      message.success('Xóa thành công!');
    } catch (err) {
      setLoading(false);
    }
  };

  const getXeKhaDungModel = async (payload: { thoiGianBd: string; thoiGianKt: string }) => {
    setLoading(true);
    const response = await getXeKhaDung(payload);
    setDanhSach(response?.data?.data?.result ?? []);
    setLoading(false);
  };

  const getXeKhongKhaDungModel = async (payload: { thoiGianBd: string; thoiGianKt: string }) => {
    setLoading(true);
    const response = await getXeKhongKhaDung(payload);
    setDanhSach(response?.data?.data ?? []);
    setLoading(false);
  };

  return {
    getXeCongModel,
    getXeCongPageable,
    postXeCongModel,
    thongTinMuonXeModel,
    putTrangThaiDonMuonXeModel,
    getMeThongTinMuonXeModel,
    putMeHuyMuonXeModel,
    putXeCongModel,
    getXeKhaDungModel,
    getXeKhongKhaDungModel,
    deleteXeCongModel,
    danhSach,
    danhSachDon,
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
    laiXe,
    setLaiXe,
    xeChon,
    setXeChon,
  };
};
