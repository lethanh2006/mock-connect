import { getLocale } from 'umi';

export type LocalizedNameRecord = {
	ten?: string | null;
	tenTiengAnh?: string | null;
};

const isViLocale = (locale?: string) => (locale ?? getLocale()).startsWith('vi');

/**
 * Lấy tên hiển thị theo locale từ ten / tenTiengAnh.
 * vi: ten -> tenTiengAnh -> fallback
 * en: tenTiengAnh -> ten -> fallback
 */
export const getLocalizedName = (
	record?: LocalizedNameRecord | null,
	fallback?: string,
	locale?: string,
): string | undefined => {
	if (isViLocale(locale)) {
		return record?.ten ?? record?.tenTiengAnh ?? fallback;
	}

	return record?.tenTiengAnh ?? record?.ten ?? fallback;
};
