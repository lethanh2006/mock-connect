import { ETagColor } from '../base/constant';

export enum ETrangThaiKqht {
	NOT_STARTED = 'not-started',
	IN_PROGRESS = 'in-progress',
	COMPLETED = 'completed',
}

export const trangThaiKqht: Record<ETrangThaiKqht, string> = {
	[ETrangThaiKqht.NOT_STARTED]: 'Chưa bắt đầu',
	[ETrangThaiKqht.IN_PROGRESS]: 'Đang thực hiện',
	[ETrangThaiKqht.COMPLETED]: 'Hoàn thành',
};

export const colorTrangThaiKqht: Record<ETrangThaiKqht, ETagColor> = {
	[ETrangThaiKqht.NOT_STARTED]: ETagColor.DEFAULT,
	[ETrangThaiKqht.IN_PROGRESS]: ETagColor.BLUE,
	[ETrangThaiKqht.COMPLETED]: ETagColor.GREEN,
};

export enum ELoaiNhuCauHocPhan {
	KHHT_CHUAN = 'Theo kế hoạch học tập chuẩn',
	NGOAI_CT = 'Ngoài chương trình đào tạo',
	HOC_LAI = 'Học lại',
	HOC_CAI_THIEN = 'Học cải thiện',
	HOC_VUOT = 'Học vượt',
	HOC_VB2 = 'Học văn bằng 2',
}

export enum ELoaiHocPhanCTDT {
	BAT_BUOC = 'Bắt buộc',
	TU_CHON = 'Tự chọn',
	TOT_NGHIEP = 'Tốt nghiệp',
}

export const LoaiHocPhanCTDT: Record<ELoaiHocPhanCTDT, string> = {
	[ELoaiHocPhanCTDT.BAT_BUOC]: 'tientrinhhoctap.ctdt.loaiHocPhan.batBuoc',
	[ELoaiHocPhanCTDT.TU_CHON]: 'tientrinhhoctap.ctdt.loaiHocPhan.tuChon',
	[ELoaiHocPhanCTDT.TOT_NGHIEP]: 'tientrinhhoctap.ctdt.loaiHocPhan.totNghiep',
};

// Trạng thái học tập trong tiến trình học tập
export enum ETrangThaiHocTap {
	CHUA_HOC = 'CHUA_HOC',
	DANG_HOC = 'DANG_HOC',
	DA_HOC = 'DA_DAT',
	CHUA_DAT = 'CHUA_DAT',
}

export enum ETrangThaiDonNghiHoc {
	CHO_DUYET = 'cho_duyet',
	DA_DUYET = 'da_duyet',
	TU_CHOI = 'tu_choi',
	DA_HUY = 'da_huy',
}

export const trangThaiHocTap: Record<ETrangThaiHocTap, string> = {
	[ETrangThaiHocTap.CHUA_HOC]: 'daotao.trangthaihoctap.chuaHoc',
	[ETrangThaiHocTap.DANG_HOC]: 'daotao.trangthaihoctap.dangHoc',
	[ETrangThaiHocTap.DA_HOC]: 'daotao.trangthaihoctap.daHoc',
	[ETrangThaiHocTap.CHUA_DAT]: 'daotao.trangthaihoctap.chuaDat',
};

export const colorTrangThaiHocTap: Record<ETrangThaiHocTap, ETagColor> = {
	[ETrangThaiHocTap.CHUA_HOC]: ETagColor.DEFAULT,
	[ETrangThaiHocTap.DANG_HOC]: ETagColor.BLUE,
	[ETrangThaiHocTap.DA_HOC]: ETagColor.GREEN,
	[ETrangThaiHocTap.CHUA_DAT]: ETagColor.RED,
};

export enum EGioiTinh {
	Nam = 'Nam',
	Nu = 'Nữ',
}

export const genderMessageIds: Partial<Record<EGioiTinh, string>> = {
	[EGioiTinh.Nam]: 'thongtincanhan.hoso.enum.gioitinh.nam',
	[EGioiTinh.Nu]: 'thongtincanhan.hoso.enum.gioitinh.nu',
};

export enum EPhuongThucTinhDiem {
	DAT = 'Đạt',
	BAC = 'Theo bậc',
	DIEM = 'Tính điểm',
}

