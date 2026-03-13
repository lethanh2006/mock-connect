import type { EXepLoaiRenLuyen } from '@/services/CongTacSinhVien/DiemRenLuyenV2/PhieuDiemRenLuyen/constants';
import type { KetQuaHocKy } from '@/services/HocTap/KetQuaHocKy/typing';
import type { LopHanhChinh } from '@/services/HocTap/LopHanhChinh/typing';
import type { LopHocPhan } from '@/services/HocTap/LopHocPhan/typings';
import type { ETrangThaiHocBa } from './constant';

declare module HocBaSinhVien {
	export interface IRecord
		extends Pick<
			KetQuaHocKy.IRecord,
			| '_id'
			| 'hocKy'
			| 'hocLuc'
			| 'khoaNganh'
			| 'maHocKy'
			| 'maKhoaNganh'
			| 'sinhVien'
			| 'sinhVienSsoId'
			| 'tongSoTinChiDangKyHocKy'
			| 'tongSoTinChiDangKyToanKhoa'
			| 'tongSoTinChiHocKy'
			| 'tongSoTinChiNoHocKy'
			| 'tongSoTinChiNoToanKhoa'
			| 'tongSoTinChiTichLuyHocKy'
			| 'tongSoTinChiTichLuyToanKhoa'
			| 'trinhDo'
			| 'trungBinhHocBongHocKyThang4'
			| 'trungBinhHocKyThang4'
			| 'trungBinhTichLuyToanKhoaThang4'
		> {
		dotCapNhatHocBaId: string;
		nhanSuSsoId?: string;
		maNhanSu?: string;
		hoTenNhanSu?: string;
		tenLopHc?: string;
		lopHc?: LopHanhChinh.IRecord;

		yKienCoVan?: string;
		trangThai?: ETrangThaiHocBa;

		diemRenLuyen?: number;
		xepLoaiDRL?: EXepLoaiRenLuyen;

		diemHocPhanKy?: LopHocPhan.IDiemHpSvHk[];
	}

	export interface IDotCapNhat {
		_id: string;
		tenDot: string;
		maHocKy: string;
		hocKy?: HocKy.IRecord;
		maTrinhDoDaoTao: string;
		trinhDoDaoTao?: TrinhDoDaoTao.IRecordCoSo;
		maHinhThucDaoTao: string;
		hinhThucDaoTao?: HinhThucDaoTao.IRecordCoSo;
		thoiGianCVDanhGia?: TThoiGian | null;
		thoiGianCTSVDanhGia?: TThoiGian | null;

		daKhoiTao: boolean;
	}

	type TThoiGian = {
		thoiGianBatDau: string;
		thoiGianKetThuc: string;
	};
}
