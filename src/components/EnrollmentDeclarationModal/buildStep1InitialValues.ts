import type { SinhVien } from '@/services/DaoTao/SinhVien/typings';

const buildDiaChiInitialValues = (diaChi: SinhVien.TDiaChi | undefined, suffix: string): Record<string, any> => ({
	[`tinhTp${suffix}`]: diaChi?.tenTP,
	[`maTinhTp${suffix}`]: diaChi?.maTP,
	[`xaPhuong${suffix}`]: diaChi?.tenXaPhuong,
	[`maXaPhuong${suffix}`]: diaChi?.maXaPhuong,
	[`soNhaTenDuong${suffix}`]: diaChi?.diaChi,
});

/**
 * Inverse of `buildStep1Payload` — maps the saved student profile (core `SinhVien.IRecord` fields
 * plus the enrollment-only `hoSoNhapHoc` fields) back into the step 1 form's field names.
 */
export const buildStep1InitialValues = (sinhVien?: SinhVien.IRecord): Record<string, any> => {
	if (!sinhVien) return {};

	const hoSoNhapHoc = sinhVien.hoSoNhapHoc;
	const hoKhauThuongTru = sinhVien.hoKhauThuongTru as SinhVien.TDiaChi | undefined;

	const documentAttachments = (hoSoNhapHoc?.danhSachGiayToNhapHoc ?? []).reduce<Record<string, any>>((acc, item) => {
		if (item.id) acc[`document_${item.id}`] = item.urlFile;
		return acc;
	}, {});

	return {
		firstName: sinhVien.firstName,
		middleName: sinhVien.middleName,
		lastName: sinhVien.lastName,
		dob: sinhVien.ngaySinh,
		gender: sinhVien.gioiTinh,
		phoneCountryCode: sinhVien.maVungDienThoai,
		phoneNumber: sinhVien.soDienThoai,
		nationalIdNumber: sinhVien.cccd,
		issueDate: sinhVien.ngayCapCccd,
		placeOfIssue: sinhVien.noiCapCccd,
		vinuniAccount: sinhVien.email,
		nationality: sinhVien.quocTich,
		maQuocTich: sinhVien.maQuocTich,
		ethnicity: sinhVien.danToc,
		religion: sinhVien.tonGiao,
		tinhTpNoiSinh: sinhVien.tinhTpNoiSinh,
		maTinhTpNoiSinh: sinhVien.maTinhTpNoiSinh,
		...buildDiaChiInitialValues(sinhVien.noiOHienTai, 'KhaiBao'),
		...buildDiaChiInitialValues(hoKhauThuongTru, 'ThuongTru'),
		bank: sinhVien.tenNganHang,
		bankAccountNumber: sinhVien.soTaiKhoanNganHang,
		bankBranch: sinhVien.chiNhanhNganHang,
		accountHolderName: hoSoNhapHoc?.chuTaiKhoanNganHang,
		height: sinhVien.chieuCao,
		weight: sinhVien.canNang,
		disabilityType: sinhVien.maLoaiKhuyetTat ?? sinhVien.loaiKhuyetTat,
		medicalNotes: sinhVien.ghiChuYTe,
		postalCode: hoSoNhapHoc?.maBuuChinh,
		bloodType: hoSoNhapHoc?.nhomMau,
		...(hoSoNhapHoc?.coVanDeSucKhoe !== undefined ? { hasHealthProblem: hoSoNhapHoc.coVanDeSucKhoe } : {}),
		healthProblemAttachment: hoSoNhapHoc?.urlDinhKemVanDeSucKhoe,
		isRegisterFreeDormitory: hoSoNhapHoc?.isRegisterFreeDormitory,
		frontIdCard: hoSoNhapHoc?.urlMatTruocCccd,
		backIdCard: hoSoNhapHoc?.urlMatSauCccd,
		...documentAttachments,
		passportNumber: hoSoNhapHoc?.soHoChieu,
		passportAttachment: hoSoNhapHoc?.urlDinhKemHoChieu,
		visaType: hoSoNhapHoc?.visa?.loaiVisa,
		visaIssueDate: hoSoNhapHoc?.visa?.ngayCap,
		visaExpiryDate: hoSoNhapHoc?.visa?.ngayHetHan,
		visaIssuingAuthority: hoSoNhapHoc?.visa?.coQuanCap,
		visaPlaceOfIssue: hoSoNhapHoc?.visa?.noiCap,
		firstGenStudent: hoSoNhapHoc?.firstGenStudent,
		adjustmentNeeds: hoSoNhapHoc?.adjustmentNeeds,
		adjustmentOthersText: hoSoNhapHoc?.adjustmentOthersText,
	};
};
