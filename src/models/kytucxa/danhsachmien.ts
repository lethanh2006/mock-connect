import useInitModel from '@/hooks/useInitModel';
import { KyTucXa } from '@/services/KyTucXa/typings';
import { ipCsvc } from '@/utils/ip';
import axios from '@/utils/axios';

export default () => {
	const objInit = useInitModel<KyTucXa.IDanhSachMien>('dang-ky-ky-tuc-xa/me/mien-dang-ky', undefined, undefined, ipCsvc);

	const getModel = async () => {
		objInit.setLoading(true);
		try {
			const res = await axios.get(`${ipCsvc}/dang-ky-ky-tuc-xa/me/mien-dang-ky`);
			const data = res?.data?.data ?? [];
			const list = Array.isArray(data) ? data : (data.result ?? [data]);
			objInit.setDanhSach(list);
			objInit.setTotal(list.length);
			return list;
		} catch (err) {
			objInit.setDanhSach([]);
			objInit.setTotal(0);
			return [];
		} finally {
			objInit.setLoading(false);
		}
	};

	const getAllModel = async () => {
		return getModel();
	};

	const nopMinhChung = async (id: string, urlMinhChung: string) => {
		return axios.post(`${ipCsvc}/dang-ky-ky-tuc-xa/me/mien-dang-ky/${id}/minh-chung`, { urlMinhChung });
	};

	return {
		...objInit,
		getModel,
		getAllModel,
		nopMinhChung,
	};
};
