import { ipThuVien } from '@/utils/ip';
import axios from 'axios';

export async function getChiTietAnPham(idAnPham: string) {
	return axios.get(`${ipThuVien}/an-pham/${idAnPham}/tag`);
}

export async function getDKCBKhaDung(idAnPham: string, condition?: any) {
	return axios.get(`${ipThuVien}/an-pham/${idAnPham}/thong-ke-an-pham-kha-dung`, { params: { condition: condition } });
}
