export const Settings = {
  version: '1.0',
};

export enum Role {
  nhan_vien = 'Cán bộ, giảng viên',
  sinh_vien = 'Sinh viên',
  Admin = 'Quản trị viên hệ thống',
  quan_tri = 'Quản trị viên đơn vị',
}

export enum EVaiTroBieuMau {
  SINH_VIEN = 'sinh_vien',
  NHAN_VIEN = 'nhan_vien',
}

export enum ELoaiBieuMau {
  KHAO_SAT = 'Khảo sát',
  TRAC_NGHIEM = 'Trắc nghiệm',
  KHAI_BAO_Y_TE = 'Khai báo y tế',
  DANH_GIA_GIANG_VIEN = 'Đánh giá giảng viên',
}

export enum EChucNangSuDung {
  KET_QUA_HOC_TAP = 'KET_QUA_HOC_TAP',
}

export enum ELoaiDot {
  BIEU_MAU = 'BIEU_MAU',
}

export enum EThoiGianDot {
  CHUA_DIEN_RA = 'CHUA_DIEN_RA',
  DANG_DIEN_RA = 'DANG_DIEN_RA',
  DA_DIEN_RA = 'DA_DIEN_RA',
}

export const MapKeyThoiGianDot = {
  [EThoiGianDot.CHUA_DIEN_RA]: 'Chưa diễn ra',
  [EThoiGianDot.DANG_DIEN_RA]: 'Đang diễn ra',
  [EThoiGianDot.DA_DIEN_RA]: 'Đã diễn ra',
};

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

