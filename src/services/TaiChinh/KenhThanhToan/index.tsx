import axios from '@/utils/axios';

import { ipTaiChinh } from '@/utils/ip';

export async function postTransactionMePayment(body: {
	againLink?: string;
	billIdentityCode: string;
	kenhThanhToanId: string;
	loaiLePhiThanhToan?: 'PHAN_TRAM' | 'TIEN';
	phanTramLePhiThanhToan?: number;
	soTienLePhiThanhToan?: number;
}) {
	return axios.post(`${ipTaiChinh}/transaction/me/payment`, body);
}
