import { Button, Tooltip, TooltipProps, type ButtonProps } from 'antd';
import React from 'react';
import './style.less';

export interface ButtonExtendProps extends ButtonProps {
	tooltip?: React.ReactNode;
	notHideText?: boolean;
	otherTooltipProps?: TooltipProps;
}

/** Button extend text with default Tooltip */
const ButtonExtend = (props: ButtonExtendProps) => {
	const { children, tooltip, notHideText, otherTooltipProps, ...otherProps } = props;

	return (
		<Tooltip title={tooltip ?? children} {...otherTooltipProps}>
			<Button {...otherProps}>
				{!notHideText && !!children && !!otherProps.icon ? <span className='span-extend'>{children}</span> : children}
			</Button>
		</Tooltip>
	);
};

export default ButtonExtend;
