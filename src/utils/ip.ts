import { AppModules, EModuleKey } from '@/services/ant-design-pro/constant';

// const ip3 = 'https://dhs.ptit.edu.vn/odoo-user-service'; // ip prod
// const ip = 'https://dhs.ptit.edu.vn'; // ip prod

// const ip3 = 'https://ais.aisenote.com/qldt'; // ip dev
const ip3 = 'https://ais.aisenote.com/slink'; // ip dev

const ipNotif = 'https://ais.aisenote.com/notification'; // ip dev
const ipGlobal = 'https://ais2.aisenote.com/qldt-internal-api'; // ip dev
const ipDaoTao = 'https://ais.aisenote.com/qldt'; // ip dev
const ipNhanSu = 'https://ais.aisenote.com/tcns';
const ipCore = 'https://ais.aisenote.com/core';

const currentRole = EModuleKey.CONNECT;

const keycloakClientID = AppModules[currentRole].clientId;
const keycloakAuthority = 'https://ais.aisenote.com/keycloak/realms/vwa';
const resourceServerClientId = 'vwa-auth';
const keycloakTokenEndpoint =
  'https://ais.aisenote.com/keycloak/realms/vwa/protocol/openid-connect/token';

export {
  ipDaoTao,
  ipNhanSu,
  ipCore,
  ip3,
  ipNotif,
  ipGlobal,
  currentRole,
  keycloakClientID,
  resourceServerClientId,
  keycloakTokenEndpoint,
  keycloakAuthority,
};
