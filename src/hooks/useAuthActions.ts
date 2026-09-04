import { getPublicAssetPath } from '@/utils/path';
import { useAuth } from 'react-oidc-context';
import { useModel } from 'umi';

export const useAuthActions = () => {
	const { setInitialState } = useModel('@@initialState');
	const auth = useAuth();

	const clearClientAuthState = () => {
		sessionStorage.removeItem('initialState');
		localStorage.removeItem('partitionCode');
		setInitialState((prev) => ({
			...prev,
			currentUser: undefined,
			authorizedPermissions: [],
			authorizedRoles: [],
			authorizedRolesByClient: {},
			realmRoles: [],
			permissionLoading: true,
		}));
	};

	const handleLogout = () => {
		clearClientAuthState();
		void auth
			.signoutRedirect({
				post_logout_redirect_uri: window.location.origin + getPublicAssetPath('user/login'),
				id_token_hint: auth.user?.id_token,
			})
			.catch(() => {
				void auth.removeUser();
			});
	};

	const handleLogin = () => {
		auth?.signinRedirect();
	};

	return {
		dangXuat: handleLogout,
		dangNhap: handleLogin,
		isLoading: auth?.isLoading || false,
	};
};
