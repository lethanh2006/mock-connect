import { Card } from 'antd';
import React from 'react';
import { PageCardProps } from './typing';

const PageCard: React.FC<PageCardProps> = ({
	className,
	children,
	hideInnerCard,
	level = 1,
	showIndicator = true,
	...rest
}) => {
	// Hierarchy modifiers: card-big-title (level 1 only), highlight (level 2), normal (level 3), or standard (level 4)
	const isLevel4 = level === 4;
	const baseClasses = `${level === 1 || level === 3 ? 'card-big-title' : ''} ${isLevel4 ? '' : 'card-borderless'}`;
	const levelClass = level === 2 ? 'highlight' : level === 3 ? 'normal' : isLevel4 ? 'standard' : '';

	// Indicator visibility logic for Level 1 and 3
	const canToggleIndicator = level === 1 || level === 3;
	const indicatorClass = canToggleIndicator && showIndicator === true ? 'has-indicator' : '';

	return (
		<Card
			{...rest}
			className={`${baseClasses} ${levelClass} ${indicatorClass} ${className}`}
			variant={isLevel4 ? rest.variant : 'borderless'}
		>
			{hideInnerCard ? children : <Card variant={rest.bordered ? 'outlined' : 'borderless'}>{children}</Card>}
		</Card>
	);
};

export default PageCard;
