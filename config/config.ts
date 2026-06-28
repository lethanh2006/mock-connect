// https://umijs.org/config/
import { defineConfig } from 'umi';
import { getPublicAssetPath } from '../src/utils/path';
import defaultSettings from './defaultSettings';
import routes from './routes';

const appBasePath = '/student/';
const schoolName = 'Trường Đại học VinUni';
const schoolPrefix = 'Trường';
const schoolShortName = 'VINUNI';
const isDev = process.env.NODE_ENV === 'development';
const appConfigDefines = isDev
	? Object.entries(process.env).reduce((result, [key, value]) => {
			if (key.startsWith('APP_CONFIG_')) {
				return {
					...result,
					[key]: value,
				};
			}
			return result;
		}, {})
	: {};

export default defineConfig({
	hash: true,
	title: `HỆ THỐNG CHUYỂN ĐỔI SỐ - ${schoolName.toUpperCase()}`,
	metas: [
		{
			name: 'keywords',
			content: `${schoolPrefix}, ${schoolShortName}, Trực tuyến, HỆ THỐNG CHUYỂN ĐỔI SỐ - ${schoolName.toUpperCase()}, đào tạo`,
		},
		{ property: 'og:image', content: getPublicAssetPath('/metadata.png') },
		{
			name: 'description',
			content: `HỆ THỐNG CHUYỂN ĐỔI SỐ - ${schoolName.toUpperCase()}`,
		},
		{ name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' },
	],
	links: [{ rel: 'icon', href: getPublicAssetPath('/favicon.ico'), type: 'image/x-icon' }],

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
	},

	// plugins: ['@react-dev-inspector/umi4-plugin'],

	alias: {
		'pdfjs-dist': require.resolve('@react-pdf-viewer/pdfjs-dist-signature'),
	},

	jsMinifier: 'terser',
	exportStatic: {},
	headScripts: [{ src: `${appBasePath}env.js` }],

	define: appConfigDefines,

	base: appBasePath,
	publicPath: appBasePath,
});