export const accessFileUpload = {
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

export enum TrangThaiDonDVMC {
  OK = 'Đã duyệt',
  NOT_OK = 'Không duyệt',
  PROCESSING = 'Đang xử lý',
}

export enum ELoaiDotKhaiBaoKHCN {
  TU_NGAY_DEN_NGAY = 'Từ ngày đến ngày',
  TU_NAM_DEN_NAM = 'Từ năm đến năm',
  MOC_THOI_GIAN_NGAY = 'Mốc thời gian (ngày)',
  MOC_THOI_GIAN_NAM = 'Mốc thời gian (năm)',
}

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

export enum ExportType {
  WORD = 'word',
  PDF = 'pdf',
  XLSX = 'excel',
}

export const PhamVi = ['Tất cả', 'Hình thức đào tạo'];
export enum EPhamVi {
  TAT_CA = 'Tất cả',
  HINH_THUC_DAO_TAO = 'Hình thức đào tạo',
}

export const Setting = {
  navTheme: 'dark',
  primaryColor: '#007EB9',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: 'PTIT S-Link',
  pwa: false,
  logo: '/favicon.ico',
  iconfontUrl: '',
  version: 'v1.0',
  tenTruong: 'Học viện Phụ nữ Việt Nam',
};

export enum EVaiTro {
  DEVELOPER = -8,
  SINH_VIEN = 0,
  GIANG_VIEN = 1,
  PHU_HUYNH = 2,
  ADMIN = 3,
  GUEST = 4,
  CAN_BO = 5,
  CAN_BO_DAO_TAO = 6,
  CAN_BO_QLKH = 7,
  LANH_DAO = 8,
}

export enum ELoaiSuKien {
  LICH_GIANG_DAY = 'Lịch giảng dạy',
  LICH_HOC = 'Lịch học',
  LICH_THI = 'Lịch thi',
  CA_NHAN = 'Cá nhân',
  TAT_CA = 'Tất cả',
}

export enum ECapQuanLy {
  NHA_NUOC = 'Cấp Nhà nước',
  BO_NGANH_TINH = 'Cấp Bộ/Ngành/Tỉnh',
  HOC_VIEN = 'Cấp Học viện',
  KHAC = 'Khác',
  TRUONG = 'Cấp Trường',
}

export enum ECapQuanLyTapChi {
  NGANH = 'Cấp Ngành',
  TRUONG = 'Cấp Trường',
}

export enum EKetQuaDuyet {
  CHUA_DUYET = 'Chưa duyệt',
  DUYET = 'Duyệt',
  KHONG_DUYET = 'Không duyệt',
  CHINH_SUA_LAI = 'Chỉnh sửa lại',
  GIANG_VIEN_DA_CHINH_SUA = 'Đã chỉnh sửa',
}

export enum LoaiCongTrinhKhoaHoc {
  baiBaoKhoaHoc = 'Bài báo khoa học',
  bangDocQuyenGiaiPhap = 'Bằng sáng chế',
  huongDanNcsHvch = 'Hướng dẫn NCS/HVCH',
  nhiemVuKhcn = 'Đề tài KHCN',
  sachPhucVuDaoTao = 'Biên soạn sách',
  tacPhamThanhTich = 'Tác phẩm/Thành tích',
}

export enum ELoaiBaiBao {
  TAP_CHI = 'Tạp chí',
  HOI_NGHI = 'Hội nghị',
}

export enum ELoaiTapChi {
  ISI = 'ISI',
  SCOPUS = 'Scopus',
  SCI = 'SCI',
  SCIE = 'SCIE',
  SSCI = 'SSCI',
  AHCI = 'A&HCI',
  ESCI = 'ESCI',
  ACI = 'ACI',
  TAP_CHI_KINH_TE_VA_QUAN_LY = 'Tạp chí Kinh tế và quản lý',
}

export enum ELoaiSach {
  SACH_CHUYEN_KHAO = 'Sách chuyên khảo',
  SACH_GIAO_TRINH = 'Sách giáo trình',
  SACH_THAM_KHAO = 'Sách tham khảo',
  SACH_HUONG_DAN = 'Sách hướng dẫn',
  // SACH_BAI_TAP = 'Sách bài tập',
  // TU_DIEN = 'Từ điển',
}

export enum ELoaiChuongSach {
  VIET_MOI = 'Viết mới',
  CHINH_SUA_BO_SUNG = 'Chỉnh sửa bổ sung',
}

export enum ELoaiNganSach {
  NSNN = 'Ngân sách Nhà nước',
  KHAC = 'Khác',
}

export enum ECapNghiemThu {
  CO_SO = 'Cơ sở',
  SO_BO = 'Sơ bộ',
  CHINH_THUC = 'Chính thức',
}

export enum EKetQuaNghiemThu {
  XUAT_SAC = 'Xuất sắc',
  TOT = 'Tốt',
  KHA = 'Khá',
  DAT = 'Đạt',
  KHONG_DAT = 'Không đạt',
}

export enum ELoaiHinhDeTaiNhiemVu {
  DTNV = 'Đề tài/nhiệm vụ',
  BCCD = 'Báo cáo chuyên đề',
  HUONG_DAN_DE_TAI_SINH_VIEN = 'Hướng dẫn đề tài sinh viên',
}

export enum EVaiTroHuongDanDeTaiSinhVien {
  GV_HUONG_DAN_CHINH = 'Giảng viên hướng dẫn chính',
  DONG_HUONG_DAN = 'Đồng hướng dẫn',
}

export enum EPhanLoaiLanhTho {
  QUOC_TE = 'Quốc tế',
  TRONG_NUOC = 'Trong nước',
  TRUONG = 'Trường',
  DONVI = 'Đơn vị',
}

export enum ELoaiTuDien {
  BACH_KHOA_TOAN_THU = 'Bách khoa toàn thư',
  KHAC = 'Khác',
}

export enum EXepLoaiTapChi {
  Q1 = 'Q1',
  Q2 = 'Q2',
  Q3 = 'Q3',
  Q4 = 'Q4',
}

export enum ELoaiCongTrinhKhoaHoc {
  DE_TAI_NHIEM_VU_KHCN = 'Đề tài/ nhiệm vụ KHCN',
  BAI_BAO_KHOA_HOC = 'Bài báo khoa học',
  GIAO_TRINH_SACH_CHUONG_SACH = 'Giáo trình/ sách/ chương sách',
  HUONG_DAN_NCS = 'Hướng dẫn NCS/HVCH',
  BANG_SANG_CHE = 'Bằng sáng chế',
  TAC_PHAM_THANH_TICH = 'Tác phẩm, thành tích',
  HOI_THAO_KHOA_HOC = 'Hội thảo khoa học',
}

export enum ELoaiTacPhamThanhTich {
  TAC_PHAM = 'Tác phẩm',
  THANH_TICH = 'Thành tích',
}

export enum ECapGiaiThuongThiDau {
  TRUONG = 'Trường',
  THANH_PHO = 'Thành phố',
  NHA_NUOC = 'Nhà nước',
}

export enum EVaiTroKHCN {
  CNDT = 'Chủ nhiệm đề tài',
  CB = 'Chủ biên',
  TKKH = 'Thư ký khoa học',
  TVC = 'Thành viên chính',
  TV = 'Thành viên',
  KTV_NVHT = 'Kỹ thuật viên/Nhân viên hỗ trợ',
  TG = 'Tác giả',
  TGC = 'Tác giả chính',
  DTG = 'Đồng tác giả',
  SV_HVC = 'Sinh viên/học viên chính',
  TVCL = 'Thành viên còn lại',
  GV_HD_CHINH = 'Giảng viên hướng dẫn chính',
  DONG_GV_HD = 'Đồng hướng dẫn',
  VAN_DONG_VIEN = 'Vận động viên',
}

export enum ECapHTKH {
  QTUY = 'Quốc tế uy tín',
  QTK = 'Quốc tế khác',
  QG = 'Quốc gia',
  TRUONG = 'Trường',
  DONVI = 'Đơn vị',
}

export enum EVaiTroDeTai {
  CNDT = 'Chủ nhiệm đề tài',
  TKKH = 'Thư ký khoa học',
  TVC = 'Thành viên chính',
  TVTG = 'Thành viên tham gia',
  KTV = 'Kỹ thuật viên',
  NVHT = 'Nhân viên hỗ trợ',
  CTV = 'Cộng tác viên', //todo: backend chưa có
}

export enum EVaiTroSach {
  CB = 'Chủ biên',
  CTV = 'Cộng tác viên', //todo: backend chưa có
  // TVC = 'Thành viên chính',
}

export enum EVaiTroBangSangChe {
  TAC_GIA_CHINH = 'Tác giả',
  CTV = 'Cộng tác viên',
}

export enum EVaiTroBaiBao {
  TAC_GIA_DAU = 'Tác giả đầu',
  TAC_GIA_LH = 'Tác giả liên hệ',
  DONG_TG = 'Đồng tác giả',
}

export enum EVaiTroNCKHSinhVien {
  SV = 'Sinh viên/học viên chính',
  TV = 'Thành viên còn lại',
}

export enum ENgonNgu {
  TV = 'Tiếng Việt',
  NN = 'Ngoại ngữ',
}

export enum ECapGiaiThuong {
  BO = 'Bộ',
  TINH = 'Tỉnh',
  THANH_PHO = 'Thành phố',
  TRUONG = 'Trường',
  VUNG_MIEN = 'Vùng miền',
  QUOC_GIA = 'Quốc gia',
  QUOC_TE = 'Quốc tế',
}

export enum ELoaiGiaiThuong {
  NHAT = 'Nhất',
  NHI = 'Nhì',
  BA = 'Ba',
  KHUYEN_KHICH = 'Khuyến khích',
}

export enum ELoaiHinhNCKHSV {
  NCKH = 'Nghiên cứu khoa học',
  CUOC_THI_KHAC = 'Cuộc thi chuyên môn khác',
}

export enum ETrangThaiDotDangKyDeTaiQLKH {
  DANG_DIEN_RA = 'Đang diễn ra',
  CHUA_DIEN_RA = 'Chưa diễn ra',
  DA_KET_THUC = 'Đã diễn ra',
}

export enum ETrangThaiHoiDongKHCN {
  DANG_DIEN_RA = 'Đang diễn ra',
  CHUA_DIEN_RA = 'Chưa diễn ra',
  DA_KET_THUC = 'Đã diễn ra',
}

export const MapKeyColorTrangThaiDotDangKyDeTaiQLKH = {
  'Đang diễn ra': '#28a745',
  'Chưa diễn ra': '#007bff',
  'Đã diễn ra': '#dc3545',
};

export enum TrangThaiThanhToan {
  open = 'Chưa thanh toán đủ',
  paid = 'Đã thanh toán đủ',
  overpaid = 'Thanh toán thừa',
}

export enum ETrangThaiKhoa {
  DA_KHOA = 'Đã nộp',
  CHUA_KHOA = 'Chưa nộp',
}

export enum EChucVuHoiDong {
  CHU_TICH = 'Chủ tịch',
  THU_KY = 'Thư ký',
  UY_VIEN = 'Ủy viên',
  PHAN_BIEN_1 = 'Phản biện 1',
  PHAN_BIEN_2 = 'Phản biện 2',
}

export enum ELoaiDeTai {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
}

export enum EMenhGia {
  // USD = 'USD',
  // EUR = 'EUR',
  VNĐ = 'VNĐ',
}

export enum ETrangThaiDangKy {
  CHUA_TIEP_NHAN = 'Chưa tiếp nhận',
  DUOC_TIEP_NHAN = 'Được tiếp nhận',
  KHONG_DUOC_TIEP_NHAN = 'Không được tiếp nhận',
  YEU_CAU_CHINH_SUA = 'Yêu cầu chỉnh sửa',
}

export enum ETrangThaiXetDuyetDangKy {
  CHUA_DUYET = 'Chưa duyệt',
  DUYET = 'Duyệt',
  KHONG_DUYET = 'Không duyệt',
  YEU_CAU_CHINH_SUA = 'Yêu cầu chỉnh sửa',
}

export enum ETrangThaiNopDeCuong {
  CHUA_TIEP_NHAN = 'Chưa tiếp nhận',
  DUOC_TIEP_NHAN = 'Được tiếp nhận',
  KHONG_TIEP_NHAN = 'Không được tiếp nhận',
  YEU_CAU_CHINH_SUA = 'Yêu cầu chỉnh sửa',
}

export enum ETrangThaiXetDuyetDeCuong {
  CHUA_DUYET = 'Chưa duyệt',
  DUYET = 'Duyệt',
  KHONG_DUYET = 'Không duyệt',
  YEU_CAU_CHINH_SUA = 'Yêu cầu chỉnh sửa',
}

export enum ETrangThaiNghiemThu {
  CHUA_DUYET = 'Chưa duyệt',
  YEU_CAU_CHINH_SUA = 'Yêu cầu chỉnh sửa',
  DUYET = 'Duyệt',
  KHONG_DUYET = 'Không duyệt',
}

export enum ETrangThaiSauNghiemThu {
  DA_HOAN_THANH = 'Đã hoàn thành',
  CHUA_HOAN_THANH = 'Chưa hoàn thành',
}

export enum ETrangThaiThucHien {
  CHUA_TIEP_NHAN = 'Chưa tiếp nhận',
  YEU_CAU_CHINH_SUA = 'Yêu cầu chỉnh sửa',
  DUOC_TIEP_NHAN = 'Được tiếp nhận',
  KHONG_TIEP_NHAN = 'Không được tiếp nhận',
}

export enum ETrangThaiDeTaiQuanLyKhoaHoc {
  CHUA_TIEP_NHAN = 'Chưa tiếp nhận',
  YEU_CAU_CHINH_SUA = 'Yêu cầu chỉnh sửa',
  DUOC_TIEP_NHAN = 'Được tiếp nhận',
  KHONG_TIEP_NHAN = 'Không được tiếp nhận',
  CHUA_DUYET = 'Chưa duyệt',
  DUYET = 'Duyệt',
  KHONG_DUYET = 'Không duyệt',
  DA_HOAN_THANH = 'Đã hoàn thành',
  CHUA_HOAN_THANH = 'Chưa hoàn thành',
}

export const MapKeyColorTrangThaiDeTaiQuanLyKhoaHoc = {
  [ETrangThaiDeTaiQuanLyKhoaHoc.CHUA_TIEP_NHAN]: '#007bff',
  [ETrangThaiDeTaiQuanLyKhoaHoc.CHUA_DUYET]: '#007bff',
  [ETrangThaiDeTaiQuanLyKhoaHoc.DUOC_TIEP_NHAN]: '#28a745',
  [ETrangThaiDeTaiQuanLyKhoaHoc.DUYET]: '#28a745',
  [ETrangThaiDeTaiQuanLyKhoaHoc.YEU_CAU_CHINH_SUA]: '#ffc107',
  [ETrangThaiDeTaiQuanLyKhoaHoc.KHONG_TIEP_NHAN]: '#dc3545',
  [ETrangThaiDeTaiQuanLyKhoaHoc.KHONG_DUYET]: '#dc3545',
  [ETrangThaiDeTaiQuanLyKhoaHoc.DA_HOAN_THANH]: '#28a745',
  [ETrangThaiDeTaiQuanLyKhoaHoc.CHUA_HOAN_THANH]: '#dc3545',
};

export enum ELoaiHoiDongKHCN {
  DANG_KY = 'Đăng ký',
  XET_DUYET = 'Xét duyệt',
  DE_CUONG = 'Đề cương',
  NGHIEM_THU = 'Nghiệm thu',
}

export const MapKeyTrangThaiAndColorByLoaiHoiDong = {
  [ELoaiHoiDongKHCN.XET_DUYET]: {
    trangThai: 'trangThaiXetDuyetDangKy',
    color: MapKeyColorTrangThaiDeTaiQuanLyKhoaHoc,
    trangThaiDefault: ETrangThaiXetDuyetDangKy.CHUA_DUYET,
  },
  [ELoaiHoiDongKHCN.DE_CUONG]: {
    trangThai: 'trangThaiXetDuyetDeCuong',
    color: MapKeyColorTrangThaiDeTaiQuanLyKhoaHoc,
    trangThaiDefault: ETrangThaiXetDuyetDeCuong.CHUA_DUYET,
  },
  [ELoaiHoiDongKHCN.NGHIEM_THU]: {
    trangThai: 'trangThaiNghiemThu',
    color: MapKeyColorTrangThaiDeTaiQuanLyKhoaHoc,
    trangThaiDefault: ETrangThaiNghiemThu.CHUA_DUYET,
  },
};

export enum EPhaseDeTaiKHCN {
  DANG_KY = 'Đăng ký',
  TIEP_NHAN_DANG_KY = 'Tiếp nhận đăng ký',
  XET_DUYET_DANG_KY = 'Xét duyệt đăng ký',
  NOP_DE_CUONG = 'Nộp đề cương',
  XET_DUYET_DE_CUONG = 'Xét duyệt đề cương',
  THUC_HIEN = 'Thực hiện',
  NGHIEM_THU = 'Nghiệm thu',
  SAU_NGHIEM_THU = 'Sau nghiệm thu',
}

export const MapKeyTypeDeTai = {
  TIEP_NHAN: ['dangKyKhcn', 'trangThaiDangKy'],
  XET_DUYET: ['xetDuyetKhcn', 'trangThaiXetDuyet'],
  DE_CUONG: ['deCuongKhcn', 'trangThaiDeCuong'],
  NGHIEM_THU: ['nghiemThuKhcn', 'trangThaiNghiemThu'],
};

export const MapKeyFieldNamePhaseDeTai = {
  [EPhaseDeTaiKHCN.XET_DUYET_DANG_KY]: 'xetDuyetKhcn',
  [EPhaseDeTaiKHCN.XET_DUYET_DE_CUONG]: 'deCuongKhcn',
  [EPhaseDeTaiKHCN.NGHIEM_THU]: 'nghiemThuKhcn',
};

export const MapKeyLockDeTai = {
  [EPhaseDeTaiKHCN.DANG_KY]: 'lock',
  [EPhaseDeTaiKHCN.TIEP_NHAN_DANG_KY]: 'lock',
  [EPhaseDeTaiKHCN.XET_DUYET_DANG_KY]: 'lockXetDuyet',
  [EPhaseDeTaiKHCN.NOP_DE_CUONG]: 'lockNopDeCuong',
  [EPhaseDeTaiKHCN.XET_DUYET_DE_CUONG]: 'lockDeCuong',
  [EPhaseDeTaiKHCN.THUC_HIEN]: 'lockThucHien',
  [EPhaseDeTaiKHCN.NGHIEM_THU]: 'lockNghiemThu',
  [EPhaseDeTaiKHCN.SAU_NGHIEM_THU]: 'lockSauNghiemThu',
};

export const MapKeyTrangThaiDeTai = {
  [EPhaseDeTaiKHCN.DANG_KY]: 'trangThaiDangKy',
  [EPhaseDeTaiKHCN.TIEP_NHAN_DANG_KY]: 'trangThaiDangKy',
  [EPhaseDeTaiKHCN.XET_DUYET_DANG_KY]: 'trangThaiXetDuyetDangKy',
  [EPhaseDeTaiKHCN.NOP_DE_CUONG]: 'trangThaiNopDeCuong',
  [EPhaseDeTaiKHCN.XET_DUYET_DE_CUONG]: 'trangThaiXetDuyetDeCuong',
  [EPhaseDeTaiKHCN.THUC_HIEN]: 'trangThaiThucHien',
  [EPhaseDeTaiKHCN.NGHIEM_THU]: 'trangThaiNghiemThu',
};

export const ColorTrangThai = {
  [EKetQuaDuyet.CHUA_DUYET]: '#007bff',
  [EKetQuaDuyet.DUYET]: '#28a745',
  [EKetQuaDuyet.KHONG_DUYET]: '#dc3545',
  [EKetQuaDuyet.CHINH_SUA_LAI]: '#ffc107',
  [EKetQuaDuyet.GIANG_VIEN_DA_CHINH_SUA]: '#F57C02',
};

export enum EDangSanPham {
  DANG_SAN_PHAM_I = 'Dạng sản phẩm I',
  DANG_SAN_PHAM_II = 'Dạng sản phẩm II',
  DANG_SAN_PHAM_III = 'Dạng sản phẩm III',
}

export const MapKeyDangSanPham = {
  [EDangSanPham.DANG_SAN_PHAM_I]: 'Dạng sản phẩm I (Mẫu sản phẩm; Vật liệu; Thiết bị, dụng cụ)',
  [EDangSanPham.DANG_SAN_PHAM_II]:
    'Dạng sản phẩm II (Quy trình công nghệ kỹ thuật; Phương pháp công nghệ; Quy trình, quy phạm, tiêu chuẩn, định mức)',
  [EDangSanPham.DANG_SAN_PHAM_III]:
    'Dạng sản phẩm III (Chương trình máy tính; Phương pháp, giải pháp; Đề án quy hoạch; Sơ đồ, bảng số liệu; Khác)',
};

export enum ELoaiDauDiemHocPhan {
  HOC_PHAN_THUONG = 'hoc_phan_thuong',
  TIENG_ANH_A_B = 'tieng_anh_a_b',
  TIENG_ANH_COURSE = 'tieng_anh_course',
}

export const MapKeyTitleLockButtonByPhase = {
  [EPhaseDeTaiKHCN.DANG_KY]: 'Đề tài',
  [EPhaseDeTaiKHCN.XET_DUYET_DANG_KY]: 'Đề tài',
  [EPhaseDeTaiKHCN.NOP_DE_CUONG]: 'Đề cương',
  [EPhaseDeTaiKHCN.XET_DUYET_DE_CUONG]: 'Đề cương',
  [EPhaseDeTaiKHCN.THUC_HIEN]: 'Minh chứng thực hiện đề tài',
  [EPhaseDeTaiKHCN.NGHIEM_THU]: 'đề xuất Nghiệm thu',
  [EPhaseDeTaiKHCN.SAU_NGHIEM_THU]: 'kết quả sau nghiệm thu',
};

export enum EMucDoDeTai {
  NGHIEN_CUU_PHAT_TRIEN = 'Nghiên cứu - Phát triển',
  DE_TAI_LAB = 'Đề tài Lab',
  TRONG_DIEM = 'Trọng điểm',
}

export enum EThaoTacDeTai {
  TIEP_NHAN_DE_TAI = 'TIEP_NHAN_DE_TAI',
  CHUYEN_VIEN_CHINH_SUA_DE_TAI = 'CHUYEN_VIEN_CHINH_SUA_DE_TAI',
  GIANG_VIEN_CHINH_SUA_DE_TAI = 'GIANG_VIEN_CHINH_SUA_DE_TAI',
  GIANG_VIEN_THEM_MOI_DE_TAI = 'GIANG_VIEN_THEM_MOI_DE_TAI',
  XET_DUYET_DE_TAI = 'XET_DUYET_DE_TAI',
  TIEP_NHAN_DE_CUONG = 'TIEP_NHAN_DE_CUONG',
  TIEP_NHAN_THUC_HIEN = 'TIEP_NHAN_THUC_HIEN',
  CHUYEN_VIEN_CHINH_SUA_DE_CUONG = 'CHUYEN_VIEN_CHINH_SUA_DE_CUONG',
  CHUYEN_VIEN_CHINH_SUA_THUC_HIEN = 'CHUYEN_VIEN_CHINH_SUA_THUC_HIEN',
  GIANG_VIEN_CHINH_SUA_THUC_HIEN = 'GIANG_VIEN_CHINH_SUA_THUC_HIEN',
  GIANG_VIEN_CHINH_SUA_SAU_NGHIEM_THU = 'GIANG_VIEN_CHINH_SUA_SAU_NGHIEM_THU',
  GIANG_VIEN_CHINH_SUA_DE_CUONG = 'GIANG_VIEN_CHINH_SUA_DE_CUONG',
  XET_DUYET_DE_CUONG = 'XET_DUYET_DE_CUONG',
  XET_DUYET_NGHIEM_THU = 'XET_DUYET_NGHIEM_THU',
  CAP_NHAT_KET_QUA_HOP = '  CAP_NHAT_KET_QUA_HOP',
}

export enum ETrangThaiDiemDanhHoiDongQLKH {
  CO_MAT = 'Có mặt',
  VANG_CO_PHEP = 'Vắng có phép',
  VANG_KHONG_PHEP = 'Vắng không phép',
  // MIEN = 'Miễn',
}

export const arrSanPhamBatBuoc = [
  'Báo cáo tổng kết',
  'Quyết định Hội đồng nghiệm thu cấp Học viện',
  'Biên bản Hội đồng',
  'Bản giải trình',
];

//// khai bao ver ftu

export enum ETypeRequestThanhVien {
  THAM_GIA = 'Tham gia',
  ROI_KHOI = 'Rời khỏi',
}

export enum ETrangThaiDuyetThanhVien {
  DA_DUYET = 'Đã duyệt',
  TU_CHOI = 'Từ chối',
  CHUA_XU_LY = 'Chưa xử lý',
}

export enum EModeKhaiBao {
  ALL = 'ALL',
  TU_KHAI_BAO = 'TU_KHAI_BAO',
  DUOC_KHAI_BAO = 'DUOC_KHAI_BAO',
}

export enum ETitleTypeList {
  ThanhVien = 'Danh sách thành viên',
  MinhChung = 'Danh sách minh chứng',
  SinhVien = 'Danh sách thành viên',
}

export const MapKeyModeKhaiBao = {
  [EModeKhaiBao.ALL]: 'Tất cả',
  [EModeKhaiBao.TU_KHAI_BAO]: 'Tự khai báo',
  [EModeKhaiBao.DUOC_KHAI_BAO]: 'Được khai báo',
};

export enum EHocHam {
  GS = 'Giáo sư',
  PGS = 'Phó Giáo sư',
}

export enum EHocVi {
  CN = 'Cử nhân',
  KS = 'Kỹ sư',
  THS = 'Thạc sỹ',
  TS = 'Tiến sỹ',
  GVC = 'Giảng viên chính',
}

export enum EVaiTroFTU {
  VC = 'Viên chức',
  SV = 'Sinh viên',
  HVCH = 'Học viên cao học',
  NCS = 'Nghiên cứu sinh',
}

export enum ELoaiSanPhamDatDuoc {
  ISI_SCOPUS = 'Bài báo ISI/Scopus',
  BAI_BAO_TRONG_NUOC = 'Bài báo trong nước',
  SACH = 'Sách',
  CHUONG_SACH = 'Chương sách',
  SAN_PHAM_DAO_TAO = 'Sản phẩm đào tạo',
  BAO_CAO_TONG_KET = 'Báo cáo tổng kết',
  KHAC = 'Khác',
}

export enum ETinhTrangCongBo {
  CHAP_NHAN_CONG_BO = 'Chấp nhận công bố',
  DA_CONG_BO = 'Đã công bố',
  DA_XUAT_BAN = 'Đã xuất bản',
}

export enum ELoaiTapChiQuocTe {
  ISI = 'ISI',
  SCOPUS = 'Scopus',
  SCI = 'SCI',
  SCIE = 'SCIE',
  SSCI = 'SSCI',
  A_HCI = 'A&HCI',
  ESCI = 'ESCI',
  // ACI = 'ACI',
  QUOC_TE_KHAC = 'Quốc tế khác',
}

export enum EPhamViBaiBao {
  QUOC_TE = 'Quốc tế',
  TRONG_NUOC = 'Trong nước',
}

export enum ELoaiBaiVietHoiThao {
  KY_YEU_HTKH_QT_UY_TIN = 'Bài viết trên kỷ yếu HTKH quốc tế có uy tín',
  KY_YEU_HTKH_QT_KHAC = 'Bài viết trên kỷ yếu HTKH quốc tế khác',
  KY_YEU_HTKH_QG = 'Bài viết trên kỷ yếu HTKH quốc gia',
  KY_YEU_HTKH_TRUONG = 'Bài viết trên kỷ yếu HTKH cấp trường',
  KY_YEU_HTKH_DON_VI = 'Bài viết trên kỷ yếu HTKH cấp đơn vị',
  BAI_DICH_KY_YEU_HTKH = 'Bài dịch đăng trên kỷ yếu HTKH',
  THUOC_DE_TAI_QG = 'Bài viết trên kỷ yếu HTKH thuộc đề tài/nhiệm vụ/chương trình cấp Quốc gia',
  THUOC_DE_TAI_BTTP = 'Bài viết trên kỷ yếu HTKH thuộc đề tài/nhiệm vụ /chương trình cấp Bộ/Tỉnh/Thành phố ',
  THUOC_DE_TAI_CO_SO = 'Bài viết trên kỷ yếu HTKH thuộc đề tài/nhiệm vụ cấp Cơ sở/chương trình nghiên cứu',
}

export const MapKeyFieldThongKeGeneral = {
  [EKetQuaDuyet.CHUA_DUYET]: 'chuaTiepNhan',
  [EKetQuaDuyet.CHINH_SUA_LAI]: 'chinhSuaLai',
  [EKetQuaDuyet.DUYET]: 'duyet',
  [EKetQuaDuyet.GIANG_VIEN_DA_CHINH_SUA]: 'daChinhSua',
  [EKetQuaDuyet.KHONG_DUYET]: 'khongDuyet',
};

export enum EVaiTroNCKHSinhVienGV {
  GVHD1 = 'Giảng viên hướng dẫn 1',
  GVHD2 = 'Giảng viên hướng dẫn 2',
  GVHD3 = 'Giảng viên hướng dẫn 3',
}

export const fieldThongKeGeneral = {
  chuaTiepNhan: EKetQuaDuyet.CHUA_DUYET,
  chinhSuaLai: EKetQuaDuyet.CHINH_SUA_LAI,
  duyet: EKetQuaDuyet.DUYET,
  daChinhSua: EKetQuaDuyet.GIANG_VIEN_DA_CHINH_SUA,
  khongDuyet: EKetQuaDuyet.KHONG_DUYET,
};

export const fieldThongKeLoaiCongTrinh = {
  [EKetQuaDuyet.CHUA_DUYET]: 'dataChuaDuyet',
  [EKetQuaDuyet.DUYET]: 'dataOk',
  [EKetQuaDuyet.KHONG_DUYET]: 'dataNotOk',
  [EKetQuaDuyet.CHINH_SUA_LAI]: 'dataChinhSua',
};

export enum EGiaiDoanKhaiBao {
  TRUOC_TS = 'Trước Tiến sĩ',
  SAU_TS = 'Sau Tiến sĩ',
}

export enum ELoaiThanhTich {
  HUAN_LUYEN = 'Huấn luyện/Hướng dẫn',
  THAM_GIA_THI_DAU = 'Tham gia thi đấu',
}

export enum ECapGiaiThuongTacPhamThanhTich {
  QUOC_GIA = 'Quốc gia',
  QUOC_TE = 'Quốc tế',
  BO = 'Bộ',
  TINH = 'Tỉnh',
  NGANH = 'Ngành',
  BO_NGANH = 'Bộ ngành',
  THANH_PHO = 'Thành phố',
  TRUONG = 'Trường',
  KHU_VUC = 'Khu vực',
  VUNG_MIEN = 'Vùng miền',
}

export enum ETrangThaiHuongDanNCS {
  DANG_HUONG_DAN = 'Đang hướng dẫn',
  DA_HOAN_THANH = 'Đã hoàn thành',
}

export enum EDoiTuongHuongDanNCS {
  NCS = 'Nghiên cứu sinh',
  HVCH = 'Học viên cao học',
}

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
  Ngay = 'Lặp theo ngày',
  Tuan = 'Lặp theo tuần',
  Thang = 'Lặp theo tháng',
  Nam = 'Lặp theo năm',
}

