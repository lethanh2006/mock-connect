import { useAuthActions } from '@/hooks/useAuthActions';
import { getUserInfo } from '@/services/base/api';
import { AppModules, EModuleKey } from '@/services/base/constant';
import { type Login } from '@/services/base/typing';
import axios from '@/utils/axios';
import { currentRole, financeApiClientId, qldtApiClientId, replaceRole } from '@/utils/ip';
import type { AuthorizedRolesByClient } from '@/utils/keycloakRoles';
import { getKeycloakRoleContext, hasModulePermission } from '@/utils/keycloakRoles';
import { oidcConfig } from '@/utils/oidcConfig';
import { getAppBasePath, getPublicAssetPath } from '@/utils/path';
import { notification } from 'antd';
import queryString from 'query-string';
import { useEffect, useRef, type FC } from 'react';
import { AuthProvider, hasAuthParams, useAuth } from 'react-oidc-context';
import { history, useIntl, useModel } from 'umi';
import LoadingPage from '../Loading';
import { unAuthPaths, unCheckPermissionPaths } from './constant';

let OIDCBounderHandlers: ReturnType<typeof useAuthActions> | null = null;

const getModuleClientIds = (moduleKey: EModuleKey) => {
	const webClientId = AppModules[moduleKey]?.clientId;
	const clientIds = [webClientId, webClientId ? `${webClientId}-api` : undefined];

	return clientIds.filter(Boolean) as string[];
};

const getAllRoleClientIds = () =>
	Array.from(
		new Set([
			...Object.keys(AppModules).flatMap((moduleKey) => getModuleClientIds(moduleKey as EModuleKey)),
			qldtApiClientId,
			financeApiClientId,
		]),
	);

const getAuthorizedPermissionsFromRoles = (rolesByClient: AuthorizedRolesByClient): Login.IPermission[] =>
	Object.keys(AppModules)
		.map((moduleKey) => {
			const scopes = getModuleClientIds(moduleKey as EModuleKey).flatMap((clientId) => rolesByClient[clientId] ?? []);
			const uniqueScopes = Array.from(new Set(scopes));
			if (!uniqueScopes.length) return undefined;

			return {
				rsid: moduleKey,
				rsname: moduleKey as EModuleKey,
				scopes: uniqueScopes,
			};
		})
		.filter(Boolean) as Login.IPermission[];

