import { ipDaoTao } from '@/utils/ip';
import axios from 'axios';

export async function huyDonXinNghi(idDon: string) {
	return axios.delete(`${ipDaoTao}/dang-ky-nghi-hoc/huy/${idDon}`);
}