export enum ECanBoNhanVien {
  quan_tri = 'Quản trị',
  sinh_vien = 'Sinh viên',
  nhan_vien = 'Nhân viên',
  can_bo_qlkh = 'Cán bộ QLKH',
  lanh_dao = 'Lãnh đạo',
  ke_toan = 'Kế toán',
}

export enum ELoaiXe {
  LANH_DAO_HOC_VIEN = 'Lãnh đạo HV',
  TRUONG_DON_VI = 'Trưởng đơn vị',
  PHO_TRUONG_DON_VI = 'Phó trưởng đơn vị',
  CAN_BO = 'Cán bộ',
  KHACH = 'Khách',
}

export enum ETrachNhiemHuongDan {
  CHINH = 'Chính',
  PHU = 'Phụ',
}

export enum ECsvc {
  XE = 'Xe',
  PHONG = 'Phòng họp',
}

export enum ELoaiXeCong {
  BON_CHO = '4 chỗ',
  BAY_CHO = '7 chỗ',
  MUOI_SAU_CHO = '16 chỗ',
  HAI_CHIN_CHO = '29 chỗ',
  BON_NAM_CHO = '45 chỗ',
}

export enum MaDichVuVps {
  MUON_OTO = 'MUON_OTO',
  MUON_PHONG_HOC = 'MUON_PHONG_HOC',
  BAO_CAO_SU_CO = 'BAO_CAO_SU_CO',
}

