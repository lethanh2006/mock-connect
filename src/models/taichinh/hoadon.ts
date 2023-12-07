import useInitModel from '@/hooks/useInitModel';
import { postThongTinMomo } from '@/services/TaiChinh/HoaDon';
import type { HoaDon } from '@/services/TaiChinh/HoaDon/typing';
import { ETransactionPaymentType } from '@/services/TaiChinh/constant';
import { ipTaiChinh } from '@/utils/ip';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<HoaDon.IRecord>('bill', undefined, undefined, ipTaiChinh);
	const [paymentType, setPaymentType] = useState<ETransactionPaymentType>(ETransactionPaymentType.BANK);
	const [visibleHuongDan, setVisibleHuongDan] = useState<boolean>(false);
	const [infoMomo, setInfoMomo] = useState<HoaDon.IResponseMomo>();
	const { getModel: getModelOrigin, setLoading } = objInit;

	const getModel = async (condition?: Partial<HoaDon.IRecord>): Promise<HoaDon.IRecord[]> =>
		getModelOrigin(condition, undefined, undefined, undefined, undefined, 'me/pageable');

	const getInfoMomoModel = async (identityCode: string): Promise<HoaDon.IResponseMomo> => {
		setLoading(true);

		try {
			const res = await postThongTinMomo({
				identityCode,
				redirectUrl: window.location.origin + window.location.pathname,
			});

			setInfoMomo(res.data?.data);
			return res.data?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	return {
		...objInit,
		paymentType,
		setPaymentType,
		visibleHuongDan,
		setVisibleHuongDan,
		getModel,
		infoMomo,
		setInfoMomo,
		getInfoMomoModel,
	};
};
