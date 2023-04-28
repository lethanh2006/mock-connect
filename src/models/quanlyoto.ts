import { message } from 'antd';
import {
  getQuanLyOtoPageable,
  putQuanLyOto,
  postQuanLyOto,
  exportListXe,
  importListXe,
  getQuanLyOtoAll,
  getQuanLyOtoById,
  deleteQuanLyOto,
} from '@/services/QuanLyOto/Oto';
import { useState } from 'react';
import type { QuanLyOto } from '@/services/QuanLyOto/typings';

export default () => {
  const [danhSach, setDanhSach] = useState<QuanLyOto.Record[]>([]);
  const [record, setRecord] = useState<QuanLyOto.Record>();
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [condition, setCondition] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [dataImportResponse, setDataImportResponse] = useState<QuanLyOto.RecordImport>();
  const [visiblePreview, setVisiblePreview] = useState<boolean>(false);

  const getQuanLyOtoPageableModel = async () => {
    setLoading(true);
    const response = await getQuanLyOtoPageable({ page, limit, condition });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const getQuanLyOtoAllModel = async () => {
    setLoading(true);
    const response = await getQuanLyOtoAll();
    setDanhSach(response?.data?.data ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const postQuanLyOtoModel = async (payload: any) => {
    setLoading(true);
    try {
      await postQuanLyOto(payload).then((response) => {
        if (response.status === 201) {
          message.success('Tạo thành công!');
        }
        getQuanLyOtoPageableModel();
      });
    } catch (error) {
      setLoading(false);
    }
    setVisibleForm(false);
    setLoading(false);
  };

  const exportListXeModel = async (payload: any) => {
    setLoading(true);
    try {
      await exportListXe(payload).then((response) => {
        if (response.status === 201) {
          message.success('Export thành công!');
          window.open(response?.data?.data?.url);
        }
      });
    } catch (error) {
      setLoading(false);
    }
    getQuanLyOtoPageableModel();
    setVisibleForm(false);
    setLoading(false);
  };

  const importListXeModel = async (payload: any) => {
    setLoading(true);
    try {
      await importListXe(payload).then((response) => {
        if (response.status === 201) {
          setDataImportResponse(response?.data?.data ?? {});
          message.success('Import thành công!');
          setVisiblePreview(true);
        }
        getQuanLyOtoPageableModel();
      });
    } catch (error) {
      setLoading(false);
    }
    setVisibleForm(false);
    setLoading(false);
  };

  const putQuanLyOtoModel = async (id: string, payload: any) => {
    setLoading(true);
    try {
      await putQuanLyOto(id, payload).then((response) => {
        if (response.status === 200) {
          message.success('Cập nhật thành công!');
        }
        getQuanLyOtoPageableModel();
      });
    } catch (error) {
      setLoading(false);
    }
    setVisibleForm(false);
    setLoading(false);
  };

  const deleteQuanLyOtoModel = async (payload: string[]) => {
    setLoading(true);
    try {
      await deleteQuanLyOto({ listIdOto: payload });
      message.success('Xóa thành công!');
    } catch (error) {
      setLoading(false);
    }
    getQuanLyOtoPageableModel();
    setLoading(false);
  };

  const getQuanLyOtoByIdPublicModel = async (id: string) => {
    setLoading(true);
    try {
      const response = await getQuanLyOtoById(id);
      setRecord(response?.data?.data ?? {});
    } catch (error) {
      setLoading(false);
    }
    setLoading(false);
  };

  return {
    getQuanLyOtoPageableModel,
    getQuanLyOtoAllModel,
    postQuanLyOtoModel,
    exportListXeModel,
    importListXeModel,
    putQuanLyOtoModel,
    deleteQuanLyOtoModel,
    getQuanLyOtoByIdPublicModel,
    danhSach,
    setDanhSach,
    record,
    setRecord,
    filterInfo,
    setFilterInfo,
    condition,
    setCondition,
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
    dataImportResponse,
    setDataImportResponse,
    visiblePreview,
    setVisiblePreview,
  };
};
