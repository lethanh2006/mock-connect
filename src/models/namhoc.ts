import useInitModel from '@/hooks/useInitModel';
import { getAllNamHoc, getAllNamHocSinhVien } from '@/services/NamHoc/namhoc';

export default () => {
  const objInit = useInitModel<NamHoc.Record>('nam-hoc');
  const { setDanhSach, setRecord } = objInit;

  const getAllNamHocModel = async () => {
    const response = await getAllNamHoc();
    setDanhSach(response?.data?.data ?? []);
    setRecord(response?.data?.data?.[0]);
  };

  const getAllNamHocSinhVienModel = async () => {
    const response = await getAllNamHocSinhVien();
    setDanhSach(response?.data?.data ?? []);
  };

  return {
    ...objInit,
    getAllNamHocSinhVienModel,
    getAllNamHocModel,
  };
};
