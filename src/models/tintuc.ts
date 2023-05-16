import { addTinTuc, delTinTuc, getTinTuc, putTinTuc } from '@/services/TinTuc/tintuc';
import { message } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';

export default () => {
  const [danhSach, setDanhSach] = useState<TinTuc.Record[]>([]);
  const [filterInfo, setFilterInfo] = useState<any>({});
  const [condition, setCondition] = useState<any>({});
  const [record, setRecord] = useState<TinTuc.Record>({} as TinTuc.Record);
  const [loading, setLoading] = useState<boolean>(true);
  const [edit, setEdit] = useState<boolean>(false);
  const [visibleForm, setVisibleForm] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [phamVi, setPhamVi] = useState<'Tất cả' | 'Hình thức đào tạo'>('Tất cả');
  const { initialState } = useModel('@@initialState');
  const getTinTucModel = async (idHinhThuc?: number) => {
    setLoading(true);
    const response = await getTinTuc({
      page,
      limit,
      condition: {
        ...condition,
        hinhThucDaoTaoId: undefined,
        phamVi: initialState?.currentUser?.vai_tro === 'quan_tri' ? undefined : phamVi,
      },
      idHinhThuc:
        idHinhThuc ||
        (condition?.hinhThucDaoTaoId !== -1 ? condition?.hinhThucDaoTaoId : undefined),
    });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const addTinTucModel = async (payload: TinTuc.Record) => {
    setLoading(true);
    await addTinTuc(payload);
    message.success('Thêm thành công');
    setLoading(false);
    getTinTucModel();
    setVisibleForm(false);
  };
  const putTinTucModel = async (payload: { id: string; data: TinTuc.Record }) => {
    setLoading(true);
    await putTinTuc(payload);
    message.success('Sửa thành công');
    setLoading(false);
    getTinTucModel();
    setVisibleForm(false);
  };

  const delTinTucModel = async (payload: { id: string }) => {
    setLoading(true);
    await delTinTuc(payload);
    message.success('Xóa thành công');
    getTinTucModel();
    setLoading(false);
  };

  return {
    phamVi,
    setPhamVi,
    filterInfo,
    setFilterInfo,
    condition,
    setCondition,
    setRecord,
    addTinTucModel,
    putTinTucModel,
    delTinTucModel,
    edit,
    setEdit,
    visibleForm,
    setVisibleForm,
    setPage,
    setLimit,
    danhSach,
    record,
    loading,
    total,
    page,
    limit,
    getTinTucModel,
  };
};