export enum ETrangThaiHocSv {
	CHUA_PHAN_LOP = 'Chưa phân lớp',
	DANG_HOC = 'Đang học',
	BAO_LUU = 'Bảo lưu',
	DA_TOT_NGHIEP = 'Đã tốt nghiệp',
	THOI_HOC = 'Thôi học',
	BUOC_THOI_HOC = 'Buộc thôi học',
	CHUYEN_TRUONG = 'Chuyển trường',
}

export const colorTrangThaiHocSv: Record<ETrangThaiHocSv, string> = {
	[ETrangThaiHocSv.CHUA_PHAN_LOP]: 'geekblue',
	[ETrangThaiHocSv.DANG_HOC]: 'blue',
	[ETrangThaiHocSv.BAO_LUU]: 'orange',
	[ETrangThaiHocSv.DA_TOT_NGHIEP]: 'green',
	[ETrangThaiHocSv.THOI_HOC]: 'red',
	[ETrangThaiHocSv.BUOC_THOI_HOC]: 'purple',
	[ETrangThaiHocSv.CHUYEN_TRUONG]: 'volcano',
};

export const trangThaiHocSv: Partial<Record<ETrangThaiHocSv, string>> = {
	[ETrangThaiHocSv.CHUA_PHAN_LOP]: 'thongtincanhan.hoso.enum.trangthaihoc.chuaPhanLop',
	[ETrangThaiHocSv.DANG_HOC]: 'thongtincanhan.hoso.enum.trangthaihoc.dangHoc',
	[ETrangThaiHocSv.BAO_LUU]: 'thongtincanhan.hoso.enum.trangthaihoc.baoLuu',
	[ETrangThaiHocSv.DA_TOT_NGHIEP]: 'thongtincanhan.hoso.enum.trangthaihoc.daTotNghiep',
	[ETrangThaiHocSv.THOI_HOC]: 'thongtincanhan.hoso.enum.trangthaihoc.thoiHoc',
	[ETrangThaiHocSv.BUOC_THOI_HOC]: 'thongtincanhan.hoso.enum.trangthaihoc.buocThoiHoc',
	[ETrangThaiHocSv.CHUYEN_TRUONG]: 'thongtincanhan.hoso.enum.trangthaihoc.chuyenTruong',
};

// Điểm danh lớp

export enum ETrangThaiLopDiemDanh {
	CHUA_DIEM_DANH = 'CHUA_DIEM_DANH',
	DA_DIEM_DANH = 'DA_DIEM_DANH',
}

export const trangThaiLopDiemDanh: Record<ETrangThaiLopDiemDanh, string> = {
	[ETrangThaiLopDiemDanh.CHUA_DIEM_DANH]: 'Chưa điểm danh',
	[ETrangThaiLopDiemDanh.DA_DIEM_DANH]: 'Đã điểm danh',
};

export const colorTrangThaiLopDiemDanh: Record<ETrangThaiLopDiemDanh, string> = {
	[ETrangThaiLopDiemDanh.CHUA_DIEM_DANH]: 'red',
	[ETrangThaiLopDiemDanh.DA_DIEM_DANH]: 'green',
};

// Trạng thái điểm danh sinh viên

export enum ETrangThaiUserDiemDanh {
	CO_MAT = 'CO_MAT',
	MUON_VE_SOM = 'MUON_VE_SOM',
	VANG_CO_PHEP = 'VANG_CO_PHEP',
	VANG_KHONG_PHEP = 'VANG_KHONG_PHEP',
	CHUA_DIEM_DANH = 'CHUA_DIEM_DANH',
}

export const trangThaiUserDiemDanh: Record<ETrangThaiUserDiemDanh, string> = {
	[ETrangThaiUserDiemDanh.CO_MAT]: 'Có mặt',
	[ETrangThaiUserDiemDanh.MUON_VE_SOM]: 'Muộn/Về sớm',
	[ETrangThaiUserDiemDanh.VANG_CO_PHEP]: 'Vắng có phép',
	[ETrangThaiUserDiemDanh.VANG_KHONG_PHEP]: 'Vắng không phép',
	[ETrangThaiUserDiemDanh.CHUA_DIEM_DANH]: 'Chưa điểm danh',
};

