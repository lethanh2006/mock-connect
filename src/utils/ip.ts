import { AppModules, EModuleKey } from '@/services/base/constant';

const ipRoot = APP_CONFIG_IP_ROOT; // ip dev

const ip3 = ipRoot + 'slink'; // ip dev
// const ip3 = 'http://192.168.1.38:3000'; // ip dev

const ipNotif = ipRoot + 'notification'; // ip dev
// const ipDaoTao = ipRoot + 'qldt'; // ip dev
const ipDaoTao = ipRoot + 'qldt'; // ip dev
// const ipDaoTao = 'http://192.168.1.149:3001'; // ip dev

// const ipDaoTao = 'http://192.168.1.80:3001'; // ip dev
const ipNhanSu = ipRoot + 'tcns';
const ipCore = ipRoot + 'core';
const ipTaiChinh = ipRoot + 'tai-chinh';
const ipKhaoThi = ipRoot + 'khao-thi';
const ipThuVien = ipRoot + 'thu-vien'; // ip dev
const ipChatbot = ipRoot + 'chatbot-api';
const ipCCT = ipRoot + 'co-curriculum'; // ip dev
const ipFile = ipRoot + 'file';
// const ipCCT = 'http://192.168.1.38:3010'; // ip dev

const ipNewsWP = APP_CONFIG_URL_LANDING;

const currentRole = EModuleKey.CONNECT;
const replaceRole: EModuleKey | undefined = EModuleKey.CONG_CAN_BO; //EModuleKey.CONG_CAN_BO; // Thay đổi theo từng phân hệ
const oneSignalRole = EModuleKey.CONNECT;

// DO NOT TOUCH
const keycloakClientID = AppModules[currentRole].clientId;
const keycloakAuthority = APP_CONFIG_KEYCLOAK_AUTHORITY;
const resourceServerClientId = `${APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID}auth`;
const qldtApiClientId = `${APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID}qldt-api`;
const financeApiClientId = `${APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID}tc-api`;
const keycloakAuthEndpoint = APP_CONFIG_KEYCLOAK_AUTHORITY + '/protocol/openid-connect/auth';
const keycloakTokenEndpoint = APP_CONFIG_KEYCLOAK_AUTHORITY + '/protocol/openid-connect/token';
const keycloakUserInfoEndpoint = APP_CONFIG_KEYCLOAK_AUTHORITY + '/protocol/openid-connect/userinfo';
const sentryDSN = APP_CONFIG_SENTRY_DSN;
const oneSignalClient = APP_CONFIG_ONE_SIGNAL_ID;
const moodleEndpoint = APP_CONFIG_MOODLE_ENDPOINT;

export {
	currentRole,
	ip3,
	ipCCT,
	ipChatbot,
	ipCore,
	ipDaoTao,
	ipFile,
	financeApiClientId,
	ipKhaoThi,
	ipNewsWP,
	ipNhanSu,
	ipNotif,
	ipTaiChinh,
	ipThuVien,
	keycloakAuthEndpoint,
	keycloakAuthority,
	keycloakClientID,
	keycloakTokenEndpoint,
	keycloakUserInfoEndpoint,
	moodleEndpoint,
	oneSignalClient,
	oneSignalRole,
	qldtApiClientId,
	replaceRole,
	resourceServerClientId,
	sentryDSN,
};
