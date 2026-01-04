import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const defaultSettings: LayoutSettings & {
	logo?: string;
	siderWidth: number;
} = {
	navTheme: 'light',
	layout: 'side',
	contentWidth: 'Fluid',
	fixedHeader: true,
	fixSiderbar: true,
	colorWeak: true,
	logo: '/logo_vinuni.png',
	iconfontUrl: '',
	siderWidth: 260,
};

export default defaultSettings;
