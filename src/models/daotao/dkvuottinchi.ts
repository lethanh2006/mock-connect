import useInitModel from '@/hooks/useInitModel';
import { ipDaoTao } from '@/utils/ip';

import { getSoTinChiDangKy } from '@/services/DaoTao/DkVuotTinChi';
import { type DkVuotTinChi } from '@/services/DaoTao/DkVuotTinChi/typing';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<DkVuotTinChi.IRecord>('dk-vuot-tin-chi', undefined, undefined, ipDaoTao);
	const { setLoading } = objInit;
	const [soTinChiDangKy, setSoTinChiDangKy] = useState<DkVuotTinChi.ISoTinChiDangKy>();
	const getSoTinChiDangKyModel = async (maHocKy: string) => {
		setLoading(true);
		try {
			const res = await getSoTinChiDangKy(maHocKy);
			setSoTinChiDangKy(res.data?.data);
			return res.data?.data;
		} finally {
			setLoading(false);
		}
	};

	return {
		...objInit,
		soTinChiDangKy,
		getSoTinChiDangKyModel,
	};
};
