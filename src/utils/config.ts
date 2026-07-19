export const getRecaptchaSiteKey = (): string => {
	if (typeof APP_CONFIG_RECAPTCHA_SITE_KEY !== 'undefined') {
		return APP_CONFIG_RECAPTCHA_SITE_KEY;
	}

	return process.env.APP_CONFIG_RECAPTCHA_SITE_KEY || '';
};
