import { getAllNamHoc, getAllNamHocSinhVien } from '@/services/NamHoc/namhoc';
import { useState } from 'react';

export default () => {
  const [danhSach, setDanhSach] = useState<NamHoc.Record[]>([]);
  const [record, setRecord] = useState<NamHoc.Record>();

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
    record,
    setRecord,
    getAllNamHocSinhVienModel,
    danhSach,
    setDanhSach,
    getAllNamHocModel,
  };
};
