import axios from '@/utils/axios';
import { ipDaoTao } from '@/utils/ip';
import { pick } from 'lodash';

const DANG_KY_NHU_CAU_FIELDS = ['maKhoaNganh', 'maHocPhan'] as const;

export type IDangKyNhuCauPayload = Partial<Record<(typeof DANG_KY_NHU_CAU_FIELDS)[number], unknown>>;

export async function getDotDangKyNhuCauTheoHocKy(maHocKy: string) {
	return axios.get(`${ipDaoTao}/dot-dang-ky-nhu-cau/sinh-vien/me/hoc-ky/${maHocKy}`);
}

export async function sinhVienDangKyNhuCau(idDot: string, payLoad: IDangKyNhuCauPayload) {
	return axios.post(
		`${ipDaoTao}/hoc-phan-dk-nhu-cau/sinh-vien/dang-ky/dot/${encodeURIComponent(idDot)}`,
		pick(payLoad, DANG_KY_NHU_CAU_FIELDS),
	);
}

export async function getDotDangKyNhuCauHocKy(maHocKy: string) {
	return axios.get(`${ipDaoTao}/dot-dang-ky-nhu-cau/sinh-vien/me/hoc-ky/${maHocKy}`);
}
