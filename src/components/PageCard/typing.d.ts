import React from 'react';
import { CardProps } from 'antd';

export interface PageCardProps extends CardProps {
	bordered?: boolean;
	hideInnerCard?: boolean;
	level?: 1 | 2 | 3 | 4;
	showIndicator?: boolean;
}