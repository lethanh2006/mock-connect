import { ipDaoTao } from '@/utils/ip';
import axios from 'axios';

export async function getMucThuHocPhiTheoNam(maNamHoc: string) {
	return axios.get(`${ipDaoTao}/muc-thu-hoc-phi/me/nam-hoc/${maNamHoc}`);
}
