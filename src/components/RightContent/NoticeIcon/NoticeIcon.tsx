import { IconBell, SidebarDockItem } from '@/components/Icons';
import { useIntl } from '@umijs/max';
import React from 'react';

export type NoticeIconProps = {
	count?: number;
};

const NoticeIcon: React.FC<NoticeIconProps> = ({ count }) => {
	const intl = useIntl();

	return (
		<SidebarDockItem
			view='notifications'
			tooltip={intl.formatMessage({ id: 'app.header.notice', defaultMessage: 'Thông báo' })}
			badge={count ? (count < 100 ? count : '99+') : undefined}
		>
			<IconBell size={22} />
		</SidebarDockItem>
	);
};

export default NoticeIcon;
