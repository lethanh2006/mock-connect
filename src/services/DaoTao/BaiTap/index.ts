import axios from '@/utils/axios';
import { ipDaoTao } from '@/utils/ip';
import { pick } from 'lodash';

const NOP_BAI_FIELDS = ['mode', 'thongTinCauTraLoiQuiz', 'assignmentId', 'noiDungTraLoi', 'urlImages'] as const;

export type INopBaiPayload = Partial<Record<(typeof NOP_BAI_FIELDS)[number], unknown>>;

export async function sinhVienNopBai(payLoad: INopBaiPayload) {
	return axios.post(`${ipDaoTao}/assignment-user/sinh-vien`, pick(payLoad, NOP_BAI_FIELDS));
}

export async function thongKeBaiTap(startDate: any, endDate: any) {
	return axios.get(`${ipDaoTao}/assignment/lich/sinh-vien/from/${startDate}/to/${endDate}`);
}

export async function getThongKeBaiTapSinhVien(maHocKy: string) {
	return axios.get(`${ipDaoTao}/assignment-user/hoc-ky/${maHocKy}/sinh-vien/me/thong-ke`);
}
