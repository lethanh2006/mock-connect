import useInitModel from '@/hooks/useInitModel';
import {
	getChuongTrinhHienTai,
	getHocPhanTienQuyet,
	getTienTrinhKhung,
	getTienTrinhThucTe,
} from '@/services/DaoTao/ChuongTrinhDaoTao';
import { type ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { type LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import { ipDaoTao } from '@/utils/ip';
import { useState } from 'react';

export default () => {
	const objInit = useInitModel<ChuongTrinhDaoTao.IRecord>('chuong-trinh-dao-tao', undefined, undefined, ipDaoTao);
	const [loading, setLoading] = useState<boolean>();
	const [record, setRecord] = useState<ChuongTrinhDaoTao.IKhoiHocPhanCTDT>();
	const [tienTrinhHocTap, setTienTrinhHocTap] = useState<LopHocPhan.IRecordSinhVienLopHP[]>();
	const [dsKhoiHocPhanTienQuyet, setDsKhoiHocPhanTienQuyet] = useState<ChuongTrinhDaoTao.IKhoiHpCt[]>([]);
	const [loadingKhoiHocPhanTienQuyet, setLoadingKhoiHocPhanTienQuyet] = useState(false);
	const [chuongTrinhHienTai, setChuongTrinhHienTai] = useState<ChuongTrinhDaoTao.IRecord | null>(null);

	const sinhVienGetTienTrinhKhungModel = async (
		isSongNhanh?: boolean,
		personal?: boolean,
	): Promise<ChuongTrinhDaoTao.IKhoiHocPhanCTDT[]> => {
		setLoading(true);
		try {
			const response = await getTienTrinhKhung(isSongNhanh, personal);
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
