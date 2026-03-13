import useInitModel from '@/hooks/useInitModel';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<NganhDaoTao.IRecordCoSo>('nganh', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
