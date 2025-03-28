import useInitModel from '@/hooks/useInitModel';
import { getSoLuotCheckInTop, thongKeVaoRaThuVienMe } from '@/services/QuanLyThuVien';
import type { QuanLyThuVien } from '@/services/QuanLyThuVien/typing';
import { ip3 } from '@/utils/ip';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<QuanLyThuVien.IVaoRaThuVien>('ql-thu-vien', undefined, undefined, ip3, {
		thoiGianCheckIn: -1,
	});
	const { setLoading } = objInit;
	const [thongKeVaoRa, setThongKeVaoRa] = useState<QuanLyThuVien.TThongKeVaoRa[]>([]);
	const [loadingTop, setLoadingTop] = useState<boolean>(false);
	const [dataThongKeCheckInTop, setDataThongKeCheckInTop] = useState<QuanLyThuVien.IThongKeCheckInTop[]>([]);

	const thongKeVaoRaModel = async (): Promise<QuanLyThuVien.TThongKeVaoRa[]> => {
		setLoading(true);
		try {
			const res = await thongKeVaoRaThuVienMe();
			const res1 = res.data?.data as QuanLyThuVien.TThongKeVaoRa[];
			res1.sort((a, b) => a.nam - b.nam || a.thang - b.thang);
			setThongKeVaoRa(res1);
			return res1;
		} catch (error) {
			return Promise.reject(error);
		} finally {
			setLoading(false);
		}
	};

	const getSoLuotCheckInTopModel = async (
		thoiGianBatDau?: string,
		thoiGianKetThuc?: string,
		condition?: any,
		filters?: any[],
	): Promise<any> => {
		setLoadingTop(true);
		try {
			const res = await getSoLuotCheckInTop({ thoiGianBatDau, thoiGianKetThuc, condition, filters });
			setDataThongKeCheckInTop(res.data?.data);
			return res.data?.data;
		} catch (err) {
			return Promise.reject(err);
		} finally {
			setLoadingTop(false);
		}
	};

	return {
		...objInit,
		thongKeVaoRa,
		setThongKeVaoRa,
		loadingTop,
		dataThongKeCheckInTop,
		thongKeVaoRaModel,
		getSoLuotCheckInTopModel,
	};
};
