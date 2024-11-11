import useInitModel from '@/hooks/useInitModel';
import type { HocPhanThi } from '@/services/KhaoThi/HocPhanThi/typings';
import { ipKhaoThi } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<HocPhanThi.IRecord>('hoc-phan-thi', undefined, undefined, ipKhaoThi);

	return {
		...objInit,
	};
};
