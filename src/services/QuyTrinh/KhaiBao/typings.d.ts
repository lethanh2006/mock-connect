import type { TruongThongTin } from '@/services/LoaiHinhNCKH/typings';
import type { ETrangThaiThanhToanVI } from '../../DVMC/constant';
import { ETrangThaiThanhToan } from '../../DVMC/constant';
import type { EMaTrangThaiThanhToan } from '../../TaiChinh/constant';
import type { QuyTrinh } from '../typings';

declare module KhaiBaoQuyTrinh {
	export interface IRecord {
		_id: string;
		ssoId: string;
		quyTrinhId: string;
		moTa: string;
		dotQuyTrinhId: string;
		danhSachBuocXuLy: IBuocXuLy[];
		danhSachKhaiBao: {
			ten: string;
			ma: string;
			thongTinKhaiBao: any;
			danhSachKhaiBaoArchive: {
				maBuoc: string;
				thongTinKhaiBao: any;
			}[];
		}[];
		__v: 0;
		quyTrinh: QuyTrinh.IRecord;
		[key: string]: any;
		trangThaiThanhToan: EMaTrangThaiThanhToan;
		identityCode: string;
	}
	export interface IDanhSachForm {
		ten: string;
		ma: string;
		cauHinhLoaiHinh: TruongThongTin[];
	}
	export interface IDonViXuLy {
		ten: string;
		ma: string;
		phuongThucPhanCong: string;
		danhSachThanhVienXuLy: IThanhVienXuLy[];
	}
	export interface IBuocXuLy {
		ten: string;
		ma: string;
		maFormKhaiBao: string;
		maFormTiepNhan: string;
		ghiChu: string;
		maBoPhanXuLy: string;
		trangThaiTiepNhan: string;
		doiTuongDieuPhoi: string;
		coKhaiBao: boolean;
		daDienThongTin: boolean;
		laBuocHienTai: boolean;
		danhSachMaBoPhanXuLy: string[];
	}
	export interface IThanhVienXuLy {
		ssoId: string;
		ten: string;
		ma: string;
		donVi: string;
		hocHam: string;
		hocVi: string;
		soDienThoai: string;
		email: string;
	}
}