export const OIDCBounder_: FC<{ children: React.ReactElement }> = ({ children }) => {
	const intl = useIntl();
	const { setInitialState, initialState } = useModel('@@initialState');
	const auth = useAuth();
	const actions = useAuthActions();
	const isUnauth = unAuthPaths.some((path) => window.location.pathname.includes(path));
	const authTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const loginInProgressRef = useRef(false);

	const handleAxios = (access_token: string) => {
		axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
	};

	const redirectLocation = () => {
		// Loại bỏ các Auth params
		const { code, iss, session_state, state, ...other } = queryString.parse(window.location.search);
		let newSearch = Object.keys(other)
			.map((key) => `${key}=${other[key]}`)
			.join('&');
		if (newSearch) newSearch = '?' + newSearch;
		const pathname =
			window.location.pathname === '/' || window.location.pathname === `${getPublicAssetPath('user/login')}`
				? '/dashboard'
				: window.location.pathname;
		window.history.replaceState({}, document.title, `${pathname}${newSearch}${window.location.hash}`);
	};

	const handleLogin = async () => {
		if (loginInProgressRef.current) return;
		loginInProgressRef.current = true;

		if (auth.user) {
			handleAxios(auth.user.access_token);
			try {
				const getUserInfoResponse = await getUserInfo();
				const userInfo: Login.IUser = getUserInfoResponse?.data;
				const roleContext = getKeycloakRoleContext(auth.user.access_token, getAllRoleClientIds());
				const permissions = getAuthorizedPermissionsFromRoles(roleContext.authorizedRolesByClient);
				const isUncheckPath = unCheckPermissionPaths.some((path) => window.location.pathname.includes(path));
				const tmpInitialState = {
					currentUser: { ...userInfo, ssoId: userInfo.sub },
					authorizedPermissions: permissions,
					...roleContext,
				};
				const hasRole = hasModulePermission(tmpInitialState, currentRole, [
					...getModuleClientIds(currentRole),
					qldtApiClientId,
					financeApiClientId,
				]);

				// Ensure permission is fully set before marking as loaded
				setInitialState((prev) => ({
					...prev,
					...tmpInitialState,
				}));

				// Persist minimal initial state so reload won't lose permissions immediately
				try {
					sessionStorage.setItem('initialState', JSON.stringify(tmpInitialState));
				} catch (e) {}

				// Use setTimeout to ensure state update is completed before setting permissionLoading to false
				setTimeout(() => {
					setInitialState((prev) => ({ ...prev, permissionLoading: false }));
				}, 0);

				if (!isUncheckPath && currentRole && !hasRole) {
					const hasReplaceRole = hasModulePermission(tmpInitialState, replaceRole, [
						...(replaceRole ? getModuleClientIds(replaceRole) : []),
						qldtApiClientId,
						financeApiClientId,
					]);
					const linkReplace = !!replaceRole && AppModules[replaceRole]?.url;

					if (!!linkReplace && hasReplaceRole) {
						window.location.replace(linkReplace);
						return;
					}
					history.replace('/403');
				} else {
					if (window.location.pathname === '/' || window.location.pathname === '/student/user/login')
						redirectLocation();
				}
			} catch {
				setInitialState((prev) => ({ ...prev, permissionLoading: false }));
				notification.warning({
					message: intl.formatMessage({ id: 'global.OIDCBounder.message' }),
					description: intl.formatMessage({ id: 'global.OIDCBounder.description' }),
				});
				history.replace(`${getPublicAssetPath('user/login')}`);
			} finally {
				loginInProgressRef.current = false;
			}
		} else {
			loginInProgressRef.current = false;
			history.replace(`${getPublicAssetPath('user/login')}`);
		}
	};

	useEffect(() => {
		// Nếu đang cập nhật thì bật cái này lên
		// history.replace('/hold-on');
		// return;

		// Trong trường hợp các trang Public muốn đăng nhập thì dùng
		// <Button onClick={() => signinPopup()}>Đăng nhập</Button>
		// Sau khi đăng nhập popup sẽ nhảy về đây và xử lý như bình thường

		if (auth.isLoading) return;

		// Chưa login + chưa có auth params ==> Cần redirect keycloak để lấy auth params + cookie
		if (!hasAuthParams() && !auth.isAuthenticated && initialState?.permissionLoading) {
			if (!isUnauth) auth.signinRedirect();
			return;
		}

		// Quá 5s nếu ko auth được thì xóa params
		if (!authTimeoutRef.current)
			authTimeoutRef.current = setTimeout(() => {
				if (hasAuthParams() && !auth.isAuthenticated) redirectLocation();
			}, 1000 * 5);

		// Đã login => Xoá toàn bộ auth params được sử dụng để login trước đó
		if (auth.isAuthenticated) {
			if (authTimeoutRef.current) {
				clearTimeout(authTimeoutRef.current);
				authTimeoutRef.current = null;
			}
			if (hasAuthParams()) redirectLocation();
			handleLogin();
		}
	}, [auth.isAuthenticated, auth.isLoading]);

	useEffect(
		() => () => {
			if (authTimeoutRef.current) clearTimeout(authTimeoutRef.current);
		},
		[],
	);

	useEffect(() => {
		if (auth.user?.access_token) handleAxios(auth.user.access_token);
	}, [auth.user?.access_token]);

	useEffect(() => {
		OIDCBounderHandlers = actions;
	}, [actions]);

	return <>{(auth.isLoading || initialState?.permissionLoading) && !isUnauth ? <LoadingPage /> : children}</>;
};

export const OIDCBounder: FC<{ children: React.ReactElement }> & { getActions: () => typeof OIDCBounderHandlers } = (
	props,
) => {
	return (
		<AuthProvider
			{...oidcConfig}
			redirect_uri={
				window.location.pathname.includes('/user')
					? `${window.location.origin}${getAppBasePath()}`
					: window.location.href
			}
		>
			<OIDCBounder_ {...props} />
		</AuthProvider>
	);
};

OIDCBounder.getActions = () => OIDCBounderHandlers;
