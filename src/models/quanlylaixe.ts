import {
  getLaiXePageable,
  postLaiXe,
  putLaiXe,
  deleteLaiXe,
  getAllLaiXe,
} from '@/services/QuanLyLaiXe/laixe';
import { useState } from 'react';
import { message } from 'antd';

export default () => {
  const [danhSach, setDanhSach] = useState<QuanLyLaiXe.Record[]>([]);
  const [record, setRecord] = useState<QuanLyLaiXe.Record>();
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [condition, setCondition] = useState<any>({});
  const [edit, setEdit] = useState<boolean>(false);
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);

  const getLaiXePageableModel = async () => {
    setLoading(true);
    const response = await getLaiXePageable({ page, limit, condition });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const getAllLaiXeModel = async () => {
    setLoading(true);
    const response = await getAllLaiXe();
    setDanhSach(response?.data?.data ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const postLaiXeModel = async (payload: any) => {
    setLoading(true);
    try {
      await postLaiXe(payload);
      message.success('Tạo thành công!');
      getLaiXePageableModel();
    } catch (err) {
      setLoading(false);
    }
    setLoading(false);
  };

  const putLaiXeModel = async (id: string, payload: any) => {
    setLoading(true);
    try {
      await putLaiXe(id, payload);
      message.success('Cập nhật thành công!');
      getLaiXePageableModel();
    } catch (err) {
      setLoading(false);
    }
    setLoading(false);
  };

  const deleteLaiXeModel = async (id: string) => {
    setLoading(true);
    try {
      await deleteLaiXe(id);
      message.success('Xóa thành công!');
      const maxPage = Math.ceil((total - 1) / limit);
      let newPage = page;
      if (newPage > maxPage) {
        newPage = maxPage || 1;
        setPage(newPage);
      }
      getLaiXePageableModel();
    } catch (err) {
      setLoading(false);
    }
    setLoading(false);
  };

  return {
    getLaiXePageableModel,
    getAllLaiXeModel,
    postLaiXeModel,
    putLaiXeModel,
    deleteLaiXeModel,
    danhSach,
    record,
    setRecord,
    page,
    setPage,
    limit,
    setLimit,
    loading,
    setLoading,
    filterInfo,
    setFilterInfo,
    condition,
    setCondition,
    edit,
    setEdit,
    visibleForm,
    setVisibleForm,
    total,
    setTotal,
  };
};
