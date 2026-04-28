import dayjs from '@/utils/dayjs';
import useInitModel from '@/hooks/useInitModel';
import { getKyHienTai } from '@/services/DaoTao/DangKyChuyenNganh';
import { DangKyChuyenNganh } from '@/services/DaoTao/DangKyChuyenNganh/typing';
import { ipDaoTao } from '@/utils/ip';
import { useState } from 'react';

export type TDotDangKyCtdtStatus = 'not-open' | 'upcoming' | 'open' | 'closed';

const getRegistrationStatus = (dotDangKy?: DangKyChuyenNganh.IDotDangKy): TDotDangKyCtdtStatus => {
	if (!dotDangKy?.thoiGianBatDau || !dotDangKy?.thoiGianKetThuc) return 'not-open';

	const now = dayjs();
	const startTime = dayjs(dotDangKy.thoiGianBatDau);
	const endTime = dayjs(dotDangKy.thoiGianKetThuc);

	if (now.isBefore(startTime)) return 'upcoming';
	if (now.isAfter(endTime)) return 'closed';

	return 'open';
};

export default () => {
	const objInit = useInitModel<DangKyChuyenNganh.IDotDangKy>('dot-dk-ctdt', undefined, undefined, ipDaoTao);
	const { setRecord, setLoading } = objInit;
	const [registrationStatus, setRegistrationStatus] = useState<TDotDangKyCtdtStatus>('not-open');

	const applyDotDangKyState = (dotDangKy?: DangKyChuyenNganh.IDotDangKy) => {
		setRecord(dotDangKy);
		setRegistrationStatus(getRegistrationStatus(dotDangKy));
		return dotDangKy;
	};

	const fetchDotDangKy = async (loai: 'minor' | 'concentration') => {
		applyDotDangKyState(undefined);
		setLoading(true);
		try {
			const response = await getKyHienTai(loai);
			const data = response?.data?.data;
			return applyDotDangKyState(data);
		} catch (error) {
			applyDotDangKyState(undefined);
			return Promise.reject(error);
		} finally {
			setLoading(false);
		}
	};


	return {
		...objInit,
		registrationStatus,
		isRegistrationOpen: registrationStatus === 'open',
		fetchDotDangKy,
	};
};
