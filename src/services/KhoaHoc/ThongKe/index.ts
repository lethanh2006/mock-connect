import { ip3 } from '@/utils/ip';
import axios from 'axios';

const url = 'nckh/thong-ke';

export const soLuongSanPhamTheoLoaiHinhvaTrangThai = (payload: {
	ssoId?: string;
	dotIds?: string[];
	loaiHinhIds?: string[];
	danhSachMaDonVi?: string[];
}) => axios.get(`${ip3}/${url}/loai-hinh/general`, { params: payload });

export const gioNCKHBySsoId = (dotIds: string[], ssoId: string, mode: 'GIO' | 'DIEM') =>
	axios.get(`${ip3}/${url}/quy-doi-gio-nckh/nhan-su/${ssoId}`, {
		params: {
			mode,
			dotIds,
		},
	});
