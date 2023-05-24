import {
  addChuDe,
  delChuDe,
  getAllChuDe,
  getAllLoaiChuDe,
  getChuDe,
  putChuDe,
} from '@/services/ChuDe/chude';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const [danhSach, setDanhSach] = useState<ChuDe.Record[]>([]);
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [condition, setCondition] = useState<any>({});
  const [danhSachLoaiChuDe, setDanhSachLoaiChuDe] = useState<string[]>([]);
  const [loaiChuDe, setLoaiChuDe] = useState<string>();
  const [record, setRecord] = useState<ChuDe.Record>({} as ChuDe.Record);
  const [loading, setLoading] = useState<boolean>(true);
  const [edit, setEdit] = useState<boolean>(false);
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [phamVi, setPhamVi] = useState<'Tất cả' | 'Hình thức đào tạo'>();

  const getAllLoaiChuDeModel = async () => {
    setLoading(true);
    const response = await getAllLoaiChuDe();
    setDanhSachLoaiChuDe(response?.data?.data ?? []);
    setLoading(false);
  };
  const getChuDeModel = async (idHinhThuc?: number) => {
    setLoading(true);
    const response = await getChuDe({
      page,
      limit,
      condition: {
        ...condition,
        type: loaiChuDe,
        hinhThucDaoTaoId: undefined,
        phamVi,
      },
      idHinhThuc:
        idHinhThuc ||
        (condition?.hinhThucDaoTaoId === -1 ? undefined : condition?.hinhThucDaoTaoId),
    });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const getAllChuDeModel = async (cond?: any): Promise<ChuDe.Record[]> => {
    setLoading(true);
    const response = await getAllChuDe({
      condition: { ...condition, ...(cond ?? {}) },
      idHinhThuc: condition?.hinhThucDaoTaoId,
    });
    setDanhSach(response?.data?.data ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
    return response?.data?.data ?? [];
  };

  const addChuDeModel = async (payload: ChuDe.Record) => {
    try {
      setLoading(true);
      await addChuDe(payload);
      message.success('Thêm thành công');
      getChuDeModel();
      setVisibleForm(false);
    } catch (error) {
      setLoading(false);
    }
    setLoading(false);
  };
  const putChuDeModel = async (payload: { id: string; data: ChuDe.Record }) => {
    setLoading(true);
    await putChuDe(payload);
    message.success('Sửa thành công');
    setLoading(false);
    getChuDeModel();
    setVisibleForm(false);
  };

  const delChuDeModel = async (payload: { id: string }) => {
    setLoading(true);
    try {
      await delChuDe(payload);
      message.success('Xóa thành công');
      const maxPage = Math.ceil((total - 1) / limit);
      let newPage = page;
      if (newPage > maxPage) {
        newPage = maxPage || 1;
        setPage(newPage);
      }
    } finally {
      getChuDeModel();
      setLoading(false);
    }
  };

  return {
    setDanhSach,
    phamVi,
    setPhamVi,
    filterInfo,
    setFilterInfo,
    condition,
    setCondition,
    getAllChuDeModel,
    setRecord,
    addChuDeModel,
    putChuDeModel,
    delChuDeModel,
    edit,
    setEdit,
    visibleForm,
    setVisibleForm,
    setLoaiChuDe,
    setPage,
    setLimit,
    danhSach,
    record,
    loading,
    total,
    page,
    loaiChuDe,
    limit,
    getAllLoaiChuDeModel,
    danhSachLoaiChuDe,
    getChuDeModel,
  };
};
