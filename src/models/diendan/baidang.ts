import useInitModel from '@/hooks/useInitModel';
import type { BaiDang } from '@/services/HocTap/DienDan/BaiDang/typing';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<BaiDang.IRecord>('dien-dan/bai-dang', undefined, undefined, ipDaoTao);
	const { getModel } = objInit;

	const getDienDanSinhVienModel = async (
		params: any,
		maHocKy?: string,
		sortParam: Record<string, 1 | -1> = { ghimBaiViet: -1 },
		type: string = '',
	): Promise<BaiDang.IRecord[]> => {
		const path = `me/hoc-ky/${maHocKy}/${type}/page`;
		return getModel(params, undefined, sortParam, undefined, undefined, path);
	};

	return { ...objInit, getDienDanSinhVienModel };
};
