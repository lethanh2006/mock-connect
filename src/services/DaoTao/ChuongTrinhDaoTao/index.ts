import { ipDaoTao } from '@/utils/ip';
import axios from '@/utils/axios';

export async function getTienTrinhKhung(isSongNhanh?: boolean) {
	return axios.get(`${ipDaoTao}/chuong-trinh-dao-tao/tien-trinh-khung${isSongNhanh ? '/song-nganh' : ''}`);
}

export async function getTienTrinhThucTe(maKhoaNganh?: string) {
	return axios.get(`${ipDaoTao}/chuong-trinh-dao-tao/tien-trinh-thuc-te/khoa-nganh/${maKhoaNganh}`);
}
