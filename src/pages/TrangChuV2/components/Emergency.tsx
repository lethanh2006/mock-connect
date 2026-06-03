import bao_mat from '@/assets/trangchu/bao_mat.svg';
import canh_sat from '@/assets/trangchu/canh_sat.svg';
import chu_thap from '@/assets/trangchu/chu_thap.svg';
import Clinic from '@/assets/trangchu/Clinic.svg';
import ky_thuat from '@/assets/trangchu/ky_thuat.svg';
import nha_o from '@/assets/trangchu/nha_o.svg';
import suc_khoe from '@/assets/trangchu/suc_khoe.svg';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Card, Carousel, Flex } from 'antd';
import { useRef } from 'react';

const Emergency = () => {
	const carouselRef = useRef<any>(null);

	const hotlines = [
		{ id: 1, title: 'Clinic', phone: '(+84) 866 200 019', icon: Clinic },
		{ id: 2, title: 'Well-being', phone: '(+84) 868 900 016', icon: suc_khoe },
		{ id: 3, title: 'Residential Office', phone: '(+84) 866 100 018', icon: nha_o },
		{ id: 4, title: 'Technical Unit', phone: '(+84) 24 710 897 79', icon: ky_thuat },
		{ id: 5, title: 'Security Unit', phone: '(+84) 24 710 897 79', icon: bao_mat },
		{ id: 6, title: 'Gia Lam Hospital', phone: '(+84) 24 710 897 79', icon: chu_thap },
		{ id: 7, title: 'Vinmec Times City', phone: '(+84) 24 710 897 79', icon: chu_thap },
		{ id: 8, title: 'Police', phone: '(+84) 24 710 897 79', icon: canh_sat },
	];

	return (
		<Card
			title={
				<Flex justify='space-between' align='center'>
					<span className='title'>Emergency 24/7 Hotline</span>
					{hotlines.length > 4 && (
						<div className='pagination-controls'>
							<button className='nav-btn' onClick={() => carouselRef.current?.prev()}>
								<LeftOutlined />
							</button>
							<button className='nav-btn' onClick={() => carouselRef.current?.next()}>
								<RightOutlined />
							</button>
						</div>
					)}
				</Flex>
			}
			styles={{ body: { padding: 0 } }}
		>
			<div className='hotline-carousel-wrapper'>
				<Carousel
					ref={carouselRef}
					dots={false}
					autoplay={false}
					infinite={false}
					slidesToShow={4}
					slidesToScroll={1}
					responsive={[
						{
							breakpoint: 1200,
							settings: { slidesToShow: 3 },
						},
						{
							breakpoint: 992,
							settings: { slidesToShow: 2 },
						},
						{
							breakpoint: 576,
							settings: { slidesToShow: 1 },
						},
					]}
				>
					{hotlines.map((item) => (
						<div key={item.id} className='hotline-slide-item'>
							<div className='hotline-item'>
								<img
									src={item.icon}
									alt={item.title}
									style={{
										width: 28,
										height: 28,
									}}
								/>
								<div className='info'>
									<span className='info-title'>{item.title}</span>
									<a href={`tel:${item.phone.replace(/\D/g, '')}`} className='info-phone'>
										{item.phone}
									</a>
								</div>
							</div>
						</div>
					))}
				</Carousel>
			</div>
		</Card>
	);
};

export default Emergency;
