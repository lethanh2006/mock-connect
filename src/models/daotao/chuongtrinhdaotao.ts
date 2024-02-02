import { getTienTrinhKhung, getTienTrinhThucTe } from '@/services/DaoTao/ChuongTrinhDaoTao';
import { type ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { useState } from 'react';

export default () => {
	const [loading, setLoading] = useState<boolean>();
	const [record, setRecord] = useState<ChuongTrinhDaoTao.IKhoiHocPhanCTDT>();
	const [tienTrinhHocTap, setTienTrinhHocTap] = useState<LopHocPhan.IRecordSinhVienLopHP[]>();

	const sinhVienGetTienTrinhKhungModel = async (
		isSongNhanh?: string,
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

	const sinhVienGetTienTrinhThucTeModel = async (): Promise<LopHocPhan.IRecordSinhVienLopHP[]> => {
		setLoading(true);
		try {
			const response = await getTienTrinhThucTe();
			setTienTrinhHocTap(response?.data?.data ?? null);
			return response?.data?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	return {
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
