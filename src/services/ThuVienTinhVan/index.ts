import axios from '@/utils/axios';
import { ipDaoTao } from '@/utils/ip';

export async function getLichSuMuonTra(params: any) {
	return axios.get(`${ipDaoTao}/hoc-lieu-de-cuong/thu-vien/me/muon/page`, { params }).then(res => res.data);
}