export enum ETrangThaiDonVps {
  DA_DUYET = 'Đã xử lý',
  DA_HUY = ' Đã hủy mượn',
  DA_TRA_XE = 'Đã trả xe',
  DANG_MUON = 'Đang mượn',
}

export enum ETypeTableRequest {
  GUI_DEN = 'Gửi đến',
  GUI_DI = 'Gửi đi',
  PHONG_QLKH = 'Phòng QLKH',
}

export const MapKeyColorTrangThaiDuyetThanhVien = {
  [ETrangThaiDuyetThanhVien.CHUA_XU_LY]: 'blue',
  [ETrangThaiDuyetThanhVien.DA_DUYET]: 'green',
  [ETrangThaiDuyetThanhVien.TU_CHOI]: 'red',
};

export const MapKeyColorTypeRequestThanhVien = {
  [ETypeRequestThanhVien.THAM_GIA]: 'green',
  [ETypeRequestThanhVien.ROI_KHOI]: 'red',
};

export enum EMauExportQLKH {
  GIO_THEO_DON_VI = 'Thống kê giờ NCKH của GV theo đơn vị',
  CONG_TRINH_THEO_NAM = 'Thống kê công trình NCKH theo năm',
  THAM_DINH = 'Kết quả thẩm định theo đơn vị',
  DANH_SACH_BAI_BAO_THEO_NAM = 'Danh sách bài báo theo năm',
  SO_LUONG_DE_TAI_THEO_NAM = 'Số lượng đề tài theo năm',
  SO_LUONG_BAI_BAO_THEO_NAM = 'Số lượng bài báo theo năm',
  CONG_TRINH_TUONG_UNG_DE_TAI = 'Công trình tương ứng đề tài',
  ISI_SCOPUS_THEO_NAM = 'Danh sách bài báo ISI/Scopus theo năm',
}

