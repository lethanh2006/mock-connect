import useInitModel from '@/hooks/useInitModel';
import { ELoaiDangKyTheoLop } from '@/services/DaoTao/DangKyTinChi/constant';
import { type HocPhan } from '@/services/DaoTao/HocPhan/typings';
import { ipDaoTao } from '@/utils/ip';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<HocPhan.IRecord>('hoc-phan', undefined, undefined, ipDaoTao);
	const { getModel } = objInit;
	const [loaiDangKy, setLoaiDangKy] = useState<ELoaiDangKyTheoLop>(ELoaiDangKyTheoLop.TAT_CA);

	const getHocPhanDKHPModel = (maHocKy: string, condition?: any, otherQuery?: any) =>
		getModel(
			condition,
			undefined,
			undefined,
			undefined,
			undefined,
			`dang-ky-tin-chi/sinh-vien/hoc-phan/hoc-ky/${maHocKy}/loai/${loaiDangKy}/page`,
			otherQuery,
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
