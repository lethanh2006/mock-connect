import '@ant-design/v5-patch-for-react-19';
import { notification } from 'antd';
import axios1, { type InternalAxiosRequestConfig } from 'axios';
import qs from 'qs';
import { getIntl, getLocale } from 'umi';
import { excludedPaths } from './constants';
import data from './data';
import { keycloakTokenEndpoint } from './ip';

type RetryableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };
type OidcSilentRenewHandler = () => Promise<string | undefined>;

let oidcSilentRenewHandler: OidcSilentRenewHandler | null = null;
let oidcSilentRenewPromise: Promise<string | undefined> | null = null;

/** Register the OIDC context callback used to renew a token after an API 401. */
export const registerOidcSilentRenew = (handler: OidcSilentRenewHandler) => {
	const previousHandler = oidcSilentRenewHandler;
	oidcSilentRenewHandler = handler;

	return () => {
		if (oidcSilentRenewHandler === handler) oidcSilentRenewHandler = previousHandler;
	};
};

const renewAccessToken = () => {
	if (!oidcSilentRenewHandler) return Promise.resolve(undefined);
	if (!oidcSilentRenewPromise) {
		oidcSilentRenewPromise = oidcSilentRenewHandler().finally(() => {
			oidcSilentRenewPromise = null;
		});
	}

	return oidcSilentRenewPromise;
};

/** Chuẩn hóa locale (vi-VN, en-US, …) thành giá trị Accept-Language ở BE. */
const getAcceptLanguage = (): 'en' | 'vi' => (getLocale().startsWith('vi') ? 'vi' : 'en');

// Hàm trợ giúp để xử lý message từ i18n
const getMessage = (id: string, values?: Record<string, string | number>): string => {
	try {
		return getIntl()?.formatMessage({ id }, values) || id;
	} catch {
		return id;
	}
};

const axios = axios1.create({
	/**
	 *
	 * Trong Axios v0.21.x,
	 * việc serialize params (đặc biệt là object và array) sử dụng một logic đơn giản, nội bộ Axios tự động flatten object thành query string giống qs.
	 *
	 * Từ Axios v1.0+,
	 * họ bỏ cách serialize cũ và ủy thác toàn bộ cho URLSearchParams, theo chuẩn của trình duyệt – nhưng điều này không hỗ trợ lồng mảng hoặc object phức tạp, dẫn tới sort=%5Bobject%20Object%5D.
	 */
	paramsSerializer: (params) => {
		const cleanedParams: Record<string, any> = {};
		Object.entries(params || {}).forEach(([key, value]) => {
			if (value === undefined) return;

			// Stringify objects and array values which may contain nested objects
			cleanedParams[key] = Array.isArray(value)
				? value.map((item) => (item !== null && typeof item === 'object' ? JSON.stringify(item) : item))
				: typeof value === 'object'
					? JSON.stringify(value)
					: value;
		});

		return qs.stringify(cleanedParams, { encode: false, arrayFormat: 'brackets' });
	},
});

// Add a request interceptor
axios.interceptors.request.use(
	(config) => {
		const isExcluded = excludedPaths.some((path) => config.url?.startsWith(path));
		if (!isExcluded) {
			config.headers?.set('X-VinUni-Client-App', 'web-connect');
		}
		/**
		 * Chuyển sang xử lý access_token with OIDC auth ở Technical Support
		 */
		// if (!config.headers.Authorization) {
		// 	const token = localStorage.getItem('token');
		// 	if (token) {
		// 		config.headers.Authorization = `Bearer ${token}`;
		// 	}
		// }

		if (config.headers && !config.headers.get('Accept-Language')) {
			config.headers.set('Accept-Language', getAcceptLanguage());
		}

		return config;
	},
	(error) => Promise.reject(error),
);

// Add a response interceptor
axios.interceptors.response.use(
	(response) => response,
	(error) => {
		let er = error?.response?.data;
		// Convert response data to JSON
		if ((error?.response?.config?.responseType as string)?.toLowerCase() === 'arraybuffer') {
			const decoder = new TextDecoder('utf-8');
			er = JSON.parse(decoder.decode(er));
		}

		let originData = originalRequest?.data;
		if (typeof originData === 'string') originData = JSON.parse(originData);
		if (
			typeof originData !== 'object' ||
			!Object.keys(originData ?? {}).includes('silent') ||
			!originData?.silent
		) {
			const descriptionError = Array.isArray(er?.detail?.exception?.response?.message)
				? er?.detail?.exception?.response?.message?.join(', ')
				: Array.isArray(er?.detail?.exception?.errors)
					? er?.detail?.exception?.errors?.map((e: any) => e?.message)?.join(', ')
					: data.error[er?.detail?.errorCode || er?.errorCode] ||
						er?.detail?.message ||
						er?.message ||
						er?.errorDescription;

			switch (error?.response?.status) {
				case 400:
					notification.error({
						message: getMessage('error.400.title', { code: '004' }),
						description: descriptionError,
						key: 'error400',
					});
					break;

				case 401:
					// Nếu có access token (có thể access token hết hạn) thì mới cảnh báo
					if (hasAuthorizationHeader) {
						notification.error({
							message: getMessage('error.401.title', { code: '104' }),
							description: getMessage('error.401.description'),
							key: 'error401',
						});
					}
					break;

				case 403:
				case 405:
					notification.error({
						message: getMessage('error.403.title', { code: '304' }),
						description: descriptionError,
						key: 'error403',
					});
					break;

				case 404:
					notification.error({
						message: getMessage('error.404.title', { code: '040' }),
						description: descriptionError,
						key: 'error404',
					});
					break;

				case 409:
					notification.error({
						message: getMessage('error.409.title', { code: '904' }),
						description: descriptionError,
						key: 'error409',
					});
					break;

				case 500:
				case 502:
					notification.warning({
						message: getMessage('error.500.title', { code: '005' }),
						// description: descriptionError,
						description: getMessage('error.500.description'),
						key: 'error500',
					});
					break;

				case 504:
					notification.info({
						message: getMessage('error.504.title', { code: '405' }),
						description: getMessage('error.504.description'),
						key: 'error504',
					});
					break;

				default:
					notification.warning({
						message: getMessage('error.default.title'),
						description: getMessage('error.default.description'),
						key: 'global_error',
					});
					break;
			}
		}
		// Do something with response error
		return Promise.reject(error);
	},
);

export default axios;
