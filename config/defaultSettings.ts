import { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { getPublicAssetPath } from '../src/utils/path';

const defaultSettings: LayoutSettings & {
	logo?: string;
	siderWidth: number;
} = {
	navTheme: 'light',
	layout: 'mix',
	contentWidth: 'Fluid',
	fixedHeader: true,
	fixSiderbar: true,
	colorWeak: true,
	logo: getPublicAssetPath('logo-text.png'),
	iconfontUrl: '',
	siderWidth: 220,
};

export default defaultSettings;
