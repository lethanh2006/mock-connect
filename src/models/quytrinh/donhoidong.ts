import useInitModel from '@/hooks/useInitModel';
import type { KhaiBaoQuyTrinh } from '@/services/QuyTrinh/KhaiBao/typings';

export default () => {
	const objInit = useInitModel<KhaiBaoQuyTrinh.IRecord>('hoi-dong-quy-trinh');
	const { getModel } = objInit;
	const getDonHoiDongModel = (idHoiDong: string) =>
		getModel(undefined, undefined, undefined, undefined, undefined, `user/hoi-dong/${idHoiDong}/don`);
	return {
		...objInit,
		getDonHoiDongModel,
	};
};
