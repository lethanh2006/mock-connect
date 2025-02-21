export enum EBuoiRaVaoThuVien {
	SANG = 'Sáng',
	CHIEU = 'Chiều',
	TOT = 'Tối',
}

export enum EThuTrongTuan {
	THU_HAI = '1',
	THU_BA = '2',
	THU_TU = '3',
	THU_NAM = '4',
	THU_SAU = '5',
	THU_BAY = '6',
	CHU_NHAT = '7',
}

export const mapNameThuTrongTuan: Record<EThuTrongTuan, string> = {
	[EThuTrongTuan.THU_HAI]: 'Thứ hai',
	[EThuTrongTuan.THU_BA]: 'Thứ ba',
	[EThuTrongTuan.THU_TU]: 'Thứ tư',
	[EThuTrongTuan.THU_NAM]: 'Thứ năm',
	[EThuTrongTuan.THU_SAU]: 'Thứ sáu',
	[EThuTrongTuan.THU_BAY]: 'Thứ bảy',
	[EThuTrongTuan.CHU_NHAT]: 'Chủ nhật',
};

export enum ELoaiDotQuanLyThuvien {
	LUAN_AN = 'Luận án',
	KHOA_LUAN = 'Khoá luận/Đồ án',
	LUAN_VAN = 'Luận văn',
}

export enum ETrangThaiNopThuVien {
	CHO_XY_LY = 'Chờ xử lý',
	DA_DUYET = 'Đã duyệt',
	TU_CHOI = 'Từ chối',
	CHUA_NOP = 'Chưa nộp',
}

export const colorTrangThaiNopThuVien: Record<ETrangThaiNopThuVien, string> = {
	[ETrangThaiNopThuVien.CHO_XY_LY]: 'blue',
	[ETrangThaiNopThuVien.DA_DUYET]: 'green',
	[ETrangThaiNopThuVien.TU_CHOI]: 'red',
	[ETrangThaiNopThuVien.CHUA_NOP]: 'orange',
};

export enum ETrangThaiMuonSach {
	// CHO_XU_LY = 'Chờ xử lý',
	DANG_THUE_MUON = 'Đang thuê mượn',
	DA_TRA = 'Đã trả',
	// KHONG_CHO_THUE_MUON = 'Không cho thuê mượn',
}

export const colorTrangThaiMuonSach: Record<ETrangThaiMuonSach, string> = {
	[ETrangThaiMuonSach.DANG_THUE_MUON]: 'blue',
	// [ETrangThaiMuonSach.CHO_XU_LY]: 'orange',
	[ETrangThaiMuonSach.DA_TRA]: 'green',
	// [ETrangThaiMuonSach.KHONG_CHO_THUE_MUON]: 'red',
};

export const mapNameTrangThaiMuonSach: Record<ETrangThaiMuonSach, string> = {
	// [ETrangThaiMuonSach.CHO_XU_LY]: 'Chờ xử lý',
	[ETrangThaiMuonSach.DANG_THUE_MUON]: 'Đang mượn',
	[ETrangThaiMuonSach.DA_TRA]: 'Đã trả',
	// [ETrangThaiMuonSach.KHONG_CHO_THUE_MUON]: 'red',
};

export enum ETrangThaiDuyetMuonSach {
	CHO_DUYET = 'Chờ duyệt',
	DA_DUYET = 'Đã duyệt',
	KHONG_DUYET = 'Không duyệt',
}

export const colorTrangThaiDuyeMuonSach: Record<ETrangThaiDuyetMuonSach, string> = {
	[ETrangThaiDuyetMuonSach.CHO_DUYET]: 'blue',
	[ETrangThaiDuyetMuonSach.DA_DUYET]: 'green',
	[ETrangThaiDuyetMuonSach.KHONG_DUYET]: 'red',
};
