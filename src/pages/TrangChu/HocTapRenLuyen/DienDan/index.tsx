import { ArrowRightOutlined, CheckCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Card, Empty, Tag, Typography } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { history, Link, useModel } from 'umi';
import './style.less';
const { Text } = Typography;

const CardDienDanDashboard = () => {
	const { danhSach, loading, getAllModel } = useModel('diendan.baidang');
	const [screenSize, setScreenSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});

	const lastNameChar = (ten: string) => ten.split(' ')?.at(-1)?.[0]?.toUpperCase();

	// Handle window resize
	useEffect(() => {
		const handleResize = () => {
			setScreenSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};

		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		getAllModel(undefined, undefined, undefined, undefined, 'many/lop-hoc-phan/me');
	}, []);

	const isMobile = screenSize.width <= 768;

	// Lấy 6 bài đăng mới nhất
	const displayData = danhSach;
	// .slice(0, 6);

	const renderDiscussionItem = (item: any, index: number) => {
		return (
			<div
				key={item._id}
				className='card-diendan-wrapper'
				onClick={() => history.push(`/hoc-tap/lop-tin-chi/${item.lopHocPhanId}?idBaiViet=${item._id}#dien-dan`)}
			>
				{/* Tên lớp học phần */}
				<div className='card-diendan-lop'>
					<Text className='card-diendan-lop-text'>#{item.lopHocPhan?.ten}</Text>
					<ArrowRightOutlined style={{ fontSize: '10px', color: '#1890ff' }} />
				</div>

				{/* Nội dung */}
				<div className='card-diendan-content'>
					<Avatar
						size={isMobile ? 36 : 40}
						src={item.thongTinNguoiDang.avatar ? <img src={item.thongTinNguoiDang.avatar} /> : undefined}
						icon={
							!item.thongTinNguoiDang.avatar
								? (lastNameChar(item.thongTinNguoiDang.hoTen) ?? <UserOutlined />)
								: undefined
						}
						alt='avatar'
						className='avatar'
					/>

					<div className='card-diendan-content-right'>
						{/* Tên người đăng */}
						<div className='card-diendan-user-info'>
							<Text className='card-diendan-user-info-name'>{item?.thongTinNguoiDang?.hoTen}</Text>
						</div>

						{/* Thời gian */}
						<Text className='card-diendan-time'>
							{item?.thongTinNguoiDang?.isGiaoVien && (
								<CheckCircleOutlined
									style={{ color: '#52c41a', fontSize: '12px', marginRight: 4 }}
									title='Giảng viên'
								/>
							)}
							{moment(item?.ngayDang ?? item.createdAt).format('HH:mm DD/MM/YYYY')}
						</Text>
					</div>
				</div>

				{/* Tiêu đề bài viết */}
				<Text className='card-diendan-title'>{item.tieuDe}</Text>
			</div>
		);
	};

	return (
		<Card
			variant='borderless'
			className='card-borderless card-big-title'
			title={
				<>
					Diễn đàn thảo luận{' '}
					<Tag color={displayData.length > 0 ? 'green' : ''} style={{ marginLeft: 8 }}>
						{displayData.length}
					</Tag>
				</>
			}
			extra={
				<Link to='/hoc-tap/lop-tin-chi' className='xem-tat-ca-link'>
					Xem thêm
				</Link>
			}
			loading={loading}
		>
			<Card variant='borderless' style={{ borderRadius: 8, maxHeight: '348px', overflowX: 'scroll' }}>
				{displayData.length ? (
					displayData.map((item, index) => renderDiscussionItem(item, index))
				) : (
					<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ margin: '16px 0' }} description='Không có dữ liệu' />
				)}
			</Card>
		</Card>
	);
};

export default CardDienDanDashboard;
