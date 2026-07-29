import axios from '@/utils/axios';
import { ipTaiChinh } from '@/utils/ip';
import type { TraGop } from './typing';

/** Kiểm tra hóa đơn có đủ điều kiện đăng ký trả góp không */
export function checkEligibleTraGop(billId: string) {
	return axios.get(`${ipTaiChinh}/tra-gop/check-eligible/${billId}`);
}

/** Sinh viên gửi yêu cầu đăng ký trả góp cho một hóa đơn */
export function postYeuCauTraGop(payload: TraGop.IYeuCauPayload) {
	return axios.post(`${ipTaiChinh}/tra-gop/yeu-cau`, payload);
}

/** Lấy danh sách các đợt (phiên) trả góp đã được phân bổ cho hóa đơn */
export function getPhienTraGop(billId: string) {
	return axios.get(`${ipTaiChinh}/tra-gop/phien-tra-gop/${billId}`);
}
