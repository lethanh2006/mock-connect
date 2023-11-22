import type { DonViHanhChinh } from '../Core/DonViHanhChinh/typing';
import type { ETrangThaiDuyetNoiNgoaiTru, ETrangThaiKhaiBaoNoiNgoaiTru, ETrangThaiNoiNgoaiTru } from './constant';

declare module NoiNgoaiTru {
	export interface IRecord {
		_id: string;
		tenDot: string;
		thoiGianBatDau: Date;
		thoiGianKetThuc: Date;
		maHocKy: string;
		hocKy?: HocKy.IRecord;
		trangThai: ETrangThaiNoiNgoaiTru;
		trangThaiDuyet: ETrangThaiDuyetNoiNgoaiTru;
		danhSachKhoaSinhVienKhaiBao: string[];
	}

	export interface IKhaiBao {
		_id: string;
		dangONoiTru: boolean;
		noiONgoaiTru?: IDonViHanhChinh;
		thongTinSinhVien?: ISinhVienKhaiBao;
		thongTinNguoiThan: IThongTinNguoiThan;
		noiONoiTru: string;
		urlAnhThe: string;
		dotKhaiBaoId: string;
		dotKhaiBao?: IRecord;
		trangThai: ETrangThaiKhaiBaoNoiNgoaiTru;
	}

	export interface IThongTinNguoiThan {
		_id: string;
		hoTen: string;
		namSinh: Date;
		soDienThoai: string;
		diaChiThuongTru: IDonViHanhChinh;
		ngheNghiep: string;
		noiLamViec: string;
	}

	export interface IDonViHanhChinh {
		tenTinh?: Partial<DonViHanhChinh.IRecord2>;
		tenQuanHuyen?: Partial<DonViHanhChinh.IRecord2>;
		tenPhuongXa?: Partial<DonViHanhChinh.IRecord2>;
		soNhaTenDuong?: string;
	}

	export interface ISinhVienKhaiBao {
		sinhVienSsoId?: string;
		maSinhVien?: string;
		hoDem?: string;
		ten?: string;
		hoTen?: string;
		ngaySinh?: Date;
		gioiTinh?: GioiTinh;
		soDienThoai?: string;
		maKhoaSinhVien?: string;
		maNganh?: string;
		cmtCccd?: string;
		queQuan?: IDonViHanhChinh;
		hoKhauThuongTru?: IDonViHanhChinh;
	}
}
