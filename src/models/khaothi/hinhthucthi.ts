import useInitModel from '@/hooks/useInitModel';
import { ipDaoTao } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<HinhThucThi.IRecord>('hinh-thuc-thi', undefined, undefined, ipDaoTao);

	return {
		...objInit,
	};
};
