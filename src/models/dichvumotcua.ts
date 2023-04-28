import useInitModel from '@/hooks/useInitModel';
import { userGetAllBieuMau } from '@/services/DichVuMotCua/dichvumotcua';
import { useState } from 'react';

export default () => {
  const objInit = useInitModel<DichVuMotCua.BieuMau>('dich-vu-mot-cua');
  const { setLoading, setDanhSach, setRecord, condition } = objInit;
  const [recordDon, setRecordDon] = useState<DichVuMotCua.Don>();
  const [visibleFormBieuMau, setVisibleFormBieuMau] = useState<boolean>(false);

  const getAllBieuMauModel = async () => {
    setLoading(true);
    const response = await userGetAllBieuMau({
      condition: { ...condition },
    });
    setDanhSach(response?.data?.data ?? []);
    setRecord(response?.data?.data?.[0]);
    setLoading(false);
  };

  return {
    ...objInit,
    recordDon,
    setRecordDon,
    visibleFormBieuMau,
    setVisibleFormBieuMau,
    getAllBieuMauModel,
  };
};
