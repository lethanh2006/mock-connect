import { getMyProfile } from '@/services/SinhVien/sinhvien';
import { useState } from 'react';

export default () => {
  const [record, setRecord] = useState<SinhVien.IRecord>();
  const [loading, setLoading] = useState<boolean>(false);

  const getMyProfileModel = async () => {
    setLoading(true);
    const res = await getMyProfile();
    setRecord(res?.data?.data);
    setLoading(false);
  };

  return {
    record,
    setRecord,
    loading,
    setLoading,
    getMyProfileModel,
  };
};
