import { type ELoaiHocPhanDangKyTinChi } from '@/services/DaoTao/DangKyTinChi/constant';
import type { DiemHocPhan } from '@/services/DaoTao/DiemHocPhan/typing';
import { type HocPhan } from '@/services/DaoTao/HocPhan/typings';
import { type SinhVien } from '@/services/DaoTao/SinhVien/typings';
import { type ThoiKhoaBieu } from '@/services/DaoTao/ThoiKhoaBieu/typing';
import type { ETrangThaiDuThi } from '@/services/KhaoThi/SinhVienThi/constant';
import type { ToChucNhanSu } from '@/services/ToChucNhanSu/typing';
import type { QuyDoiDiem } from '../QuyDoiDiem/typing';
import type { ETrangThaiThi } from '../constant';
import type {
	ELoaiDiemChu,
	ELoaiLopHocPhan,
	EModeLms,
	ETrangThaiDangKyGiangDay,
	ETrangThaiLopHocPhan,
} from './constant';

export declare module LopHocPhan {
	export interface IRecord {
		_id: string;
		ten: string;
		tenCha?: string;
		maLop: string;
		maLopCha?: string;
		maHocKy: string;
		csdt?: CSDT.IRecord;
		hocKy?: HocKy.IRecord;
		maHocPhan: string;
		hocPhan?: HocPhan.IRecord;
		gioiThieuChung?: string;
		lmsUrl?: string; // Link học trực tuyến
		syncLms?: boolean;
		listTaiLieu?: string[] | null; // Tài liệu học tập

		siSoToiDa: number;
		siSo?: number; // Sĩ số hiện tại
		loai: ELoaiLopHocPhan;
		soThuTuLop?: number;
		soThuTuNhom?: number;
		moodleShortname?: string | null;
		phongHoc?: string;
		parent?: IRecord;
		children?: IRecord[];
		/** Lớp ghép thời khóa biểu cùng */
		tenLopGhepTkb?: string;
		lopGhepTkb?: IRecord;

		nhanSuList?: IRecordNhanSuLopHP[];
		sinhVienList?: SinhVien.IRecord[];
		maHoaLichHoc?: TMaHoaLichHoc[];
		thoiKhoaBieuList?: ThoiKhoaBieu.IRecord[];
		trangThaiLop: ETrangThaiLopHocPhan;

		/** Đã chốt kế hoạch rà soát học phần chưa? */
		chotKeHoach?: boolean;
		chotTkb: boolean;
		dangKyTinChi?: boolean;
		khoaTkb?: boolean;

		// lopHpHcList?: Partial<ILopHpLopHc>[];
		// doiTuongLopHanhChinh?: EDoiTuongLopHanhChinh;

		maCSDT?: string;
		maHinhThuc: string;
		hinhThuc?: HinhThucDaoTao.IRecordCoSo;
		maTinhChat: string;
		// tinhChat?: TinhChatChuongTrinh.IRecord;

		// Đề cương học phần học kỳ
		deCuong?: { deCuong?: Partial<HocPhan.IDeCuongHocPhan>; deCuongId: string };

		// Sinh viên get Lớp học phần
		diem?: IRecordSinhVienLopHP;

		thongKeDiemDanhLhp?: TThongKeDiemDanh;
		soBaiTap?: number;
		soBaiDang?: number;

		phongCapacity?: number;
		waitlistCount?: number;
	}

	export type TThongKeDiemDanh = {
		soBuoi?: number;
		soBuoiChuaDiemDanh?: number;
		soBuoiDaDiemDanh?: number;
		coMat?: number;
		vangCoPhep?: number;
		monVeSom?: number;
		vangKhongPhep?: number;
	};

	export type TMaHoaLichHoc = {
		thu: number;
		tietBatDau: number;
		soTiet: number;
		gioBatDau?: string;
		gioKetThuc?: string;
		nhanSuSsoId?: string; //SsoId
		nhanSu?: ToChucNhanSu.INhanSu;
		maNhanSu?: string;
		tenNhanSu?: string;

		loaiHinhHocTap?: ELoaiHinhHocTap;
		nhomTietHocId?: string;
		danhSachTuan: { tuan: number; tkbId: string }[];
		phongHoc?: string;
	};

