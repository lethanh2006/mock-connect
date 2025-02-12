// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import routes from './routes';

export default defineConfig({
	hash: true,
	antd: {
		theme: {
			'primary-color': defaultSettings.colorPrimary,
			'border-radius-base': defaultSettings.borderRadiusBase,
		},
		// Transform DayJS to MomentJS
    momentPicker: true,
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
		default: 'vi-VN',
		antd: true,
		// default true, when it is true, will use `navigator.language` overwrite default
		baseNavigator: false,
		// baseSeparator: '_',
	},
	targets: {
		ie: 11,
	},
	routes,
	// Theme for antd: https://ant.design/docs/react/customize-theme-cn
	theme: {
		'primary-color': defaultSettings.colorPrimary,
		'border-radius-base': defaultSettings.borderRadiusBase,
	},
	ignoreMomentLocale: true,
	// proxy: proxy[REACT_APP_ENV || 'dev'],
	manifest: {
		basePath: '/',
	},
	// Fast Refresh 热更新
	fastRefresh: true,

	plugins: [    
    '@react-dev-inspector/umi4-plugin',
  ],

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
