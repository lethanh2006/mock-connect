import { BaoHiemYTe } from '@/services/BaoHiemYTe/typing';
import axios from '@/utils/axios';
import { ipCCT } from '@/utils/ip';

export async function postSinhVienDangKyTruong(payLoad: BaoHiemYTe.ISinhVienDangKyTruong) {
	return axios.post(`${ipCCT}/bhyt/registration-periods/purchase-school-package`, payLoad);
}

export async function postSinhVienDangKyTuChon(payLoad: BaoHiemYTe.ISinhVienDangKy) {
	return axios.post(`${ipCCT}/bhyt/registration-periods/me/declare-insurance`, payLoad);
}

export async function putSinhVienDangKyTuChon(payLoad: BaoHiemYTe.ISinhVienDangKy) {
	return axios.put(`${ipCCT}/bhyt/registration-periods/me/declare-insurance`, payLoad);
}
