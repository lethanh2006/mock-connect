import useInitModel from '@/hooks/useInitModel';
import { getTienTrinhKhung, getTienTrinhThucTe } from '@/services/DaoTao/ChuongTrinhDaoTao';
import { type ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { ipDaoTao } from '@/utils/ip';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<ChuongTrinhDaoTao.IRecord>('chuong-trinh-dao-tao', undefined, undefined, ipDaoTao);
	const [loading, setLoading] = useState<boolean>();
	const [record, setRecord] = useState<ChuongTrinhDaoTao.IKhoiHocPhanCTDT>();
	const [tienTrinhHocTap, setTienTrinhHocTap] = useState<LopHocPhan.IRecordSinhVienLopHP[]>();

	const sinhVienGetTienTrinhKhungModel = async (
		isSongNhanh?: boolean,
	): Promise<ChuongTrinhDaoTao.IKhoiHocPhanCTDT[]> => {
		setLoading(true);
		try {
			const response = await getTienTrinhKhung(isSongNhanh);
			setTienTrinhHocTap(response?.data?.data ?? null);
			return response?.data?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	const sinhVienGetTienTrinhThucTeModel = async (
		maKhoaNganh: string,
	): Promise<ChuongTrinhDaoTao.TTienTrinhThucTe[]> => {
		setLoading(true);
		try {
			const response = await getTienTrinhThucTe(maKhoaNganh);
			return response?.data?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	return {
		...objInit,
		loading,
		record,
		setRecord,
		setLoading,
		tienTrinhHocTap,
		setTienTrinhHocTap,
		sinhVienGetTienTrinhKhungModel,
		sinhVienGetTienTrinhThucTeModel,
	};
};
