import type { ETrangThaiKhieuNai, EXepLoaiDiemRenLuyenLabel } from './constants';

declare module PhieuDiemRenLuyenV2 {
	export interface IRecord {
		_id: string;
		ssoId: string;
		hoTen: string;
		maSinhVien: string;
		lopHanhChinh: string;
		maNganh: string;
		dotChamDiemId: string;
		trangThaiNopSV: string;
		trangThaiNopCoVan: string;
		trangThaiNopBCS: string;
		trangThaiPhongCTSV: string;
		createdAt: string;
		updatedAt: string;
		__v: 0;
		diemCham: any[];
		noiDungKhieuNai: string;
		urlFileDinhKem: string[];
		traLoiNoiDungKhieuNai: string;
		diemSauKhieuNai: number;
		trangThaiXuLyKhieuNai: ETrangThaiKhieuNai;
		guiKhieuNai: boolean;
	}

	export interface PhieuTongHopSV {
		stt: number;
		msv: string;
		hoDem: string;
		ten: string;
		nd1: number;
		nd2: number;
		nd3: number;
		nd4: number;
		nd5: number;
		tongDiem: number;
		xepHang: EXepLoaiDiemRenLuyenLabel;
	}

	export interface IPhieuTongHop {
		lopHC: string;
		kyHoc: string;
		namHoc: string;
		khoa: string;
		ds: PhieuTongHopSV[];
		xuatSac: string;
		tot: string;
		kha: string;
		tb: string;
		y: string;
		k: string;
		sv1: number;
		sv2: number;
		sv3: number;
		sv4: number;
		sv5: number;
		sv6: number;
	}
}
