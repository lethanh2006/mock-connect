import { Card, CardProps } from 'antd';
import React from 'react';

export interface PageCardProps extends CardProps {}

const PageCard: React.FC<PageCardProps> = ({ className, children, ...rest }) => {

	return (
		<Card {...rest} className={`card-big-title card-borderless ${className}`} variant='borderless'>
			<Card variant='borderless'>{children}</Card>
		</Card>
	);
};

export default PageCard;
