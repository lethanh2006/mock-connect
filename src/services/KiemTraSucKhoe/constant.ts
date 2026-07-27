import { ETagColor } from '../base/constant';

export enum EKtscPublishStatus {
	UNPUBLISHED = 'UNPUBLISHED',
	PUBLISHED = 'PUBLISHED',
}

export enum EDeclarationType {
	CHUA_DANG_KY = 'CHUA_DANG_KY',
	DA_DANG_KY = 'KHAM_TRONG_TRUONG',
	MIEN_KHAM = 'DA_KHAM_BEN_NGOAI',
}

export const declarationTypeIntlId: Record<EDeclarationType, string> = {
	[EDeclarationType.CHUA_DANG_KY]: 'kiemtrasuckhoe.dangky.luaChon.chuaDangKy',
	[EDeclarationType.DA_DANG_KY]: 'kiemtrasuckhoe.dangky.luaChon.dangKyTruong',
	[EDeclarationType.MIEN_KHAM]: 'kiemtrasuckhoe.dangky.luaChon.mienKham',
};

export const declarationTypeIntlColor: Record<EDeclarationType, ETagColor> = {
	[EDeclarationType.CHUA_DANG_KY]: ETagColor.ORANGE,
	[EDeclarationType.DA_DANG_KY]: ETagColor.BLUE,
	[EDeclarationType.MIEN_KHAM]: ETagColor.GREEN,
};

export const REGISTERED_DECLARATION_TYPES = [EDeclarationType.DA_DANG_KY, EDeclarationType.MIEN_KHAM];

export const isRegisteredDeclarationType = (value?: EDeclarationType | null) =>
	!!value && REGISTERED_DECLARATION_TYPES.includes(value);

export enum EKtscReviewStatus {
	CHO_DUYET = 'CHO_DUYET',
	DA_DUYET = 'DA_DUYET',
	TU_CHOI = 'TU_CHOI',
	CAN_BO_SUNG = 'CAN_BO_SUNG',
}

export const reviewStatusIntlId: Record<EKtscReviewStatus, string> = {
	[EKtscReviewStatus.CHO_DUYET]: 'kiemtrasuckhoe.dangky.reviewStatus.choDuyet',
	[EKtscReviewStatus.DA_DUYET]: 'kiemtrasuckhoe.dangky.reviewStatus.daDuyet',
	[EKtscReviewStatus.TU_CHOI]: 'kiemtrasuckhoe.dangky.reviewStatus.tuChoi',
	[EKtscReviewStatus.CAN_BO_SUNG]: 'kiemtrasuckhoe.dangky.reviewStatus.canBoSung',
};

export const reviewStatusColor: Record<EKtscReviewStatus, ETagColor> = {
	[EKtscReviewStatus.CHO_DUYET]: ETagColor.BLUE,
	[EKtscReviewStatus.DA_DUYET]: ETagColor.GREEN,
	[EKtscReviewStatus.TU_CHOI]: ETagColor.RED,
	[EKtscReviewStatus.CAN_BO_SUNG]: ETagColor.ORANGE,
};

export enum EGioiTinh {
	Nam = 'Nam',
	Nu = 'Nữ',
}

export enum EKtscNationality {
	VIETNAM = 'VIETNAM',
	FOREIGN = 'FOREIGN',
}

export enum KtscPaymentStatus {
	CHUA_THANH_TOAN = 'unpaid',
	DA_THANH_TOAN = 'paid',
}

export const paymentStatusIntlId: Record<KtscPaymentStatus, string> = {
	[KtscPaymentStatus.CHUA_THANH_TOAN]: 'kiemtrasuckhoe.dangky.trangThaiThanhToan.chuaThanhToan',
	[KtscPaymentStatus.DA_THANH_TOAN]: 'kiemtrasuckhoe.dangky.trangThaiThanhToan.daThanhToan',
};

export const paymentStatusColor: Record<KtscPaymentStatus, ETagColor> = {
	[KtscPaymentStatus.CHUA_THANH_TOAN]: ETagColor.ORANGE,
	[KtscPaymentStatus.DA_THANH_TOAN]: ETagColor.GREEN,
};

export const transKtscNationalityIntlId: Record<EKtscNationality, string> = {
	[EKtscNationality.VIETNAM]: 'kiemtrasuckhoe.dangky.nationality.vietnam',
	[EKtscNationality.FOREIGN]: 'kiemtrasuckhoe.dangky.nationality.foreign',
};

export const ktscNationalityOptionsIntlId = Object.values(EKtscNationality).map((value) => ({
	value,
	intlId: transKtscNationalityIntlId[value],
}));
