import useInitModel from '@/hooks/useInitModel';
import { getInvoiceByIdentityCode, thongKeMyInvoice } from '@/services/CongNo/ThanhToan';
import { type ThanhToan } from '@/services/CongNo/ThanhToan/typings';
import { ipTaiChinh } from '@/utils/ip';
import { useState } from 'react';

export default () => {
  const objInit = useInitModel<ThanhToan.Invoice>('chi-tiet-thu', undefined, undefined, ipTaiChinh);
  const { condition, getModel: getModel1, setRecord, setLoading } = objInit;
  const [postTypeCongNo, setPostTypeCongNo] = useState<'normal' | 'import'>('normal');
  const [recordThongKeInvoice, setRecordThongKeInvoice] = useState<ThanhToan.ThongKeInvoice>();

  const getModel = async () =>
    getModel1(undefined, undefined, undefined, undefined, undefined, 'me');

  const getInvoiceByIdentityCodeModel = async (
    identityCode?: string,
  ): Promise<ThanhToan.Invoice> => {
    if (!identityCode) return Promise.reject();
    setLoading(true);
    try {
      const response = await getInvoiceByIdentityCode(identityCode);
      setRecord(response?.data?.data);

      return response?.data?.data;
    } catch (er) {
      return Promise.reject(er);
    } finally {
      setLoading(false);
    }
  };

  const thongKeMyInvoiceModel = async () => {
    const response = await thongKeMyInvoice({ condition: { status: condition?.status ?? 'open' } });
    setRecordThongKeInvoice(response?.data?.data ?? {});
  };

  return {
    ...objInit,
    getModel,
    recordThongKeInvoice,
    setRecordThongKeInvoice,
    thongKeMyInvoiceModel,
    postTypeCongNo,
    setPostTypeCongNo,
    getInvoiceByIdentityCodeModel,
  };
};
