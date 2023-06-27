import useInitModel from '@/hooks/useInitModel';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { ipDaoTao } from '@/utils/ip';

export default () => {
  const objInit = useInitModel<LopHocPhan.IRecord>('lop-hoc-phan', undefined, undefined, ipDaoTao);
  const { getByIdModel, getModel } = objInit;

  const sinhVienGetModel = async (params: any): Promise<LopHocPhan.IRecord[]> =>
    params.maHocKy &&
    getModel(params, undefined, undefined, undefined, undefined, 'sinh-vien/page');

  const sinhVienGetByIdModel = async (idLop: string): Promise<LopHocPhan.IRecord> =>
    getByIdModel(`${idLop}/sinh-vien`);

  return {
    ...objInit,
    sinhVienGetModel,
    sinhVienGetByIdModel,
  };
};
