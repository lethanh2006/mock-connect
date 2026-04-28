import { type ELoaiToChucDayHoc } from '../constant';
import { ETrangThaiPhieuDkyCtdt } from '../PhieuDkyCTDT/constant';

declare module HocPhan {
	export interface IRecord {
		_id: string;
		ma: string;
		ten: string;
		tenTiengAnh?: string;
		maLoaiHocPhan: string;
		loaiHocPhan?: ILoaiHocPhan;
		soTinChi: number;
		maDonVi: string;
		trangThaiKqht?: ETrangThaiPhieuDkyCtdt;
		donVi?: ToChucNhanSu.IDonVi;

		active: boolean;
		deCuongHienTaiId?: string;
		deCuongHienTai?: IDeCuongHocPhan;
		createdAt?: string;
		updatedAt?: string;
	}

	export interface ILoaiHocPhan {
		_id: string;
		ma: string;
		ten: string;

		isTinhDiem: boolean;
		isTinhSoTinChiDangKy: boolean;
		isTinhSoTinChiTichLuy: boolean;
		khoiTuChon?: boolean;
		khoiTotNghiep?: boolean;
	}

	export interface IDeCuongHocPhan extends ITrongSoDeCuong, IHinhThucThi, ITrongSoThi {
		_id: string;
		ma: string;
		maHocPhan: string;
		hocPhan: IRecord;
		// nguoiBienSoan: string;
		// ngayApDung: string;
		thoiDiemApDung?: string;
		maCanCu: string;
		canCu: VanBanQuyDinh.IRecord;
		// soTinChi: number;
		// isTinhDiem: boolean;
		mucTieuHocPhan: string;
		chuanDauRa: string;
		// noiDungTomTat: string;
		// noiDungChiTiet: string;
		active: boolean;
		createdAt?: string;
		updatedAt?: string;
		url?: string | null;

		trangThaiDuyet: ETrangThaiDuyetDeCuongHocPhan;

		thongTinTrongSo: IThongTinTrongSo[];
		thongTinTrongSoThi?: IThongTinTrongSo[];
		/** Ngưỡng điểm THI KTHP đủ điều kiện đạt học phần (mặc định: 0.1)
		 * => Điểm thi >= ngưỡng thì mới đủ đạt học phần (tương đương ngưỡng điểm THÀNH PHẦN) */
		nguongDiemDieuKienKthp?: number;

		//fake data
		danhSachHinhThuc: string[];
	}

	export interface IThongTinTrongSo {
		field: number;
		trongSo: number;
		/** Ngưỡng điểm đủ điều kiện dự thi (mặc định: 0.1) => Điểm sinh viên >= ngưỡng thì mới đủ ĐKDT */
		nguongDiemDieuKien?: number;
		moTa?: string;

		hinhThucDanhGia?: string;
		chuanDauRa?: string;
	}

	export interface ITrongSoThi {
		trongSoThi1?: number;
		trongSoThi2?: number;
		trongSoThi3?: number;
		trongSoThi4?: number;
		trongSoThi5?: number;
	}

	export interface IHinhThucThi {
		hinhThucThi1Id: string;
		hinhThucThi2Id: string;
		hinhThucThi3Id: string;
		hinhThucThi4Id: string;
		hinhThucThi5Id: string;
		// hinhThucThi6Id: string;
		// hinhThucThi7Id: string;
		// hinhThucThi8Id: string;
		// hinhThucThi9Id: string;
		// hinhThucThi10Id: string;
	}

	export interface ITrongSoDeCuong {
		trongSo1?: number;
		trongSo2?: number;
		trongSo3?: number;
		trongSo4?: number;
		trongSo5?: number;
		trongSo6?: number;
		trongSo7?: number;
		trongSo8?: number;
		trongSo9?: number;
		trongSo10?: number;
	}

	export interface IGiangVienDeCuong {
		_id: string;
		deCuongId: string;
		deCuong?: IDeCuongHocPhan;
		nhanSuSsoId: string | null;
		hoTen?: string | null;
		chucDanh?: string | null;
		hocHam?: string | null;
		hocVi?: string | null;
		soDienThoai?: string | null;
		diaChi?: string | null;
	}

	export interface ILichTrinhChung {
		_id: string;
		tieuDe: string;
		ten: string;
		deCuongHpId: string;
		gioLyThuyet: number;
		gioBaiTapTL: number;
		gioThucHanh: number;
		gioTuHoc: number;

		giaiDoanDayHoc?: string; // Giai đoạn dạy học (1, 2, 3, 4, trước khi đến lớp, trên lớp...)
		listMaChuanDauRa?: string[]; // Danh sách mã chuẩn đầu ra CLO
		listTrongSoTuongUng?: string[]; // [trongSo1, trongSo2, trongSoThi1, trongSoThi2...]
		thuTuHienThi?: number; // Thứ tự hiển thị (1, 2, 3, 4, 5...)
	}

	export interface ITienTrinhHocPhan {
		_id: string;
		deCuongId: string;
		deCuong?: IDeCuongHocPhan;
		tuanBatDau: number;
		tuanKetThuc: number;
		noiDung: string;
		noiDungChinh: string;
		yeuCauSinhVien: string;
		ghiChu: string;
		ndTienTrinhList?: INoiDungTienTrinh[];
	}

	export interface INoiDungTienTrinh {
		_id: string;
		tienTrinhHpId: string;
		tienTrinhHp?: ITienTrinhHocPhan;
		loaiToChucDayHoc: ELoaiToChucDayHoc;
		soTiet: number;
	}

	// Setting thư viện
	export interface ISettingThuVien {
		enable?: boolean;
		thuVienUrl?: string;
	}

	export interface IHocLieuDeCuong {
		_id: string;
		deCuongId: string;
		deCuong?: IDeCuongHocPhan;

		idTaiLieuThuVien?: number; // Tài liệu tinh vân
		loaiTaiLieuThuVien?: 'item' | 'edata';
		maTaiLieuThuVien?: string;

		tieuDe?: string;
		moTa?: string;
		tacGia?: string;
		tenNhaXuatBan?: string;
		namXuatBan?: number;
		batBuoc: boolean;
		url?: string;
	}

	/** Chuẩn đầu ra học phần (CLO) */
	export interface IChuanDauRa {
		_id: string;
		/** Mã Chuẩn đầu ra (CLO1, CLO2...), unique trong CTĐT */
		ma: string;
		ten: string;
		diemToiThieu?: number;

		deCuongId: string;
		deCuong?: IDeCuongHocPhan;

		moTa?: string;
	}

	export interface ICdrHinhThuc {
		_id?: string;
		cloId: string; // CLO
		dmMucTieuHocPhan?: IChuanDauRa;
		trongSoTuongUng: string; // trongSo1, trongSo2, trongSoThi1, trongSoThi2...

		tyLeAnhHuong?: number;
		/** Có tính điểm hay không
		 * Chỉ cần nhập điểm cho những hình thức đánh giá có isTinhDiem = true
		 */
		isTinhDiem?: boolean;
		diemToiThieu?: number; // Ngưỡng điểm tối thiểu để tính đạt CLO
	}
}
