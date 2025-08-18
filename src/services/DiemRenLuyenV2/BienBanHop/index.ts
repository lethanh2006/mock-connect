import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export const exportBienBanHop = (idBienBan: string) => {
	return axios.get(`${ip3}/phieu-diem-ren-luyen/export-bien-ban-cuoc-hop/${idBienBan}`, {
		responseType: 'arraybuffer',
	});
};
