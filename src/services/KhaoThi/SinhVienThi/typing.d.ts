import type { EDinhDangBaiThi, EDKDTCongNo, EDKDTKetQuaHocTap } from '../constant';
import type { HocPhanThi } from '../HocPhanThi/typings';
import type { KyThi } from '../KyThi/typings';
import type { ELoaiThi, ETrangThaiChamLai, ETrangThaiSinhVienThi } from './constant';

declare module SinhVienThi {
	export interface IRecord {
		ssoId: string;
		ten: string;
		ma: string;
		maHocPhan: string | any;
		tenHocPhan: string;
		dieuKienKetQuaHocTap: EDKDTKetQuaHocTap;
		dieuKienCongNo: EDKDTCongNo;
		maPhachPhucKhao: string;
		maPhachThamDinh: string;
		maPhach: string;
		kyThiId: string;
		kyThi: KyThi.IRecord;
		_id: string;
		trangThai: ETrangThaiSinhVienThi;
		trangThaiChamLai: ETrangThaiChamLai;
		maHocKyHoc: string;
		tenHocKyHoc: string;
		lichThiId: any;
		ketQuaChamChinhThuc: KetQuaChamThi;
		loaiThi: ELoaiThi;
		daDongBoDiem: boolean;
		chamXacNhan: {
			danhSachDiem: ChamThi.DiemCham[];
			diemCuoi: number;
			diemSauViPham: number;
		};
		daChot: boolean;
		daDuyet: boolean;
		daCongBo: boolean;
		phat: {
			hinhThucXuPhat: string;
			phanTram: number;
			lyDo: string;
		};
		[k: string]: any;
		fileDinhKem: string[] | null;

		//
		thoiGianBatDau: Date;
		thoiGianKetThuc: Date;
		soFilePhaiNop: number;
		dungLuongToiDa: number;
		ghiChuKhac: string;
		dinhDangFileChoPhep: EDinhDangBaiThi[];
		choPhepNopNgoaiThoiGian: boolean;
		daNopBai: boolean;
		urlBaiNop: string[] | null;
	}

	export interface IDiemThiHocKySinhVien {
		kyThi: KyThi.IRecord;
		diemThi: number;
		diemPhucKhao: number;
		hocPhanThi: HocPhanThi.IRecord;
		sinhVienThi: IRecord;
	}

	export type TUploadMultiPartResponse = {
		fileId: string;
		multipartPartSize: number;
		totalPart: number;
		presignedUrls: {
			partNumber: number;
			presignedUrl: string;
		}[];
	};
}
