import { type EHeDaoTaoRenLuyen } from './constants';

declare module DotChamDiem {
	export type TThoiGianChamDiem = {
		thoiGianBatDau?: string;
		thoiGianKetThuc?: string;
	};

	export interface IRecord {
		_id: string;
		tenDot: string;
		kyHoc: string;
		heDaoTao?: EHeDaoTaoRenLuyen;
		ghiChu?: string;

		thoiGianTiepNhanMinhChung?: TThoiGianChamDiem;
		thoiGianSVChamDiem?: TThoiGianChamDiem;
		thoiGianCanSuLopChamDiem?: TThoiGianChamDiem;
		thoiGianCVHTChamDiem?: TThoiGianChamDiem;

		filter?: {
			roles?: EVaiTroBieuMau[];
			idKhoaSinhVien: string;
			idKhoa: string;
			idNganh: string;
			idLopHanhChinh: string;
			idLopHocPhan: string;
		};
		receiverType: EReceiverType;
		topics?: string[];
		users?: IUser[];
		roles?: EVaiTroBieuMau[];
	}
	export interface IUser {
		code: string;
		firstname: string;
		lastname: string;
		vaiTro?: EVaiTroBieuMau;
		thamGia?: boolean;
		fullname?: string;
	}
}
