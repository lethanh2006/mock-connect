import useInitModel from '@/hooks/useInitModel';
import {
  sinhVienGetLopHanhChinhById,
  sinhVienGetLopHanhChinhPageable,
} from '@/services/HocTap/LopHanhChinh/lophanhchinh';

export default () => {
  const objInit = useInitModel<LopHanhChinh.IRecord>('lop-hanh-chinh');
  const { setLoading, page, limit, condition, setDanhSach, setTotal, setRecord, sort, filters } =
    objInit;

  const sinhVienGetLopHanhChinhPageableModel = async () => {
    setLoading(true);
    const response = await sinhVienGetLopHanhChinhPageable({
      page,
      limit,
      condition,
      sort,
      filters: filters?.filter((item) => item.active)?.map(({ active, ...item }) => item),
    });
    setDanhSach(response?.data?.data?.result ?? []);
    setTotal(response?.data?.data?.total ?? 0);
    setLoading(false);
  };

  const sinhVienGetLopHanhChinhByIdModel = async (idLop: string) => {
    setLoading(true);
    const response = await sinhVienGetLopHanhChinhById(idLop);
    console.log(response, 'res');
    setRecord(response?.data?.data ?? {});
    setLoading(false);
  };

  return {
    ...objInit,
    sinhVienGetLopHanhChinhPageableModel,
    sinhVienGetLopHanhChinhByIdModel,
  };
};
