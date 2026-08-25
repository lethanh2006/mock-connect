import type { SinhVien } from '@/services/DaoTao/SinhVien/typings';

export type TStep1Payload = {
	firstName: string;
	middleName: string;
	lastName: string;
	ngaySinh: string;
	gioiTinh: string;
	soDienThoai: string;
	maVungDienThoai: string;
	cccd: string;
	ngayCapCccd: string;
	noiCapCccd: string;
	email: string;
	quocTich: string;
	maQuocTich: string;
	danToc: string;
	tonGiao: string;
	tinhTpNoiSinh: string;
	maTinhTpNoiSinh: string;
	noiOHienTai: SinhVien.TDiaChi;
	hoKhauThuongTru: SinhVien.TDiaChi;
	tenNganHang: string;
	soTaiKhoanNganHang: string;
	chiNhanhNganHang: string;
	chieuCao: number;
	canNang: number;
	maLoaiKhuyetTat?: string;
	ghiChuYTe?: string;
	maBuuChinh?: string;
	urlMatTruocCccd: string;
	urlMatSauCccd: string;
	chuTaiKhoanNganHang: string;
	nhomMau?: string;
	coVanDeSucKhoe: boolean;
	urlDinhKemVanDeSucKhoe?: string;
	isRegisterFreeDormitory?: boolean;
	passportNumber?: string;
	urlDinhKemHoChieu?: string;
	visa?: {
		tenQuocGia?: string;
		soHieuVisa?: string;
		loaiVisa?: string;
		ngayCap?: string;
		ngayHetHan?: string;
		coQuanCap?: string;
		noiCap?: string;
		urlDinhKemVisa?: string;
	};
	danhSachGiayToNhapHoc: {
		id: string;
		urlFile?: string;
	}[];
	firstGenStudent: boolean;
	adjustmentNeeds?: string[];
	adjustmentOthersText?: string;
	anhDaiDienUrl?: string;
};

export type TThongTinTruongCap3 = {
	tenTruong?: string;
	tenTinh?: string;
	maTinh?: string;
	maTruong?: string;
	diem: {
		diemToan?: number;
		diemVan?: number;
		diemTiengAnh?: number;
		diemLy?: number;
		diemHoa?: number;
		diemSinh?: number;
		diemTrungBinhNam?: number;
	};
};

export type TStep2Payload = {
	doiTuongUuTienTuyenSinh?: string;
	khuVucUuTienTuyenSinh?: string;
	xepLoaiHocTapTHPT?: string;
	namTotNghiep?: number;
	coBangDaiHoc: boolean;
	thongTinDaiHoc?: {
		tenTruongDaiHoc?: string;
		tenNganhHoc?: string;
		trinhDoHocVan?: string;
		tuNgay?: string;
		denNgay?: string;
	};
	thongTinHocTapTHPT: {
		noiHoc: string;
		quocGiaHoc?: string;
		thanhPho?: string;
		tenTruongCap3?: string;
		tenTinh?: string;
		maTinh?: string;
		maTruong?: string;
		coDoiTruong: boolean;
		truongLop10: TThongTinTruongCap3;
		truongLop11: TThongTinTruongCap3;
		truongLop12: TThongTinTruongCap3;
	};
	thongTinChungChiTiengAnh?: {
		loaiChungChi?: string;
		isChungChiKhac?: boolean;
		diemChungChi?: string;
		diemNghe?: string;
		diemNoi?: string;
		diemDoc?: string;
		diemViet?: string;
		ngayCapChungChi?: string;
		noiCapChungChi?: string;
		urlFileMinhChung?: string;
	};
};

export type TDiaChiGiaDinh = SinhVien.TDiaChi & { quocGia?: string };

export type TFamilyMember = {
	key?: number;
	loaiThanhVien: string;
	hoDem?: string;
	ten?: string;
	fullName?: string;
	ngaySinh?: string;
	quocTich?: string;
	danToc?: string;
	maVungDienThoai?: string;
	soDienThoai?: string;
	soDienThoai2?: string;
	email?: string;
	coQuanCongTac?: string;
	trinhDoDaoTao?: string;
	tonGiao?: string;
	ngheNghiep?: string;
	soTheBHYT?: string;
	diaChiHienNay?: TDiaChiGiaDinh;
	hoKhauThuongTru?: TDiaChiGiaDinh;
	hoatDongChinhTriXaHoi?: string;
	laLienLacKhanCap?: boolean;
	taoTaiKhoan?: boolean;
};

export type TStep3Payload = {
	thanhVienGiaDinh: Omit<TFamilyMember, 'key' | 'fullName'>[];
	dongYNhanThongBao: boolean;
	dongYDieuKhoan: boolean;
};

export type TStep4Payload = {
	id1: string;
	id2: string;
	id3: string;
	alreadyHadCheckup?: boolean;
	healthCheckupAttachment?: string;
	hasInsurance?: boolean;
	healthInsuranceNumber?: string;
	healthInsuranceAttachment?: string;
	isRegisterDormitory?: boolean;
};
