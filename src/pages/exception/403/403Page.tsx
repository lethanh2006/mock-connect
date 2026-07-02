import Footer from '@/components/Footer';
import { OIDCBounder } from '@/components/OIDCBounder';
import { landingUrl } from '@/services/base/constant';
import { currentRole } from '@/utils/ip';
import { GlobalOutlined, LogoutOutlined } from '@ant-design/icons';
import { Button, Result } from 'antd';
import { useEffect } from 'react';
import { history, useIntl, useModel } from 'umi';

const NotAccessible = () => {
	const { initialState } = useModel('@@initialState');
	const intl = useIntl();

	useEffect(() => {
		if (currentRole && initialState?.authorizedPermissions?.find((item) => item.rsname === currentRole))
			history.replace('/dashboard');
	}, [initialState?.authorizedPermissions]);

	const onLogout = (): void => OIDCBounder?.getActions()?.dangXuat();

	return (
		<OIDCBounder>
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
						<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
							<Button type='primary' onClick={() => (window.location.href = landingUrl)} icon={<GlobalOutlined />}>
								{intl.formatMessage({ id: 'pages.exception.portal' })}
							</Button>
							<Button icon={<LogoutOutlined />} onClick={onLogout}>
								{intl.formatMessage({ id: 'pages.exception.logout' })}
							</Button>
						</div>
					}
				/>

				<Footer />
			</div>
		</OIDCBounder>
	);
};
export default NotAccessible;
