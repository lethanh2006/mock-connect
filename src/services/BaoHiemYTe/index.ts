import axios from '@/utils/axios';
import { ipCsvc } from '@/utils/ip';

export async function postSinhVienDangKyTruong(idDot: string) {
	return axios.post(`${ipCsvc}/bhyt/registration-periods/${idDot}/purchase-school-package`);
}

export async function postSinhVienDangKyTuChon(periodStudentId: string, payLoad: any) {
	return axios.post(`${ipCsvc}/bhyt/registration-periods/${periodStudentId}/declare-insurance`, payLoad);
}
