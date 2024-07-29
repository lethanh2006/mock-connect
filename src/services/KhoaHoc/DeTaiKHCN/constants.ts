export enum EChucVuHoiDong {
	CHU_TICH = 'Chủ tịch',
	THU_KY = 'Thư ký',
	UY_VIEN = 'Ủy viên',
	PHAN_BIEN_1 = 'Phản biện 1',
	PHAN_BIEN_2 = 'Phản biện 2',
}

export enum ETrangThaiDiemDanh {
	CO_MAT = 'Có mặt',
	VANG_CO_PHEP = 'Vắng có phép',
	VANG_KHONG_PHEP = 'Vắng không phép',
	MIEN = 'Miễn',
}

export enum EVaiTroDeTai {
	DONG_CHU_NHIEM = 'Đồng chủ nhiệm',
	PHO_CHU_NHIEM = 'Phó chủ nhiệm',
	THU_KY = 'Thư ký',
	THANH_VIEN = 'Thành viên',
	KY_THUAT_VIEN = 'Kỹ thuật viên',
}

export enum EMenhGia {
	VND = 'VNĐ',
	EUR = 'EUR',
	USD = 'USD',
}

export enum ETrangThaiNopDeCuong {
	CHUA_TIEP_NHAN = 'Chưa tiếp nhận',
	DUOC_TIEP_NHAN = 'Được tiếp nhận',
	KHONG_TIEP_NHAN = 'Không được tiếp nhận',
	YEU_CAU_CHINH_SUA = 'Yêu cầu chỉnh sửa',
}

export enum ETrangThaiXetDuyetDeCuong {
	CHUA_DUYET = 'Chưa duyệt',
	DUYET = 'Duyệt',
	KHONG_DUYET = 'Không duyệt',
	YEU_CAU_CHINH_SUA = 'Yêu cầu chỉnh sửa',
}

export enum ETrangThaiNghiemThu {
	CHUA_DUYET = 'Chưa duyệt',
	YEU_CAU_CHINH_SUA = 'Yêu cầu chỉnh sửa',
	DUYET = 'Duyệt',
	KHONG_DUYET = 'Không duyệt',
}

export enum ETrangThaiNopNghiemThu {
	CHUA_TIEP_NHAN = 'Chưa tiếp nhận',
	DUOC_TIEP_NHAN = 'Được tiếp nhận',
	KHONG_TIEP_NHAN = 'Không được tiếp nhận',
	YEU_CAU_CHINH_SUA = 'Yêu cầu chỉnh sửa',
}

export enum ETrangThaiSauNghiemThu {
	DA_HOAN_THANH = 'Đã hoàn thành',
	CHUA_HOAN_THANH = 'Chưa hoàn thành',
}

export enum ETrangThaiThucHien {
	CHUA_TIEP_NHAN = 'Chưa tiếp nhận',
	YEU_CAU_CHINH_SUA = 'Yêu cầu chỉnh sửa',
	DUOC_TIEP_NHAN = 'Được tiếp nhận',
	KHONG_TIEP_NHAN = 'Không được tiếp nhận',
}

export enum EPhaseDeTaiKHCN {
	DANG_KY = 'Đăng ký',
	XET_DUYET_DANG_KY = 'Xét duyệt đăng ký',
	NOP_DE_CUONG = 'Nộp đề cương',
	XET_DUYET_DE_CUONG = 'Xét duyệt đề cương',
	THUC_HIEN = 'Thực hiện',
	NOP_NGHIEM_THU = 'Nộp nghiệm thu',
	NGHIEM_THU = 'Nghiệm thu',
	SAU_NGHIEM_THU = 'Sau nghiệm thu',
}

