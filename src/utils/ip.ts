import { AppModules, EModuleKey } from '@/services/ant-design-pro/constant';

// const ipRoot = 'https://ais.aisenote.com/'; // ip prod
const ipRoot = 'https://ais.aisenote.com/dev/'; // ip dev

// const ip3 = ipRoot + 'qldt'; // ip dev
const ip3 = ipRoot + 'slink'; // ip dev

const ipNotif = ipRoot + 'notification'; // ip dev
const ipDaoTao = ipRoot + 'qldt'; // ip dev
const ipNhanSu = ipRoot + 'tcns';
const ipCore = ipRoot + 'core';
const ipTaiChinh = ipRoot + 'tai-chinh-api';
const ipNews = 'https://vwa-content.aisenote.com';
const ipGlobal = 'https://ais2.aisenote.com/qldt-internal-api'; // ip dev

const currentRole = EModuleKey.CONNECT;

const keycloakClientID = AppModules[currentRole].clientId;
const keycloakAuthority = ipRoot + 'keycloak/realms/vwa';
const resourceServerClientId = 'vwa-auth';
const keycloakTokenEndpoint = ipRoot + 'keycloak/realms/vwa/protocol/openid-connect/token';

export {
  ipDaoTao,
  ipNhanSu,
  ipCore,
  ip3,
  ipNotif,
  ipNews,
  ipGlobal,
  ipTaiChinh,
  currentRole,
  keycloakClientID,
  resourceServerClientId,
  keycloakTokenEndpoint,
  keycloakAuthority,
};
