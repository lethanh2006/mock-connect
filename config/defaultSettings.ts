import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
	logo?: string;
	borderRadiusBase: string;
	siderWidth: number;
} = {
	navTheme: 'light',
	// TODO: Cannot default?
	colorPrimary: process.env.APP_CONFIG_PRIMARY_COLOR,
	borderRadiusBase: '4px',
	layout: 'mix',
	contentWidth: 'Fluid',
	fixedHeader: true,
	fixSiderbar: true,
	colorWeak: true,
	title: process.env.APP_CONFIG_TITLE_NHAN_SU ?? '',
	logo: '/logo-text.png',
	iconfontUrl: '',
	siderWidth: 220,
};

export default Settings;
