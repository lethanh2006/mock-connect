import useInitModel from '@/hooks/useInitModel';
import { KyTucXa } from '@/services/KyTucXa/typings';
import { ipCsvc } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<KyTucXa.IYeuCauChoPhong>('dang-ky-ky-tuc-xa/waiting-request', undefined, undefined, ipCsvc);

	return {
		...objInit,
	};
};
