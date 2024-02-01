import { ipDaoTao } from '@/utils/ip';
import axios from '@/utils/axios';

export async function getTienTrinhKhung() {
	return axios.get(`${ipDaoTao}/chuong-trinh-dao-tao/tien-trinh-khung`);
}

export async function getTienTrinhKhungSongNganh() {
	return axios.get(`${ipDaoTao}/chuong-trinh-dao-tao/tien-trinh-khung/song-nganh`);
}

export async function getTienTrinhThucTe() {
	return axios.get(`${ipDaoTao}/chuong-trinh-dao-tao/tien-trinh-thuc-te`);
}