export const MapKeyNamePhaseDeTaiKHCN = {
	[EPhaseDeTaiKHCN.DANG_KY]: 'Đăng ký đề xuất đề tài',
	[EPhaseDeTaiKHCN.XET_DUYET_DANG_KY]: 'Hội đồng xét chọn đề xuất đề tài NCKH',
	[EPhaseDeTaiKHCN.NOP_DE_CUONG]: 'Xây dựng và nộp hồ sơ thuyết minh đề tài NCKH',
	[EPhaseDeTaiKHCN.XET_DUYET_DE_CUONG]: 'Hội đồng xét duyệt thuyết minh đề tài NCKH',
	[EPhaseDeTaiKHCN.THUC_HIEN]: 'Triển khai đề tài NCKH và báo cáo tiến độ',
	[EPhaseDeTaiKHCN.NOP_NGHIEM_THU]: 'Nộp hồ sơ nghiệm thu',
	[EPhaseDeTaiKHCN.NGHIEM_THU]: 'Hội đồng nghiệm thu đề tài NCKH',
	[EPhaseDeTaiKHCN.SAU_NGHIEM_THU]: 'Nộp hồ sơ sau nghiệm thu',
};

export enum EDangSanPham {
	DANG_SAN_PHAM_I = 'Dạng sản phẩm I',
	DANG_SAN_PHAM_II = 'Dạng sản phẩm II',
	DANG_SAN_PHAM_III = 'Dạng sản phẩm III',
}

export enum EMucDoDeTai {
	NC = 'Nghiên cứu - Phát triển',
	LAB = 'Đề tài Lab',
	TRONG_DIEM = 'Trọng điểm',
}

export const MapKeyDangSanPham = {
	[EDangSanPham.DANG_SAN_PHAM_I]: 'Dạng sản phẩm I (Mẫu sản phẩm; Vật liệu; Thiết bị, dụng cụ)',
	[EDangSanPham.DANG_SAN_PHAM_II]:
		'Dạng sản phẩm II (Quy trình công nghệ kỹ thuật; Phương pháp công nghệ; Quy trình, quy phạm, tiêu chuẩn, định mức)',
	[EDangSanPham.DANG_SAN_PHAM_III]:
		'Dạng sản phẩm III (Chương trình máy tính; Phương pháp, giải pháp; Đề án quy hoạch; Sơ đồ, bảng số liệu; Khác)',
};

export enum ETrangThaiGhiChuDuToanKinhPhi {
	NOI_BO = 'NOI_BO',
	CONG_KHAI = 'CONG_KHAI',
}

export enum ETrangThaiDuyetDuToan {
	DA_DUYET = 'DA_DUYET',
	CHO_DUYET = 'CHO_DUYET',
	YEU_CAU_CHINH_SUA = 'YEU_CAU_CHINH_SUA',
	KHONG_DUYET = 'KHONG_DUYET',
}

export enum ETrangThaiDeTaiQuanLyKhoaHoc {
	CHUA_TIEP_NHAN = 'Chưa tiếp nhận',
	YEU_CAU_CHINH_SUA = 'Yêu cầu chỉnh sửa',
	DUOC_TIEP_NHAN = 'Được tiếp nhận',
	KHONG_TIEP_NHAN = 'Không được tiếp nhận',
	CHUA_DUYET = 'Chưa duyệt',
	DUYET = 'Duyệt',
	KHONG_DUYET = 'Không duyệt',
	DA_HOAN_THANH = 'Đã hoàn thành',
	CHUA_HOAN_THANH = 'Chưa hoàn thành',
}

export const MapKeyColorTrangThaiDeTaiQuanLyKhoaHoc: any = {
	[ETrangThaiDeTaiQuanLyKhoaHoc.CHUA_TIEP_NHAN]: '#007bff',
	[ETrangThaiDeTaiQuanLyKhoaHoc.CHUA_DUYET]: '#007bff',
	[ETrangThaiDeTaiQuanLyKhoaHoc.DUOC_TIEP_NHAN]: '#28a745',
	[ETrangThaiDeTaiQuanLyKhoaHoc.DUYET]: '#28a745',
	[ETrangThaiDeTaiQuanLyKhoaHoc.YEU_CAU_CHINH_SUA]: '#ffc107',
	[ETrangThaiDeTaiQuanLyKhoaHoc.KHONG_TIEP_NHAN]: '#dc3545',
	[ETrangThaiDeTaiQuanLyKhoaHoc.KHONG_DUYET]: '#dc3545',
	[ETrangThaiDeTaiQuanLyKhoaHoc.DA_HOAN_THANH]: '#28a745',
	[ETrangThaiDeTaiQuanLyKhoaHoc.CHUA_HOAN_THANH]: '#dc3545',
};

