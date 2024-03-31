import axios from '@/utils/axios';
import { ipKhaoThi } from '@/utils/ip';

const url = 'lich-thi';

export async function getLichThiTrongKhoang(payload: { fromDate: string; toDate: string }) {
	return axios.get(`${ipKhaoThi}/${url}/lich-thi/sv/from/${payload.fromDate}/to/${payload.toDate}`);
}