export const mapTrangThaiUserDiemDanhI18n: Record<ETrangThaiUserDiemDanh, string> = {
	[ETrangThaiUserDiemDanh.CO_MAT]: 'lophocphan.diemdanh.comat',
	[ETrangThaiUserDiemDanh.MUON_VE_SOM]: 'lophocphan.diemdanh.muonvesom',
	[ETrangThaiUserDiemDanh.VANG_CO_PHEP]: 'lophocphan.diemdanh.vangcophep',
	[ETrangThaiUserDiemDanh.VANG_KHONG_PHEP]: 'lophocphan.diemdanh.vangkhongphep',
	[ETrangThaiUserDiemDanh.CHUA_DIEM_DANH]: 'lophocphan.diemdanh.chuadiemdanh',
};

export const colorTrangThaiUserDiemDanh: Record<ETrangThaiUserDiemDanh, string> = {
	[ETrangThaiUserDiemDanh.CO_MAT]: 'green',
	[ETrangThaiUserDiemDanh.MUON_VE_SOM]: 'blue',
	[ETrangThaiUserDiemDanh.VANG_CO_PHEP]: 'gold',
	[ETrangThaiUserDiemDanh.VANG_KHONG_PHEP]: 'orange',
	[ETrangThaiUserDiemDanh.CHUA_DIEM_DANH]: 'red',
};

// CHƯƠNG TRÌNH ĐÀO TẠO
export enum ELoaiChuongTrinhDaoTao {
	CHUAN = 'Chuan',
	KE_HOACH = 'KeHoach',
	CA_NHAN = 'CaNhan',
}

export const LoaiChuongTrinhDaoTao: Record<ELoaiChuongTrinhDaoTao, string> = {
	[ELoaiChuongTrinhDaoTao.CHUAN]: 'daotao.loaichuongtrinh.chuan',
	[ELoaiChuongTrinhDaoTao.KE_HOACH]: 'daotao.loaichuongtrinh.keHoach',
	[ELoaiChuongTrinhDaoTao.CA_NHAN]: 'daotao.loaichuongtrinh.caNhan',
};

//Đăng ký nhu cầu
export enum ETrangThaiHocPhanDangKyNhuCau {
	CHO_DUYET = 'CHO_DUYET',
	DA_DUYET = 'DA_DUYET',
	KHONG_DUYET = 'KHONG_DUYET',
	DA_PHAN_LOP = 'DA_PHAN_LOP',
}

export const mapTrangThaiHocPhanDangKyNhuCau: Record<ETrangThaiHocPhanDangKyNhuCau, string> = {
	[ETrangThaiHocPhanDangKyNhuCau.CHO_DUYET]: 'dangkyhoctap.status.choDuyet',
	[ETrangThaiHocPhanDangKyNhuCau.DA_DUYET]: 'dangkyhoctap.status.daDuyet',
	[ETrangThaiHocPhanDangKyNhuCau.KHONG_DUYET]: 'dangkyhoctap.status.khongDuyet',
	[ETrangThaiHocPhanDangKyNhuCau.DA_PHAN_LOP]: 'dangkyhoctap.status.daPhanLop',
};

export const colorTrangThaiHocPhanDangKyNhuCau: Record<ETrangThaiHocPhanDangKyNhuCau, string> = {
	[ETrangThaiHocPhanDangKyNhuCau.CHO_DUYET]: 'blue',
	[ETrangThaiHocPhanDangKyNhuCau.DA_DUYET]: 'orange',
	[ETrangThaiHocPhanDangKyNhuCau.KHONG_DUYET]: 'red',
	[ETrangThaiHocPhanDangKyNhuCau.DA_PHAN_LOP]: 'green',
};

export const TrangThaiDonNghiHoc: Record<ETrangThaiDonNghiHoc, { text: string; color: string }> = {
	[ETrangThaiDonNghiHoc.CHO_DUYET]: { text: 'Chờ duyệt', color: 'orange' },
	[ETrangThaiDonNghiHoc.DA_DUYET]: { text: 'Đã duyệt', color: 'green' },
	[ETrangThaiDonNghiHoc.TU_CHOI]: { text: 'Từ chối', color: 'red' },
	[ETrangThaiDonNghiHoc.DA_HUY]: { text: 'Đã hủy', color: 'gray' },
};
