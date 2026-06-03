import ManNon from '@/assets/trangchu/mam_non.svg';
import Number1 from '@/assets/trangchu/number_1.svg';
import Star1 from '@/assets/trangchu/star_1.svg';
import TheThao from '@/assets/trangchu/the_thao.svg';
import { FallOutlined, QuestionCircleOutlined, RiseOutlined } from '@ant-design/icons';
import React from 'react';

interface StatCardProps {
	title: string;
	value: string | number;
	subValue?: string;
	percent: string;
	isUp: boolean;
	periodText: string;
	icon: React.ReactNode;
	disabled?: boolean;
}

const StatCard = ({ title, value, subValue, percent, isUp, periodText, icon, disabled }: StatCardProps) => (
	<div className={`card-container ${disabled ? 'is-disabled' : ''}`}>
		<div className='card-header'>
			<span className='title'>{title}</span>
			<div className='icon-wrapper'>{icon}</div>
		</div>
		<div className='value-wrapper'>
			<span className='main-value'>{disabled ? '--' : value}</span>
			{subValue && <span className='sub-value'>{subValue}</span>}
		</div>
		<div className='footer'>
			{disabled ? (
				<div className='disabled-placeholder'>
					<QuestionCircleOutlined className='q-icon' />
					<span className='dash-text'>---</span>
				</div>
			) : (
				<div className={`badge ${isUp ? 'up' : 'down'}`}>
					{isUp ? <RiseOutlined /> : <FallOutlined />} {percent}
				</div>
			)}

			<span className='period'>{periodText}</span>
		</div>
	</div>
);

const CardTienTrinh = () => {
	return (
		<div className='stats-wrapper'>
			<StatCard
				title='GPA'
				value='3.5'
				percent='3%'
				isUp={true}
				periodText='vs. last period'
				icon={<img src={ManNon} style={{ width: 25, height: 25 }} />}
				disabled={true}
			/>
			<StatCard
				title='Activities'
				value='4'
				percent='2,5%'
				isUp={false}
				periodText='vs. last week'
				icon={<img src={TheThao} style={{ width: 25, height: 25 }} />}
				disabled={true}
			/>
			<StatCard
				title='Awards'
				value='5'
				percent='2,7%'
				isUp={false}
				periodText='vs. last period'
				icon={<img src={Number1} style={{ width: 25, height: 25 }} />}
				disabled={true}
			/>
			<StatCard
				title='Credits'
				value='28'
				subValue='/150'
				percent='3,1%'
				isUp={true}
				periodText='vs. last period'
				icon={<img src={Star1} style={{ width: 25, height: 25 }} />}
				disabled={true}
			/>

			<div className='add-card-button'>
				<span className='plus-icon'>+</span>
			</div>
		</div>
	);
};

export default CardTienTrinh;
