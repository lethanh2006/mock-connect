import useInitModel from '@/hooks/useInitModel';
import { type ELoaiHocPhanDangKyTinChi } from '@/services/DaoTao/DangKyTinChi/constant';
import { type DangKyTinChi } from '@/services/DaoTao/DangKyTinChi/typing';
import { ipDaoTao } from '@/utils/ip';
import { useState } from 'react';

export default () => {
  const objInit = useInitModel<DangKyTinChi.IHocPhanDangKy>(
    'hoc-phan/hoc-vien/dang-ky-tin-chi/hoc-ky',
    undefined,
    undefined,
    ipDaoTao,
  );
  const [loaiHocPhan, setLoaiHocPhan] = useState<ELoaiHocPhanDangKyTinChi>(); // Loại học phần đang chọn

  return {
    ...objInit,
    loaiHocPhan,
    setLoaiHocPhan,
  };
};
