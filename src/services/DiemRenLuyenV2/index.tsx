import axios from '@/utils/axios';
import { ip3 } from '@/utils/ip';
import { ETrangThaiTiepNhanMinhChung } from '@/services/DiemRenLuyenV2/MinhChung/KhaiBao/constants';


export async function duyetTheoLopHanhChinh(
	idDot: string,
	lopHanhChinh: string,
	trangThai?: ETrangThaiTiepNhanMinhChung,
) {
	return axios.put(`${ip3}/khai-bao-minh-chung/duyet-theo-lop-hanh-chinh/${lopHanhChinh}/${idDot}`, {
		trangThai: trangThai,
	});
}
