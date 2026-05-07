import axios from '@/utils/axios';
import { ipDaoTao } from '@/utils/ip';

export async function getTienTrinhKhung(isSongNhanh?: boolean, personal?: boolean) {
	const queryString = personal !== undefined ? `?personal=${personal}` : '';
	return axios.get(
		`${ipDaoTao}/chuong-trinh-dao-tao/tien-trinh-khung${isSongNhanh ? '/song-nganh' : ''}${queryString}`,
	);
}

export async function getTienTrinhThucTe(maKhoaNganh?: string) {
	return axios.get(`${ipDaoTao}/chuong-trinh-dao-tao/tien-trinh-thuc-te/khoa-nganh/${maKhoaNganh}`);
}

export async function getManyKhoiLuaChonKhoaNganh(maKhoaNganh: string) {
	return axios.get(`${ipDaoTao}/chuong-trinh-dao-tao/khoa-nganh/${maKhoaNganh}/khoi-lua-chon/many`);
}

export async function getPathwayList(maKhoaNganh: string, maKhoiLuaChon: string) {
	return axios.get(
		`${ipDaoTao}/chuong-trinh-dao-tao/khoa-nganh/${maKhoaNganh}/khoi-lua-chon/${maKhoiLuaChon}/khoi-con`,
	);
}

export async function getChuongTrinhHienTai(maKhoaNganh: string) {
	return axios.get(`${ipDaoTao}/chuong-trinh-dao-tao/me/khoa-nganh/${maKhoaNganh}/hien-tai`);
}

export async function choosePathway(
	payload: { maKhoaNganh: string; maKhoiCha: string; maKhoiCon: string; dotDangKyPathwayId: string }[],
) {
	return axios.post(`${ipDaoTao}/sv-khoi-kien-thuc/lua-chon`, payload);
}

export async function getPathwayChoice(maKhoaNganh: string) {
	return axios.get(`${ipDaoTao}/sv-khoi-kien-thuc/khoa-nganh/${maKhoaNganh}/lua-chon`);
}

export async function getChuongTrinhDaoTaoTheoLoai(loai: string, donviId?: string) {
	return axios.get(`${ipDaoTao}/chuong-trinh-dao-tao/${loai}${donviId ? `/${donviId}` : ''}`);
}

export async function getChuongTrinhDaoTaoUserPage(params?: {
	page?: number;
	limit?: number;
	condition?: { loai?: string };
}) {
	return axios.get(`${ipDaoTao}/chuong-trinh-dao-tao/user/page`, { params });
}

export async function getChuyenNganhMeMany() {
	return axios.get(`${ipDaoTao}/chuong-trinh-dao-tao/chuyen-nganh/me/many`);
}

/** Danh sách học phần tiên quyết theo mã học phần (trong CTĐT) */
export async function getHocPhanTienQuyet(maHocPhan: string) {
	return axios.get(`${ipDaoTao}/chuong-trinh-dao-tao/hoc-phan/${maHocPhan}/tien-quyet`);
}
