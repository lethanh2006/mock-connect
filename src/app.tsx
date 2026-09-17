import AppShell from '@/components/AppShell';
import LoadingModal from '@/components/Loading/LoadingModal';
import '@/utils/dayjs';
import '@ant-design/v5-patch-for-react-19';
import { Toaster, UiProvider } from '@vinuni/ui';
import { App } from 'antd';
import React from 'react'; // Bổ sung import React
import type { RunTimeLayoutConfig } from 'umi';
import { getIntl, history } from 'umi';
import defaultSettings from '../config/defaultSettings';
import ErrorBoundary from './components/ErrorBoundary';
import { OIDCBounder } from './components/OIDCBounder';
import { unCheckPermissionPaths } from './components/OIDCBounder/constant';
import OneSignalBounder from './components/OneSignalBounder';
import TechnicalSupportBounder from './components/TechnicalSupportBounder';
import ConfigBounder from './components/TechnicalSupportBounder/ConfigBounder';
import NotAccessible from './pages/exception/403';
import NotFoundContent from './pages/exception/404';
import { AppModules } from './services/base/constant';
import type { IInitialState } from './services/base/typing';
import './styles/global.less';
import { currentRole, replaceRole } from './utils/ip';

export function rootContainer(container: React.ReactNode) {
	const currentTheme = (localStorage.getItem('theme') as any) || 'light';
	document.documentElement.setAttribute('data-vinuni-theme', currentTheme);

	return (
		<UiProvider
			defaultTheme={currentTheme}
			onThemeChange={(theme) => {
				localStorage.setItem('theme', theme);
				document.documentElement.setAttribute('data-vinuni-theme', theme);
			}}
		>
			<ConfigBounder>
				<App>{container}</App>
			</ConfigBounder>
			<Toaster />
			<LoadingModal />
		</UiProvider>
	);
}

export async function getInitialState(): Promise<IInitialState> {
	const initialState: IInitialState = {
		settings: defaultSettings,
		permissionLoading: true,
		authorizedRoles: [],
		authorizedRolesByClient: {},
	};
	try {
		const raw = sessionStorage.getItem('initialState');
		if (raw) {
			const { authorizedPermissions } = JSON.parse(raw) as Partial<IInitialState>;
			Object.assign(initialState, { authorizedPermissions });
		}
	} catch (e) {}

	return initialState;
}

// ProLayout  https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
	const intl = getIntl();
	return {
		unAccessible: (
			<OIDCBounder>
				<TechnicalSupportBounder>
					<NotAccessible />
				</TechnicalSupportBounder>
			</OIDCBounder>
		),
		noFound: <NotFoundContent />,
		menuRender: false,
		headerRender: false,
		footerRender: false,
		disableContentMargin: true,

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
				) {
					const hasReplaceRole = initialState.authorizedPermissions.some((item) => item.rsname === replaceRole);
					const linkReplace = !!replaceRole && AppModules[replaceRole]?.url;

					if (!!linkReplace && hasReplaceRole) {
						window.location.replace(linkReplace);
						return;
					}
					history.replace('/403');
				}
			}
		},

		menuItemRender: (item: any, dom: any) => (
			<a
				className='not-underline menu-item-link'
				key={item?.path}
				href={item?.path}
				onClick={(e) => {
					e.preventDefault();
					history.push(item?.path ?? '/');
				}}
			>
				{dom}
			</a>
		),

		childrenRender: (dom) => {
			const content = (
				<OIDCBounder>
					<ErrorBoundary>
						<TechnicalSupportBounder>
							<OneSignalBounder>{dom}</OneSignalBounder>
						</TechnicalSupportBounder>
					</ErrorBoundary>
				</OIDCBounder>
			);

			return <AppShell>{content}</AppShell>;
		},

		title: intl.formatMessage({ id: AppModules[currentRole].title }),
		...initialState?.settings,
	};
};
