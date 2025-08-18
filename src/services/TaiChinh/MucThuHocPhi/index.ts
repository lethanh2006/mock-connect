import axios from '@/utils/axios';
import { ipDaoTao } from '@/utils/ip';
export async function getMucThuHocPhiTheoNam(maNamHoc: string) {
	return axios.get(`${ipDaoTao}/muc-thu-hoc-phi/me/nam-hoc/${maNamHoc}`);
}
