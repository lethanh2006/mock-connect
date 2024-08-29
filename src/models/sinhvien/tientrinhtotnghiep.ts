import { getTienTrinhDauRa, getTrangThaiNoSinhVienMe } from '@/services/DaoTao/SinhVien';
import type { SinhVien } from '@/services/DaoTao/SinhVien/typings';
import { useState } from 'react';

export default () => {
	const [record, setRecord] = useState<SinhVien.ITienTrinhTotNghiep>();
	const [recordChungChi, setRecordChungChi] = useState<SinhVien.TChungChiDauRaSv>();
	const [dieuKienTotNghiep, setDieuKienTotNghiep] = useState<SinhVien.TDieuKienTotNghiep>();
	const [loading, setLoading] = useState<boolean>(false);
	const [visibleForm, setVisibleForm] = useState<boolean>(false);

	const getTienTrinhTotNghiepModel = async (
		maKhoaNganh: string,
		dotXetTotNghiepId?: string,
	): Promise<SinhVien.ITienTrinhTotNghiep> => {
		setLoading(true);
		try {
			// Get tiến trình tốt nghiệp
			const response = await getTienTrinhDauRa(maKhoaNganh);
			const temp: SinhVien.ITienTrinhTotNghiep = response?.data?.data;
			// Get sinh viên nợ nghĩa vụ
			let sinhVienNo: SinhVien.ISinhVienNoNghiaVu | undefined;
			if (dotXetTotNghiepId) sinhVienNo = (await getTrangThaiNoSinhVienMe(dotXetTotNghiepId)).data?.data;

			const isDuDieuKienTBC =
				(temp?.kqhtHocKy?.trungBinhTichLuyToanKhoaThang4 ?? 0) >= (temp?.diemTichLuyToiThieu ?? 0);
			const phanTramTinChi = Math.round(
				((temp?.kqhtHocKy?.tongSoTinChiTichLuyToanKhoa ?? 0) / (temp?.ctdtKeHoach?.tongSoTinChi ?? 100)) * 100,
			);
			const isDuDieuKienChungChi = record?.thongTinCdr?.every((item) => item.datChuanDauRa) ?? true;
			setDieuKienTotNghiep({
				isDuDieuKienChungChi,
				isDuDieuKienTBC,
				phanTramTinChi,
				noTaiChinh: sinhVienNo?.noTaiChinh,
				noThuVien: sinhVienNo?.noThuVien,
				isDuKieuKien:
					isDuDieuKienChungChi &&
					isDuDieuKienTBC &&
					phanTramTinChi >= 100 &&
					sinhVienNo?.noTaiChinh !== true &&
					sinhVienNo?.noThuVien !== true,
			});

			setRecord(temp);
			return temp;
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
		getTienTrinhTotNghiepModel,
	};
};
