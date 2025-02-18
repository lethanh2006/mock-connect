import { useCooldown } from '@/hooks/useCooldown';
import { Button, Tooltip, type ButtonProps } from 'antd';
import React from 'react';
import './style.less';

/** Button extend text with default Tooltip */
const ButtonExtend = (
	props: {
		children?: React.ReactNode;
		tooltip?: React.ReactNode;
		/**
		 * Cooldown (second)
		 */
		cooldownMs?: number;
		notHideText?: boolean;
	} & ButtonProps,
) => {
	const { children, tooltip, notHideText, cooldownMs, disabled, onClick, ...otherProps } = props;
	const { countdown, disabled: disableCooldown, startCooldown } = useCooldown(Number(cooldownMs) / 1000);

	const handleOnclick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
		if (onClick) {
			onClick(e);
		}
		if (cooldownMs != null) {
			startCooldown();
		}
	};

	const cooldownLabel = countdown > 0 && `(${countdown} giây)`;
	const childrenValue = [children, cooldownLabel].filter(Boolean).join(' ');
	return (
		<Tooltip title={tooltip ?? children}>
			<Button {...otherProps} disabled={disableCooldown || disabled} onClick={handleOnclick}>
				{!notHideText && !!children && !!otherProps.icon ? <span className='span-extend'>{childrenValue}</span> : childrenValue}
			</Button>
		</Tooltip>
	);
};

export default ButtonExtend;
