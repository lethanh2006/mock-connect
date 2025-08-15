import { Card, Col, Row } from 'antd';
import React, { isValidElement, ReactElement } from 'react';
import './style.less';
import { StatisticsCardProps, StatisticsItem } from './typing';

const StatisticsCard: React.FC<StatisticsCardProps> = ({
	title,
	data,
	loading = false,
	containerStyle = {},
	cardStyle,
	colSpan = { xs: 24, sm: 12, md: 8 },
	hideCard,
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
		statShadow = false,
	}: StatisticsItem) => {
		const statusClass = status || 'gray';
		const clickableClass = onClick ? 'pointer' : '';
		const borderAccentClass = borderAccent ? 'border-accent' : '';

		// Nếu có status thì sử dụng CSS class, không dùng màu tùy chỉnh
		let customStyle: React.CSSProperties = { ...cardStyle };
		let iconElement = icon;

		if (status) {
			// Khi có status, chỉ áp dụng cardStyle
			customStyle = { ...cardStyle };
			iconElement = icon; // Giữ nguyên icon, không thay đổi màu
		} else {
			// Khi không có status, áp dụng màu tùy chỉnh như cũ
			const finalValueColor = valueColor || '#595959';
			customStyle = {
				backgroundColor,
				color: finalValueColor,
				borderLeft: !status && borderAccent ? `4px solid ${borderColor || finalValueColor}` : undefined,
				...cardStyle,
			};

			iconElement =
				icon && isValidElement(icon)
					? React.cloneElement(icon as ReactElement<any>, {
							style: {
								color: finalValueColor,
								...((icon as ReactElement<any>).props.style || {}),
							},
						})
					: icon;
		}

		return (
			<div
				className={`statistics-item ${statusClass} ${clickableClass} ${borderAccentClass} ${statShadow && 'statistics-shadow'}`}
				style={{ ...customStyle }}
				onClick={onClick}
			>
				<div className='text'>
					<span className='anticon'>{iconElement}</span>
					<span>{title}</span>
				</div>

				<div className='num' style={status ? {} : { color: customStyle.color }}>
					{value}
				</div>
			</div>
		);
	};

	return hideCard ? (
		<div style={{ ...containerStyle }}>
			<Row gutter={[16, 16]} wrap>
				{data.map((item, index) => (
					<Col {...colSpan} key={index}>
						{renderStatisticItem(item)}
					</Col>
				))}
			</Row>
		</div>
	) : (
		<Card
			className='card-big-title card-borderless '
			loading={loading}
			variant='borderless'
			style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', ...containerStyle }}
		>
			<span style={{ fontSize: 16, fontWeight: 500, marginBottom: 16, display: 'block' }}>{title}</span>
			<Row gutter={[16, 16]} wrap>
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
