import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import '@ant-design/v5-patch-for-react-19';
import 'dayjs/locale/vi';
import type { RunTimeLayoutConfig } from 'umi';
import { history } from 'umi';
import defaultSettings from '../config/defaultSettings';
import ErrorBoundary from './components/ErrorBoundary';
import { OIDCBounder } from './components/OIDCBounder';
import { unCheckPermissionPaths } from './components/OIDCBounder/constant';
import OneSignalBounder from './components/OneSignalBounder';
import HeaderContentPage from './components/RightContent/Header';
import TechnicalSupportBounder from './components/TechnicalSupportBounder';
import ConfigBounder from './components/TechnicalSupportBounder/ConfigBounder';
import NotAccessible from './pages/exception/403';
import NotFoundContent from './pages/exception/404';
import { AppModules, primaryColor } from './services/base/constant';
import type { IInitialState } from './services/base/typing';
import './styles/global.less';
import { currentRole } from './utils/ip';

// https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<IInitialState> {
	return {
		settings: defaultSettings,
		permissionLoading: true,
	};
}

// ProLayout  https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
	return {
		unAccessible: (
			<OIDCBounder>
				<TechnicalSupportBounder>
					<NotAccessible />
				</TechnicalSupportBounder>
			</OIDCBounder>
		),
		noFound: <NotFoundContent />,
		rightContentRender: () => <RightContent />,
		headerContentRender: () => <HeaderContentPage />,
		disableContentMargin: true,

		footerRender: () => <Footer />,

		onPageChange: () => {
			if (initialState?.currentUser) {
				const { location } = history;
				const isUncheckPath = unCheckPermissionPaths.some((path) => window.location.pathname.includes(path));

				if (location.pathname === '/') {
					history.replace('/dashboard');
				} else if (
					!isUncheckPath &&
					currentRole &&
					initialState?.authorizedPermissions?.length &&
					!initialState?.authorizedPermissions?.find((item) => item.rsname === currentRole)
				)
					history.replace('/403');
			}
		},

		menuItemRender: (item: any, dom: any) => (
			<a
				className='not-underline'
				key={item?.path}
				href={item?.path}
				onClick={(e) => {
					e.preventDefault();
					history.push(item?.path ?? '/');
				}}
				style={{ display: 'block' }}
			>
				{dom}
			</a>
		),

		childrenRender: (dom) => (
			<OIDCBounder>
				<ErrorBoundary>
					<TechnicalSupportBounder>
						<OneSignalBounder>{dom}</OneSignalBounder>
					</TechnicalSupportBounder>
				</ErrorBoundary>
			</OIDCBounder>
		),

		menuRender: (props, defaultDom) => <ConfigBounder>{defaultDom}</ConfigBounder>,

		title: AppModules[currentRole].title,
		colorPrimary: primaryColor,
		...initialState?.settings,
	};
};
