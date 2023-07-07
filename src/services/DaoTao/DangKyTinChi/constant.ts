export enum ELoaiHocPhanDangKyTinChi {
  TAT_CA = 'Tất cả học phần',
  TIEN_TRINH = 'Theo đúng tiến trình',
  NHU_CAU = 'Theo nhu cầu',
  HOC_LAI = 'Học lại',
  HOC_VUOT = 'Học vượt',
  CAI_THIEN = 'Học cải thiện',
  NGANH_2 = 'Học ngành 2',
  HOC_NGOAI = 'Học ngoài CTĐT',
}

export const LoaiHocPhanDangKyTinChi = {
  [ELoaiHocPhanDangKyTinChi.TAT_CA]: 'Tất cả học phần',
  [ELoaiHocPhanDangKyTinChi.TIEN_TRINH]: 'Theo đúng tiến trình',
  [ELoaiHocPhanDangKyTinChi.NHU_CAU]: 'Theo nhu cầu',
  [ELoaiHocPhanDangKyTinChi.HOC_LAI]: 'Học lại',
  [ELoaiHocPhanDangKyTinChi.HOC_VUOT]: 'Học vượt',
  [ELoaiHocPhanDangKyTinChi.CAI_THIEN]: 'Học cải thiện',
  [ELoaiHocPhanDangKyTinChi.NGANH_2]: 'Học ngành 2',
  [ELoaiHocPhanDangKyTinChi.HOC_NGOAI]: 'Học ngoài CTĐT',
};

export enum ELoaiDangKyTinChi {
  DK_LAN_DAU = 'Đăng ký lần đầu',
  HOC_LAI = 'Học lại',
  HOC_VUOT = 'Học vượt',
  CAI_THIEN = 'Học cải thiện',
  NGANH_2 = 'Học ngành 2',
  HOC_NGOAI = 'Học ngoài CTĐT',
}

export enum EColorLopDangKy {
  TRUNG_LICH = 'rgba(255, 223, 140, 0.5)',
  FULL_LOP = 'rgba(255, 122, 0, 0.5)',
  KHONG_DU_DK = 'rgba(255, 104, 104, 0.5)',
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
