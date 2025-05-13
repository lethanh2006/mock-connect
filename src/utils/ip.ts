import { AppModules, EModuleKey } from '@/services/base/constant';

const ipRoot = APP_CONFIG_IP_ROOT; // ip dev

const ip3 = ipRoot + 'slink'; // ip dev
// const ip3 = 'http://192.168.1.37:3000'; // ip dev

const ipNotif = ipRoot + 'notification'; // ip dev
const ipDaoTao = ipRoot + 'qldt'; // ip dev
// const ipDaoTao = 'http://192.168.1.80:3001'; // ip dev
const ipNhanSu = ipRoot + 'tcns';
const ipCore = ipRoot + 'core';
const ipTaiChinh = ipRoot + 'tai-chinh';
const ipKhaoThi = ipRoot + 'khao-thi';
const ipThuVien = ipRoot + 'thu-vien'; // ip dev

const ipNewsWP = APP_CONFIG_URL_LANDING;

const currentRole = EModuleKey.CONNECT;
const replaceRole: EModuleKey | undefined = undefined; //EModuleKey.CONG_CAN_BO; // Thay đổi theo từng phân hệ
const oneSignalRole = EModuleKey.CONNECT;

// DO NOT TOUCH
const keycloakClientID = AppModules[currentRole].clientId;
const keycloakAuthority = APP_CONFIG_KEYCLOAK_AUTHORITY;
const resourceServerClientId = `${APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID}auth`;
const keycloakAuthEndpoint = APP_CONFIG_KEYCLOAK_AUTHORITY + '/protocol/openid-connect/auth';
const keycloakTokenEndpoint = APP_CONFIG_KEYCLOAK_AUTHORITY + '/protocol/openid-connect/token';
const keycloakUserInfoEndpoint = APP_CONFIG_KEYCLOAK_AUTHORITY + '/protocol/openid-connect/userinfo';
const sentryDSN = APP_CONFIG_SENTRY_DSN;
const oneSignalClient = APP_CONFIG_ONE_SIGNAL_ID;
const moodleEndpoint = APP_CONFIG_MOODLE_ENDPOINT;

export {
	ipDaoTao,
	ipNhanSu,
	currentRole,
	replaceRole,
	ip3,
	ipCore,
	ipNotif,
	ipTaiChinh,
	ipThuVien,
	oneSignalRole,
	keycloakClientID,
	resourceServerClientId,
	keycloakAuthEndpoint,
	keycloakAuthority,
	keycloakTokenEndpoint,
	keycloakUserInfoEndpoint,
	oneSignalClient,
	sentryDSN,
	ipNewsWP,
	moodleEndpoint,
	ipKhaoThi,
};
