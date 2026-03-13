import axios from '@/utils/axios';
import { ipDaoTao } from '@/utils/ip';

export async function getKeHoachNamHocHienTai(namHocId: string) {
	return axios.get(`${ipDaoTao}/ke-hoach-nam-hoc/many/nam-hoc/${namHocId}`);
}
