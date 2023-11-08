import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';

export async function getQuyTrinhChuyenVien(
	loaiXuLyDon: string,
	payload: { page: number; limit: number; condition: any },
) {
	return axios.get(`${ip3}/don-quy-trinh-dong/chuyen-vien/page/loai-xu-ly-don/${loaiXuLyDon}`, {
		params: { ...payload },
	});
}
export async function chuyenVienTiepNhanDuyet(id: string, payload: any) {
	return axios.put(`${ip3}/don-quy-trinh-dong/chuyen-vien/tiep-nhan/don/${id}`, {
		...payload,
	});
}