	export interface IRecordNhanSuLopHP {
		_id: string;
		lopHocPhanId: string;
		lopHocPhan: IRecord;
		nhanSuSsoId: string;
		nhanSu?: ToChucNhanSu.INhanSu;
		maNhanSu?: string;
		tenNhanSu?: string;
		trangThai: ETrangThaiDangKyGiangDay;
	}

	export interface IRecordSinhVienLopHP {
		_id: string;
		lopHocPhanId: string;
		lopHocPhan: IRecord;
		sinhVienSsoId: string;
		sinhVien?: SinhVien.IRecord;
		maKhoaNganh?: string;

		maSvHk?: string; // {ssoId}|{maHocKy}
		idPhieuDktc?: string;
		// phieuDktc: ;

		loai?: ELoaiHocPhanDangKyTinChi;
		diemHpSvHk?: IDiemHpSvHk;

		//fake
		trangThai?: ETrangThaiDangKyTinChi;
	}

	export interface IDiemHpSvHk
		extends IDiemThanhPhan,
			IDiemThi,
			IDiemTongKet,
			HocPhan.ITrongSoDeCuong,
			HocPhan.ITrongSoThi {
		_id: string;
		sinhVienSsoId: string;
		// maSinhVien: string;
		sinhVien?: SinhVien.IRecord;
		maHocPhan: string;
		hocPhan?: HocPhan.IRecord;
		maHocKy: string;
		hocKy?: HocKy.IRecord;

		// Điểm có từ lớp học phần?
		tenLopHocPhan?: string;
		soThuTuLop?: number;
		lopHocPhan?: IRecord;

		// Điểm có từ quy đổi điểm?
		dotDangKyQuyDoiDiemId: string;
		dotDangKyQuyDoiDiem?: QuyDoiDiem.IQuyDoiDiemSinhVien;
		isCongNhanQuyDoiDiem?: boolean;
		/** Điểm từ quy đổi điểm có tính vào tích lũy? */
		coTichLuyQuyDoi?: boolean;

		// trangThaiDuyetDiemThanhPhan?: ETrangThaiDuyetDiem;
		// trangThaiDuyet?: ETrangThaiDuyetDiem;

		dat?: boolean; // Có đạt học phần này không?
		khoa: boolean; // Khóa điểm thành phần
		khoaDiemThi: boolean; // Khóa điểm thi
		public: boolean;
		/** Điểm nhập cứng, ko tính toán từ data? */
		isStatic?: boolean;
		ghiChuDiem?: string;
		/** Bỏ qua HP ko tính vào điểm tích lũy */
		skip?: boolean;

		/** Chi tiết điểm chuẩn đầu ra học phần phục vụ tính chuẩn đầu ra CLO, PLO */
		danhSachDiemChuanDauRaThanhPhan?: TChiTietDiemCdr[];
		danhSachDiemChuanDauRaThi?: TChiTietDiemCdr[];
		danhSachDiemChuanDauRaThiCuoi?: TChiTietDiemCdr[];
		/** Danh sách điểm chuẩn đầu ra học phần theo CLO */
		danhSachDiemMucTieuDauRa?: TDiemChuanDauRa[];

		/** Khi get all điểm hphk của sinh viên */
		infoKhoaNganh?: Record<string, TInfoKhoaNganh>; // `maKhoaNganh` 7380101_7_1_2022: { ... }

		/** Đã đánh giá giảng viên? `true` => Cho xem điểm */
		daDanhGiaGiangVien?: boolean;

		// maKhoaNganh: string;
		// khoaNganh?: KhoaNganh.IRecord;

		khoiHpCt?: ChuongTrinhDaoTao.IKhoiHocPhanCTDT;
	}

	export type TChiTietDiemCdr = {
		// listChuanDauRa?: ChuongTrinhDaoTao.ICdrMucTieuHocPhan[]; // PLO - CLO
		maClo: string; // CLO1
		trongSo: number; // Trọng số của CLO này
		/** diemThanhPhan1, diemThanhPhan2, diemThi1, diemThi2 ... */
		field: keyof IDiemThanhPhan | keyof IDiemThi;
		diem?: number;
	};

