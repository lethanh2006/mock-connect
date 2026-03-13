export enum TrangThaiBuoc {
  OK = 'Đã duyệt',
  NOT_OK = 'Không duyệt',
  PROCESSING = 'Đang xử lý',
}

export enum TrangThaiThaoTac {
  PENDING = 'Chưa duyệt',
  OK = 'Đã duyệt',
  NOT_OK = 'Không duyệt',
}

export enum ColorTrangThaiDonMotCua {
  PENDING = 'gray',
  OK = '#28a745cc',
  NOT_OK = '#007EB9cc',
  PROCESSING = '#1890ffcc',
}

export enum TrangThaiDonDVMC {
  OK = 'Đã duyệt',
  NOT_OK = 'Không duyệt',
  PROCESSING = 'Đang xử lý',
}

export enum ElementTemplateType {
  TEXT_INPUT = 'Nhập Text 1 dòng',
  TEXT_AREA = 'Nhập Text nhiều dòng',
  INPUT_NUMBER = 'Nhập số',
  DATE_PICKER = 'Chọn ngày tháng',
  UPLOAD_SINGLE = 'Chọn 1 file',
  UPLOAD_MULTI = 'Chọn nhiều file',
  DROP_LIST_SINGLE = 'Lựa chọn một (dạng Droplist)',
  DROP_LIST_MULTI = 'Lựa chọn nhiều (dạng Droplist)',
  RADIO_BUTTON = 'Lựa chọn một (Radio)',
  CHECKLIST = 'Lựa chọn nhiều (Checklist)',
  DON_VI_HANH_CHINH = 'Đơn vị hành chính',
  TABLE = 'Dạng bảng',
  MY_SEMESTER = 'Kỳ học của sinh viên',
  MY_YEAR = 'Năm học của sinh viên',
  MY_CREDIT = 'Môn học của sinh viên',
  // CREDIT = 'Môn học',
  MY_COURSE = 'Lớp tín chỉ của sinh viên',
  // _OTO = 'Dịch vụ Ô-tô',
  TEXT_BLOCK = 'Đoạn văn bản',
  DAN_TOC = 'Dân tộc',
  TON_GIAO = 'Tôn giáo',
  HOC_PHAN_CO_DIEM = 'Học phần có điểm',
  // CMT_CCCD = 'CMT/CCCD',
  // BUTTON_SEARCH_PHONG = 'Button tìm phòng VPS',
}

export enum EFileType {
  doc = 'Tài liệu (doc, docx)',
  pdf = 'Tài liệu (pdf)',
  excel = 'Excel (xlsx, xls)',
  image = 'Ảnh (png, jpg, jpeg)',
}

export enum LoaiDoiTuongXuLyQuyTrinh {
  DON_VI_CU_THE = 'Đơn vị cụ thể',
  DON_VI_QUAN_LY = 'Đơn vị quản lý',
  // CO_VAN_HOC_TAP = 'Cố vấn học tập',
}

export const LevelDonViHanhChinh = [
  'Tỉnh',
  'Tỉnh, quận',
  'Tỉnh, quận, xã',
  'Tỉnh, quận, xã, số nhà tên đường',
];

export const LevelCCCD = ['Số CMT/CCCD', 'Số CMT/CCCD, ngày cấp', 'Số CMT/CCCD, ngày cấp, nơi cấp'];

export const accessFileUpload: any = {
  doc: '.doc,.docx',
  excel: '.xlsm, .xls, .xlsx',
  image: '.png, .jpg, .jpeg',
  pdf: '.pdf',
};

export const TitleFormImport = {
  danhSachLopHanhChinh: 'lớp hành chính',
  danhSachLopTinChi: 'lớp tín chỉ',
  danhSachKhoaHoc: 'khóa học',
  danhSachNganhHoc: 'ngành học',
  danhSachNguoiDungCuThe: 'người dùng',
};

export enum ELoaiDotKhaiBaoKHCN {
  TU_NGAY_DEN_NGAY = 'Từ ngày đến ngày',
  TU_NAM_DEN_NAM = 'Từ năm đến năm',
  MOC_THOI_GIAN_NGAY = 'Mốc thời gian (ngày)',
  MOC_THOI_GIAN_NAM = 'Mốc thời gian (năm)',
}

export const PhamVi = ['Tất cả', 'Hình thức đào tạo'];
export enum EPhamVi {
  TAT_CA = 'Tất cả',
  HINH_THUC_DAO_TAO = 'Hình thức đào tạo',
}
