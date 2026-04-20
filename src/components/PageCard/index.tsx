import { Card, CardProps } from 'antd';
import React from 'react';

export interface PageCardProps extends CardProps {
	bordered?: boolean;
	hideInnerCard?: boolean;
	level?: 1 | 2 | 3 | 4;
	showIndicator?: boolean;
}

const PageCard: React.FC<PageCardProps> = ({
	className,
	children,
	hideInnerCard,
	level = 1,
	showIndicator = true,
	...rest
}) => {
	if (level === 4) {
		return (
			<Card {...rest} className={className}>
				{children}
			</Card>
		);
	}

	// Hierarchy modifiers: card-big-title (levels 1 & 3), highlight (level 2), normal (level 3)
	const isBigTitle = level === 1 || level === 3;
	const baseClasses = `${isBigTitle ? 'card-big-title' : ''} card-borderless`.trim();
	const levelClass = level === 2 ? 'highlight' : level === 3 ? 'normal' : '';

	// Indicator visibility logic for Level 1 and 2
	const canToggleIndicator = level === 1 || level === 2;
	const indicatorClass = (canToggleIndicator && showIndicator === false) ? 'hide-indicator' : '';

	return (
		<Card
			{...rest}
			className={`${baseClasses} ${levelClass} ${indicatorClass} ${className}`.trim()}
			variant='borderless'
		>
			{hideInnerCard ? children : <Card variant={rest.bordered ? 'outlined' : 'borderless'}>{children}</Card>}
		</Card>
	);
};

export default PageCard;
