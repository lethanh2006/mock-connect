import readAll from '@/assets/read-all.svg';
import { BellOutlined } from '@ant-design/icons';
import { Link } from '@umijs/max';
import { Badge, Tooltip } from 'antd';
import useMergedState from 'rc-util/es/hooks/useMergedState';
import React from 'react';
import { useMediaQuery } from 'react-responsive';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

export type NoticeIconProps = {
	count?: number;
	total?: number;
	onPopupVisibleChange?: (visible: boolean) => void;
	popupVisible?: boolean;
	children?: React.ReactNode;
	allowClear?: boolean;
	onClear?: () => void;
};

const NoticeIcon: React.FC<NoticeIconProps> = ({
	count,
	total,
	children,
	allowClear,
	onClear,
	popupVisible,
	onPopupVisibleChange,
}) => {
	const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
	const [visible, setVisible] = useMergedState<boolean>(false, {
		value: popupVisible,
		onChange: onPopupVisibleChange,
	});

	return (
		<HeaderDropdown
			placement={isMobile ? 'bottom' : 'bottomRight'}
			content={
				<div className='module-view'>
					<div className='module-header'>
						Thông báo của tôi ({total ?? 0})
						<Tooltip title='Đánh dấu tất cả là đã đọc'>
							<Link
								to='#!'
								onClick={(e) => {
									e.preventDefault();
									if (allowClear && onClear) onClear();
								}}
							>
								<img src={readAll} />
							</Link>
						</Tooltip>
					</div>
					<div className='module-container' style={{ paddingBottom: 2, overflow: 'hidden' }}>
						{children}
					</div>
				</div>
			}
			trigger={['click']}
			open={visible}
			onOpenChange={(open) => setVisible(open)}
		>
			<Tooltip title='Thông báo' placement='bottom'>
				<Badge count={count ? (count < 100 ? count : '99+') : undefined} className={styles.noti_badge}>
					<a>
						<BellOutlined />
					</a>
				</Badge>
			</Tooltip>
		</HeaderDropdown>
	);
};

export default NoticeIcon;
