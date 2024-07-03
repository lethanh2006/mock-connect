import type { HoiDongKHCN } from '../HoiDongKHCN/typings';
import type { ELoaiDeTai } from '../KeHoachDeTai/constants';
import type { EHocHam, EHocVi } from '../QuanLyKhoaHocV2/SanPhamNCKH/constants';
import type {
	EChucVuHoiDong,
	EDangSanPham,
	ELoaiDeTaiCaNhan,
	ELoaiUngDungTrongHocVien,
	EMenhGia,
	EMucDoDeTai,
	EPhaseDeTaiKHCN,
	ETrangThaiDiemDanh,
	ETrangThaiDuyetDuToan,
	ETrangThaiGhiChuDuToanKinhPhi,
	ETrangThaiNghiemThu,
	ETrangThaiNopNghiemThu,
	ETrangThaiTienDo,
	EVaiTroDeTai,
} from './constants';

declare module DeTaiKHCN {
	export interface ThanhVienDeTai {
		index: number;
		userId: string;
		maDinhDanh: string;
		maDonVi: string;
		idDonVi: string;
		tenDonVi: string;
		chucVu: string;
		danhSachChucVuHoiDong: EChucVuHoiDong[];
		chucVuHoiDong: EChucVuHoiDong;
		email: string;
		hocHam: EHocHam;
		hocVi: EHocVi;
		soDienThoai: string;
		ngaySinh: string;
		donViCongTac: string;
		diaChi: string;
		ten: string;
		trangThaiDiemDanh: ETrangThaiDiemDanh;
		chuyenNganhDaoTaoCaoNhat: string;
		vaiTroDeTai: EVaiTroDeTai;
		danhSachVaiTroDeTai: EVaiTroDeTai[];
		noiSinh: string;
		tenLopHanhChinh: string;
		maLopHanhChinh: string;
		cccd: string;
		soTaiKhoanNganHang: string;
	}

	export interface KinhPhiDeXuat {
		kinhPhi: number;
		menhGia: EMenhGia;
	}

	export interface TimeLine {
		startDate: string;
		endDate: string;
		noiDungTimeline: string;
		ketQuaDuKien: string;
		kinhPhiDuKien: number;
		sanPhamUrl: string;
		danhSachNguoiThucHien: ThanhVienDeTai[];
	}

	export interface DangKyDeXuat {
		ten: string;
		loaiDeTai: ELoaiDeTai;
		loaiCaNhan: ELoaiDeTaiCaNhan;
		comment: string;
		duKienToChuc: string;
		chuTriDeTai: ThanhVienDeTai;
		mucTieuDeTai: string;
		noiDungDeTai: string;
		ketQuaDeTai: string;
		thoiGianThucHienBatDau: string;
		thoiGianThucHienKetThuc: string;
		kinhPhi: KinhPhiDeXuat;
		tinhCanThietVaMoi: string;
		tomTatDeXuat: string;
		thuocLinhVuc: string;
		donViChuTri: string;
		maDonViChuTri: string;
		coQuanQuanLy: string;
		coQuanPhoiHop: string;
		soDienThoai: string;
		diaChiCongTac: string;
		noiDungNghienCuu: TimeLine[];
		danhSachCTV: ThanhVienDeTai[];
		attachmentUrl: string;
		ghiChu: string;
		urlPhieuDangKyDeXuat: string;
		nguoiHuongDan: DeTaiKHCN.ThanhVienDeTai;
	}

	export interface XetDuyetDeXuat {
		kinhPhi: KinhPhiDeXuat;
		bienBanXetDuyetUrl: string[];
		commentHoiDong: string;
		comment: string;
		hoiDongId: string[];
		quyetDinhGiaoUrl: string;
		commentQuyetDinhGiaoUrl: string;
		ngayDuyet: string;
		hoiDong: HoiDongKHCN.IRecord[];
	}

	export interface TimelineThuyetMinh {
		index: number;
		startDate: string;
		endDate: string;
		noiDungTimeline: string;
		ketQuaDuKien: string;
		kinhPhiDuKIen: number;
		sanPhamUrl: string[];
		danhSachNguoiThucHien?: ThanhVienDeTai[];
	}

	export interface SanPhamThuyetMinh {
		index?: number;
		dangSanPham: EDangSanPham;
		tenSanPham: string;
		donViTinh: string;
		mucChatLuongThamKhaoLoai1: string;
		mauTuongTuTrongNuoc: string;
		mauTuongTuNgoaiNuoc: string;
		soLuong: number;
		chuThichKetQua: string;
		fileType: string[];
		yeuCauLoai23: string;
		chuThichYeuCau: string;
		duKienNoiCongBo: string;
		sanPhamUrl: string[];
	}

	export interface ThuyetMinh {
		deCuongUrl: string[];
		soLuocTinhHinhNghienCuuTrongNuoc: string;
		soLuocTinhHinhNghienCuuNgoaiNuoc: string;
		nhuCauThucTeKhaNangApDung: string;
		timeline: TimelineThuyetMinh[];
		sanPhamDeCuong: SanPhamThuyetMinh[];
		sanPhamDeCuongDangI: SanPhamThuyetMinh[];
		sanPhamDeCuongDangII: SanPhamThuyetMinh[];
		sanPhamDeCuongDangIII: SanPhamThuyetMinh[];
		duToanKinhPhi: DuToanKinhPhi[];
		scanDeCuong: string;
		hopDong: string;
		comment: string;
		hoiDongId: string[];
		hoiDong: HoiDongKHCN.IRecord[];
		tongDiem: number;
		bienBanUrl: string[];
		daThucHienTamUng: boolean;
		ketLuanTienDo: ETrangThaiTienDo;
		duKienLichBaoVe: string;
		banGiaiTrinhUrl: string[];
	}

