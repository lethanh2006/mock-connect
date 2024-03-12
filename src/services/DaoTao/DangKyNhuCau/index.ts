import { ipDaoTao } from '@/utils/ip';
import axios from 'axios';

export async function getDotDangKyNhuCauTheoHocKy(maHocKy: string) {
	return axios.get(`${ipDaoTao}/dot-dang-ky-nhu-cau/sinh-vien/me/hoc-ky/${maHocKy}`);
}

export async function sinhVienDangKyNhuCau(idDot: string, payLoad: any) {
	return axios.get(`${ipDaoTao}/hoc-phan-dk-nhu-cau/sinh-vien/dang-ky/dot/${idDot}`, payLoad);
}
