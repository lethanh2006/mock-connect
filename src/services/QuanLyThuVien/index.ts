import axios from '@/utils/axios';
import { ip3, ipDaoTao } from '@/utils/ip';
import { pick } from 'lodash';

const NOP_TAI_LIEU_FIELDS = [
	'urlTaiLieu',
	'idTaiLieu',
	'urlTomTat',
	'idTomTat',
	'urlTaiLieuMinhChung',
	'idTaiLieuMinhChung',
	'commit',
] as const;

export type INopTaiLieuPayload = Partial<Record<(typeof NOP_TAI_LIEU_FIELDS)[number], unknown>>;

export async function nopTaiLieu(id: string, payLoad: INopTaiLieuPayload) {
	return axios.put(`${ipDaoTao}/quan-ly-la-lv-kl/${encodeURIComponent(id)}/nop`, pick(payLoad, NOP_TAI_LIEU_FIELDS));
}

export async function thongKeVaoRaThuVienMe() {
	return axios.get(`${ip3}/ql-thu-vien/thong-ke/me`);
}

export async function getSoLuotCheckInTop(params?: {
	thoiGianBatDau?: string;
	thoiGianKetThuc?: string;
	condition?: any;
	filters?: any[];
}) {
	return axios.get(`${ip3}/ql-thu-vien/top/so-luot-checkin`, {
		params,
	});
}
