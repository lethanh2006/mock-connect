import Footer from '@/components/Footer';
import { Button, IconDoor01, IconEarth } from '@/components/Icons';
import { OIDCBounder, OIDCBounder_ } from '@/components/OIDCBounder';
import { landingUrl } from '@/services/base/constant';
import { currentRole, financeApiClientId, qldtApiClientId } from '@/utils/ip';
import { hasModulePermission } from '@/utils/keycloakRoles';
import { Result } from 'antd';
import { useEffect } from 'react';
import { history, useIntl, useModel } from 'umi';

const NotAccessible = () => {
	const { initialState } = useModel('@@initialState');
	const intl = useIntl();

	useEffect(() => {
		if (currentRole && hasModulePermission(initialState, currentRole, [qldtApiClientId, financeApiClientId]))
			history.replace('/dashboard');
	}, [initialState?.authorizedPermissions, initialState?.authorizedRoles]);

	const onLogout = (): void => OIDCBounder?.getActions()?.dangXuat();

	return (
		<OIDCBounder_>
			<div
				style={{
					minHeight: '100vh',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					flexDirection: 'column',
				}}
			>
				<Result
					status='403'
					title={intl.formatMessage({ id: 'pages.exception.403.title' })}
					style={{
						background: 'none',
					}}
					subTitle={intl.formatMessage({ id: 'pages.exception.403.subtitle' })}
					extra={
						<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
							<Button variant='default' onClick={() => (window.location.href = landingUrl)} icon={<IconEarth />}>
								{intl.formatMessage({ id: 'pages.exception.portal' })}
							</Button>
							<Button variant='outline' icon={<IconDoor01 />} onClick={onLogout}>
								{intl.formatMessage({ id: 'pages.exception.logout' })}
							</Button>
						</div>
					}
				/>

				<Footer />
			</div>
		</OIDCBounder_>
	);
};
export default NotAccessible;
