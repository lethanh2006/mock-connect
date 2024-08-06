import useInitModel from '@/hooks/useInitModel';
import type { ThongBao } from '@/services/ThongBao/typing';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<ThongBao.IRecord>('foo', undefined, undefined, ipDaoTao);
	const { getModel } = objInit;

	const getThongBaoLopModel = (
		idLop: string,
		loai: 'lop-hanh-chinh' | 'lop-hoc-phan',
		paramPage?: number,
		paramLimit?: number,
	) =>
		getModel(
			undefined,
			undefined,
			undefined,
			paramPage,
			paramLimit,
			`${loai}/${idLop}/notification/page`,
			undefined,
			undefined,
			true,
		);

	return {
		...objInit,
		getThongBaoLopModel,
	};
};
