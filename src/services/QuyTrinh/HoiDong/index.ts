import { ip3 } from '@/utils/ip';
import axios from 'axios';

export const getDonHoiDong = (
	idHoiDong: string,
	payload: {
		page: number;
		limit: number;
		condition?: any;
	},
) => axios.get(`${ip3}/hoi-dong-quy-trinh/user/hoi-dong/${idHoiDong}/don`, { params: { payload } });

export const hoiDongNhanXet = (
	idHoiDong: string,
	idDon: string,
	payload: { ghiChuHoiDong: string; danhSachFileDinhKem: string[] },
) => axios.put(`${ip3}/hoi-dong-quy-trinh/user/ghi-chu/hoi-dong/${idHoiDong}/don/${idDon}`, payload);
