import useInitModel from '@/hooks/useInitModel';
import useInitService from '@/hooks/useInitService';
import { type HocPhan } from '@/services/DaoTao/HocPhan/typings';
import { ipDaoTao } from '@/utils/ip';

export default () => {
  const objInit = useInitModel<HocPhan.ITienTrinhHocPhan>(
    'tien-trinh-hp',
    undefined,
    undefined,
    ipDaoTao,
  );
  const { postService, putService } = useInitService('nd-tien-trinh');

  const putOrPostNoiDungModel = (
    noiDungList: HocPhan.INoiDungTienTrinh[],
    data: Partial<HocPhan.INoiDungTienTrinh>,
  ) => {
    const noiDung = noiDungList.find((item) => item.loaiToChucDayHoc === data.loaiToChucDayHoc);
    if (noiDung) putService(noiDung._id, { ...noiDung, soTiet: data.soTiet ?? 0 });
    else postService(data as any);
  };

  return {
    ...objInit,
    putOrPostNoiDungModel,
  };
};
