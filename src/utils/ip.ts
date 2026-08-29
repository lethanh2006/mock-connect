import { AppModules, EModuleKey } from '@/services/base/constant';

const ipRoot = APP_CONFIG_IP_ROOT; // ip dev
const ipRootWithSlash = ipRoot.replace(/\/?$/, '/');
const ipConnect = ipRootWithSlash + 'connect';
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
const ipCCT = getConnectTarget('co-curriculum'); // ip dev
const ipFile = ipRoot + 'file';
const ipFileMultiPart = ipRoot + 'file';

// const ipCCT = 'http://192.168.1.38:3010'; // ip dev
// const ipCsvc = ipRoot + 'csvc';
const ipCsvc = getConnectTarget("csvc");

const currentRole = EModuleKey.CONNECT;
const replaceRole: EModuleKey | undefined = EModuleKey.CONG_CAN_BO; //EModuleKey.CONG_CAN_BO; // Thay đổi theo từng phân hệ

// DO NOT TOUCH
const keycloakClientID = AppModules[currentRole].clientId;
const keycloakAuthority = APP_CONFIG_KEYCLOAK_AUTHORITY;
const qldtApiClientId = `${APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID}qldt-api`;
const financeApiClientId = `${APP_CONFIG_PREFIX_OF_KEYCLOAK_CLIENT_ID}tc-api`;
const keycloakAuthEndpoint = APP_CONFIG_KEYCLOAK_AUTHORITY + '/protocol/openid-connect/auth';
const keycloakTokenEndpoint = APP_CONFIG_KEYCLOAK_AUTHORITY + '/protocol/openid-connect/token';
const keycloakUserInfoEndpoint = APP_CONFIG_KEYCLOAK_AUTHORITY + '/protocol/openid-connect/userinfo';
const moodleEndpoint = APP_CONFIG_MOODLE_ENDPOINT;

export {
	currentRole,
	financeApiClientId,
	ip3,
	ipCCT,
	ipConnect,
	ipCore,
	ipCsvc,
	ipDaoTao,
	ipFile,
	ipFileMultiPart,
	ipKhaoThi,
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
	qldtApiClientId,
	replaceRole,
};
