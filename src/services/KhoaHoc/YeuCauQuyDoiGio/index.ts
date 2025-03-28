import axios from 'axios';
import type { SanPhamNCKH } from '../SanPhamNCKH/typings';
import { ip3 } from '@/utils/ip';

const url = 'nckh/yeu-cau-quy-doi-gio';

export const createYeuCauQuyDoiGio = (
	idSanPham: string,
	payload: {
		namHocId: string;
		danhSachKetQuaTinhGioThanhVien: SanPhamNCKH.KetQuaTinhGioThanhVien[];
	},
	mode: 'GIO' | 'DIEM',
) => axios.post(`${ip3}/${url}/create/san-pham-nckh/${idSanPham}?mode=${mode}`, payload);
