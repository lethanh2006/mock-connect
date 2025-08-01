import { DownOutlined } from '@ant-design/icons';
import { Button, Card, Carousel, Dropdown, Empty, Menu, Space } from 'antd';
import { CarouselRef } from 'antd/es/carousel';
import { useEffect, useRef, useState } from 'react';
import { Link, useModel } from 'umi';
import CardLopHocPhanItem from '../../HocTap/LopHocPhan/components/CardLopHocPhanItem';
import SlideButtonIcon from '../components/SlideButtonIcon';

const CardLopHocPhan = () => {
	const {
		danhSach: danhSachLHP,
		sinhVienGetAllModel,
		loading,
		setDanhSach: setDanhSachLHP,
	} = useModel('lophocphan.lophocphan');
	const { getAllModel: getAllHocKy, danhSach, record: recHocKy, setRecord } = useModel('daotao.hocky');
	const carouselRef = useRef<CarouselRef>(null);
	const [currentSlide, setCurrentSlide] = useState(0);

	// Assets
	const Isolation_Mode_1 = 'images/isolation-mode-1.svg';
	const Isolation_Mode_2 = 'images/isolation-mode-2.svg';
	const Isolation_Mode_3 = 'images/isolation-mode-3.svg';
	const Isolation_Mode_4 = 'images/isolation-mode-4.svg';
	const Isolation_Mode_5 = 'images/isolation-mode-5.svg';
	const Isolation_Mode_6 = 'images/isolation-mode-6.svg';

	const getData = () => recHocKy?.ma && sinhVienGetAllModel({ maHocKy: recHocKy?.ma });

	useEffect(() => {
		if (!danhSach.length) {
			getAllHocKy(!recHocKy?._id, { ma: -1 }, { active: true }, undefined, 'sinh-vien/me').then((res) => {
				if (!recHocKy?._id) {
					const hocKy = res.find((i) => i.kyHienTai) ?? res?.[0];
					setRecord(hocKy);
				}
			});
		}
	}, []);

	useEffect(() => {
		getData();
	}, [recHocKy?.ma]);

	const backgrounds = [
		Isolation_Mode_1,
		Isolation_Mode_2,
		Isolation_Mode_3,
		Isolation_Mode_4,
		Isolation_Mode_5,
		Isolation_Mode_6,
	];

	// Tạo mảng background cố định cho mỗi item để tránh bị giật hình
	const getBackgroundForItem = (itemId: string, index: number) => {
		// Sử dụng hash từ ID hoặc index để đảm bảo background cố định cho mỗi item
		const hash = itemId
			? itemId.split('').reduce((a, b) => {
					a = (a << 5) - a + b.charCodeAt(0);
					return a & a;
				}, 0)
			: index;

		const backgroundIndex = Math.abs(hash) % backgrounds.length;
		return backgrounds[backgroundIndex];
	};

	const filteredData = danhSachLHP.filter((item) => item?.maLopCha === null);
	const totalSlides = filteredData.length;

	const handlePrevSlide = () => {
		const newSlide = currentSlide === 0 ? totalSlides - 1 : currentSlide - 1;
		setCurrentSlide(newSlide);
		carouselRef.current?.goTo(newSlide);
	};

	const handleNextSlide = () => {
		const newSlide = currentSlide === totalSlides - 1 ? 0 : currentSlide + 1;
		setCurrentSlide(newSlide);
		carouselRef.current?.goTo(newSlide);
	};

	return (
		<Card
			variant='borderless'
			className='card-borderless card-big-title'
			title='Lớp tín chỉ'
			loading={loading}
			extra={
				<div style={{ display: 'flex', gap: 8, marginRight: 8, alignItems: 'center' }}>
					{/* Custom Carousel Navigation */}
					{danhSachLHP.length > 0 && (
						<div className='navigation-buttons'>
							<Button
								type='text'
								icon={<SlideButtonIcon direction='left' disabled={filteredData.length == 0} />}
								disabled={filteredData.length == 0}
								onClick={handlePrevSlide}
								className='nav-btn'
							/>

							<Button
								type='text'
								icon={<SlideButtonIcon direction='right' disabled={filteredData.length == 0} />}
								disabled={filteredData.length == 0}
								onClick={handleNextSlide}
								className='nav-btn'
							/>
						</div>
					)}

					<div
						style={{
							backgroundColor: '#f3f3f3',
							padding: '3px 10px',
							borderRadius: 4,
						}}
					>
						<Dropdown
							overlay={
								<Menu style={{ maxHeight: 250, overflowY: 'auto' }}>
									{danhSach.map((item) => (
										<Menu.Item onClick={() => setRecord(item)} key={item._id}>
											{item.ten}
										</Menu.Item>
									))}
								</Menu>
							}
							trigger={['click']}
						>
							<span onClick={(e) => e.preventDefault()}>
								<Space>
									<div style={{ cursor: 'pointer', fontWeight: 500 }}>
										HK{recHocKy?.soThuTu} {(recHocKy?.namHoc?.namBatDau?.toString() ?? '')?.slice(-2)}-
										{(recHocKy?.namHoc?.namKetThuc?.toString() ?? '')?.slice(-2)}
									</div>
									<DownOutlined />
								</Space>
							</span>
						</Dropdown>
					</div>

					<Link to='/hoc-tap/lop-tin-chi' className='xem-tat-ca-link'>
						Xem tất cả
					</Link>
				</div>
			}
		>
			{danhSachLHP.length ? (
				<Carousel
					ref={carouselRef}
					className='custom-carousel'
					dots={false}
					arrows={false}
					slidesToShow={4}
					slidesToScroll={3}
					infinite={true}
					swipe={true}
					autoplay
					autoplaySpeed={3000}
					beforeChange={(from, to) => setCurrentSlide(to)}
					responsive={[
						{
							breakpoint: 1024,
							settings: {
								slidesToShow: 3,
							},
						},
						{
							breakpoint: 768,
							settings: {
								slidesToShow: 2,
							},
						},
						{
							breakpoint: 480,
							settings: {
								slidesToShow: 1,
							},
						},
					]}
				>
					{filteredData.map((lop, index) => (
						<CardLopHocPhanItem key={lop._id} lop={lop} index={index} backgrounds={backgrounds} />
					))}
				</Carousel>
			) : (
				<Card variant='borderless' style={{ borderRadius: 8 }}>
					<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ margin: '16px 0' }} description='Không có dữ liệu' />
				</Card>
			)}
		</Card>
	);
};

export default CardLopHocPhan;
