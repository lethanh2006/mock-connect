import { ETagColor } from '@/services/base/constant';

/** Trạng thái duyệt đề cương */
export enum ETrangThaiDuyetGiaoAn {
	DANG_SOAN_THAO = 'dang_soan_thao',
	CHO_AQA_THAM_DINH = 'cho_aqa_tham_dinh',
	YEU_CAU_CHINH_SUA = 'yeu_cau_chinh_sua',
	CHO_DUYET = 'cho_duyet',
	TU_CHOI_DUYET = 'tu_choi_duyet',
	DA_DUYET = 'da_duyet',
	BAN_HANH = 'ban_hanh',
}

export const trangThaiDuyetGiaoAn: Record<ETrangThaiDuyetGiaoAn, string | undefined> = {
	[ETrangThaiDuyetGiaoAn.DANG_SOAN_THAO]: 'syllabus.stat.status.dang_soan_thao',
	[ETrangThaiDuyetGiaoAn.CHO_AQA_THAM_DINH]: 'syllabus.stat.status.cho_aqa_tham_dinh',
	[ETrangThaiDuyetGiaoAn.YEU_CAU_CHINH_SUA]: 'syllabus.stat.status.yeu_cau_chinh_sua',
	[ETrangThaiDuyetGiaoAn.TU_CHOI_DUYET]: 'syllabus.stat.status.tu_choi_duyet',
	[ETrangThaiDuyetGiaoAn.DA_DUYET]: 'syllabus.stat.status.da_duyet',
	[ETrangThaiDuyetGiaoAn.BAN_HANH]: 'syllabus.stat.status.ban_hanh',
	[ETrangThaiDuyetGiaoAn.CHO_DUYET]: 'syllabus.stat.status.cho_duyet',
};

export const colorTrangThaiDuyetGiaoAn: Record<ETrangThaiDuyetGiaoAn, ETagColor> = {
	[ETrangThaiDuyetGiaoAn.DANG_SOAN_THAO]: ETagColor.DEFAULT,
	[ETrangThaiDuyetGiaoAn.CHO_AQA_THAM_DINH]: ETagColor.CYAN,
	[ETrangThaiDuyetGiaoAn.YEU_CAU_CHINH_SUA]: ETagColor.ORANGE,
	[ETrangThaiDuyetGiaoAn.TU_CHOI_DUYET]: ETagColor.RED,
	[ETrangThaiDuyetGiaoAn.DA_DUYET]: ETagColor.GREEN,
	[ETrangThaiDuyetGiaoAn.BAN_HANH]: ETagColor.PURPLE,
	[ETrangThaiDuyetGiaoAn.CHO_DUYET]: ETagColor.GOLD,
};

export enum ECloLevel {
	Introduced = 'I',
	Reinforced = 'R',
	Mastery = 'M',
}

export const thongKeTrangThaiDeCuongChiTiet = {
	tongDeCuong: 'syllabus.stat.status.tongDeCuong',
	dangSoanThao: 'syllabus.stat.status.dang_soan_thao',
	choAqaThamDinh: 'syllabus.stat.status.cho_aqa_tham_dinh',
	daDuyet: 'syllabus.stat.status.da_duyet',
	banHanh: 'syllabus.stat.status.ban_hanh',
	choDuyet: 'syllabus.stat.status.cho_duyet',
	yeuCauChinhSua: 'syllabus.stat.status.yeu_cau_chinh_sua',
	tuChoiDuyet: 'syllabus.stat.status.tu_choi_duyet',
};

export const fieldTrangThaiGiaoAn: Record<string, ETrangThaiDuyetGiaoAn | undefined> = {
	tongDeCuong: undefined,
	dangSoanThao: ETrangThaiDuyetGiaoAn.DANG_SOAN_THAO,
	choAqaThamDinh: ETrangThaiDuyetGiaoAn.CHO_AQA_THAM_DINH,
	yeuCauChinhSua: ETrangThaiDuyetGiaoAn.YEU_CAU_CHINH_SUA,
	tuChoiDuyet: ETrangThaiDuyetGiaoAn.TU_CHOI_DUYET,
	daDuyet: ETrangThaiDuyetGiaoAn.DA_DUYET,
	banHanh: ETrangThaiDuyetGiaoAn.BAN_HANH,
	choDuyet: ETrangThaiDuyetGiaoAn.CHO_DUYET,
};

export const colorTrangThaiDeCuongChiTiet: Record<string, string> = {
	tongDeCuong: 'blue',
	dangSoanThao: 'default',
	choAqaThamDinh: 'cyan',
	choDuyet: 'gold',
	yeuCauChinhSua: 'orange',
	tuChoiDuyet: 'red',
	daDuyet: 'green',
	banHanh: 'purple',
};

/** Kết quả thẩm định */
export enum EKetQuaThamDinh {
	DUYET = 'duyet',
	TU_CHOI = 'tu_choi',
	YEU_CAU_CHINH_SUA = 'yeu_cau_chinh_sua',
}

export const ketQuaThamDinh: Record<EKetQuaThamDinh, string | undefined> = {
	[EKetQuaThamDinh.DUYET]: 'syllabus.stat.status.da_duyet',
	[EKetQuaThamDinh.TU_CHOI]: 'syllabus.stat.status.tu_choi_duyet',
	[EKetQuaThamDinh.YEU_CAU_CHINH_SUA]: 'syllabus.stat.status.yeu_cau_chinh_sua',
};

export const ketQuaThamDinhToGiaoAn: Record<EKetQuaThamDinh, ETrangThaiDuyetGiaoAn> = {
	[EKetQuaThamDinh.DUYET]: ETrangThaiDuyetGiaoAn.DA_DUYET,
	[EKetQuaThamDinh.TU_CHOI]: ETrangThaiDuyetGiaoAn.TU_CHOI_DUYET,
	[EKetQuaThamDinh.YEU_CAU_CHINH_SUA]: ETrangThaiDuyetGiaoAn.YEU_CAU_CHINH_SUA,
};

export const ketQuaThamDinhToAssessmentModalTitleId: Record<EKetQuaThamDinh, string> = {
	[EKetQuaThamDinh.DUYET]: 'syllabus.modal.assessment.titleDuyet',
	[EKetQuaThamDinh.TU_CHOI]: 'syllabus.modal.assessment.titleTuChoi',
	[EKetQuaThamDinh.YEU_CAU_CHINH_SUA]: 'syllabus.modal.assessment.titleYeuCauChinhSua',
};

export enum LoaiNoiDungGiaoAn {
	DEFAULT = 'default',
	TITLE = 'title',
	PROVIDER = 'provider',
	PLO_CLO = 'plo_clo',
	COURSE = 'course',
}
