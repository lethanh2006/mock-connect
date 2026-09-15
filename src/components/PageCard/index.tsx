import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@vinuni/ui';
import { Spin } from 'antd';
import React from 'react';
import { PageCardProps } from './typing';

const PageCard: React.FC<PageCardProps> = ({
	className,
	children,
	title,
	extra,
	cardExtra,
	loading = false,
	style,
	level = 1,
	showIndicator = false,
	bordered = false,
	hideInnerCard = false,
	...rest
}) => {
	const extraContent = extra ?? cardExtra;
	const hasHeader = Boolean(title && title !== true ? title : extraContent);

	// Hierarchy modifiers:
	// Level 1: Page Title lớn (card-big-title, 24px)
	// Level 2: Section Title quan trọng (highlight, 18px, hỗ trợ indicator)
	// Level 3: Sub-section Title thường (normal, 16px, không indicator)
	// Level 4: Standard Card (standard, title nằm TRONG Card)
	const isLevel4 = level === 4;
	const baseClasses = `${level === 1 ? 'card-big-title' : ''} ${isLevel4 ? '' : 'card-borderless'}`;
	const levelClass = level === 2 ? 'highlight' : level === 3 ? 'normal' : isLevel4 ? 'standard' : '';

	// Indicator visibility logic for Level 1 and 2
	const canToggleIndicator = level === 1 || level === 2;
	const indicatorClass = canToggleIndicator && showIndicator === true ? 'has-indicator' : '';

	// Khi level === 4 (Standard): Title nằm TRONG Card theo chuẩn Card thông thường
	if (isLevel4) {
		const cardClasses = [
			'page-card',
			'page-card-standard',
			levelClass,
			indicatorClass,
			className,
		]
			.filter(Boolean)
			.join(' ');

		return (
			<Card className={cardClasses} style={style} {...rest}>
				<Spin spinning={loading} style={{ width: '100%' }}>
					{hasHeader && (
						<CardHeader>
							{title && <CardTitle>{title}</CardTitle>}
							{extraContent && <CardAction>{extraContent}</CardAction>}
						</CardHeader>
					)}
					<CardContent className={hideInnerCard ? 'p-0' : undefined}>
						{children}
					</CardContent>
				</Spin>
			</Card>
		);
	}

	// Khi level === 1, 2, 3: Title nằm NGOÀI Card (Page/Section Title)
	const containerClasses = [
		'page-card',
		'page-card-outer',
		baseClasses,
		levelClass,
		indicatorClass,
		className,
	]
		.filter(Boolean)
		.join(' ');

	return (
		<div className={containerClasses} style={style} {...rest}>
			<Spin spinning={loading} style={{ width: '100%' }}>
				{hasHeader && (
					<div className='page-card-header' data-slot='page-card-header'>
						{title && (
							<div className='page-card-title' data-slot='card-title'>
								{title}
							</div>
						)}
						{extraContent && (
							<div className='page-card-action' data-slot='card-action'>
								{extraContent}
							</div>
						)}
					</div>
				)}
				{hideInnerCard ? (
					children
				) : (
					<Card
						className={[
							'page-card-inner',
							bordered ? 'border border-ds-line-primary' : 'border-0 shadow-none',
						]
							.filter(Boolean)
							.join(' ')}
					>
						<CardContent>{children}</CardContent>
					</Card>
				)}
			</Spin>
		</div>
	);
};

export default PageCard;
