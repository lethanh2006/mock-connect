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
import EnrollmentPrompt from './components/EnrollmentPrompt';
import ErrorBoundary from './components/ErrorBoundary';
import { OIDCBounder_, OIDCProvider } from './components/OIDCBounder';
import { unCheckPermissionPaths } from './components/OIDCBounder/constant';
import TechnicalSupportBounder from './components/TechnicalSupportBounder';
import ConfigBounder from './components/TechnicalSupportBounder/ConfigBounder';
import './observability/otel';
import NotAccessible from './pages/exception/403';
import NotFoundContent from './pages/exception/404';
import { AppModules } from './services/base/constant';
import type { IInitialState } from './services/base/typing';
import './styles/global.less';
import { currentRole, financeApiClientId, qldtApiClientId, replaceRole } from './utils/ip';
import { hasModulePermission } from './utils/keycloakRoles';

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
				<App>
					<OIDCProvider>{container}</OIDCProvider>
				</App>
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
			const { authorizedPermissions, authorizedRoles, authorizedRolesByClient, realmRoles } = JSON.parse(
				raw,
			) as Partial<IInitialState>;
			Object.assign(initialState, { authorizedPermissions, authorizedRoles, authorizedRolesByClient, realmRoles });
		}
	} catch (e) {}

	return initialState;
}

// ProLayout  https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
	const intl = getIntl();
	return {
		unAccessible: (
			<OIDCBounder_>
				<TechnicalSupportBounder>
					<NotAccessible />
				</TechnicalSupportBounder>
			</OIDCBounder_>
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
					!hasModulePermission(initialState, currentRole, [qldtApiClientId, financeApiClientId])
				) {
					const hasReplaceRole = hasModulePermission(initialState, replaceRole, [qldtApiClientId, financeApiClientId]);
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
			const isDashboard = /\/dashboard\/?$/.test(window.location.pathname);
			const content = (
				<OIDCBounder_>
					<ErrorBoundary>
						<TechnicalSupportBounder>
							<EnrollmentPrompt />
							{dom}
						</TechnicalSupportBounder>
					</ErrorBoundary>
				</OIDCBounder_>
			);

			return <AppShell>{content}</AppShell>;
		},

		title: intl.formatMessage({ id: AppModules[currentRole].title }),
		...initialState?.settings,
	};
};
