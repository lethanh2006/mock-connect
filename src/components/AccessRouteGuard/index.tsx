import NotAccessible from '@/pages/exception/403';
import { useMemo, type FC, type ReactNode } from 'react';
import { matchRoutes, useAccess, useAppData, useLocation, useModel } from 'umi';

const AccessRouteGuard: FC<{ children: ReactNode }> = ({ children }) => {
	const { initialState } = useModel('@@initialState');
	const access = useAccess() as Record<string, any>;
	const { pathname } = useLocation();
	const { clientRoutes } = useAppData();

	const matchedRoute = useMemo(() => {
		const matches = matchRoutes(clientRoutes as any[], pathname);
		if (!matches?.length) return undefined;

		return [...matches].reverse().find((item) => (item.route as any)?.access)?.route as
			| { access?: string; maChucNang?: string; listChucNang?: string[] }
			| undefined;
	}, [clientRoutes, pathname]);

	if (initialState?.permissionLoading) return <>{children}</>;

	const accessCode = matchedRoute?.access;
	if (accessCode) {
		const detector = access[accessCode];
		const allowed = typeof detector === 'function' ? detector(matchedRoute) : !!detector;
		if (!allowed) return <NotAccessible />;
	}

	return <>{children}</>;
};

export default AccessRouteGuard;
