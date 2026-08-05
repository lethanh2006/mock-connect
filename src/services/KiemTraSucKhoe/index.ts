import { KiemTraSucKhoe } from '@/services/KiemTraSucKhoe/typing';
import axios from '@/utils/axios';
import { ipCCT } from '@/utils/ip';

export async function postSinhVienDangKyKham(payLoad: KiemTraSucKhoe.ISinhVienDangKy) {
	return axios.post(`${ipCCT}/ksk/registration-periods/me/register-school-exam`, payLoad);
}

export async function postSinhVienMienKham(payLoad: KiemTraSucKhoe.ISinhVienMienKham) {
	return axios.post(`${ipCCT}/ksk/registration-periods/me/declare-external-exam`, payLoad);
}

export async function putSinhVienMienKham(payLoad: KiemTraSucKhoe.ISinhVienMienKham) {
	return axios.put(`${ipCCT}/ksk/registration-periods/me/declare-external-exam`, payLoad);
}
