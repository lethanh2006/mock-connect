import { landingUrl } from '@/services/base/constant';
import { FileWordOutlined, GlobalOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Menu, notification, Spin } from 'antd';
import { type ItemType } from 'antd/lib/menu/hooks/useItems';
import React, { useEffect } from 'react';
import { history, useModel } from 'umi';
import { OIDCBounder } from '../OIDCBounder';
import HeaderDropdown from './HeaderDropdown';
import styles from './index.less';

export type GlobalHeaderRightProps = {
	menu?: boolean;
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
	const { initialState } = useModel('@@initialState');
	const { getThongTinCuaToiModel, record: recSinhVien } = useModel('sinhvien.sinhvien');
	const avatarUrl = recSinhVien?.anhDaiDienUrl ?? initialState?.currentUser?.picture;

	useEffect(() => {
		if (initialState?.currentUser?.ssoId)
			getThongTinCuaToiModel().then((res) => {
				// if (res.needUpdateFaceReg)
				// 	notification.warn({
				// 		message: 'Nhận diện khuôn mặt',
				// 		description: 'Cần cập nhật ảnh nhận diện khuôn mặt',
				// 		key: 'updateFaceRegNoti',
				// 		btn: (
				// 			<Button
				// 				type='primary'
				// 				size='small'
				// 				onClick={() => {
				// 					history.push('/thong-tin-ca-nhan');
				// 					notification.close('updateFaceRegNoti');
				// 				}}
				// 			>
				// 				Cập nhật ngay
				// 			</Button>
				// 		),
				// 	});
			});
	}, [initialState?.currentUser?.ssoId]);

	const loginOut = () => OIDCBounder?.getActions()?.dangXuat();

	if (!initialState || !initialState.currentUser)
		return (
			<span className={`${styles.action} ${styles.account}`}>
				<Spin size='small' style={{ marginLeft: 8, marginRight: 8 }} />
			</span>
		);

	const fullName = initialState.currentUser?.family_name
		? `${initialState.currentUser.family_name} ${initialState.currentUser?.given_name ?? ''}`
		: initialState.currentUser?.name ?? (initialState.currentUser?.preferred_username || '');
	const lastNameChar = fullName.split(' ')?.at(-1)?.[0]?.toUpperCase();

	const items: ItemType[] = [
		{
			key: 'name',
			icon: <UserOutlined />,
			label: fullName,
		},
		// {
		// 	key: 'password',
		// 	icon: <SwapOutlined />,
		// 	label: 'Đổi mật khẩu',
		// 	onClick: () => {
		// 		const redirect = window.location.href;
		// 		window.location.href = `${keycloakAuthEndpoint}?client_id=${AppModules[currentRole].clientId}&redirect_uri=${redirect}&response_type=code&scope=openid&kc_action=UPDATE_PASSWORD`;
		// 	},
		// },
		{
			key: 'office',
			icon: <FileWordOutlined />,
			label: 'Office 365',
			onClick: () => window.open('https://office.com/'),
		},
		{
			key: 'portal',
			icon: <GlobalOutlined />,
			label: APP_CONFIG_TITLE_LANDING ?? 'Cổng thông tin',
			onClick: () => window.open(landingUrl),
		},
		{ type: 'divider', key: 'divider' },
		{
			key: 'logout',
			icon: <LogoutOutlined />,
			label: 'Đăng xuất',
			onClick: loginOut,
			danger: true,
		},
	];

	if (menu && !initialState.currentUser.realm_access?.roles?.includes('QUAN_TRI_VIEN')) {
		items.splice(0, 1, {
			key: 'center',
			icon: <UserOutlined />,
			label: fullName
				? `${fullName} - ${initialState.currentUser?.preferred_username || ''}`
				: initialState.currentUser?.preferred_username || '',
			onClick: () => history.push('/thong-tin-ca-nhan'),
		});
	}

	return (
		<>
			<HeaderDropdown overlay={<Menu className={styles.menu} items={items} />}>
				<span className={`${styles.action} ${styles.account}`}>
					<Avatar
						className={styles.avatar}
						src={!!avatarUrl ? <img src={avatarUrl} /> : undefined}
						icon={!avatarUrl ? lastNameChar ?? <UserOutlined /> : undefined}
						alt='avatar'
					/>
					<span className={`${styles.name}`}>{fullName}</span>
				</span>
			</HeaderDropdown>
		</>
	);
};

export default AvatarDropdown;
