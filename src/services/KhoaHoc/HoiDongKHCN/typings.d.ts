import type { ETrangThaiNghiemThu, ETrangThaiXetDuyetDeCuong } from '@/utils/constants';
import type { ETrangThaiXetDuyetDangKy } from '../DeTaiKHCN/constants';
import type { DeTaiKHCN } from '../DeTaiKHCN/typings';
import type { KeHoachDeTai } from '../KeHoachDeTai/typings';
import type { ETrangThaiHoiDongKHCN } from './constants';

declare module HoiDongKHCN {
	export interface IRecord {
		deTaiIds: string[];
		loaiHoiDongKhcn: ELoaiHoiDongKHCN;
		dotDangKyId: string;
		ten: string;
		thoiGianBatDau: string;
		_id: string;
		thoiGianKetThuc: string;
		danhSachThanhVien: DeTaiKHCN.ThanhVienDeTai[];
		danhSachThanhVienThamGia: DeTaiKHCN.ThanhVienDeTai[];
		nguoiTao: DeTaiKHCN.ThanhVienDeTai;
		danhSachDeTai: DeTaiKHCN.IRecord[];
		dotDangKy: KeHoachDeTai.IRecord;
		hetHan: ETrangThaiHoiDongKHCN;
		bienBanUrl: string[];
		quyetDinhThanhLapHoiDong: string;
		daKetThuc: boolean;
		daDiemDanh: boolean;
		bienBanNhanXet: string;
		thoiGianDiemDanh: string;
		daKetThuc: boolean;
		noiDungHop: string;
		diaDiem: string;
	}

	export interface NhanXetHoiDong {
		_id: string;
		thanhVienNhanXet: DeTaiKHCN.ThanhVienDeTai;
		nguoiTaoDeTai: DeTaiKHCN.ThanhVienDeTai;
		hoiDongId: string;
		deTaiId: string;
		nhanXet: string;
		urlBienBan: string;
		hoiDong: HoiDong.IRecord;
		deTai: DeTaiKHCN.IRecord;
	}

	export interface KetQuaDeTaiHoiDong {
		deTaiId: string;
		ketQuaXetDuyet: DeTaiKHCN.XetDuyetDeXuat;
		ketQuaDeCuong: DeTaiKHCN.ThuyetMinh;
		ketQuaNghiemThu: DeTaiKHCN.NghiemThu;
		ngayDuyet?: string;
		trangThaiXetDuyetDangKy: ETrangThaiXetDuyetDangKy;
		trangThaiXetDuyetDeCuong: ETrangThaiXetDuyetDeCuong;
		trangThaiNghiemThu: ETrangThaiNghiemThu;
	}
}
