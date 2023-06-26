export enum ELoaiDauDiemHocPhan {
  HOC_PHAN_THUONG = 'hoc_phan_thuong',
  TIENG_ANH_A_B = 'tieng_anh_a_b',
  TIENG_ANH_COURSE = 'tieng_anh_course',
}

export enum ELoaiHinhHocTap {
  LY_THUYET = 'Lý thuyết',
  THUC_HANH = 'Thực hành',
  THI_NGHIEM = 'Thí nghiệm',
  DO_AN = 'Đồ án tốt nghiệp',
  BAI_TAP = 'Bài tập',
  BAI_TAP_LON = 'Bài tập lớn',
}

export enum ELoaiLopHocPhan {
  CHINH = 'C',
  LY_THUYET = 'LT',
  THUC_HANH = 'TH',
  THI_NGHIEM = 'TN',
  BAI_TAP = 'BT',
  BAI_TAP_LOP = 'BTL',
  DO_AN_TOT_NGHIEP = 'DATN',
}

export const ETenLoaiLopHocPhan = {
  [ELoaiLopHocPhan.CHINH]: 'Lớp học phần',
  [ELoaiLopHocPhan.LY_THUYET]: 'Lớp lý thuyết',
  [ELoaiLopHocPhan.THUC_HANH]: 'Lớp thực hành',
  [ELoaiLopHocPhan.THI_NGHIEM]: 'Lớp thí nghiệm',
  [ELoaiLopHocPhan.BAI_TAP]: 'Lớp bài tập',
  [ELoaiLopHocPhan.BAI_TAP_LOP]: 'Lớp bài tập lớn',
  [ELoaiLopHocPhan.DO_AN_TOT_NGHIEP]: 'Lớp đồ án tốt nghiệp',
};

export enum ETrangThaiDangKyGiangDay {
  CHAP_NHAN = 'Chấp nhận',
  TU_CHOI = 'Từ chối',
  DANG_XU_LY = 'Đang xử lý',
  CHUA_DANG_KY = 'Chưa đăng ký',
  DA_XU_LY_XONG = 'Đã xử lý xong',
  CHUA_CO_DANG_KY = 'Chưa có đăng ký',
}
