import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@vinuni/ui';
import React from 'react';
import { mapButtonSize, mapButtonVariant, type AntdButtonType, type AntdSize } from '../utils/vinuniAdapters';
import './style.less';

type TooltipSide = 'top' | 'right' | 'bottom' | 'left';
type TooltipAlign = 'start' | 'center' | 'end';

const mapTooltipPlacement = (placement?: string): { side: TooltipSide; align: TooltipAlign } => {
	switch (placement) {
		case 'bottom':
			return { side: 'bottom', align: 'center' };
		case 'bottomLeft':
			return { side: 'bottom', align: 'start' };
		case 'bottomRight':
			return { side: 'bottom', align: 'end' };
		case 'left':
			return { side: 'left', align: 'center' };
		case 'right':
			return { side: 'right', align: 'center' };
		case 'topLeft':
			return { side: 'top', align: 'start' };
		case 'topRight':
			return { side: 'top', align: 'end' };
		default:
			return { side: 'top', align: 'center' };
	}
};

export interface ButtonExtendProps extends Omit<
	React.ComponentProps<typeof Button>,
	'type' | 'size' | 'variant' | 'icon' | 'iconRight'
> {
	/** Kiểu button (tương đương antd Button `type`) */
	type?: AntdButtonType;
	danger?: boolean;
	/** Tương đương antd Button `htmlType` (thuộc tính `type` gốc của thẻ <button>) */
	htmlType?: 'button' | 'submit' | 'reset';
	size?: AntdSize;
	icon?: React.ReactNode;
	tooltip?: React.ReactNode;
	notHideText?: boolean;
	otherTooltipProps?: { placement?: string };
}

/** Button extend text with default Tooltip */
const ButtonExtend = (props: ButtonExtendProps) => {
	const {
		children,
		tooltip,
		notHideText,
		otherTooltipProps,
		type,
		danger,
		htmlType,
		size = 'small',
		icon,
		...otherProps
	} = props;

	const ariaLabel =
		(otherProps as any)['aria-label'] || (typeof tooltip === 'string' ? tooltip : undefined);

	const buttonNode = (
		<Button
			{...otherProps}
			aria-label={ariaLabel}
			type={htmlType ?? 'button'}
			variant={mapButtonVariant(type, danger)}
			size={mapButtonSize(size, !children)}
			icon={icon as any}
		>
			{!notHideText && !!children && !!icon ? <span className='span-extend'>{children}</span> : children}
		</Button>
	);

	const tooltipContent = tooltip ?? children;
	if (!tooltipContent) return buttonNode;

	const { side, align } = mapTooltipPlacement(otherTooltipProps?.placement);

	return (
		<Tooltip>
			<TooltipTrigger asChild>{buttonNode}</TooltipTrigger>
			<TooltipContent side={side} align={align}>
				{tooltipContent}
			</TooltipContent>
		</Tooltip>
	);
};

export default ButtonExtend;
