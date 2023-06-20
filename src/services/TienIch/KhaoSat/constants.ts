export enum EThoiGianDot {
  CHUA_DIEN_RA = 'CHUA_DIEN_RA',
  DANG_DIEN_RA = 'DANG_DIEN_RA',
  DA_DIEN_RA = 'DA_DIEN_RA',
}

export enum EChucNangSuDung {
  KET_QUA_HOC_TAP = 'KET_QUA_HOC_TAP',
}

export const MapKeyThoiGianDot = {
  [EThoiGianDot.CHUA_DIEN_RA]: 'Chưa diễn ra',
  [EThoiGianDot.DANG_DIEN_RA]: 'Đang diễn ra',
  [EThoiGianDot.DA_DIEN_RA]: 'Đã diễn ra',
};

export const textThucHienKhaoSat = {
  [EThoiGianDot.CHUA_DIEN_RA]: 'Khảo sát chưa bắt đầu',
  [EThoiGianDot.DANG_DIEN_RA]: 'Thực hiện khảo sát',
  [EThoiGianDot.DA_DIEN_RA]: 'Khảo sát đã kết thúc',
};

export enum ELoaiBieuMau {
  KHAO_SAT = 'Khảo sát',
  TRAC_NGHIEM = 'Trắc nghiệm',
  KHAI_BAO_Y_TE = 'Khai báo y tế',
  DANH_GIA_GIANG_VIEN = 'Đánh giá giảng viên',
}
