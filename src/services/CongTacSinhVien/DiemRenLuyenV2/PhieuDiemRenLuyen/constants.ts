export enum ETrangThaiChamDiem {
  DANG_CHAM = 'DANG_CHAM',
  DA_CHAM_XONG = 'DA_CHAM_XONG',
  DANG_NIEM_YET = 'DANG_NIEM_YET',
  DA_NIEM_YET = 'DA_NIEM_YET',
  DANG_XU_LY_KHIEU_NAI = 'DANG_XU_LY_KHIEU_NAI',
  DA_CONG_BO = 'DA_CONG_BO',
}

export const MapKeyNameTrangThaiChamDiem = {
  [ETrangThaiChamDiem.DANG_CHAM]: 'Đang chấm',
  [ETrangThaiChamDiem.DANG_XU_LY_KHIEU_NAI]: 'Đang xử lý khiếu nại',
  [ETrangThaiChamDiem.DA_CHAM_XONG]: 'Đã chấm xong',
  [ETrangThaiChamDiem.DA_CONG_BO]: 'Đã công bố',
  [ETrangThaiChamDiem.DANG_NIEM_YET]: 'Đang niêm yết',
  [ETrangThaiChamDiem.DA_NIEM_YET]: 'Đã niêm yết',
};
export const MapKeyColorTrangThaiChamDiem = {
  [ETrangThaiChamDiem.DANG_CHAM]: 'yellow',
  [ETrangThaiChamDiem.DANG_XU_LY_KHIEU_NAI]: 'blue',
  [ETrangThaiChamDiem.DA_CHAM_XONG]: 'green',
  [ETrangThaiChamDiem.DA_CONG_BO]: 'green',
  [ETrangThaiChamDiem.DANG_NIEM_YET]: 'yellow',
  [ETrangThaiChamDiem.DA_NIEM_YET]: 'blue',
};


export enum EXepLoai {
  XUAT_SAC = 'XUAT_SAC',
  TOT = 'TOT',
  KHA = 'KHA',
  TRUNG_BINH = 'TRUNG_BINH',
  YEU = 'YEU',
  KEM = 'KEM',
}

export const MapKeyNameXepLoai = {
  [EXepLoai.XUAT_SAC]: 'Xuất sắc',
  [EXepLoai.TOT]: 'Tốt',
  [EXepLoai.KHA]: 'Khá',
  [EXepLoai.TRUNG_BINH]: 'Trung bình',
  [EXepLoai.YEU]: 'Yếu',
  [EXepLoai.KEM]: 'Kém',
};

export const MapKeyColorXepLoai = {
  [EXepLoai.XUAT_SAC]: 'green',
  [EXepLoai.TOT]: 'green',
  [EXepLoai.KHA]: 'yellow',
  [EXepLoai.TRUNG_BINH]: 'yellow',
  [EXepLoai.YEU]: 'orange',
  [EXepLoai.KEM]: 'red',
};
