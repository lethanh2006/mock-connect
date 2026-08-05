import axios from '@/utils/axios';
import { ipDaoTao } from '@/utils/ip';

export async function getManyLoaiKhuyetTat() {
	return axios.get(`${ipDaoTao}/dm-loai-khuyet-tat/many`);
}
