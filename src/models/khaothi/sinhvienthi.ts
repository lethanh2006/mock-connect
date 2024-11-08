import useInitModel from '@/hooks/useInitModel';
import { getDiemThiHocKySinhVien, nopBaiTap } from '@/services/KhaoThi/SinhVienThi';
import type { SinhVienThi } from '@/services/KhaoThi/SinhVienThi/typing';
import { ipKhaoThi } from '@/utils/ip';
import { message } from 'antd';

export default () => {
	const objInit = useInitModel<SinhVienThi.IRecord>('sinh-vien-thi', undefined, undefined, ipKhaoThi);
	const { setLoading, formSubmiting, setFormSubmiting } = objInit;

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

	const nopBaiTapModel = async (
		idHocPhan: string,
		payload: {
			urlBaiNop: any;
		},
		getData?: () => void,
	): Promise<SinhVienThi.IRecord> => {
		if (formSubmiting) Promise.reject('Form submiting');
		setFormSubmiting(true);
		try {
			const res = await nopBaiTap(idHocPhan, payload);
			message.success('Lưu thành công');
			if (getData) getData();

			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setFormSubmiting(false);
		}
	};

	return {
		...objInit,
		getDiemThiHocKySinhVienModel,
		nopBaiTapModel,
	};
};
