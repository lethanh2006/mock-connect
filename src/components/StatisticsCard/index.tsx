import { Card, Col, Row } from 'antd';
import classNames from 'classnames';
import React, { isValidElement, ReactElement } from 'react';
import './style.less';
import { StatisticsCardProps, StatisticsItem } from './typing';

const StatisticsCard: React.FC<StatisticsCardProps> = ({
	title,
	data,
	loading = false,
	containerStyle = {},
	cardStyle,
	colSpan = { span: 24, sm: 12, md: 8 },
	hideCard,
	rowGutter = 8,
	borderleft = false,
	statShadow = true,
}) => {
	const renderStatisticItem = ({
		title,
		value,
		icon,
		status,
		onClick,
		backgroundColor,
		valueColor,
	}: StatisticsItem) => {
		const statusClass = status || '';

		const iconElement =
			icon && isValidElement(icon)
				? React.cloneElement(icon as ReactElement<any>, {
						style: {
							color: valueColor,
							...((icon as ReactElement<any>).props.style || {}),
						},
					})
				: icon;

		return (
			<div
				className={`${classNames({
					'statistics-item': true,
					pointer: !!onClick,
					border: borderleft,
					shadow: statShadow,
				})} ${statusClass}`}
				style={{ ...cardStyle, backgroundColor: backgroundColor, borderColor: valueColor }}
				onClick={onClick}
			>
				<div className='text'>
					<span className='anticon'>{iconElement}</span>
					<span>{title}</span>
				</div>

				<div className='num' style={status ? {} : { color: valueColor }}>
					{value}
				</div>
			</div>
		);
	};

	return hideCard ? (
		<div style={{ ...containerStyle }}>
			<Row gutter={[rowGutter, rowGutter]}>
				{data.map((item, index) => (
					<Col {...colSpan} key={index}>
						{renderStatisticItem(item)}
					</Col>
				))}
			</Row>
		</div>
	) : (
		<Card
			style={{ borderRadius: 8, ...containerStyle }}
			// className='card-big-title card-borderless'
			loading={loading}
			variant='borderless'
		>
			<div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>{title}</div>

			<Row gutter={[rowGutter, rowGutter]} wrap>
				{data.map((item, index) => (
					<Col {...colSpan} key={index}>
						{renderStatisticItem(item)}
					</Col>
				))}
			</Row>
		</Card>
	);
};

export default StatisticsCard;
