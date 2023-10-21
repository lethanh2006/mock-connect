import type { ChuongTrinhDaoTao } from '@/services/DaoTao/ChuongTrinhDaoTao/typing';
import { getTienTrinhDauRa, getTrangThaiNoSinhVienMe } from '@/services/DaoTao/SinhVien';
import type { SinhVien } from '@/services/DaoTao/SinhVien/typings';
import { useState } from 'react';

export default () => {
	const [record, setRecord] = useState<SinhVien.ITienTrinhTotNghiep>();
	const [recordChungChi, setRecordChungChi] = useState<ChuongTrinhDaoTao.IChungChiCTDT>();
	const [dieuKienTotNghiep, setDieuKienTotNghiep] = useState<SinhVien.TDieuKienTotNghiep>();
	const [loading, setLoading] = useState<boolean>(false);
	const [trangthaiNo, setTrangThaiNo] = useState<SinhVien.ISinhVienNoNghiaVu>();
	const [visibleForm, setVisibleForm] = useState<boolean>(false);

	const getTienTrinhChungChiCTDTModel = async (): Promise<SinhVien.ITienTrinhTotNghiep> => {
		setLoading(true);
		try {
			const response = await getTienTrinhDauRa();
			const temp: SinhVien.ITienTrinhTotNghiep = response?.data?.data;

			const isDuDieuKienTBC = (temp?.kqhtHocKy?.trungBinhTichLuyToanKhoaThang4 ?? 0) > (temp?.diemTichLuyToiThieu ?? 0);
			const phanTramTinChi = Math.round(
				((temp?.kqhtHocKy?.tongSoTinChiTichLuyToanKhoa ?? 0) / (temp?.ctdtKeHoach?.tongSoTinChi ?? 100)) * 100,
			);
			const isDuDieuKienChungChi = record?.thongTinCdr?.every((item) => item.datChuanDauRa) ?? false;
			setDieuKienTotNghiep({
				isDuDieuKienChungChi,
				isDuDieuKienTBC,
				phanTramTinChi,
				isDuKieuKien: isDuDieuKienChungChi && isDuDieuKienTBC && phanTramTinChi === 100,
			});

			setRecord(temp);
			return temp;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	const getTrangThaiNoModel = async (dotXetTotNghiepId: string): Promise<SinhVien.ISinhVienNoNghiaVu> => {
		setLoading(true);
		try {
			const response = await getTrangThaiNoSinhVienMe(dotXetTotNghiepId);
			setTrangThaiNo(response?.data?.data);

			return response?.data?.data;
		} catch (er) {
			return Promise.reject(er);
		} finally {
			setLoading(false);
		}
	};

	return {
		record,
		setRecord,
		recordChungChi,
		setRecordChungChi,
		loading,
		setLoading,
		visibleForm,
		setVisibleForm,
		dieuKienTotNghiep,
		setDieuKienTotNghiep,
		getTienTrinhChungChiCTDTModel,
		getTrangThaiNoModel,
		trangthaiNo,
	};
};