export enum EThaoTacDeTai {
	TIEP_NHAN_DE_TAI = 'TIEP_NHAN_DE_TAI',
	CHUYEN_VIEN_CHINH_SUA_DE_TAI = 'CHUYEN_VIEN_CHINH_SUA_DE_TAI',
	GIANG_VIEN_CHINH_SUA_DE_TAI = 'GIANG_VIEN_CHINH_SUA_DE_TAI',
	GIANG_VIEN_THEM_MOI_DE_TAI = 'GIANG_VIEN_THEM_MOI_DE_TAI',
	XET_DUYET_DE_TAI = 'XET_DUYET_DE_TAI',
	TIEP_NHAN_DE_CUONG = 'TIEP_NHAN_DE_CUONG',
	TIEP_NHAN_THUC_HIEN = 'TIEP_NHAN_THUC_HIEN',
	CHUYEN_VIEN_CHINH_SUA_DE_CUONG = 'CHUYEN_VIEN_CHINH_SUA_DE_CUONG',
	CHUYEN_VIEN_CHINH_SUA_THUC_HIEN = 'CHUYEN_VIEN_CHINH_SUA_THUC_HIEN',
	GIANG_VIEN_CHINH_SUA_THUC_HIEN = 'GIANG_VIEN_CHINH_SUA_THUC_HIEN',
	GIANG_VIEN_CHINH_SUA_SAU_NGHIEM_THU = 'GIANG_VIEN_CHINH_SUA_SAU_NGHIEM_THU',
	GIANG_VIEN_CHINH_SUA_DE_CUONG = 'GIANG_VIEN_CHINH_SUA_DE_CUONG',
	XET_DUYET_DE_CUONG = 'XET_DUYET_DE_CUONG',
	XET_DUYET_NGHIEM_THU = 'XET_DUYET_NGHIEM_THU',
	CAP_NHAT_KET_QUA_HOP = '  CAP_NHAT_KET_QUA_HOP',
}

export enum ELoaiHoiDongKHCN {
	DANG_KY = 'Đăng ký',
	XET_DUYET = 'Xét duyệt',
	DE_CUONG = 'Đề cương',
	NGHIEM_THU = 'Nghiệm thu',
}

export enum ETrangThaiDangKy {
	CHUA_TIEP_NHAN = 'Chưa tiếp nhận',
	DUOC_TIEP_NHAN = 'Được tiếp nhận',
	KHONG_DUOC_TIEP_NHAN = 'Không được tiếp nhận',
	YEU_CAU_CHINH_SUA = 'Yêu cầu chỉnh sửa',
}

export enum ETrangThaiXetDuyetDangKy {
	CHUA_DUYET = 'Chưa duyệt',
	DUYET = 'Duyệt',
	KHONG_DUYET = 'Không duyệt',
	YEU_CAU_CHINH_SUA = 'Yêu cầu chỉnh sửa',
}

export enum ELoaiDeTaiCaNhan {
	CA_NHAN = 'Cá nhân',
	TAP_THE = 'Tập thể',
}

export enum ETypeTableDeTai {
	DangKyDeXuat = 'DangKyDeXuat',
	HoiDongXetChonDeXuat = 'HoiDongXetChonDeXuat',
	NopThuyetMinh = 'NopThuyetMinh',
	HoiDongXetDuyetThuyetMinh = 'HoiDongXetDuyetThuyetMinh',
	QuyetDinhGiao = 'QuyetDinhGiao',
	ThucHienDeTai = 'ThucHienDeTai',
	NopHoSoNghiemThu = 'NopHoSoNghiemThu',
	HoiDongNghiemThu = 'HoiDongNghiemThu',
	NopHoSoSauNghiemThu = 'NopHoSoSauNghiemThu',
}

export enum ELinhVucDeTai {
	TU_NHIEN = 'Tự nhiên',
	KHOA_HOC_XA_HOI = 'Khoa học xã hội và nhân văn',
	KY_THUAT_VA_CONG_NGHE = 'Kỹ thuật và công nghệ',
}

