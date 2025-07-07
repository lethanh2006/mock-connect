import { EPhanLoaiTrongFormDanhGia } from "@/services/DiemRenLuyenV2/PhieuDiemRenLuyen/constants";


export const getPhanLoaiValue = (tongDiem: number) => {
	if (tongDiem >= 90) {
		return EPhanLoaiTrongFormDanhGia.XUAT_SAC;
	}
	if (tongDiem >= 80 && tongDiem < 90) {
		return EPhanLoaiTrongFormDanhGia.TOT_A;
	}
	if (tongDiem >= 70 && tongDiem < 80) {
		return EPhanLoaiTrongFormDanhGia.TOT_B;
	}
	if (tongDiem >= 50 && tongDiem < 70) {
		return EPhanLoaiTrongFormDanhGia.HOAN_THANH;
	}
	return EPhanLoaiTrongFormDanhGia.KHONG_HOAN_THANH;
};
