import axios from 'axios';
import type { ETrangThaiKeHoachNCKH } from './constants';
import { ip3 } from '@/utils/ip';

export const duyetKeHoach = (
	idKeHoach: string,
	payload: {
		ghiChuTiepNhan?: string;
		trangThai: ETrangThaiKeHoachNCKH;
	},
) => axios.put(`${ip3}/nckh/ke-hoach-nckh/${idKeHoach}/tiep-nhan`, payload);
