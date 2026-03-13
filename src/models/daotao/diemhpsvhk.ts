import useInitModel from '@/hooks/useInitModel';
import { ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { thongKeDiemPLOSinhVien } from '@/services/HocTap/LopHocPhan';
import type { LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { ipDaoTao } from '@/utils/ip';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<LopHocPhan.IDiemHpSvHk>('diem-hp-sv-hk', undefined, undefined, ipDaoTao);
	const { getAllModel, setLoading } = objInit;
	const [thongKePLO, setThongKePLO] = useState<ChuongTrinhDaoTao.TThongKePloSinhVien>();

	const getDiemSvHk = (maKhoaNganh: string) =>
		getAllModel(undefined, undefined, undefined, undefined, 'sinh-vien/me', undefined, undefined, { maKhoaNganh });

	const thongKeDiemPLOSinhVienModel = async (maKhoaNganh: string): Promise<ChuongTrinhDaoTao.TThongKePloSinhVien> => {
		setLoading(true);
		try {
			const response = await thongKeDiemPLOSinhVien(maKhoaNganh);
			const data: ChuongTrinhDaoTao.TThongKePloSinhVien = response?.data?.data ?? [];
			setThongKePLO(data);
			return data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	return {
		...objInit,
		thongKePLO,
		getDiemSvHk,
		thongKeDiemPLOSinhVienModel,
	};
};
