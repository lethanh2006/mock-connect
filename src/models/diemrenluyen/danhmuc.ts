import useInitModel from '@/hooks/useInitModel';
import { locationPathMappingToELoaiDungMucChung } from '@/services/DiemRenLuyen/DanhMuc/constant';
import { type DanhMucDiemRenLuyen } from '@/services/DiemRenLuyen/DanhMuc/typing';
import { last } from 'lodash';

export default () => {
	const objInit = useInitModel<DanhMucDiemRenLuyen.IRecord>('danh-muc-chung');

	const { getModel } = objInit;

	const getLoaiDanhMucChung = () => {
		const suKienType = last(window.location.pathname.split('/')) ?? '';
		return locationPathMappingToELoaiDungMucChung[suKienType];
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
			{ ...paramCondition, loai: getLoaiDanhMucChung() },
			filterParams,
			sortParam,
			paramPage,
			paramLimit,
			path,
			otherQuery,
			isSetDanhSach,
			isAbsolutePath,
		);
	};

	return {
		...objInit,
		getLoaiDanhMucChung,
		getModel: getModel_,
	};
};
