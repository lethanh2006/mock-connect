export enum ELoaiHocPhanDangKyTinChi {
  NHU_CAU = 'NhuCau',
  TIEN_TRINH = 'TienTrinh',
  HOC_LAI = 'HocLai',
  HOC_VUOT = 'HocVuot',
  CAI_THIEN = 'HocCaiThien',
  // NGANH_2 = 'kyTruoc',
  CHUA_THEO_TIEN_TRINH = 'ChuaTheoTienTrinh',
  HOC_NGOAI = 'NgoaiChuongTrinh',
  // TAT_CA = 'TatCa',
}

export const LoaiHocPhanDangKyTinChi = {
  [ELoaiHocPhanDangKyTinChi.NHU_CAU]: 'Theo nhu cầu',
  [ELoaiHocPhanDangKyTinChi.TIEN_TRINH]: 'Theo đúng tiến trình',
  [ELoaiHocPhanDangKyTinChi.HOC_LAI]: 'Học lại',
  [ELoaiHocPhanDangKyTinChi.HOC_VUOT]: 'Học vượt',
  [ELoaiHocPhanDangKyTinChi.CAI_THIEN]: 'Học cải thiện',
  // [ELoaiHocPhanDangKyTinChi.NGANH_2]: 'Học ngành 2',
  [ELoaiHocPhanDangKyTinChi.CHUA_THEO_TIEN_TRINH]: 'Chưa theo tiến trình',
  [ELoaiHocPhanDangKyTinChi.HOC_NGOAI]: 'Học ngoài CTĐT',
  // [ELoaiHocPhanDangKyTinChi.TAT_CA]: 'Tất cả học phần',
};

export enum ETrangThaiHocPhanDangKyTinChi {
  DUOC_DK = 'Được phép đăng ký',
  NO_TIEN_QUYET = 'Thiếu học phần tiên quyết',
  NO_HOC_TRUOC = 'Thiếu học phần học trước',
  NO_TIEN_QUYET_VA_HOC_TRUOC = 'Thiếu học phần tiên quyết và học phần học trước',
  NO_SONG_HANH = 'Thiếu học phần song hành',
  MIEN = 'Miễn',
}

export enum EColorLopDangKy {
  TRUNG_LICH = 'rgba(255, 223, 140, 0.3)',
  FULL_LOP = 'rgba(255, 122, 0, 0.3)',
  KHONG_DU_DK = 'rgba(255, 104, 104, 0.3)',
}

export enum ETrangThaiDangKyTinChi {
  CHUA_DANG_KY = 'Chưa đăng ký',
  DA_DANG_KY = 'Đã đăng ký',
  LOI = 'Lỗi',
}

export const ColorTrangThaiDangKyTinChi = {
  [ETrangThaiDangKyTinChi.CHUA_DANG_KY]: 'blue',
  [ETrangThaiDangKyTinChi.DA_DANG_KY]: 'green',
  [ETrangThaiDangKyTinChi.LOI]: 'red',
};
