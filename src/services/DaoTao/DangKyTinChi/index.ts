import axios from '@/utils/axios';
import { ipDaoTao } from '@/utils/ip';

type TLopHocPhanDangKyTheoHocPhanPayload = {
	page?: number;
	limit?: number;
	select?: string;
	sort?: Record<string, 1 | -1> | string;
	population?: string[];
	condition?: Record<string, any> | string;
	filters?: any[];
};

export async function getDotAvailable(maHocKy: string) {
	return axios.get(`${ipDaoTao}/dang-ky-tin-chi/validate/hoc-ky/${maHocKy}`);
}

export async function getPhieuDangKy(idDotDangKyTinChi: string) {
	return axios.get(`${ipDaoTao}/dang-ky-tin-chi/phieu-dang-ky/dot/${idDotDangKyTinChi}`);
}

export async function getLopDangKy(maHocKy: string) {
	return axios.get(`${ipDaoTao}/dang-ky-tin-chi/lop-dang-ky/hoc-ky/${maHocKy}`);
}

export async function postDangKyTinChi(data: { dangKy: { lopHocPhanId: string }; phieuDktcId: string }) {
	return axios.post(`${ipDaoTao}/dang-ky-tin-chi/dang-ky/lop-hoc-phan`, { ...data, silent: true });
}

export async function deleteDangKyTinChi(data: { phieuDktcId: string; lopHocPhanId: string }) {
	return axios.delete(`${ipDaoTao}/dang-ky-tin-chi/dang-ky/lop-hoc-phan`, { data });
}

export async function getSinhVienDot(dotDangKyTinChiId: string) {
	return axios.get(`${ipDaoTao}/dang-ky-tin-chi/dot-sinh-vien/me/dot/${dotDangKyTinChiId}`);
}

export async function getLopDaHuyDangKyTinChi(idPhieuDktc: string) {
	return axios.get(`${ipDaoTao}/dang-ky-tin-chi/audit-log/sv-del-dk/phieu/${idPhieuDktc}/many/me`);
}

export async function revertLopDangKyTinDaHuy(idAuditLog: string) {
	return axios.post(`${ipDaoTao}/dang-ky-tin-chi/audit-log/sv-del-dk/${idAuditLog}/revert/me`);
}

export async function getLichDangKyTinChiTrongKhoang(payload: { fromDate: string; toDate: string }) {
	return axios.get(`${ipDaoTao}/dang-ky-tin-chi/dot/lich/sinh-vien/from/${payload.fromDate}/to/${payload.toDate}`);
}

export async function getLopHocPhanDangKyTheoHocPhan(
	payload: TLopHocPhanDangKyTheoHocPhanPayload,
	maHocKy: string,
	loai: 'lop-hanh-chinh' | 'khoa-nganh' | 'tat-ca',
) {
	return axios.get(
		`${ipDaoTao}/dang-ky-tin-chi/sinh-vien/lop-hoc-phan/by-hoc-phan/hoc-ky/${maHocKy}/loai/${loai}/page`,
		{
			params: payload,
		},
	);
}

export async function getChiTietHocPhanDangKyTinChi(maHocPhan: string, maKhoaNganh: string) {
	return axios.get(`${ipDaoTao}/dang-ky-tin-chi/hoc-phan/${maHocPhan}/khoa-nganh/${maKhoaNganh}/chi-tiet`);
}
