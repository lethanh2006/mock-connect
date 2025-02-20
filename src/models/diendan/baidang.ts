import useInitModel from '@/hooks/useInitModel';
import type { BaiDang } from '@/services/HocTap/DienDan/BaiDang/typing';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<BaiDang.IRecord>('dien-dan/bai-dang', undefined, undefined, ipDaoTao);

	return objInit;
};
