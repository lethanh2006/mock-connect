import useInitModel from '@/hooks/useInitModel';
import { type DotChamDiem } from '@/services/CongTacSinhVien/DiemRenLuyen/DotChamDiem/typing';

export default () => {
	const objInit = useInitModel<DotChamDiem.IRecord>('dot-cham-diem-ren-luyen');

	const { getModel } = objInit;

	const getModelBySinhVien: typeof getModel = (
		paramCondition,
		filterParams,
		sortParam,
		paramPage,
		paramLimit,
		path,
		otherQuery,
		isSetDanhSach,
		isAbsolutePath,
	) => {
		return getModel(
			paramCondition,
			filterParams,
			sortParam,
			paramPage,
			paramLimit,
			'sinh-vien/page',
			otherQuery,
			isSetDanhSach,
			isAbsolutePath,
		);
	};

	return {
		...objInit,
		getModelBySinhVien,
	};
};
