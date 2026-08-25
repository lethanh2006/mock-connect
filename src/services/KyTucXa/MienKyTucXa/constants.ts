export enum ETrangThaiMinhChung {
	BAN_NHAP = 'Bản nháp',
	CHO_DUYET = 'Chờ duyệt',
	DA_DUYET = 'Đã duyệt',
	// Khớp FE ETrangThaiSinhVienMienKTX.REJECT - không phải "Từ chối" (đó là TrangThaiDuyet.TU_CHOI, khác field).
	TU_CHOI = 'Không duyệt',
	YEU_CAU_CHINH_SUA = 'Yêu cầu chỉnh sửa',
}

export const MienKyTucXaTrangThaiLabelIds: Record<ETrangThaiMinhChung, string> = {
	[ETrangThaiMinhChung.BAN_NHAP]: 'global.enrollmentDeclaration.additional.mienKtxStatus.banNhap',
	[ETrangThaiMinhChung.CHO_DUYET]: 'global.enrollmentDeclaration.additional.mienKtxStatus.choDuyet',
	[ETrangThaiMinhChung.DA_DUYET]: 'global.enrollmentDeclaration.additional.mienKtxStatus.daDuyet',
	[ETrangThaiMinhChung.TU_CHOI]: 'global.enrollmentDeclaration.additional.mienKtxStatus.tuChoi',
	[ETrangThaiMinhChung.YEU_CAU_CHINH_SUA]: 'global.enrollmentDeclaration.additional.mienKtxStatus.yeuCauChinhSua',
};

// Cùng pattern với ColorTrangThaiMinhChungDiemRenLuyen (DiemRenLuyen/MinhChung/constants.ts):
// map trạng thái -> màu, dùng rgb/hex trực tiếp (không phải tên màu preset của antd) để style
// luôn thắng qua inline style, không bị CSS module của Tag ghi đè.
export const MienKyTucXaTrangThaiColors: Record<ETrangThaiMinhChung, { color: string; background: string }> = {
	[ETrangThaiMinhChung.BAN_NHAP]: { color: '#8c8c8c', background: '#fafafa' },
	[ETrangThaiMinhChung.CHO_DUYET]: { color: '#b27400', background: '#fef8e7' },
	[ETrangThaiMinhChung.DA_DUYET]: { color: '#389e0d', background: '#f6ffed' },
	[ETrangThaiMinhChung.TU_CHOI]: { color: '#cf1322', background: '#fff1f0' },
	[ETrangThaiMinhChung.YEU_CAU_CHINH_SUA]: { color: '#d46b08', background: '#fff7e6' },
};
