import { Card, CardProps } from 'antd';
import React from 'react';

export interface PageCardProps extends CardProps {
	bordered?: boolean;
}

const PageCard: React.FC<PageCardProps> = ({ className, children, ...rest }) => {
	return (
		<Card {...rest} className={`card-big-title card-borderless ${className}`} variant='borderless'>
			<Card variant={rest.bordered ? 'outlined' : 'borderless'}>{children}</Card>
		</Card>
	);
};

export default PageCard;
