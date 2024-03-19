

export enum EGioiTinh {
  Nam = 'Nam',
  Nu = 'Nữ',
}

export enum EHinhThucTuyenDung {
  THI_TUYEN = 'Thi tuyển',
  XET_TUYEN = 'Xét tuyển',
  HOP_DONG = 'Hơp đồng',
  BIET_PHAI = 'Biệt phái',
  DIEU_DONG = 'Điều động',
}

export enum EViTriViecLam {
  DUNG_NGANH = 'Có việc làm đúng ngành đào tạo',
  LIEN_QUAN = 'Có việc làm liên quan đến ngành đào tạo',
  KHONG_LIEN_QUAN = 'Có việc làm không liên quan đến ngành đào tạo',
  TIEP_TUC_HOC = 'Tiếp tục học',
  CHUA_CO = 'Chưa có việc làm',
}

export enum ENoiNgoaiTru {
  NOI_TRU = 'Nội trú',
  NGOAI_TRU = 'Ngoại trú',
}

export enum ELoaiNoiSinh {
  TRONG_NUOC = 'TRONG_NUOC',
  NUOC_NGOAI = 'NUOC_NGOAI',
}

export const TenLoaiNoiSinh: Record<ELoaiNoiSinh, string> = {
  [ELoaiNoiSinh.TRONG_NUOC]: 'Trong nước',
  [ELoaiNoiSinh.NUOC_NGOAI]: 'Nước ngoài',
};

export enum ETrangThaiThanhVienGiaDinh {
  DA_MAT = 'Đã mất',
  CO_THONG_TIN = 'Có thông tin',
  KHONG_CO_THONG_TIN = 'Không có thông tin',
}

export enum ELoaiThanhVienGiaDinh {
  BO = 'Bố',
  ME = 'Mẹ',
  NGUOI_GIAM_HO = 'Người giám hộ',
  ANH = 'Anh trai',
  CHI = 'Chị gái',
  EM_TRAI = 'Em trai',
  EM_GAI = 'Em gái',
  NGUOI_LIEN_HE = 'Người liên hệ',
}

export enum ELoaiThoiHanChungChi {
  CO_THOI_HAN = 'Có thời hạn',
  KHONG_CO_THOI_HAN = 'Không có thời hạn',
}

// Trạng thái bảo lưu

export enum ETrangThaiSinhVienBaoLuu {
  DANG_BAO_LUU = 'Đang bảo lưu',
  QUAY_LAI_HOC = 'Quay lại học',
  BUOC_THOI_HOC = 'Buộc thôi học',
}

export const colorTrangThaiSinhVienBaoLuu: Record<ETrangThaiSinhVienBaoLuu, string> = {
  [ETrangThaiSinhVienBaoLuu.DANG_BAO_LUU]: 'blue',
  [ETrangThaiSinhVienBaoLuu.QUAY_LAI_HOC]: 'green',
  [ETrangThaiSinhVienBaoLuu.BUOC_THOI_HOC]: 'red',
};

export const fieldTrangThaiSinhVienBaoLuu: Record<ETrangThaiSinhVienBaoLuu, keyof QuyetDinh.TThongKeSinhVienBaoLuu> = {
  [ETrangThaiSinhVienBaoLuu.DANG_BAO_LUU]: 'dangBaoLuu',
  [ETrangThaiSinhVienBaoLuu.QUAY_LAI_HOC]: 'quayLaiHoc',
  [ETrangThaiSinhVienBaoLuu.BUOC_THOI_HOC]: 'buocThoiHoc',
};
