import { ETagColor } from '../base/constant';

export enum EBhytPublishStatus {
	UNPUBLISHED = 'UNPUBLISHED',
	PUBLISHED = 'PUBLISHED',
}

export enum EDeclarationType {
	CHUA_DANG_KY = 'CHUA_DANG_KY',
	MUA_TRONG_TRUONG = 'MUA_TRONG_TRUONG',
	DA_CO_BEN_NGOAI = 'DA_CO_BEN_NGOAI',
}

export const declarationTypeIntlId: Record<EDeclarationType, string> = {
	[EDeclarationType.CHUA_DANG_KY]: 'baohiemyte.dangky.luaChon.chuaDangKy',
	[EDeclarationType.MUA_TRONG_TRUONG]: 'baohiemyte.dangky.luaChon.dangKyTruong',
	[EDeclarationType.DA_CO_BEN_NGOAI]: 'baohiemyte.dangky.luaChon.benNgoai',
};

export const declarationTypeIntlColor: Record<EDeclarationType, ETagColor> = {
	[EDeclarationType.CHUA_DANG_KY]: ETagColor.ORANGE,
	[EDeclarationType.MUA_TRONG_TRUONG]: ETagColor.BLUE,
	[EDeclarationType.DA_CO_BEN_NGOAI]: ETagColor.GREEN,
};

export const REGISTERED_DECLARATION_TYPES = [EDeclarationType.MUA_TRONG_TRUONG, EDeclarationType.DA_CO_BEN_NGOAI];

export const isRegisteredDeclarationType = (value?: EDeclarationType | null) =>
	!!value && REGISTERED_DECLARATION_TYPES.includes(value);

export enum EBhytReviewStatus {
	CHO_DUYET = 'CHO_DUYET',
	DA_DUYET = 'DA_DUYET',
	TU_CHOI = 'TU_CHOI',
	CAN_BO_SUNG = 'CAN_BO_SUNG',
}

export const reviewStatusIntlId: Record<EBhytReviewStatus, string> = {
	[EBhytReviewStatus.CHO_DUYET]: 'baohiemyte.dangky.reviewStatus.choDuyet',
	[EBhytReviewStatus.DA_DUYET]: 'baohiemyte.dangky.reviewStatus.daDuyet',
	[EBhytReviewStatus.TU_CHOI]: 'baohiemyte.dangky.reviewStatus.tuChoi',
	[EBhytReviewStatus.CAN_BO_SUNG]: 'baohiemyte.dangky.reviewStatus.canBoSung',
};

export const reviewStatusColor: Record<EBhytReviewStatus, ETagColor> = {
	[EBhytReviewStatus.CHO_DUYET]: ETagColor.BLUE,
	[EBhytReviewStatus.DA_DUYET]: ETagColor.GREEN,
	[EBhytReviewStatus.TU_CHOI]: ETagColor.RED,
	[EBhytReviewStatus.CAN_BO_SUNG]: ETagColor.ORANGE,
};

export enum EDoiTuongThamGiaBHYT {
	HO_GIA_DINH = 'HO_GIA_DINH',
	CO_QUAN_DOANH_NGHIEP = 'CO_QUAN_DOANH_NGHIEP',
	THAN_NHAN_QUAN_DOI_CONG_AN = 'THAN_NHAN_QUAN_DOI_CONG_AN',
	HO_NGHEO_CAN_NGHEO = 'HO_NGHEO_CAN_NGHEO',
	KHAC = 'KHAC',
}

export const doiTuongThamGiaBHYTIntlId: Record<EDoiTuongThamGiaBHYT, string> = {
	[EDoiTuongThamGiaBHYT.HO_GIA_DINH]: 'baohiemyte.mien.doiTuong.hoGiaDinh',
	[EDoiTuongThamGiaBHYT.CO_QUAN_DOANH_NGHIEP]: 'baohiemyte.mien.doiTuong.coQuanDoanhNghiep',
	[EDoiTuongThamGiaBHYT.THAN_NHAN_QUAN_DOI_CONG_AN]: 'baohiemyte.mien.doiTuong.thanNhanQuanDoiCongAn',
	[EDoiTuongThamGiaBHYT.HO_NGHEO_CAN_NGHEO]: 'baohiemyte.mien.doiTuong.hoNgheoCanNgheo',
	[EDoiTuongThamGiaBHYT.KHAC]: 'baohiemyte.mien.doiTuong.khac',
};

export enum EGioiTinh {
	Nam = 'Nam',
	Nu = 'Nữ',
}

export enum EBhytNationality {
	VIETNAM = 'VIETNAM',
	FOREIGN = 'FOREIGN',
}

export const transBhytNationalityIntlId: Record<EBhytNationality, string> = {
	[EBhytNationality.VIETNAM]: 'baohiemyte.dangky.nationality.vietnam',
	[EBhytNationality.FOREIGN]: 'baohiemyte.dangky.nationality.foreign',
};

export const bhytNationalityOptionsIntlId = Object.values(EBhytNationality).map((value) => ({
	value,
	intlId: transBhytNationalityIntlId[value],
}));
