import useInitModel from '@/hooks/useInitModel';
import { ELoaiDangKyTheoLop } from '@/services/DaoTao/DangKyTinChi/constant';
import { type HocPhan } from '@/services/DaoTao/HocPhan/typings';
import { ipDaoTao } from '@/utils/ip';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<HocPhan.IRecord>('hoc-phan', undefined, undefined, ipDaoTao);
	const { getModel } = objInit;
	const [loaiDangKy, setLoaiDangKy] = useState<ELoaiDangKyTheoLop>(ELoaiDangKyTheoLop.LOP_HANH_CHINH);

	const getHocPhanDKHPModel = (maHocKy: string, condition?: any) =>
		getModel(
			condition,
			undefined,
			undefined,
			undefined,
			undefined,
			`dang-ky-tin-chi/sinh-vien/hoc-phan/hoc-ky/${maHocKy}/loai/${loaiDangKy}/page`,
			undefined,
			undefined,
			true,
		);

	return {
		...objInit,
		loaiDangKy,
		setLoaiDangKy,
		getHocPhanDKHPModel,
	};
};
