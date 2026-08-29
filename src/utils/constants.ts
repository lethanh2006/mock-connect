import {
	keycloakAuthEndpoint,
	keycloakTokenEndpoint,
	keycloakUserInfoEndpoint,
} from './ip';

// Các endpoint KHÔNG gắn x-data-partition-code
export const excludedPaths = [
	APP_CONFIG_KEYCLOAK_AUTHORITY,
	keycloakAuthEndpoint,
	keycloakTokenEndpoint,
	keycloakUserInfoEndpoint,
].filter(Boolean);

export const getPartitionCode = (): string | null => {
	return localStorage.getItem('partitionCode');
};

export const kiemTraPhanVung = (dataPartitionCode: string | null) => {
	return !dataPartitionCode || dataPartitionCode === localStorage.getItem('partitionCode');
};