	export type TDiemChuanDauRa = {
		maClo: string; // CLO1
		diem?: number;

		pass?: boolean; // Có đạt CLO này không?
		diemToiThieu?: number; // Điểm tối thiểu để đạt CLO này
	};

	type TInfoKhoaNganh = Pick<DiemHocPhan.IDiemSinhVien, 'maHocKyDat' | 'maHocKyCaiThien' | 'soLanHoc' | 'trongCtdt'> & {
		maHocPhanQuyDoi?: string;
	};

	export interface IDiemThanhPhan {
		diemThanhPhan1?: number;
		diemThanhPhan2?: number;
		diemThanhPhan3?: number;
		diemThanhPhan4?: number;
		diemThanhPhan5?: number;
		diemThanhPhan6?: number;
		diemThanhPhan7?: number;
		diemThanhPhan8?: number;
		diemThanhPhan9?: number;
		diemThanhPhan10?: number;
		trangThaiThi?: ETrangThaiThi;
	}

	export interface IDiemThi {
		diemThi1?: number;
		diemThi2?: number;

		/** Điểm thi 1, 2 của trọng số thứ 2 */
		diemThi12?: number;
		diemThi22?: number;

		diemThi13?: number;
		diemThi23?: number;
		diemThi14?: number;
		diemThi24?: number;
		diemThi15?: number;
		diemThi25?: number;
	}

	export interface IDiemTongKet {
		/** Trạng thái dự thi */
		trangThaiDuThi?: ETrangThaiDuThi;

		diemKthp?: number;
		diemTongKet?: number;
		diemThang4?: number;
		diemChu?: ELoaiDiemChu;
	}

	export interface ThongTinChungLopTinChiRecord {
		giangVien?: Login.Profile;
		giangVienList: Login.Profile[];
		sinhVienList: ThongTinSinhVien[];
		soBuoiVang?: any[];
		soBuoiVangCoPhep?: any[];
		diemCong?: IDiemCong[];
	}

	export interface ILopHpLopHc {
		_id?: string;
		maLopHp: string;
		lopHocPhan?: IRecord;
		maLopHc: string;
		lopHanhChinh?: LopHanhChinh.IRecord;
	}

	export type TViewDiemHocKy = IDiemHpSvHk & {
		title?: string;
		tenHocPhan?: string;
		maHocPhanQuyDoi?: string;
		tichLuy?: boolean;
		trongChuongTrinh?: boolean;
	};

	export interface ILmsInfo {
		_id?: string;
		sinhVien: {
			_id: string; //ssoId
			id: number;
			ma: string;
			ten: string;
			email: string;
		};
		hocPhan: {
			_id: string;
			id: number;
			ten: string;
			ma: string;
		};
		tiLeHoanThanh: number;
		thoiGianTaoVao: string;
		thoiGianCapNhatGanNhatVao: string;
		hocLieu: THocLieuLms[];
		hocLieuAll: THocLieuAllLms[];

		textCheckBaiKiemTra: string;
	}

	export type THocLieuLms = {
		id: number;
		hoanThanh: boolean;
		soLanLamBaiKiemTra: number;
		ten: string;
		thoiGianHoanThanh: string;
		isCategory: boolean;
	};

	export type THocLieuAllLms = {
		id: number;
		isCategory: boolean;
		laBaiKiemTra: boolean;
		soLanLamBaiKiemTra: number;
		ten: string;
		textCheckBaiKiemTra: string;
		thoiGianBatDau: string;
		thoiGianHoanThanh: string;
		thoiGianKetThuc: string;
		isCategory: boolean;
		hoanThanh: boolean;
		quaHan: boolean;
	};

	export type TSettingLMS = {
		_id?: string;
		chucDanhGiamDoc: string;
		lmsMode: EModeLms;
		supervisingUnit: string;
		tenGiamDoc: string;
		tenTruongPhongQLDT: string;
		university: string;
		syllabusPolicies: string;
	};
}
