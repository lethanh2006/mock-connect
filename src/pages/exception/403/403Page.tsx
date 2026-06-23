import Footer from '@/components/Footer';
import { OIDCBounder } from '@/components/OIDCBounder';
import { landingUrl } from '@/services/base/constant';
import { currentRole, financeApiClientId, qldtApiClientId } from '@/utils/ip';
import { hasModulePermission } from '@/utils/keycloakRoles';
import { GlobalOutlined, LogoutOutlined } from '@ant-design/icons';
import { Button, Result } from 'antd';
import { useEffect } from 'react';
import { history, useModel } from 'umi';

const NotAccessible = () => {
	const { initialState } = useModel('@@initialState');

	useEffect(() => {
		if (currentRole && hasModulePermission(initialState, currentRole, [qldtApiClientId, financeApiClientId]))
			history.replace('/dashboard');
	}, [initialState?.authorizedPermissions, initialState?.authorizedRoles]);

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
					title='Truy cập bị từ chối'
					style={{
						background: 'none',
					}}
					subTitle='Xin lỗi, bạn không có quyền truy cập trang này.'
					extra={
						<div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
							<Button type='primary' onClick={() => (window.location.href = landingUrl)} icon={<GlobalOutlined />}>
								Tới trang Cổng thông tin
							</Button>
							<Button icon={<LogoutOutlined />} onClick={onLogout}>
								Đăng xuất
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
