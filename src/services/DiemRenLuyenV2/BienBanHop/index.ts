import { ip3 } from '@/utils/ip';
import axios from 'axios';

export const exportBienBanHop = (idBienBan: string) => {
	return axios.get(`${ip3}/phieu-diem-ren-luyen/export-bien-ban-cuoc-hop/${idBienBan}`, {
		responseType: 'arraybuffer',
	});
};
