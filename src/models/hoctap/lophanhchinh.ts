import useInitModel from '@/hooks/useInitModel';
import { type APILopHanhChinh } from '@/services/LopHanhChinh';

export default () => {
  const objInit = useInitModel<APILopHanhChinh.INhanVienSinhVien>('lop-hanh-chinh');

  return {
    ...objInit,
  };
};
