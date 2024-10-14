import useInitModel from '@/hooks/useInitModel';
import type { SuKien } from '@/services/SuKien/typings';

export default () => {
	const objInit = useInitModel<SuKien.ISinhVienHoatDongCTSV>('sv-hd-ctsv');

	return {
		...objInit,
	};
};
