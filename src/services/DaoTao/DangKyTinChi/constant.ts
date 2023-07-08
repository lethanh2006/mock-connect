export enum ELoaiHocPhanDangKyTinChi {
  NHU_CAU = 'Theo nhu cầu',
  TIEN_TRINH = 'kyHienTai',
  HOC_LAI = 'hocLai',
  HOC_VUOT = 'hocVuot',
  CAI_THIEN = 'hocCaiThien',
  NGANH_2 = 'Học ngành 2',
  HOC_NGOAI = 'Học ngoài CTĐT',
  TAT_CA = 'Tất cả học phần',
}

export const LoaiHocPhanDangKyTinChi = {
  [ELoaiHocPhanDangKyTinChi.NHU_CAU]: 'Theo nhu cầu',
  [ELoaiHocPhanDangKyTinChi.TIEN_TRINH]: 'Theo đúng tiến trình',
  [ELoaiHocPhanDangKyTinChi.HOC_LAI]: 'Học lại',
  [ELoaiHocPhanDangKyTinChi.HOC_VUOT]: 'Học vượt',
  [ELoaiHocPhanDangKyTinChi.CAI_THIEN]: 'Học cải thiện',
  [ELoaiHocPhanDangKyTinChi.NGANH_2]: 'Học ngành 2',
  [ELoaiHocPhanDangKyTinChi.HOC_NGOAI]: 'Học ngoài CTĐT',
  [ELoaiHocPhanDangKyTinChi.TAT_CA]: 'Tất cả học phần',
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