	export interface GhiChuDuToanKinhPhi {
		_id: string;
		createdAt: string;
		updatedAt: string;
		noiDung: string;
		thoiGianGopY: string;
		tenNguoiChoGopY: string;
		ssoIdNguoiGopY: string;
		maCanBoNguoiGopY: string;
		duToanKinhPhiId: string;
		trangThai: ETrangThaiGhiChuDuToanKinhPhi;
	}

	export interface DuToanKinhPhi {
		_id: string;
		soThuTu: number;
		keHoachHoatDongNamId: string;
		hoatDong: string;
		donViTinh: string;
		donViTinhKhac: string;
		soLuong: number;
		soLuongNguoi: number;
		soLuongNgay: number;
		soLuongKhac: number;
		dinhMuc: number;
		ghiChu: string;
		tienDoHoanThanh: string;
		tepDinhKem: string[];
		chungTuYeuCau: string;
		info: any;
		danhSachGhiChu: GhiChuDuToanKinhPhi[];
		trangThaiDuyetDuToan: ETrangThaiDuyetDuToan;
		createdAt: string;
		updatedAt: string;
	}

	export interface SanPhamNghiemThu {
		loai: string;
		url: string[];
	}

	export interface UngDungHocVien {
		index: number;
		stt: number;
		loaiUngDung: ELoaiUngDungTrongHocVien;
		noiDungUngDung: string;
		minhChungUrl: string[];
	}

	export interface KeHoachUngDung {
		index: number;
		noiDung: string;
		thoiGian: string;
		diaDiem: string;
		yeuCau: string;
	}

	export interface NghiemThu {
		sanPham: SanPhamNghiemThu[];
		comment: string;
		banGiaiTrinhUrl: string[];
		bienBanUrl: string[];
		hoiDongId: string[];
		hoiDong: HoiDongKHCN.IRecord[];
		baoCaoUrl: string[];
		keHoachUngDung: KeHoachUngDung[];
		sanPhamChinh: SanPhamThuyetMinh[];
		sanPhamDeCuongDangI: SanPhamThuyetMinh[];
		sanPhamDeCuongDangII: SanPhamThuyetMinh[];
		sanPhamDeCuongDangIII: SanPhamThuyetMinh[];
		noiDungUngDungHocVien: UngDungHocVien[];
		noiDungUngDungKhac: string;
		[x: string];
	}

	export interface TaiLieu {
		ten: string;
		url: string[];
		ghiChu: string;
	}

	export type KetQuaHoiDong = Record<string, HoiDongKHCN.KetQuaDeTaiHoiDong>;

	export interface IRecord {
		_id: string;
		tenHoiDong?: string;
		ketQuaHoiDong?: KetQuaHoiDong;
		dangKyKhcn: DangKyDeXuat;
		xetDuyetKhcn: XetDuyetDeXuat;
		deCuongKhcn: ThuyetMinh;
		ketQuaHoiDongXetChonDeXuat?: HoiDongKHCN.KetQuaDeTaiHoiDong;
		ketQuaHoiDongXetDuyetThuyetMinh?: HoiDongKHCN.KetQuaDeTaiHoiDong;
		ketQuaHoiDongNghiemThu?: HoiDongKHCN.KetQuaDeTaiHoiDong;
		maDeTai: string;
		dotDangKyId: string;
		commentNopDeCuong: string;
		commentThucHien: string;
		commentNopNghiemThu: string;
		mucDoDeTai: EMucDoDeTai;
		urlDeXuat: string;
		urlQuyetDinhGiao: string;
		nghiemThuKhcn: NghiemThu;
		mucDoDeTai: EMucDoDeTai;
		ngayBatDauDangKy: string;
		ngayKetThucDangKy: string;
		ngayBatDauXetDuyet: string;
		ngayKetThucXetDuyet: string;
		ngayBatDauDeCuong: string;
		ngayKetThucDeCuong: string;
		ngayBatDauNghiemThu: string;
		ngayKetThucNghiemThu: string;
		phaseDeTaiKhcn: EPhaseDeTaiKHCN;
		lock: boolean;
		lockXetDuyet: boolean;
		lockNopDeCuong: boolean;
		lockDeCuong: boolean;
		lockThucHien: boolean;
		lockNopNghiemThu: boolean;
		lockNghiemThu: boolean;
		lockSauNghiemThu: boolean;
		trangThaiDangKy: ETrangThaiDangKy;
		trangThaiXetDuyetDangKy: ETrangThaiXetDuyetDangKy;
		trangThaiNopDeCuong: ETrangThaiNopDeCuong;
		commentNopDeCuong: string;
		trangThaiXetDuyetDeCuong: ETrangThaiXetDuyetDeCuong;
		trangThaiThucHien: ETrangThaiThucHien;
		commentThucHien: string;
		trangThaiNghiemThu: ETrangThaiNghiemThu;
		trangThaiNopNghiemThu: ETrangThaiNopNghiemThu;
		taiLieuSauNghiemThu: TaiLieu[];
		hoanThanh: boolean;
		quyetDinhGiaoId: string;
		urlQuyetDinhGiao: string;
		mauQuyetDinhGiao: string;
	}
}
