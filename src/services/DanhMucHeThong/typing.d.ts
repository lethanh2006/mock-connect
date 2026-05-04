declare module Syllabus {
	export interface INguoiDuyet {
		ssoId?: string;
		name?: string;
		code?: string;
		ghiChu?: string;
		ghiChuChinhSua?: string;
		thoiGian?: string;
		trangThai: EKetQuaThamDinh;
	}

	export interface INoiDung {
		id?: string;
		loai?: string;
		tieuDe?: string;
		noiDung?: string;
		template?: string;
		isVisible?: boolean;
		kichHoat?: boolean;
		providerHelpText?: string;
		providerFacultyName?: string;
		providerFacultyEmail?: string;
		providerFacultyScheduleInfo?: string;
		providerTAName?: string;
		providerTAEmail?: string;
		providerTAScheduleInfo?: string;
		maHocPhanForClo?: string;
		maChuongTrinhDaoTaoClo?: string;
	}

	export interface IRecord {
		_id?: string;
		nguoiTaoHoTen?: string;
		danhSachNguoiDuyet?: INguoiDuyet[];
		thuTuDuyet?: number;
		nguoiDuyetHienTaiSsoId?: string;
		daDuyetSsoIds?: string;
		idDeCuong?: string;
		tieuDe?: string;
		moTa?: string;
		noiDung?: INoiDung[];
		trangThaiHoatDong?: boolean;
		ghiChu?: string;
		ghiChuChinhSua?: string;
		noiDungCu?: INoiDung[];

		// Cũ
		maHocPhan?: string;
		deCuong?: HocPhan.IDeCuongHocPhan;
		congBo?: boolean;
		trangThaiDuyet?: string;
		updatedAt?: string;
		createdAt?: string;
	}

	export type TThongKeGiaoAn = {
		dang_soan_thao?: number;
		cho_aqa_tham_dinh?: number;
		yeu_cau_chinh_sua?: number;
		cho_duyet?: number;
		da_duyet?: number;
		tu_choi_duyet?: number;
		ban_hanh?: number;
		khongCoDeCuong?: number;
	};
}
