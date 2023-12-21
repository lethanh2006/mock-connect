import { ip3 } from '@/utils/ip';
import axios from 'axios';

export async function khaiBaoNoiNgoaiTru(dotKhaiBaoId: string, payLoad: any) {
	return axios.post(`${ip3}/khai-bao-noi-tru-ngoai-tru/${dotKhaiBaoId}/khai-bao`, payLoad);
}