export enum ETrangThaiTienDo {
	DUNG_VOI_KE_HOACH = 'Đúng với kế hoạch',
	CHAM_VOI_KE_HOACH = 'Chậm với kế hoạch',
	CHUA_TRIEN_KHAI_HOAT_DONG = 'Chưa triển khai hoạt động',
}

export const arrKeyNameSanPhamNghiemThu = [
	{
		title: 'Sách chuyên khảo, sách tham khảo được cấp giấy phép xuất bản',
		field: 'sach',
	},
	{
		title: 'Bài báo đăng trên các tạp chí khoa học',
		field: 'baiBao',
	},
	{
		title: 'Báo cáo trình bày hoặc đăng trong kỷ yếu hội nghị, hội thảo khoa học trong nước và quốc tế',
		field: 'hoiThaoQuocTe',
	},
	{
		title: 'Báo cáo hoặc trưng bày, trình diễn sản phẩm tại hội nghị, hội thảo, seminar (xê-mi-na) từ cấp khoa trở lên',
		field: 'hoiThaoKhoa',
	},
	{
		title: 'Ứng dụng trong thực tiễn có xác nhận của tổ chức, đơn vị sử dụng sản phẩm của đề tài',
		field: 'ungDung',
	},
];
export const arrKeyNameSanPhamSauNghiemThu = [
	{
		title: 'Báo cáo tổng hợp kết quả nghiên cứu đề tài',
		field: 'baoCaoUrl',
		required: true,
	},
	{
		title: 'Bản giải trình tiếp thu ý kiến Hội đồng nghiệm thu',
		field: 'banGiaiTrinhUrl',
		required: true,
	},
	{
		title: 'Các công bố khoa học của đề tài (nếu có)',
		field: 'congBoKhoaHocUrl',
		required: false,
	},
	{
		title: 'Bản đề xuất ứng dụng kết quả ứng dụng KH&CN',
		field: 'banDeXuatUngDungUrl',
		required: true,
	},
	{
		title: 'Giấy xác nhận nhận tài liệu của viện CNTT',
		field: 'giayXacNhanUrl',
		required: false,
	},
];

export enum ExportType {
	WORD = 'word',
	PDF = 'pdf',
	XLSX = 'excel',
	ZIP = 'zip',
}

export enum ELoaiUngDungTrongHocVien {
	UNG_DUNG_DE_CUONG = 'Ứng dụng trong xây dựng/phát triển đề cương học phần',
	UNG_DUNG_SACH = 'Ứng dụng trong xây dựng/phát triển tập bài giảng, giáo trình, sách chuyên khảo và các xuất bản khác',
	UNG_DUNG_BAI_GIANG = 'Ứng dụng trong xây dựng/phát triển bài giảng',
	UNG_DUNG_KHCN = 'Ứng dụng trong chuyển giao sản phẩm KH&CN',
	UNG_DUNG_KHAC = 'Khác',
}

export const MapKeyNameLoaiUngDungTrongHocVien = {
	[ELoaiUngDungTrongHocVien.UNG_DUNG_DE_CUONG]: 'Ứng dụng trong xây dựng/phát triển đề cương học phần',
	[ELoaiUngDungTrongHocVien.UNG_DUNG_SACH]:
		'Ứng dụng trong xây dựng/phát triển tập bài giảng, giáo trình, sách chuyên khảo và các xuất bản khác',
	[ELoaiUngDungTrongHocVien.UNG_DUNG_BAI_GIANG]: 'Ứng dụng trong xây dựng/phát triển bài giảng',
	[ELoaiUngDungTrongHocVien.UNG_DUNG_KHCN]: 'Ứng dụng trong chuyển giao sản phẩm KH&CN',
	[ELoaiUngDungTrongHocVien.UNG_DUNG_KHAC]: 'Ứng dụng khác',
};

export const MapKeyColorTrangThaiTienDo = {
	[ETrangThaiTienDo.CHUA_TRIEN_KHAI_HOAT_DONG]: '#dc3545',
	[ETrangThaiTienDo.CHAM_VOI_KE_HOACH]: '#ffc107',
	[ETrangThaiTienDo.DUNG_VOI_KE_HOACH]: '#28a745',
};
