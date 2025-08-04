import { Card, Col, Row, Typography } from 'antd';
import React, { isValidElement, ReactElement } from 'react';
import './style.less';
import { StatisticsCardProps, StatisticsItem } from './typing';

const { Text } = Typography;

const StatisticsCard: React.FC<StatisticsCardProps> = ({
	title,
	data,
	loading = false,
	containerStyle = {},
	cardStyle,
	colSpan = { xs: 24, sm: 12, md: 8 },
}) => {
	const renderStatisticItem = ({
		title,
		value,
		icon,
		status,
		onClick,
		borderAccent = true,
		backgroundColor,
		valueColor,
		borderColor,
	}: StatisticsItem) => {
		const statusClass = status || 'gray';
		const clickableClass = onClick ? 'pointer' : '';
		const borderAccentClass = borderAccent ? 'border-accent' : '';

		const finalValueColor = valueColor || '#595959';

		const customStyle: React.CSSProperties = {
			backgroundColor,
			color: finalValueColor,
			borderLeft: borderAccent ? `4px solid ${borderColor || finalValueColor}` : undefined,
			...cardStyle,
		};

		const iconWithColor =
			icon && isValidElement(icon)
				? React.cloneElement(icon as ReactElement<any>, {
						style: {
							color: finalValueColor,
							...((icon as ReactElement<any>).props.style || {}),
						},
					})
				: icon;

		return (
			<div
				className={`statistics-item ${statusClass} ${clickableClass} ${borderAccentClass}`}
				style={customStyle}
				onClick={onClick}
			>
				<Col>
					<div>{iconWithColor}</div>
					<Text className='text'>{title}</Text>
				</Col>

				<Col className='num' style={{ color: finalValueColor }}>
					{value}
				</Col>
			</div>
		);
	};

	return (
		<div className='statistics-wrapper' style={containerStyle}>
			<Card
				style={{
					padding: 0,
					margin: 0,
					border: 'none',
					borderRadius: '8px',
				}}
				bodyStyle={{
					padding: 0,
					margin: 0,
				}}
				loading={loading}
			>
				<Text style={{ fontSize: 16, fontWeight: 500, marginBottom: 16, display: 'block' }}>{title}</Text>
				<Row gutter={[16, 16]} wrap>
					{data.map((item, index) => (
						<Col {...colSpan} key={index}>
							{renderStatisticItem(item)}
						</Col>
					))}
				</Row>
			</Card>
		</div>
	);
};

export default StatisticsCard;
