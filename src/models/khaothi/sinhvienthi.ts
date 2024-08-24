import useInitModel from '@/hooks/useInitModel';
import { getDiemThiHocKySinhVien } from '@/services/KhaoThi/SinhVienThi';
import type { SinhVienThi } from '@/services/KhaoThi/SinhVienThi/typing';
import { ipKhaoThi } from '@/utils/ip';

export default () => {
	const objInit = useInitModel<SinhVienThi.IRecord>('sinh-vien-thi', undefined, undefined, ipKhaoThi);
	const { setLoading } = objInit;

	const getDiemThiHocKySinhVienModel = async (
		maHocKy: string,
		maHocPhan: string,
	): Promise<SinhVienThi.IDiemThiHocKySinhVien[]> => {
		setLoading(true);
		try {
			const response = await getDiemThiHocKySinhVien(maHocKy, maHocPhan);
			return response?.data?.data ?? [];
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	return {
		...objInit,
		getDiemThiHocKySinhVienModel,
	};
};
