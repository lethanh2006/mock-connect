import useInitModel from '@/hooks/useInitModel';
import { locationPathMappingToELoaiMinhChungDiemRenLuyen } from '@/services/DiemRenLuyen/MinhChung/constants';
import { type MinhChungDiemRenLuyen } from '@/services/DiemRenLuyen/MinhChung/typing';
import { last } from 'lodash';

export default () => {
	const objInit = useInitModel<MinhChungDiemRenLuyen.IRecord>('minh-chung');

	const { getModel } = objInit;

	const getLoaiMinhChung = () => {
		const suKienType = last(window.location.pathname.split('/')) ?? '';
		return locationPathMappingToELoaiMinhChungDiemRenLuyen[suKienType];
	};

	const getModel_: typeof getModel = (
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
			{ ...paramCondition, loaiMinhChung: getLoaiMinhChung() },
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
		getLoaiMinhChung,
		getModel: getModel_,
	};
};
