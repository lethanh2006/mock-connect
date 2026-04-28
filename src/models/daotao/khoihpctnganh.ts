import useInitModel from '@/hooks/useInitModel';
import { ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<ChuongTrinhDaoTao.IKhoiHpCt>('khoi-hp-ct/nganh', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
