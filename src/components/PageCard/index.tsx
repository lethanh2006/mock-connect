import { Card, CardProps } from 'antd';
import React from 'react';

export interface PageCardProps extends CardProps {
	bordered?: boolean;
	hideInnerCard?: boolean;
	level?: 1 | 2 | 3;
}

const PageCard: React.FC<PageCardProps> = ({ className, children, hideInnerCard, level = 1, ...rest }) => {
	// Base identity: card-big-title and card-borderless
	const baseClasses = 'card-big-title card-borderless';
	// Hierarchy modifiers: highlight (level 2) or normal (level 3)
	const levelClass = level === 2 ? 'highlight' : level === 3 ? 'normal' : '';

	return (
		<Card {...rest} className={`${baseClasses} ${levelClass} ${className}`} variant='borderless'>
			{hideInnerCard ? children : <Card variant={rest.bordered ? 'outlined' : 'borderless'}>{children}</Card>}
		</Card>
	);
};

export default PageCard;
