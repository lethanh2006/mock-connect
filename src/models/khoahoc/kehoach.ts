import useInitModel from '@/hooks/useInitModel';
import type { KeHoachNCKH } from '@/services/KhoaHoc/KeHoach/typings';

export default () => {
	const objInit = useInitModel<KeHoachNCKH.IRecord>('nckh/ke-hoach-nckh');

	return {
		...objInit,
	};
};
