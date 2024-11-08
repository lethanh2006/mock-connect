import { ipKhaoThi } from '@/utils/ip';
import axios from 'axios';

export async function getDiemThiHocKySinhVien(maHocKy: string, maHocPhan: string) {
	return axios.get(`${ipKhaoThi}/sinh-vien-thi/diem-thi/user/hoc-ky/${maHocKy}/hoc-phan/${maHocPhan}`);
}

export async function nopBaiTap(idHocPhan: string, payload: any) {
	return axios.put(`${ipKhaoThi}/sinh-vien-thi/${idHocPhan}/nop-bai`, payload);
}
