import { AppModules, EModuleKey } from '@/services/base/constant';

const ipRoot = APP_CONFIG_IP_ROOT; // ip dev
const ipRootWithSlash = ipRoot.replace(/\/?$/, '');
const ipConnect = ipRootWithSlash;
const getConnectTarget = (target: string) => `${ipConnect}/${target}`;

const ip3 = ipConnect; // ip dev
// const ip3 = 'http://192.168.1.38:3000'; // ip dev

const ipNotif = getConnectTarget('notification'); // ip dev
// const ipDaoTao = ipRoot + 'qldt'; // ip dev
const ipDaoTao = getConnectTarget('qldt'); // ip dev
// const ipDaoTao = 'http://172.16.8.55:3999'; // ip dev

// const ipDaoTao = 'http://192.168.1.80:3001'; // ip dev
const ipNhanSu = getConnectTarget('tcns');
const ipCore = getConnectTarget('core');
const ipTaiChinh = getConnectTarget('tai-chinh');
const ipKhaoThi = getConnectTarget('not-deployed/khao-thi');
const ipThuVien = getConnectTarget('not-deployed/thu-vien'); // ip dev
const ipChatbot = getConnectTarget('not-deployed/chatbot-api');
const ipCCT = getConnectTarget('co-curriculum'); // ip dev
const ipFile = ipRoot + 'file';
const ipFileMultiPart = ipRoot + 'file';

// const ipCCT = 'http://192.168.1.38:3010'; // ip dev
const ipCsvc = ipRoot + 'csvc';

const ipNewsWP = APP_CONFIG_URL_LANDING;

const currentRole = EModuleKey.CONNECT;
const replaceRole: EModuleKey | undefined = EModuleKey.CONG_CAN_BO; //EModuleKey.CONG_CAN_BO; // Thay đổi theo từng phân hệ
const oneSignalRole = EModuleKey.CONNECT;

// DO NOT TOUCH
const keycloakClientID = AppModules[currentRole].clientId;
const keycloakAuthority = APP_CONFIG_KEYCLOAK_AUTHORITY;
const qldtApiClientId = `${APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID}qldt-api`;
const financeApiClientId = `${APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID}tc-api`;
const keycloakAuthEndpoint = APP_CONFIG_KEYCLOAK_AUTHORITY + '/protocol/openid-connect/auth';
const keycloakTokenEndpoint = APP_CONFIG_KEYCLOAK_AUTHORITY + '/protocol/openid-connect/token';
const keycloakUserInfoEndpoint = APP_CONFIG_KEYCLOAK_AUTHORITY + '/protocol/openid-connect/userinfo';
const sentryDSN = APP_CONFIG_SENTRY_DSN;
const oneSignalClient = APP_CONFIG_ONE_SIGNAL_ID;
const moodleEndpoint = APP_CONFIG_MOODLE_ENDPOINT;

export {
	ipFileMultiPart,
	currentRole, financeApiClientId, ip3,
	ipCCT,
	ipChatbot,
	ipConnect,
	ipCore,
	ipCsvc,
	ipDaoTao,
	ipFile, ipKhaoThi,
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
	sentryDSN
};

