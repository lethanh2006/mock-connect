// import { keycloakSecret } from './ip';
import { keycloakAuthority, keycloakClientID } from './ip';

const oidcCallbackParams = ['code', 'error', 'error_description', 'error_uri', 'iss', 'session_state', 'state'];

const getUrlWithoutOidcCallbackParams = () => {
	const url = new URL(window.location.href);

	oidcCallbackParams.forEach((param) => url.searchParams.delete(param));

	return url;
};

/** Keep OIDC callback data out of the address bar and out of subsequent auth requests. */
export const onSigninCallback = () => {
	const url = getUrlWithoutOidcCallbackParams();
	const search = url.searchParams.toString();

	window.history.replaceState({}, document.title, `${url.pathname}${search ? `?${search}` : ''}${url.hash}`);
};

/** Use a stable redirect URI even when the current URL is an OIDC callback URL. */
export const getOidcRedirectUri = () => {
	const url = getUrlWithoutOidcCallbackParams();
	const search = url.searchParams.toString();

	return `${url.origin}${url.pathname}${search ? `?${search}` : ''}${url.hash}`;
};

export const oidcConfig = {
	authority: keycloakAuthority,
	client_id: keycloakClientID,
	automaticSilentRenew: true,
	accessTokenExpiringNotificationTimeInSeconds: 60,
	maxSilentRenewTimeoutRetries: 1,
	onSigninCallback,
	// client_secret: keycloakSecret,
};
