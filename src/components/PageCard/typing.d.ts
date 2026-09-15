import React from 'react';

export interface PageCardProps {
	title?: React.ReactNode | boolean;
	extra?: React.ReactNode;
	cardExtra?: React.ReactNode;
	children?: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
	bordered?: boolean;
	hideInnerCard?: boolean;
	level?: 1 | 2 | 3 | 4;
	showIndicator?: boolean;
	loading?: boolean;
	[key: string]: any;
}
