import {
	keycloakAuthEndpoint,
	keycloakTokenEndpoint,
	keycloakUserInfoEndpoint,
	oneSignalClient,
	sentryDSN,
} from './ip';

// Các endpoint KHÔNG gắn x-data-partition-code
export const excludedPaths = [
	APP_CONFIG_KEYCLOAK_AUTHORITY,
	keycloakAuthEndpoint,
	keycloakTokenEndpoint,
	keycloakUserInfoEndpoint,
	sentryDSN,
	oneSignalClient,
].filter(Boolean);
