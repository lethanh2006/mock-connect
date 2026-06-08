/** Font mặc định TinyEditor — Montserrat khi tenant VinUni (access.vinuniAccessFilter) */
export const TINY_EDITOR_DEFAULT_FONT_LABEL = 'Mặc định';

const LEGACY_DEFAULT_FONT_FAMILY =
	'-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif';

const VINUNI_DEFAULT_FONT_FAMILY = 'Montserrat, sans-serif';

/** Font "Mặc định" — VinUni dùng Montserrat, các tenant khác dùng stack hệ thống */
export const getTinyEditorDefaultFontFamily = (isVinUni: boolean): string =>
	isVinUni ? VINUNI_DEFAULT_FONT_FAMILY : LEGACY_DEFAULT_FONT_FAMILY;

const OTHER_FONT_FAMILY_FORMATS = `
Arial=arial,helvetica,sans-serif;
Arial Black=arial black,avant garde;
Times New Roman=times new roman,times;
Comic Sans MS=comic sans ms,sans-serif;
Noto Sans=noto sans;
Monospace=monospace;
Courier New=courier new,courier;
Helvetica=helvetica;
Tahoma=tahoma,arial,helvetica,sans-serif;
Verdana=verdana,geneva;`;

export const getTinyEditorFontFamilyFormats = (resolvedDefaultFont: string, isVinUni: boolean): string => {
	const defaultEntry = `${TINY_EDITOR_DEFAULT_FONT_LABEL}=${resolvedDefaultFont}`;
	if (isVinUni) {
		return `${defaultEntry};
${OTHER_FONT_FAMILY_FORMATS}`;
	}
	return `${defaultEntry};
Montserrat=Montserrat,sans-serif;
${OTHER_FONT_FAMILY_FORMATS}`;
};
