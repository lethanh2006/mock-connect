import { useMemo } from 'react';
import useInitModel from '@/hooks/useInitModel';
import { DangKyKyTucXa } from '@/services/KyTucXa/typings';
import { ipCsvc } from '@/utils/ip';

export default () => {
  const objInit = useInitModel<DangKyKyTucXa.IDanhMucChung>(
    'danh-muc-chung',
    undefined,
    { maLoai: 'LOAI_PHONG_KTX' },
    ipCsvc,
  );

  const getAllModel: typeof objInit.getAllModel = (isSetRecord, sortParam, conditionParam, ...rest) => {
    const finalCondition = {
      maLoai: 'LOAI_PHONG_KTX',
      ...(conditionParam || {}),
    };
    return objInit.getAllModel(isSetRecord, sortParam, finalCondition, ...rest);
  };

  const tienIchMap = useMemo(() => {
    const m = new Map<string, DangKyKyTucXa.IDanhMucChung>();
    (objInit.danhSach ?? []).forEach((d) => {
      if (d.ma) m.set(d.ma, d);
    });
    return m;
  }, [objInit.danhSach]);

  return {
    ...objInit,
    getAllModel,
    tienIchMap,
  };
};