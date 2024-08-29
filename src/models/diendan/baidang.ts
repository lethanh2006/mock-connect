import useInitModel from '@/hooks/useInitModel';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<BaiDang.IRecord>('dien-dan/bai-dang', 'condition', undefined, ipDaoTao);
	return objInit;
};
