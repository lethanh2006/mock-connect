import { landingUrl } from '@/services/base/constant';
import { DatabaseOutlined, FileWordOutlined, GlobalOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Spin } from 'antd';
import { ItemType } from 'antd/es/menu/interface';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import { OIDCBounder } from '../OIDCBounder';
import styles from './index.less';

const AvatarDropdown = () => {
	const intl = useIntl();
	const { initialState } = useModel('@@initialState');
	const { danhSach, getAllModel } = useModel('core.phanvunguser');

	const currentPartition = localStorage.getItem('partitionCode');

	//Phân vùng dữ liệu
	useEffect(() => {
		if (initialState?.currentUser?.ssoId) {
			getAllModel(undefined, undefined, undefined, undefined, 'many/me').then((res) => {
				if (!res || res.length === 0) {
					localStorage.removeItem('partitionCode');
					return;
				}

				const exists = res.some((item) => item?.dataPartitionCode?.toString() === currentPartition);

				if (!currentPartition || !exists) {
					localStorage.setItem('partitionCode', res?.[0]?.dataPartitionCode?.toString());
				}
			});
		}
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
		: (initialState.currentUser?.name ?? (initialState.currentUser?.preferred_username || ''));
	const lastNameChar = fullName.split(' ')?.at(-1)?.[0]?.toUpperCase();

	const partitionItems: ItemType[] =
		danhSach?.map((item) => {
			const code = item?.dataPartitionCode?.toString();
			const isActive = code === currentPartition;

			return {
				key: `partition-${code}`,
				icon: <DatabaseOutlined />,
				label: item?.dataPartition?.name ?? item?.dataPartition?.ma,
				className: isActive ? styles.activePartition : undefined,
				onClick: () => {
					localStorage.setItem('partitionCode', code);
					window.location.reload();
				},
			};
		}) ?? [];

	const items: ItemType[] = [
		...(partitionItems as any),
		...(partitionItems.length > 0 ? [{ type: 'divider', key: 'divider' } as ItemType] : []),
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
			label:
				APP_CONFIG_TITLE_LANDING ?? intl.formatMessage({ id: 'app.header.portal', defaultMessage: 'Cổng thông tin' }),
			onClick: () => window.open(landingUrl),
		},
		{ type: 'divider', key: 'divider' },
		{
			key: 'logout',
			icon: <LogoutOutlined />,
			label: intl.formatMessage({ id: 'app.header.logout', defaultMessage: 'Đăng xuất' }),
			onClick: loginOut,
			danger: true,
		},
	];

	if (!initialState.currentUser.realm_access?.roles?.includes('QUAN_TRI_VIEN')) {
		// items.splice(1, 0, {
		//   key: 'center',
		//   icon: <UserOutlined />,
		//   label: intl.formatMessage({ id: 'app.header.userpage', defaultMessage: 'Trang cá nhân' }),
		//   onClick: () => history.push('/account/center'),
		// });
	}

	return (
		<>
			<Dropdown menu={{ items }}>
				<span className={`${styles.action} ${styles.account}`}>
					<div className={styles.avatarWrapper}>
						<Avatar
							className={styles.avatar}
							src={initialState.currentUser?.picture ? <img src={initialState.currentUser?.picture} /> : undefined}
							icon={!initialState.currentUser?.picture ? (lastNameChar ?? <UserOutlined />) : undefined}
							alt='avatar'
						/>
						{danhSach?.length >= 2 && (
							<span className={styles.partitionBadge}>
								{danhSach
									.find((item) => item?.dataPartitionCode?.toString() === currentPartition)
									?.dataPartition?.name?.[0]?.toUpperCase() ?? ''}
							</span>
						)}
					</div>
					<span className={`${styles.name}`}>{fullName}</span>
				</span>
			</Dropdown>
		</>
	);
};

export default AvatarDropdown;
