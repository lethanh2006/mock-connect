import useInitModel from '@/hooks/useInitModel';
import { KyTucXa } from '@/services/KyTucXa/typings';
import { ipCsvc } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<KyTucXa.IDanhSachMien>('mien-ky-tuc-xa', undefined, undefined, ipCsvc);

	return {
		...objInit,
	};
};
