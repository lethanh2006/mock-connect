import { getLocale } from 'umi';

const isViLocale = (locale?: string) => (locale ?? getLocale()).startsWith('vi');

export const getLocalizedName = (
	record?: any,
	fallback?: string,
	fallbackEn?: string,
	locale?: string,
): string | undefined => {
	if (isViLocale(locale)) {
		return record?.ten ?? record?.name ?? record?.nameEn ?? record?.tenTiengAnh ?? fallback ?? fallbackEn;
	}

	return record?.tenTiengAnh ?? record?.nameEn ?? record?.ten ?? record?.name ?? fallbackEn ?? fallback;
};
