import { ipThuVien } from '@/utils/ip';
import axios from 'axios';

export async function dangKyAnPham(payload: any) {
	return axios.post(`${ipThuVien}/thue-muon-an-pham/dang-ky`, payload);
}

export async function getSetting() {
	return axios.get(`${ipThuVien}/thue-muon-an-pham/setting`);
}

export async function thongKeMuonTraSach() {
	return axios.get(`${ipThuVien}/thue-muon-an-pham/me/thong-ke`);
}

export async function chinhSuaMuonTraMe(id: string, payLoad: any) {
	return axios.put(`${ipThuVien}/thue-muon-an-pham/${id}/me`, payLoad);
}

export async function xoaMuonTraMe(id: string) {
	return axios.delete(`${ipThuVien}/thue-muon-an-pham/${id}/me`);
}
