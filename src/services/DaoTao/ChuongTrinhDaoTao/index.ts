import { ipDaoTao } from '@/utils/ip';
import axios from '@/utils/axios';

export async function getTienTrinhKhung(isSongNhanh?: string) {
	return axios.get(`${ipDaoTao}/chuong-trinh-dao-tao/tien-trinh-khung${isSongNhanh}`);
}

export async function getTienTrinhThucTe() {
	return axios.get(`${ipDaoTao}/chuong-trinh-dao-tao/tien-trinh-thuc-te`);
}
