import useInitModel from '@/hooks/useInitModel';
import {
	getChuongTrinhHienTai,
	getHocPhanTienQuyet,
	getTienTrinhKhung,
	getTienTrinhThucTe,
} from '@/services/DaoTao/ChuongTrinhDaoTao';
import { type ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { ipDaoTao } from '@/utils/ip';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<ChuongTrinhDaoTao.IRecord>('chuong-trinh-dao-tao', undefined, undefined, ipDaoTao);
	const [loading, setLoading] = useState<boolean>();
	const [record, setRecord] = useState<ChuongTrinhDaoTao.IKhoiHocPhanCTDT>();
	const [tienTrinhHocTap, setTienTrinhHocTap] = useState<ChuongTrinhDaoTao.IKhoiHocPhanCTDT[]>();
	const [tienTrinhKhungMinors, setTienTrinhKhungMinors] = useState<ChuongTrinhDaoTao.TTienTrinhKhungMinor[]>([]);
	const [dsKhoiHocPhanTienQuyet, setDsKhoiHocPhanTienQuyet] = useState<ChuongTrinhDaoTao.IKhoiHpCt[]>([]);
	const [loadingKhoiHocPhanTienQuyet, setLoadingKhoiHocPhanTienQuyet] = useState(false);
	const [chuongTrinhHienTai, setChuongTrinhHienTai] = useState<ChuongTrinhDaoTao.IRecord | null>(null);

	const sinhVienGetTienTrinhKhungModel = async (
		isSongNhanh?: boolean,
		personal?: boolean,
	): Promise<ChuongTrinhDaoTao.TTienTrinhKhung> => {
		setLoading(true);
		try {
			const response = await getTienTrinhKhung(isSongNhanh, personal);
			const data = response?.data?.data;
			const nextData = Array.isArray(data)
				? { tienTrinh: data, minors: [] }
				: {
						tienTrinh: Array.isArray(data?.tienTrinh) ? data.tienTrinh : [],
						minors: Array.isArray(data?.minors) ? data.minors : [],
					};
			setTienTrinhHocTap(nextData.tienTrinh);
			setTienTrinhKhungMinors(nextData.minors);
			return nextData;
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

	const fetchKhoiHocPhanTienQuyet = async (maHocPhan: string) => {
		setLoadingKhoiHocPhanTienQuyet(true);
		try {
			const res = await getHocPhanTienQuyet(maHocPhan);
			const data = res?.data?.data ?? [];
			setDsKhoiHocPhanTienQuyet(data);
			return data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoadingKhoiHocPhanTienQuyet(false);
		}
	};

	const getChuongTrinhHienTaiModel = async (maKhoaNganh: string): Promise<ChuongTrinhDaoTao.IRecord | null> => {
		if (!maKhoaNganh) {
			setChuongTrinhHienTai(null);
			return null;
		}
		setLoading(true);
		try {
			const response = await getChuongTrinhHienTai(maKhoaNganh);
			const data = response?.data?.data;
			setChuongTrinhHienTai(data);
			return data;
		} catch (error) {
			setChuongTrinhHienTai(null);
			return Promise.reject(error);
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
		tienTrinhKhungMinors,
		setTienTrinhKhungMinors,
		chuongTrinhHienTai,
		setChuongTrinhHienTai,
		sinhVienGetTienTrinhKhungModel,
		sinhVienGetTienTrinhThucTeModel,
		getChuongTrinhHienTaiModel,
		dsKhoiHocPhanTienQuyet,
		setDsKhoiHocPhanTienQuyet,
		loadingKhoiHocPhanTienQuyet,
		fetchKhoiHocPhanTienQuyet,
	};
};
