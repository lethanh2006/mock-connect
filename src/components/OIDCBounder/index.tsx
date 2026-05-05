import { useAuthActions } from '@/hooks/useAuthActions';
import { getPermission, getUserInfo } from '@/services/base/api';
import { AppModules } from '@/services/base/constant';
import { type Login } from '@/services/base/typing';
import axios from '@/utils/axios';
import { currentRole, replaceRole } from '@/utils/ip';
import { oidcConfig } from '@/utils/oidcConfig';
import { Button, notification, Result } from 'antd';
import queryString from 'query-string';
import { useEffect, useRef, useState, type FC } from 'react';
import { AuthProvider, hasAuthParams, useAuth } from 'react-oidc-context';
import { history, useIntl, useModel } from 'umi';
import LoadingPage from '../Loading';
import { unAuthPaths, unCheckPermissionPaths } from './constant';

let OIDCBounderHandlers: ReturnType<typeof useAuthActions> | null = null;

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

const getBasePath = () => trimTrailingSlash(APP_CONFIG_BASE_PATH || '');

const removeAuthParams = (search: string) => {
	const params = queryString.parse(search);
	delete params.code;
	delete params.iss;
	delete params.session_state;
	delete params.state;

	let newSearch = queryString.stringify(params);
	if (newSearch) newSearch = '?' + newSearch;

	return newSearch;
};

const getRedirectPathname = () => {
	const basePath = getBasePath();
	const loginPath = `${basePath}/user/login`;
	const dashboardPath = `${basePath}/dashboard`;
	const pathname = trimTrailingSlash(window.location.pathname);

	return pathname === '' || pathname === basePath || pathname === '/user/login' || pathname === loginPath
		? dashboardPath
		: window.location.pathname;
};

const getOidcRedirectUri = () => {
	const basePath = getBasePath();
	const pathname = window.location.pathname.includes('/user') ? `${basePath}/` : window.location.pathname;
	const search = removeAuthParams(window.location.search);

	return `${window.location.origin}${pathname}${search}${window.location.hash}`;
};

const redirectLocation = () => {
	// Loại bỏ các Auth params
	const newSearch = removeAuthParams(window.location.search);
	// Cập nhật URL hiện tại sau khi nhận access token, tránh reload callback lặp lại
	const pathname = getRedirectPathname();
	window.history.replaceState({}, document.title, `${pathname}${newSearch}${window.location.hash}`);
};

export const OIDCBounder_: FC<{ children: React.ReactElement }> = ({ children }) => {
	const intl = useIntl();
	const { setInitialState, initialState } = useModel('@@initialState');
	const auth = useAuth();
	const actions = useAuthActions();
	const [authError, setAuthError] = useState<string>();
	const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
	const isUnauth = unAuthPaths.some((path) => window.location.pathname.includes(path));

	const handleAxios = (access_token: string) => {
		axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
	};

	const handleAuthError = (description: string) => {
		setAuthError(description);
		setInitialState((prev) => ({ ...prev, currentUser: undefined, permissionLoading: false }));
		notification.error({
			message: intl.formatMessage({ id: 'global.OIDCBounder.message' }),
			description,
		});
	};

	const handleLogin = async () => {
		if (auth.user) {
			handleAxios(auth.user.access_token);
			try {
				const [getPermissionsResponse, getUserInfoResponse] = await Promise.all([getPermission(), getUserInfo()]);
				const userInfo: Login.IUser = getUserInfoResponse?.data;
				const permissions: Login.IPermission[] = getPermissionsResponse.data;
				const isUncheckPath = unCheckPermissionPaths.some((path) => window.location.pathname.includes(path));
				const hasRole = permissions.some((item) => item.rsname === currentRole);
				const tmpInitialState = {
					currentUser: { ...userInfo, ssoId: userInfo.sub },
					authorizedPermissions: permissions,
				};

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
					const hasReplaceRole = permissions.some((item) => item.rsname === replaceRole);
					const linkReplace = !!replaceRole && AppModules[replaceRole]?.url;

					if (!!linkReplace && hasReplaceRole) {
						window.location.replace(linkReplace);
						return;
					}
					handleAuthError('Bạn không có quyền truy cập phân hệ này. Vui lòng liên hệ quản trị viên để được cấp quyền.');
				} else {
					if (getRedirectPathname() !== window.location.pathname) redirectLocation();
				}
			} catch (error) {
				console.error('OIDC login failed:', error);
				handleAuthError('Không thể lấy thông tin người dùng hoặc phân quyền. Vui lòng thử đăng nhập lại.');
				if (auth.isAuthenticated) auth.removeUser();
			}
		} else history.replace('/user/login');
	};

	useEffect(() => {
		// Nếu đang cập nhật thì bật cái này lên
		// history.replace('/hold-on');
		// return;

		// Trong trường hợp các trang Public muốn đăng nhập thì dùng
		// <Button onClick={() => signinPopup()}>Đăng nhập</Button>
		// Sau khi đăng nhập popup sẽ nhảy về đây và xử lý như bình thường

		if (auth.isLoading || authError) return;

		if (auth.error) {
			handleAuthError(auth.error.message || 'Xác thực không thành công. Vui lòng thử đăng nhập lại.');
			redirectLocation();
			return;
		}

		// Chưa login + chưa có auth params ==> Cần redirect keycloak để lấy auth params + cookie
		if (!hasAuthParams() && !auth.isAuthenticated && initialState?.permissionLoading) {
			if (!isUnauth) auth.signinRedirect();
			return;
		}

		// Quá 5s nếu ko auth được thì xóa params
		if (!timeoutRef.current)
			timeoutRef.current = setTimeout(() => {
				if (hasAuthParams() && !auth.isAuthenticated) {
					handleAuthError('Không thể hoàn tất xác thực từ SSO. Vui lòng thử đăng nhập lại.');
					redirectLocation();
				}
			}, 1000 * 5);

		// Đã login => Xoá toàn bộ auth params được sử dụng để login trước đó
		if (auth.isAuthenticated) {
			if (hasAuthParams()) redirectLocation();
			else {
				if (timeoutRef.current) clearTimeout(timeoutRef.current);
				handleLogin();
			}
		}
	}, [auth.isAuthenticated, auth.isLoading, auth.error, authError]);

	useEffect(() => {
		if (auth.user?.access_token) handleAxios(auth.user.access_token);
	}, [auth.user?.access_token]);

	useEffect(() => {
		OIDCBounderHandlers = actions;
	}, [actions]);

	if (authError && !isUnauth) {
		return (
			<Result
				status='error'
				title='Xác thực không thành công'
				subTitle={authError}
				extra={
					<Button type='primary' onClick={() => auth.signinRedirect()}>
						Đăng nhập lại
					</Button>
				}
			/>
		);
	}

	return <>{(auth.isLoading || initialState?.permissionLoading) && !isUnauth ? <LoadingPage /> : children}</>;
};

export const OIDCBounder: FC<{ children: React.ReactElement }> & { getActions: () => typeof OIDCBounderHandlers } = (
	props,
) => {
	return (
		<AuthProvider
			{...oidcConfig}
			redirect_uri={getOidcRedirectUri()}
			onSigninCallback={redirectLocation}
		>
			<OIDCBounder_ {...props} />
		</AuthProvider>
	);
};

OIDCBounder.getActions = () => OIDCBounderHandlers;
