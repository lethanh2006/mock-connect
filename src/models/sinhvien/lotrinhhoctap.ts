import useInitModel from '@/hooks/useInitModel';
import { LoTrinhHocTap } from '@/services/DaoTao/ChuongTrinhDaoTao/LoTrinhHocTap/typing';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<LoTrinhHocTap.IRecord>('dot-dang-ky-pathway-sinh-vien', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
