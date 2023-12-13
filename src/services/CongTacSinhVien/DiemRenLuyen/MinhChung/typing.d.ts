import { type SuKien } from '@/services/SuKien/typings';
import type {
	ELoaiChucDanhLop,
	ELoaiMinhChungDiemRenLuyen,
	ELoaiViPhamQuyCheThi,
	EPhanLoaiNoiNgoaiTru,
	ETrangThaiMinhChungDiemRenLuyen,
} from './constants';
import { type DanhMuc } from '../DanhMuc/typing';
import { type DonViHanhChinh } from '@/services/Core/DonViHanhChinh/typing';

declare module MinhChungDiemRenLuyen {
	export interface IRecord extends IHoatDongSinhVien, INoiNgoaiTru, IMinhChungSinhVien {
		_id: string;
		kyHoc: string;
		loaiMinhChung: ELoaiMinhChungDiemRenLuyen;
		diemQuyDoi: number;
		idDotChamDiem: string;

		trangThai: ETrangThaiMinhChungDiemRenLuyen;
		user: {
			lop: string;
			hoTen: string;
			maSinhVien: string;
			_id: string;
		};
		createdAt?: string;
		nguoiGui?: ENguoiGui;
	}

	export interface IMinhChungSinhVien {
		chucDanh?: ELoaiChucDanhLop;
		chucVu?: string;
		donVi?: string;
		loaiViPhamQuyCheThi?: ELoaiViPhamQuyCheThi;
	}

	export interface IHoatDongSinhVien {
		noiDungHoatDong?: string;

		idNoiDungCongTacXaHoi?: string; // Dùng với 3.2
		noiDungCongTacXaHoi?: DanhMuc.IRecord;
		idCapDatGiai?: string; // Dùng với 5.3
		capDatGiai?: DanhMuc.IRecord;
		idSuKienCTSV?: string; // Dùng với 3.3
		suKienCTSV?: SuKien.Record;

		ngayThamGia: string;
		urlFileList?: string[];
		duongDan?: string;
	}

	export interface INoiNgoaiTru {
		phanLoai: EPhanLoaiNoiNgoaiTru;
		soPhong?: DanhMuc.IRecord;
		kyTucXa?: DanhMuc.IRecord;

		thongTinNoiTru?: {
			idSoPhong: string;
			idKyTucXa: string;
		};
		thongTinNgoaiTru?: IDonViHanhChinh & {
			nhaRieng?: boolean;
			tenChuTro?: string;
			sdtChuTro?: string;
		};
	}

	export interface IDonViHanhChinh {
		tinh?: Partial<DonViHanhChinh.IRecord2>;
		quan?: Partial<DonViHanhChinh.IRecord2>;
		xa?: Partial<DonViHanhChinh.IRecord2>;
		soNha?: string;
	}
}
