import { AppModules, landingUrl } from '@/services/base/constant';
import { generateInitialsAvatar } from '@/utils/initialsAvatar';
import { currentRole } from '@/utils/ip';
import {
	AccountMenu,
	AccountMenuItem,
	AccountMenuOptions,
	AccountMenuSeparator,
	AccountMenuTrigger,
	IconCheck,
	IconDoor01,
	IconEarth,
	IconLogoMicrosoft,
} from '@vinuni/ui';
import { Spin } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import './index.less';
import { OIDCBounder } from '../OIDCBounder';

const AvatarDropdown = () => {
	const intl = useIntl();
	const { initialState } = useModel('@@initialState');
	const { danhSach: dsPhanVung, getPartitionCodeMeModel } = useModel('core.phanvunguser');
	const { getAllModel: getAllPhanVung } = useModel('core.phanvungdulieu');

	const currentPartition = localStorage.getItem('partitionCode');

	//Phân vùng dữ liệu
	useEffect(() => {
		if (initialState?.currentUser?.ssoId) {
			//Get All phân vùng để lấy mã màu
			getAllPhanVung();
			getPartitionCodeMeModel(currentPartition?.toString());
		}
	}, [initialState?.currentUser?.ssoId]);

	const loginOut = () => OIDCBounder?.getActions()?.dangXuat();

	if (!initialState || !initialState.currentUser) {
		return (
			<div className='avatar-dropdown-loading'>
				<Spin size='small' />
			</div>
		);
	}

	const fullName = initialState.currentUser?.family_name
		? `${initialState.currentUser.family_name} ${initialState.currentUser?.given_name ?? ''}`
		: (initialState.currentUser?.name ?? (initialState.currentUser?.preferred_username || ''));

	const avatarSrc = initialState.currentUser?.picture || generateInitialsAvatar(fullName);

	return (
		<AccountMenu>
			<AccountMenuTrigger
				name={fullName}
				role={intl.formatMessage({ id: AppModules[currentRole].title })}
				avatarSrc={avatarSrc}
			/>
			<AccountMenuOptions>
				{dsPhanVung?.length >= 2 && (
					<>
						{dsPhanVung.map((item) => {
							const code = item?.dataPartitionCode;
							const isActive = code === currentPartition;

							return (
								<AccountMenuItem
									key={`partition-${code}`}
									icon={<IconCheck style={{ visibility: isActive ? 'visible' : 'hidden' }} />}
									onClick={() => {
										if (code) localStorage.setItem('partitionCode', code);
										window.location.reload();
									}}
								>
									{item?.dataPartition?.name ?? item?.dataPartition?.ma}
								</AccountMenuItem>
							);
						})}
						<AccountMenuSeparator />
					</>
				)}

				<AccountMenuItem icon={<IconLogoMicrosoft />} onClick={() => window.open('https://office.com/')}>
					Office 365
				</AccountMenuItem>

				<AccountMenuItem icon={<IconEarth />} onClick={() => window.open(landingUrl)}>
					{intl.formatMessage({ id: 'modules.cong-thong-tin' }) ||
						intl.formatMessage({ id: 'app.header.portal', defaultMessage: 'Cổng thông tin' })}
				</AccountMenuItem>

				<AccountMenuSeparator />

				<AccountMenuItem icon={<IconDoor01 />} onClick={loginOut}>
					{intl.formatMessage({ id: 'app.header.logout', defaultMessage: 'Đăng xuất' })}
				</AccountMenuItem>
			</AccountMenuOptions>
		</AccountMenu>
	);
};

export default AvatarDropdown;
