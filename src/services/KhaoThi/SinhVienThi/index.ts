import { ipKhaoThi } from '@/utils/ip';
import axios from 'axios';

export async function getDiemThiHocKySinhVien(maHocKy: string, maHocPhan: string) {
	return axios.get(`${ipKhaoThi}/sinh-vien-thi/diem-thi/user/hoc-ky/${maHocKy}/hoc-phan/${maHocPhan}`);
}
