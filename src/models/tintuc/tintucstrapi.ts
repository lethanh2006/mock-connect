import { getMultiTinTucStrapi, getTinTucChiTietStrapi, getTinTucStrapi } from '@/services/TinTuc';
import { EChuDeStrapi, PathChuDeStrapi } from '@/services/TinTuc/constant';
import { type TinTucStrapi } from '@/services/TinTuc/typing';
import { useState } from 'react';

export default () => {
  const [danhSach, setDanhSach] = useState<TinTucStrapi.IRecord[]>([]);
  const [record, setRecord] = useState<TinTucStrapi.IRecord>();
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [chuDe, setChuDe] = useState<EChuDeStrapi>(EChuDeStrapi.DAO_TAO);

  const getDashboardModel = async (): Promise<TinTucStrapi.IRecord[]> => {
    setLoading(true);
    const payload = {
      page: 1,
      size: 5,
      listContentType: Object.values(PathChuDeStrapi),
    };

    try {
      const response = await getMultiTinTucStrapi(payload);
      if (setDanhSach) setDanhSach(response?.data?.results ?? []);

      return response?.data?.results;
    } catch (er) {
      return Promise.reject(er);
    } finally {
      setLoading(false);
    }
  };

  const getModel = async (
    apiArticleName?: EChuDeStrapi,
    paramPage?: number,
    paramLimit?: number,
  ): Promise<TinTucStrapi.IRecord[]> => {
    setLoading(true);
    const payload = {
      page: paramPage || page,
      size: paramLimit || limit,
      apiArticleName: PathChuDeStrapi[apiArticleName || chuDe],
    };

    try {
      const response = await getTinTucStrapi(payload);
      if (setDanhSach) setDanhSach(response?.data?.article?.results ?? []);
      setTotal(response?.data?.article?.pagination?.total ?? 0);

      return response?.data?.article?.results;
    } catch (er) {
      return Promise.reject(er);
    } finally {
      setLoading(false);
    }
  };

  const getByIdModel = async (
    slug: string,
    contentType: string,
    isSetRecord?: boolean,
  ): Promise<TinTucStrapi.IRecord> => {
    if (!slug || !contentType) return Promise.reject();
    setLoading(true);
    try {
      const response = await getTinTucChiTietStrapi({
        slug,
        contentType,
      });
      if (isSetRecord !== false) setRecord(response?.data ?? null);
      return response?.data;
    } catch (er) {
      return Promise.reject(er);
    } finally {
      setLoading(false);
    }
  };

  return {
    danhSach,
    setDanhSach,
    record,
    setRecord,
    page,
    setPage,
    limit,
    setLimit,
    loading,
    setLoading,
    total,
    setTotal,
    getModel,
    getByIdModel,
    chuDe,
    setChuDe,
    getDashboardModel,
  };
};
