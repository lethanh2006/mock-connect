import type { IInitialState } from '@/services/base/typing';

export type AuthorizedRolesByClient = Record<string, string[]>;

type KeycloakTokenPayload = {
	realm_access?: {
		roles?: string[];
	};
	resource_access?: Record<string, { roles?: string[] }>;
};

const decodeBase64Url = (value: string) => {
	const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
	const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');

	return decodeURIComponent(
		Array.from(atob(padded))
			.map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
			.join(''),
	);
};

export const decodeKeycloakToken = (token?: string): KeycloakTokenPayload | undefined => {
	if (!token) return undefined;

	try {
		const [, payload] = token.split('.');
		if (!payload) return undefined;

		return JSON.parse(decodeBase64Url(payload)) as KeycloakTokenPayload;
	} catch {
		return undefined;
	}
};

export const getKeycloakRoleContext = (token: string | undefined, clientIds: string[]) => {
	const payload = decodeKeycloakToken(token);
	const authorizedRolesByClient = clientIds.reduce<AuthorizedRolesByClient>((acc, clientId) => {
		acc[clientId] = payload?.resource_access?.[clientId]?.roles ?? [];
		return acc;
	}, {});
	const authorizedRoles = Array.from(new Set(Object.values(authorizedRolesByClient).flat()));
	const realmRoles = payload?.realm_access?.roles ?? [];

	return {
		authorizedRoles,
		authorizedRolesByClient,
		realmRoles,
	};
};

export const getLegacyPermissionScopes = (initialState?: IInitialState) => {
	return initialState?.authorizedPermissions?.flatMap((item) => item.scopes) ?? [];
};

export const hasAnyClientRole = (initialState: IInitialState | undefined, clientIds?: string[]) => {
	const rolesByClient = initialState?.authorizedRolesByClient ?? {};
	const clientRoles = clientIds?.length
		? clientIds.flatMap((clientId) => rolesByClient[clientId] ?? [])
		: initialState?.authorizedRoles;
	return Boolean(clientRoles?.length);
};

export const hasModulePermission = (
	initialState: IInitialState | undefined,
	moduleKey?: string,
	clientIds?: string[],
) => {
	if (!moduleKey) return true;
	if (initialState?.authorizedPermissions?.some((item) => item.rsname === moduleKey)) return true;

	return hasAnyClientRole(initialState, clientIds);
};

const mapLegacyPermissionToClientRoles = (permission?: string): string[] => {
	if (!permission) return [];
	if (permission.includes('.')) return [permission];
	return [permission];
};

export const hasAccessCode = (initialState: IInitialState | undefined, permission?: string) => {
	if (!permission) return false;
	const roles = initialState?.authorizedRoles ?? [];
	const mappedRoles = mapLegacyPermissionToClientRoles(permission);
	return mappedRoles.some((role) => roles.includes(role));
};

export const hasAnyAccessCode = (initialState: IInitialState | undefined, permissions?: string[]) => {
	return Boolean(permissions?.some((permission) => hasAccessCode(initialState, permission)));
};

export const hasAllAccessCodes = (initialState: IInitialState | undefined, permissions?: string[]) => {
	return Boolean(permissions?.length && permissions.every((permission) => hasAccessCode(initialState, permission)));
};
