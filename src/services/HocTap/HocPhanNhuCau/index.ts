import axios from '@/utils/axios';
import { ipDaoTao } from '@/utils/ip';

export async function nhucauhocphan(payLoad: any) {
	return axios.post(`${ipDaoTao}/hoc-phan-sinh-vien-dang-ky-nhu-cau/dang-ky`, payLoad);
}

export const exportSinhVienDangKyNhuCau = (
	idDotDangKyHocPhanNhuCau: string,
	params?: { condition?: any; filter?: any[] },
) => {
	return axios.get(
		`${ipDaoTao}/sinh-vien-dang-ky-hoc-phan-nhu-cau/dot-dang-ky-hoc-phan-nhu-cau/${idDotDangKyHocPhanNhuCau}`,
		{
			responseType: 'arraybuffer',
			params,
		},
	);
};
