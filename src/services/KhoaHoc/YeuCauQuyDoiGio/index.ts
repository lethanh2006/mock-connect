import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import type { SanPhamNCKH } from '../SanPhamNCKH/typings';

const url = 'nckh/yeu-cau-quy-doi-gio';

export const createYeuCauQuyDoiGio = (
	idSanPham: string,
	payload: {
		namHocId: string;
		danhSachKetQuaTinhGioThanhVien: SanPhamNCKH.KetQuaTinhGioThanhVien[];
	},
	mode: 'GIO' | 'DIEM',
) => axios.post(`${ip3}/${url}/create/san-pham-nckh/${idSanPham}?mode=${mode}`, payload);
