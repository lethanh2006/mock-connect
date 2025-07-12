import type { LoaiHinh } from '@/services/FormDong/LoaiHinh/typing';
import type { EDoiTuongNhap } from './MauDon/constants';

declare module MinhChungDrl {
	export interface IRecord {
		_id: string;
		diemQuyDoi: 10;
		isDanhMucDiemQuyDoi: false;
		danhSachCauHinhMinhChung: [
			{
				colspan: 12;
				ten: 'Phân loại cư trú';
				ma: 'phanLoaiCuTru';
				laDangMang: false;
				kieuDuLieu: 'Chữ';
				readonly: false;
				customAggregationArray: [];
				arrayMapDanhMucDefaultValue: [];
				kichHoat: true;
				batBuoc: true;
				danhSachFileDinhKem: [];
				thamDinh: [];
			},
		];
		doiTuongNhap: ['SINH_VIEN'];
		loaiMinhChung: 'Y_THUC_CHAP_HANH_NOI_QUY';
		tenMinhChung: 'Khai báo nội ngoại trú';
		maMinhChung: 'KBNGT';
		danhMucDiemQuyDoi: [];
		createdAt: '2024-05-03T07:19:22.964Z';
		updatedAt: '2024-05-03T07:19:22.964Z';
		__v: 0;

		[k: string]: any;
	}
	export interface IBieuMau {
		_id: string;
		diemQuyDoi: number;
		isDanhMucDiemQuyDoi: boolean;
		tenDanhMucQuyDoi: string;
		danhSachCauHinhMinhChung: LoaiHinh.Cot[];
		doiTuongNhap: EDoiTuongNhap[];
		loaiMinhChung: string;
		tenMinhChung: string;
		maMinhChung: string;
		danhMucDiemQuyDoi: { tieuDe: string; diemQuyDoi: number }[];
		createdAt: string;
		updatedAt: string;
		__v: 0;

		[k: string]: any;
	}
}