export enum ELoaiCauHoiBieuMau {
  SINGLECHOICE = 'SingleChoice',
  MULTIPLECHOICE = 'MultipleChoice',
  DROPDOWNMENU = 'DropdownMenu',
  GRIDSINGLECHOICE = 'GridSingleChoice',
  GRIDMULTIPLECHOICE = 'GridMultipleChoice',
  NUMERICRANGE = 'NumericRange',
  TEXT = 'Text',
  UPLOADFILE = 'UploadFile',
}

export const TagColor: Record<
  'GREEN' | 'YELLOW' | 'RED' | 'BLUE' | 'PURPLE' | 'ORANGE',
  {
    text: string;
    color: string;
  }
> = {
  GREEN: {
    text: '#2a8000',
    color: '#c6ffb3',
  },
  YELLOW: {
    text: '#666600',
    color: '#ffff99',
  },
  RED: {
    text: '#e60000',
    color: '#ffe6e6',
  },
  BLUE: {
    text: '#0059b3',
    color: '#cce6ff',
  },
  PURPLE: {
    text: '#aa00ff',
    color: '#f7e6ff',
  },
  ORANGE: {
    text: '#D97B67',
    color: '#FACBC0',
  },
};

export const ColorLichTuan = {
  'Chờ duyệt': '#008080ca',
  'Đã duyệt': '#469829',
  'Không duyệt': '#cc0e00e5',
  'Chính thức': '#bc426a',
};

export enum ECourseED {
  Course_0 = 'Course 0',
  Course_1 = 'Course 1',
  Course_2 = 'Course 2',
  Course_3 = 'Course 3',
  Course_3_Plus = 'Course 3 Plus',
}

export enum EKeyCauHinh {
  SSO_OAUTH_2 = 'SSO_OAUTH_2',
  APP_CONFIG = 'APP_CONFIG',
  ADDONS = 'ADDONS',
}
