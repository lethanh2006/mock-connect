import type { ChamThi } from '../ChamThi/typings';
import type { EDinhDangBaiThi } from '../constant';
import type { ELoaiThi, ETrangThaiChamLai, ETrangThaiSinhVienThi } from './constant';

declare module SinhVienThi {
	export interface IRecord {
		ssoId: string;
		ten: string;
		ma: string;
		maHocPhan: string | any;
		tenHocPhan: string;
		dieuKienKetQuaHocTap: boolean;
		dieuKienCongNo: boolean;
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

		//
		thoiGianBatDau: Date;
		thoiGianKetThuc: Date;
		dungLuongToiDa: number;
		ghiChuKhac: string;
		dinhDangFileChoPhep: EDinhDangBaiThi[];

		daNopBai: boolean;
		urlBaiNop: string[] | null;
	}

	export interface IDiemThiHocKySinhVien {
		diemPhucKhao: number;
		diemThi: number;
		kyThi: string;
	}
}
