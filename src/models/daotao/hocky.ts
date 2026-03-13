import useInitModel from '@/hooks/useInitModel';
import { ipDaoTao } from '@/utils/ip';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<HocKy.IRecord>('hoc-ky', undefined, undefined, ipDaoTao);
	const [danhSachHkLhc, setDanhSachHkLhc] = useState<HocKy.IRecord[]>([]);

	return {
		...objInit,
		danhSachHkLhc,
		setDanhSachHkLhc,
	};
};
