// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import routes from './routes';

const {
	APP_CONFIG_TEN_TRUONG = '',
	APP_CONFIG_TIEN_TO_TRUONG = '',
	APP_CONFIG_TEN_TRUONG_VIET_TAT_TIENG_ANH = '',
	APP_CONFIG_GA_ID = '',
} = process.env;

export default defineConfig({
	hash: true,
	title: `HỆ THỐNG CHUYỂN ĐỔI SỐ - ${APP_CONFIG_TEN_TRUONG.toUpperCase()}`,
	metas: [
		{
			name: 'keywords',
			content: `${APP_CONFIG_TIEN_TO_TRUONG}, ${APP_CONFIG_TEN_TRUONG_VIET_TAT_TIENG_ANH}, Trực tuyến, HỆ THỐNG CHUYỂN ĐỔI SỐ - ${APP_CONFIG_TEN_TRUONG.toUpperCase()}, đào tạo`,
		},
		{ property: 'og:image', content: '/metadata.png' },
		{
			name: 'description',
			content: `HỆ THỐNG CHUYỂN ĐỔI SỐ - ${APP_CONFIG_TEN_TRUONG.toUpperCase()}`,
		},
		{ name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' },
	],
	links: [{ rel: 'icon', href: '/favicon.ico', type: 'image/x-icon' }],

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

	// plugins: ['@react-dev-inspector/umi4-plugin'],

	alias: {
		'pdfjs-dist': require.resolve('@react-pdf-viewer/pdfjs-dist-signature'),
	},

	jsMinifier: 'terser',
	exportStatic: {},

	define: Object.entries(process.env).reduce((result, [key, value]) => {
		if (key.startsWith('APP_CONFIG_')) {
			return {
				...result,
				[key]: value,
			};
		}
		return result;
	}, {}),
});
