export enum ELoaiThoiGianThucHien {
  NGAYTHANGNAM = 'Mốc thời gian bắt đầu - kết thúc (ngày/tháng/năm)',
  THANGNAM = 'Mốc thời gian bắt đầu - kết thúc (tháng/năm)',
  NAM = 'Mốc thời gian bắt đầu - kết thúc (năm)',
  THOIGIANCUTHE_DDMMYYYY = 'Thời gian cụ thể (ngày/tháng/năm)',
  THOIGIANCUTHE_MMYYYY = 'Thời gian cụ thể (tháng/năm)',
  THOIGIANCUTHE_YYYY = 'Thời gian cụ thể (năm)',
}

export enum EKieuDuLieu {
  DOAN_VAN_BAN = 'Đoạn văn bản',
  NUMBER = 'Số nguyên',
  DECIMAL = 'Số thập phân',
  TEXT = 'Chữ',
  BOOLEAN = 'Boolean',
  HOUR = 'Ngày/tháng/năm + giờ',
  DATE = 'Ngày/tháng/năm',
  MONTH = 'Tháng/năm',
  DANHMUC = 'Danh mục',
  TABLE = 'Bảng',
  FILE = 'File',
  CAN_BO = 'TCNS - Cán bộ',
  SINH_VIEN = 'QLĐT - Sinh viên',
  DANHSACH = 'Danh sách sản phẩm NCKH',
}

export enum ELoaiQuyDoiGio {
  CHIA_DEU = 'Sử dụng giờ tổng để chia cho các thành viên',
  DON_VI_VA_HE_SO = 'Quy đổi theo đơn vị và hệ số',
  KHONG_CHIA_DEU = 'Quy đổi cho từng thành viên',
  TUY_BIEN = 'Công thức tùy biến',
}

export const MapKeyLoaiQuyDoiDiem = {
  [ELoaiQuyDoiGio.CHIA_DEU]: 'Sử dụng điểm tổng để chia cho các thành viên',
  [ELoaiQuyDoiGio.DON_VI_VA_HE_SO]: 'Quy đổi theo đơn vị và hệ số',
  [ELoaiQuyDoiGio.KHONG_CHIA_DEU]: 'Quy đổi cho từng thành viên',
  [ELoaiQuyDoiGio.TUY_BIEN]: 'Công thức tùy biến',
};

export enum ELoaiPhepToan {
  BANG = 'Bằng',
  KHONG_BANG = 'Không bằng',
  LON_HON = 'Lớn hơn',
  NHO_HON = 'Nhỏ hơn',
  LON_HON_BANG = 'Lớn hơn hoặc bằng',
  NHO_HON_BANG = 'Nhỏ hơn hoặc bằng',
  KHONG_CO_GIA_TRI = 'Không có giá trị',
  CO_GIA_TRI = 'Có giá trị',
  NAM_TRONG = 'Nằm trong',
  KHONG_NAM_TRONG = 'Không nằm trong',
}

export enum ELoaiTinhGioThanhVien {
  PHAN_TRAM = 'Phần trăm',
  GIO_CO_DINH = 'Giờ cố định',
}

export enum ELoaiLoaiHinh {
  SP = 'Sản phẩm',
  HD = 'Hoạt động',
  KHAC = 'Khác',
}

export enum ELoaiTruongThongTinTinh {
  VAI_TRO = 'Vai trò',
  THOI_GIAN_BAT_DAU = 'Thời gian bắt đầu',
  THOI_GIAN_KET_THUC = 'Thời gian kết thúc',
  MOC_THOI_GIAN = 'Mốc thời gian',
  DANH_SACH_THANH_VIEN = 'Danh sách thành viên',
  SAN_PHAM_NCKH_LIEN_QUAN = 'Sản phẩm NCKH liên quan',
}

export enum ETextDisplay {
  TEXT_AREA = 'TEXT_AREA',
  TEXT_EDITOR = 'TEXT_EDITOR',
}

export const MapKeyNameTextDisplay = {
  [ETextDisplay.TEXT_AREA]: 'Text Area',
  [ETextDisplay.TEXT_EDITOR]: 'Text Editor',
};
