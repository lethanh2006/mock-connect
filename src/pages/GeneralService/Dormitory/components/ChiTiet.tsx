import {
	CarOutlined,
	CarryOutOutlined,
	CoffeeOutlined,
	ContainerOutlined,
	DesktopOutlined,
	ExpandOutlined,
	PartitionOutlined,
	RestOutlined,
	ThunderboltOutlined,
	WifiOutlined,
} from '@ant-design/icons';
import { Button, Col, Divider, Row, Typography } from 'antd';
import { useState } from 'react';
import '../styles.less';

const { Title, Text } = Typography;

const ChiTietDormitory = () => {
	const [activeThumb, setActiveThumb] = useState(0);

	const roomData = {
		id: '8-bed',
		name: '8-BED APARTMENT',
		tag: 'On campus',
		price: '3,200,000',
		unit: 'VND',
		slots: 5,
		bathrooms: 2,
		area: '48m2',
		layout: '3/3/2 rooms',
		images: [
			'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop',
			'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=400&auto=format&fit=crop',
			'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=400&auto=format&fit=crop',
			'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=400&auto=format&fit=crop',
			'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=400&auto=format&fit=crop',
		],
		amenities: [
			{ label: 'Free gym', icon: <ThunderboltOutlined /> },
			{ label: 'Microwave', icon: <DesktopOutlined /> },
			{ label: 'Chair', icon: <ContainerOutlined /> },
			{ label: 'Wifi', icon: <WifiOutlined /> },
			{ label: 'Air conditioner', icon: <CoffeeOutlined /> },
			{ label: 'Personal cabinet', icon: <ContainerOutlined /> },
			{ label: 'Bed', icon: <CarryOutOutlined /> },
			{ label: 'Topper + Mattress', icon: <ContainerOutlined /> },
			{ label: 'Study desk', icon: <DesktopOutlined /> },
			{ label: 'Free packing', icon: <CarOutlined /> },
			{ label: 'Fridge', icon: <CoffeeOutlined /> },
			{ label: 'Bookshelf', icon: <ContainerOutlined /> },
			{ label: 'Common kitchen', icon: <CoffeeOutlined /> },
			{ label: 'Laundry service', icon: <CarryOutOutlined /> },
			{ label: 'Study area', icon: <DesktopOutlined /> },
		],
	};

	return (
		<div className='dormitory-modal-container'>
			<div className='header-section'>
				<div className='header-left'>
					<Title level={2} className='room-title'>
						{roomData.name} <span className='campus-tag'>{roomData.tag}</span>
					</Title>

					<div className='sub-info'>
						<span>
							<RestOutlined /> {roomData.bathrooms} bathrooms
						</span>
						<span>
							<ExpandOutlined /> {roomData.area}
						</span>
						<span>
							<PartitionOutlined /> {roomData.layout}
						</span>
					</div>
				</div>
				<div className='header-right'>
					<Text className='price-label'>/ per month/ per student</Text>
					<Title level={3} className='price-value'>
						{roomData.price} {roomData.unit}
					</Title>
				</div>
			</div>

			<Divider className='thin-divider' />

			<Row gutter={[12, 12]}>
				<Col xs={24} lg={12}>
					<div className='gallery-main'>
						<img src={roomData.images[activeThumb]} alt='main-room' />
						<div className='dots-indicator'>
							{roomData.images.map((_, i) => (
								<span key={i} className={`dot ${activeThumb === i ? 'active' : ''}`} />
							))}
						</div>
					</div>
				</Col>

				<Col xs={4} lg={3} className='thumbnails-col'>
					<div className='thumbnails-grid'>
						{roomData.images.map((img, index) => (
							<div
								key={index}
								className={`thumb-item ${activeThumb === index ? 'active' : ''}`}
								onClick={() => setActiveThumb(index)}
							>
								<img src={img} alt={`thumb-${index}`} />
							</div>
						))}
					</div>
				</Col>

				<Col xs={20} lg={9}>
					<div className='details-card'>
						<Row className='availability-info'>
							<Col span={12} className='info-block br-1'>
								<Text className='label'>AVAILABLE</Text>
								<Title level={5} className='value red-text'>
									{roomData.slots} slots left
								</Title>
							</Col>
							<Col span={12} className='info-block'>
								<Text className='label'>DIVIDED INTO</Text>
								<Title level={5} className='value'>
									{roomData.layout}
								</Title>
							</Col>
						</Row>
						<div className='amenities-list'>
							<Row gutter={[0, 12]}>
								{roomData.amenities.map((item, idx) => (
									<Col span={12} key={idx} className='amenity-item'>
										<span className='amenity-icon'>{item.icon}</span>
										<Text className='amenity-label'>{item.label}</Text>
									</Col>
								))}
							</Row>
						</div>
					</div>
				</Col>
			</Row>

			<div className='form-footer'>
				<Button type='primary'>Register</Button>
				<Button>Close</Button>
			</div>
		</div>
	);
};

export default ChiTietDormitory;
