import axios from '@/utils/axios';
import { ipDaoTao } from '@/utils/ip';

export async function huyDonXinNghi(idDon: string) {
	return axios.delete(`${ipDaoTao}/dang-ky-nghi-hoc/${idDon}/huy`);
}
