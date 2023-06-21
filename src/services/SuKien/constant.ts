export enum ELoaiDoiTuongSuKien {
  TAT_CA = 'Tất cả',
  VAI_TRO = 'Vai trò',
  LOP_TIN_CHI = 'Lớp tín chỉ',
  LOP_HANH_CHINH = 'Lớp hành chính',
  NGANH = 'Ngành',
  DON_VI = 'Đơn vị',
  KHOA = 'Khóa',
  NGUOI_DUNG_CU_THE = 'Người dùng cụ thể',
}

export enum EKieuLapSuKien {
  Ngay,
  Tuan,
  Thang,
  Nam,
}

export const TenKieuLapSuKien = {
  [EKieuLapSuKien.Ngay]: 'Lặp theo ngày',
  [EKieuLapSuKien.Tuan]: 'Lặp theo tuần',
  [EKieuLapSuKien.Thang]: 'Lặp theo tháng',
  [EKieuLapSuKien.Nam]: 'Lặp theo năm',
};

export enum ELoaiDoiTuong {
  TAT_CA = 'Tất cả',
  VAI_TRO = 'Vai trò',
  LOP_TIN_CHI = 'Lớp tín chỉ',
  LOP_HANH_CHINH = 'Lớp hành chính',
  NGANH = 'Ngành',
  // DON_VI = 'Đơn vị',
  KHOA = 'Khóa',
  NGUOI_DUNG_CU_THE = 'Người dùng cụ thể',
}

export enum ELoaiSuKien {
  LICH_GIANG_DAY = 'Lịch giảng dạy',
  LICH_HOC = 'Lịch học',
  LICH_THI = 'Lịch thi',
  CA_NHAN = 'Cá nhân',
  TAT_CA = 'Tất cả',
  CHUNG = 'Chung',
}

export const ColorSuKien = {
  [ELoaiSuKien.LICH_GIANG_DAY]: 'rgba(49, 190, 203, 0.7)',
  [ELoaiSuKien.LICH_HOC]: 'rgba(49, 190, 203, 0.7)',
  [ELoaiSuKien.LICH_THI]: 'rgba(223, 68, 113, 0.7)',
  [ELoaiSuKien.CA_NHAN]: 'rgba(87, 191, 86, 0.7)',
  [ELoaiSuKien.TAT_CA]: 'rgba(32, 152, 199, 0.7)',
  [ELoaiSuKien.CHUNG]: 'rgba(32, 152, 199, 0.7)',
};
