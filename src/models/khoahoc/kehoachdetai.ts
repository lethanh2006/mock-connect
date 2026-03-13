import useInitModel from '@/hooks/useInitModel';
import type { KeHoachDeTai } from '@/services/KhoaHoc/KeHoachDeTai/typings';

export default () => {
	const objInit = useInitModel<KeHoachDeTai.IRecord>('ke-hoach-de-tai');

	return {
		...objInit,
	};
};
