import useInitModel from '@/hooks/useInitModel';
import { ipDaoTao } from '@/utils/ip';

export default () => {
  const objInit = useInitModel<LopHanhChinh.IRecord>(
    'lop-hanh-chinh',
    undefined,
    undefined,
    ipDaoTao,
  );
  const { getModel, getByIdModel } = objInit;

  const sinhVienGetModel = async (params: any): Promise<LopHanhChinh.IRecord[]> =>
    getModel(params, undefined, undefined, undefined, undefined, 'sinh-vien/page');

  const sinhVienGetByIdModel = async (idLop: string): Promise<LopHanhChinh.IRecord> =>
    getByIdModel(`${idLop}/sinh-vien`);

  return {
    ...objInit,
    sinhVienGetModel,
    sinhVienGetByIdModel,
  };
};
