import axios from '@/utils/axios';
import { ipCore } from '@/utils/ip';

export async function getTinhTpTruongThpt() {
	return axios.get(`${ipCore}/truong-thpt/tinh-tp`);
}

export async function getTruongThptTheoTinh(maTinhTP: string) {
	return axios.get(`${ipCore}/truong-thpt/maTinhTP/${maTinhTP}`, { data: { silent: true } });
}
