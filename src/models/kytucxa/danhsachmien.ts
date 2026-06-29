import useInitModel from '@/hooks/useInitModel';
import { KyTucXa } from '@/services/KyTucXa/typings';
import { ipCsvc } from '@/utils/ip';
import axios from '@/utils/axios';

export default () => {
	const objInit = useInitModel<KyTucXa.IDanhSachMien>('dang-ky-ky-tuc-xa/me/mien-dang-ky', undefined, undefined, ipCsvc);

	const nopMinhChung = async (id: string, urlMinhChung: string) => {
		return axios.post(`${ipCsvc}/dang-ky-ky-tuc-xa/me/mien-dang-ky/${id}/minh-chung`, { urlMinhChung });
	};

	return {
		...objInit,
		nopMinhChung,
	};
};
