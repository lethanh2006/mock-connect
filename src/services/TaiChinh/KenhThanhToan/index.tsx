import axios from '@/utils/axios';

import { ipTaiChinh } from '@/utils/ip';

export async function postTransactionMePayment(body: {
	againLink?: string;
	billIdentityCode?: string;
	billIdentityCodes?: string[];
	kenhThanhToanId: string;
	loaiLePhiThanhToan?: 'PHAN_TRAM' | 'TIEN';
	phanTramLePhiThanhToan?: number;
	soTienLePhiThanhToan?: number;
	soTienThanhToan?: number;
	webUrlCallBack?: string;
	guiThongTinHoaDon?: boolean;
	thongTinHoaDon?: {
		tenToChuc?: string;
		maSoThue?: string;
		diaChi?: string;
		emailNhanHoaDonDienTu?: string;
		userSoDienThoai?: string;
	};
}) {
	return axios.post(`${ipTaiChinh}/transaction/me/payment`, body);
}
