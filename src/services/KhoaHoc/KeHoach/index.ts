import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import type { ETrangThaiKeHoachNCKH } from './constants';

export const duyetKeHoach = (
	idKeHoach: string,
	payload: {
		ghiChuTiepNhan?: string;
		trangThai: ETrangThaiKeHoachNCKH;
	},
) => axios.put(`${ip3}/nckh/ke-hoach-nckh/${idKeHoach}/tiep-nhan`, payload);
