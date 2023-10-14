export enum EPhamViChuDe {
	TAT_CA = 'Tất cả',
	HINH_THUC_DAO_TAO = 'Hình thức đào tạo',
}

export enum EChuDeStrapi {
	DAO_TAO = 'dao-tao',
	KHCN = 'khoa-hoc-cong-nghe',
	CTSV = 'cong-tac-sinh-vien',
}

export const PathChuDeStrapi: Record<EChuDeStrapi, string> = {
	[EChuDeStrapi.DAO_TAO]: 'api::portal-train-article.portal-train-article',
	[EChuDeStrapi.KHCN]: 'api::portal-research-article.portal-research-article',
	[EChuDeStrapi.CTSV]: 'api::portal-politic-article.portal-politic-article',
};

export const TenChuDeStrapi: Record<EChuDeStrapi, string> = {
	[EChuDeStrapi.DAO_TAO]: 'Đào tạo',
	[EChuDeStrapi.KHCN]: 'Khoa học công nghệ',
	[EChuDeStrapi.CTSV]: 'Công tác sinh viên',
};

// http://vwa.phanmemdangky.com/wp-json/wp/v2/categories
export enum WpCategoriesId {
	TIN_TUC_SU_KIEN = 25,
}
