import { AppModules, EModuleKey } from '@/services/base/constant';

const ipRoot = APP_CONFIG_IP_ROOT; // ip dev

// const ip3 = ipRoot + 'qldt'; // ip dev
const ip3 = ipRoot + 'slink'; // ip dev
// const ip3 = 'http://192.168.1.42:3000'; // ip dev

const ipNotif = ipRoot + 'notification'; // ip dev
const ipDaoTao = ipRoot + 'qldt'; // ip dev
// const ipDaoTao = 'http://192.168.1.80:3001'; // ip dev
const ipNhanSu = ipRoot + 'tcns';
const ipCore = ipRoot + 'core';
const ipTaiChinh = ipRoot + 'tai-chinh-api';
const ipNews = 'https://vwa-content.aisenote.com';
const ipNewsWP = 'http://vwa.phanmemdangky.com';

const currentRole = EModuleKey.CONNECT;

// DO NOT TOUCH
const keycloakClientID = AppModules[currentRole].clientId;
const keycloakAuthority = APP_CONFIG_KEYCLOAK_AUTHORITY;
const resourceServerClientId = `${APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID}auth`;
const keycloakTokenEndpoint = APP_CONFIG_KEYCLOAK_TOKEN_ENDPOINT_ID;
const sentryDSN = APP_CONFIG_SENTRY_DSN;
const oneSignalClient = APP_CONFIG_ONE_SIGNAL_ID;

export {
	ipDaoTao,
	ipNhanSu,
	ipCore,
	ip3,
	ipNotif,
	ipNews,
	ipTaiChinh,
	currentRole,
	keycloakClientID,
	resourceServerClientId,
	keycloakTokenEndpoint,
	keycloakAuthority,
	sentryDSN,
	oneSignalClient,
	ipNewsWP,
};
