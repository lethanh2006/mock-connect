import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function khaiBaoNoiNgoaiTru(dotKhaiBaoId: string, payLoad: any) {
	return axios.post(`${ip3}/khai-bao-noi-tru-ngoai-tru/${dotKhaiBaoId}/khai-bao`, payLoad);
}
