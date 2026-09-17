import { Popover, PopoverContent, PopoverTrigger } from '@/components/Icons';
import classNames from 'classnames';
import React, { useRef, useState } from 'react';
import styles from './index.less';

export type HeaderDropdownProps = {
	overlayClassName?: string;
	content?: React.ReactNode;
	trigger?: 'hover' | 'click';
	children?: React.ReactNode;
};

// Popover vinui (radix) chỉ mở khi click — antd Popover cho phép mở bằng hover. Vì
// HeaderDropdown vẫn cần trigger='hover' (LocaleSwitch), tự quản lý open bằng hover
// có debounce nhỏ để không đóng khi di chuột từ trigger sang content.
const HeaderDropdown: React.FC<HeaderDropdownProps> = ({ overlayClassName: cls, content, trigger = 'click', children }) => {
	const [open, setOpen] = useState(false);
	const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

	const openNow = () => {
		clearTimeout(closeTimer.current);
		setOpen(true);
	};
	const closeSoon = () => {
		closeTimer.current = setTimeout(() => setOpen(false), 150);
	};

	const hoverProps = trigger === 'hover' ? { onMouseEnter: openNow, onMouseLeave: closeSoon } : {};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild {...hoverProps}>
				{children}
			</PopoverTrigger>
			<PopoverContent align='end' className={classNames(styles.dropdown_container, cls)} {...hoverProps}>
				{content}
			</PopoverContent>
		</Popover>
	);
};

export default HeaderDropdown;
