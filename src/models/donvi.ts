import useInitModel from '@/hooks/useInitModel';
import { delDonVi, getAllDonVi, postDonVi, putDonVi } from '@/services/DonVi/donvi';
import { message } from 'antd';
import { useState } from 'react';

export default () => {
  const objInit = useInitModel<DonVi.Record>('don-vi');
  const { setDanhSach, setLoading, record, setRecord, setVisibleForm } = objInit;
  const [position, setPosition] = useState<number>(0);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  const getAllDonViModel = async () => {
    setLoading(true);
    const response = await getAllDonVi();
    setDanhSach(response?.data?.data ?? []);
    setLoading(false);
    if (record?.id) {
      setRecord(response?.data?.data?.find((item: DonVi.Record) => item.id === record.id));
    }
  };

  const getAllDonViLaModel = async () => {
    setLoading(true);
    const response = await getAllDonVi({ condition: { don_vi_cap_duoi_ids: false } });
    setDanhSach(response?.data?.data ?? []);
    setLoading(false);
    if (record?.id) {
      setRecord(response?.data?.data?.find((item: DonVi.Record) => item.id === record.id));
    }
  };

  const postDonViModel = async (payload: DonVi.Record) => {
    setLoading(true);
    await postDonVi(payload);
    message.success('Thêm thành công');
    setVisibleForm(false);
    getAllDonViModel();
  };

  const putDonViModel = async (payload: DonVi.Record, idDonVi?: number) => {
    if (!idDonVi) return;
    setLoading(true);
    await putDonVi(payload, idDonVi);
    message.success('Sửa thành công');
    setVisibleForm(false);
    getAllDonViModel();
  };

  const delDonViModel = async (idDonVi?: number) => {
    if (!idDonVi) return;
    setLoading(true);
    await delDonVi(idDonVi);
    message.success('Xóa thành công');
    getAllDonViModel();
  };

  return {
    ...objInit,
    position,
    setPosition,
    delDonViModel,
    postDonViModel,
    putDonViModel,
    getAllDonViModel,
    expandedKeys,
    setExpandedKeys,
    getAllDonViLaModel,
  };
};
