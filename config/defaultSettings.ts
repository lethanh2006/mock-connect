import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
	logo?: string;
	borderRadiusBase: string;
	siderWidth: number;
} = {
	navTheme: 'light',
	colorPrimary: process.env.APP_CONFIG_PRIMARY_COLOR,
	borderRadiusBase: '2px',
	layout: 'mix',
	contentWidth: 'Fluid',
	fixedHeader: true,
	fixSiderbar: true,
	colorWeak: true,
	title: process.env.APP_CONFIG_TITLE_NHAN_SU ?? '',
	logo: '/logo-text.png',
	iconfontUrl: '',
	// headerTheme: 'dark',
	// headerHeight: 60,
	siderWidth: 220,
};

export default Settings;
