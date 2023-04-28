
import { useState } from 'react';
import { selectHocKy, selectHocPhan } from '@/services/HocPhanCoDiem/hocphancodiem';

export default () => {
  const [dsKyHoc, setDsKyHoc] = useState<any[]>([]);
  const [dsDiemTheoKy, setDsDiemTheoKy] = useState<any[]>([]);
  const [loading,setLoading]=useState<boolean>(false)
  const getDsKyHoc = async () => {
    try {
      const res = await selectHocKy();
      if (res) {
        setDsKyHoc(res?.data?.data);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const getDsDiemTheoKy = async (idHocKy: string) => {
    try {
      const res = await selectHocPhan({ idHocKy: idHocKy });
      if (res) {
        setDsDiemTheoKy(res?.data?.data);
      }
    } catch (e) {
      console.log(e);
    }
  };
  return {
    dsKyHoc,
    dsDiemTheoKy,
    getDsDiemTheoKy,
    getDsKyHoc,
    setLoading,loading
  };
};
