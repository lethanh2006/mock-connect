import ButtonExtend from '@/components/Table/ButtonExtend';
import ModalExpandable from '@/components/Table/ModalExpandable';
import SelectAttributesManagement from '@/pages/CCT/DanhMuc/Attributes/Select';
import { CheckCircleFilled, ExpandOutlined, PartitionOutlined, ReloadOutlined, RestOutlined } from '@ant-design/icons';
import { Button, Card, Col, Flex, Row, Space, Tag } from 'antd';
import { useState } from 'react';
import ChiTietDormitory from './components/ChiTiet';
import FormDormitory from './components/Form';
import './styles.less';

export interface StudentInfo {
	fullName: string;
	studentId: string;
	nationality: string;
	gender: 'Male' | 'Female' | '';
	college: string;
	email: string;
	phone: string;
	dob: string;
	address: string;
}

export interface EmergencyContact {
	name: string;
	phone: string;
	email: string;
	relationship: string;
}

export interface ApartmentType {
	id: string;
	name: string;
	price: number;
	slots: number;
	bathrooms: number;
	area: string;
	layout: string;
	amenities: string[];
	image: string;
}

export const APARTMENT_TYPES: ApartmentType[] = [
	{
		id: '8-bed',
		name: '8-BED APARTMENT',
		price: 3200000,
		slots: 5,
		bathrooms: 2,
		area: '48m2',
		layout: '3/3/2',
		amenities: ['Free gym', 'Study desk', 'Study desk', 'Study desk'], // Thêm để đủ hiển thị 4 items đầu
		image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop',
	},
	{
		id: '4-bed',
		name: '4-BED APARTMENT',
		price: 3200000,
		slots: 5,
		bathrooms: 1,
		area: '50,5 m2',
		layout: '2/2',
		amenities: ['Free gym', 'Study desk', 'Study desk', 'Study desk'],
		image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800&auto=format&fit=crop',
	},
	{
		id: '2-bed',
		name: '2-BED APARTMENT',
		price: 4000000,
		slots: 5,
		bathrooms: 1,
		area: '21 m2',
		layout: 'Studio',
		amenities: ['Free gym', 'Study desk', 'Study desk', 'Study desk'],
		image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=800&auto=format&fit=crop',
	},
];

const DormitoryV2 = () => {
	const [visible, setVisible] = useState<boolean>(false);
	const [isView, setIsView] = useState<boolean>(true);

	return (
		<Card title='Dormitory' className='table-base-card' variant='borderless'>
			<Flex justify='space-between' align='center' gap='small' wrap>
				<Space wrap>
					<SelectAttributesManagement style={{ marginBottom: 12, width: 300 }} />
					<SelectAttributesManagement style={{ marginBottom: 12, width: 300 }} />
				</Space>

				<ButtonExtend tooltip='RELOAD' icon={<ReloadOutlined />} />
			</Flex>

			<Row gutter={[12, 12]}>
				{APARTMENT_TYPES.map((type) => {
					const isFull = type.slots === 0;

					return (
						<Col
							xs={24}
							lg={8}
							xl={8}
							key={type.id}
							onClick={() => {
								setIsView(true);
								setVisible(true);
							}}
						>
							<div className={`apartment-card ${isFull ? 'disabled' : ''}`}>
								{type.slots > 0 && <div className='status-badge-red'>{type.slots} slots left</div>}

								<div className='card-image-wrapper'>
									<img src={type.image} alt={type.name} />
								</div>

								<div className='card-body'>
									<div className='card-header-row'>
										<h3 className='apartment-title'>{type.name}</h3>
										<Tag color='blue' className='on-campus-tag'>
											On campus
										</Tag>
									</div>

									<div className='icon-features-row'>
										<span>
											<RestOutlined /> {type.bathrooms} bathrooms
										</span>
										<span>
											<ExpandOutlined /> {type.area}
										</span>
										<span>
											<PartitionOutlined /> {type.layout}
										</span>
									</div>

									<div className='amenities-grid'>
										{type.amenities.slice(0, 3).map((amenity, idx) => (
											<div key={idx} className='amenity-item'>
												<CheckCircleFilled className='check-icon' />
												<span>{amenity}</span>
											</div>
										))}
										<div className='amenity-item'>
											<CheckCircleFilled className='check-icon' />
											<div className='more-link'>+ 12 other amenities</div>
										</div>
									</div>

									<div className='card-footer'>
										<div className='price-block'>
											<div className='price-value'>{type.price.toLocaleString()} VND</div>
											<div className='price-sub'>/per month/per student</div>
										</div>
										<Button
											size='large'
											type='primary'
											// className='register-button'
											onClick={(e) => {
												e.stopPropagation();
												setIsView(false);
												setVisible(true);
											}}
											disabled={isFull}
										>
											REGISTER
										</Button>
									</div>
								</div>
							</div>
						</Col>
					);
				})}
			</Row>

			<ModalExpandable
				title={isView ? 'Dormitory Detail' : 'Register For Dormitory'}
				open={visible}
				onCancel={() => setVisible(false)}
				width={1100}
				footer={null}
			>
				{isView ? <ChiTietDormitory /> : <FormDormitory />}
			</ModalExpandable>
		</Card>
	);
};

export default DormitoryV2;
