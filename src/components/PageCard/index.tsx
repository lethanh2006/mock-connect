import { Card, CardProps } from 'antd';
import React from 'react';

export interface PageCardProps extends CardProps {
	bordered?: boolean;
	hideInnerCard?: boolean;
}

const PageCard: React.FC<PageCardProps> = ({ className, children, hideInnerCard, ...rest }) => {
	return (
		<Card {...rest} className={`card-big-title card-borderless ${className}`} variant='borderless'>
			{hideInnerCard ? children : <Card variant={rest.bordered ? 'outlined' : 'borderless'}>{children}</Card>}
		</Card>
	);
};

export default PageCard;
