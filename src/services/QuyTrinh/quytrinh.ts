import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function getQuyTrinhUser(loaiQuyTrinh: string, payload: { page: number; limit: number; condition: any }) {
	return axios.get(`${ip3}/quy-trinh-dong/user/page/${loaiQuyTrinh}`, {
		params: { ...payload },
	});
}
