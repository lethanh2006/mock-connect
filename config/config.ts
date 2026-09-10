// https://umijs.org/config/
import { readFileSync } from 'fs';
import { join } from 'path';
import { defineConfig } from 'umi';
import { getPublicAssetPath } from '../src/utils/path';
import defaultSettings from './defaultSettings';
import routes from './routes';

const {
	APP_CONFIG_TEN_TRUONG = '',
	APP_CONFIG_TIEN_TO_TRUONG = '',
	APP_CONFIG_TEN_TRUONG_VIET_TAT_TIENG_ANH = '',
	APP_CONFIG_GA_ID = '',
} = process.env;

const getAppConfigDefine = (): Record<string, string> => {
	const typings = readFileSync(join(__dirname, '../src/typings.d.ts'), 'utf-8');

	//Lấy list key có prefix APP_CONFIG_ trong typings.d.ts
	const declaredKeys = Array.from(typings.matchAll(/declare const (APP_CONFIG_\w+)/g), (m) => m[1]);

	//Lấy list key có prefix APP_CONFIG_ trong process.env
	const envKeys = Object.keys(process.env).filter((key) => key.startsWith('APP_CONFIG_'));

	//Lấy list key có trong typings.d.ts nhưng không có trong process.env
	const missingKeys = declaredKeys.filter((key) => process.env[key] === undefined);

	const define: Record<string, string> = {};

	new Set([...declaredKeys, ...envKeys]).forEach((key) => {
		define[key] = process.env[key] ?? '';
	});

	if (missingKeys.length) {
		console.warn(`[APP_CONFIG] Thiếu cấu hình env, fallback '': ${missingKeys.join(', ')}`);
	}

	return define;
};

export default defineConfig({
	hash: true,
	title: `HỆ THỐNG CHUYỂN ĐỔI SỐ - ${APP_CONFIG_TEN_TRUONG.toUpperCase()}`,
	metas: [
		{
			name: 'keywords',
			content: `${APP_CONFIG_TIEN_TO_TRUONG}, ${APP_CONFIG_TEN_TRUONG_VIET_TAT_TIENG_ANH}, Trực tuyến, HỆ THỐNG CHUYỂN ĐỔI SỐ - ${APP_CONFIG_TEN_TRUONG.toUpperCase()}, đào tạo`,
		},
		{ property: 'og:image', content: getPublicAssetPath('/metadata.png') },
		{
			name: 'description',
			content: `HỆ THỐNG CHUYỂN ĐỔI SỐ - ${APP_CONFIG_TEN_TRUONG.toUpperCase()}`,
		},
		{ name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' },
	],
	links: [{ rel: 'icon', href: getPublicAssetPath('/favicon.ico'), type: 'image/x-icon' }],
	headScripts: APP_CONFIG_GA_ID
		? [
				{ src: `https://www.googletagmanager.com/gtag/js?id=${APP_CONFIG_GA_ID}`, async: true },
				{
					content: `window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());
						gtag('config', '${APP_CONFIG_GA_ID}');`,
				},
			]
		: [],

	antd: {
		import: false,
		// Transform DayJS to MomentJS
		momentPicker: false,
	},
	access: {},
	model: {},
	initialState: {},
	request: {},
	layout: {
		// https://umijs.org/zh-CN/plugins/plugin-layout
		locale: true,
		...defaultSettings,
	},
	// https://umijs.org/zh-CN/plugins/plugin-locale
	locale: {
		// enable: true,
		default: 'en-US',
		antd: true,
		// default true, when it is true, will use `navigator.language` overwrite default
		// Có sử dụng ngôn ngữ mặc định của trình duyệt?
		baseNavigator: false,

		// Default: '-' => 'vi-VN'
		// baseSeparator: '_',
	},
	targets: { ie: 11 },
	routes,

	ignoreMomentLocale: true,
	// proxy: proxy[REACT_APP_ENV || 'dev'],
	// base: '/qldt', 		// Sub-path
	manifest: {
		basePath: '/',
	},
	// Fast Refresh 热更新
	fastRefresh: true,

	theme: {
		'@base-path': process.env.APP_CONFIG_BASE_PATH || '/',
		'@font-family': "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
	},

	// plugins: ['@react-dev-inspector/umi4-plugin'],

	alias: {
		'pdfjs-dist': require.resolve('@react-pdf-viewer/pdfjs-dist-signature'),
	},

	jsMinifier: 'terser',
	exportStatic: {},

	define: getAppConfigDefine(),

	base: process.env.APP_CONFIG_BASE_PATH,
	publicPath: process.env.APP_CONFIG_BASE_PATH,
});
