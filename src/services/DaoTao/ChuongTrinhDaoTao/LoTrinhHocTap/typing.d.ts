import { HocKy } from '@/services/HocKy/HocKy/typing';
import { KhoaNganh } from '@/services/NamHoc/KhoaNganh/typings';
import { ETrangThaiDuyetLoTrinh } from '../constant';

declare module LoTrinhHocTap {
	export interface IRecord {
		_id: string;
		dotDangKyPathwayId: string;
		dotDangKyPathway: IDotDangKy;
		sinhVienSsoId: string;
		maKhoaNganh: string;
		khoaNganh?: KhoaNganh.IRecord;
		maSinhVien: string;
		hoTen: string;
		trangThaiDuyet: ETrangThaiDuyetLoTrinh;
		thoiGianDuyet: Date;
		ghiChuDuyet: string;

		maSsoNguoiDuyet: string;
		tenNguoiDuyet: string;
	}

	export interface IDotDangKy {
		_id: string;
		maHocKy: string;
		hocKy?: HocKy.IRecord;
		ten: string;
		kichHoat: boolean;
		thoiGianBatDau: Date;
		thoiGianKetThuc: Date;
		ghiChu: string;
	}

	export interface IKhoaNganhLoTrinh {
		_id: string;
		dotDangKyPathwayId: string;
		dotDangKyPathway: IRecord;
		maKhoaNganh: string;
		khoaNganh: KhoaNganh.IRecord;
	}
}
