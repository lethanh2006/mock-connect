import XemTatCaLink from '@/pages/TrangChu/components/ViewMore';
import { ArrowRightOutlined, CheckCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Empty, Tag, Typography } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { history, useModel } from 'umi';

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
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: isMobile ? '10px' : '12px',
					padding: '16px 0',
					paddingTop: '0',
					marginBottom: '12px',
					backgroundColor: '#fff',
					cursor: 'pointer',
					transition: 'transform 0.2s ease, border-color 0.2s ease',
					borderBottom: '1px solid #EBEBEB',
				}}
				onClick={() => history.push(`/hoc-tap/lop-tin-chi/${item.lopHocPhanId}?idBaiViet=${item._id}#dien-dan`)}
				onMouseEnter={(e) => {
					e.currentTarget.style.borderColor = '#d9d9d9';
					e.currentTarget.style.transform = 'translateX(2px)';
				}}
				onMouseLeave={(e) => {
					e.currentTarget.style.borderColor = '#f0f0f0';
					e.currentTarget.style.transform = 'translateX(0)';
				}}
			>
				{/* #Tên lớp học phần */}
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: '6px',
						marginBottom: '4px',
					}}
				>
					<Text
						style={{
							color: '#1890ff',
							fontSize: isMobile ? '12px' : '13px',
							fontWeight: 500,
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap',
							maxWidth: '100%',
						}}
					>
						#{item.lopHocPhan?.ten}
					</Text>
					<ArrowRightOutlined style={{ fontSize: '10px', color: '#1890ff' }} />
				</div>

				{/* Hàng avatar và nội dung bên phải */}
				<div style={{ display: 'flex', flexDirection: 'row', gap: 12 }}>
					{/* Avatar bên trái */}
					<Avatar
						size={isMobile ? 36 : 40}
						src={item.thongTinNguoiDang.avatar ? <img src={item.thongTinNguoiDang.avatar} /> : undefined}
						icon={
							!item.thongTinNguoiDang.avatar
								? (lastNameChar(item.thongTinNguoiDang.hoTen) ?? <UserOutlined />)
								: undefined
						}
						alt='avatar'
						style={{ flexShrink: 0 }}
					/>

					{/* Nội dung bên phải (cột) */}
					<div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
						{/* Dòng: tên người đăng + giảng viên + tag Mới */}
						<div
							style={{
								display: 'flex',
								flexDirection: 'row',
								alignItems: 'center',
								gap: 6,
								flexWrap: 'wrap',
								marginBottom: 2,
							}}
						>
							<Text
								style={{
									fontSize: isMobile ? '13px' : '14px',
									fontWeight: 500,
									color: '#262626',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									whiteSpace: 'nowrap',
									display: 'flex',
									alignItems: 'center',
									gap: 4,
								}}
							>
								{item?.thongTinNguoiDang?.hoTen}
							</Text>
						</div>

						{/* Dòng: thời gian */}
						<Text
							style={{
								fontSize: isMobile ? '11px' : '12px',
								color: '#8c8c8c',
								marginBottom: 4,
							}}
						>
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
				{/* Dòng: tiêu đề bài viết */}
				<Text
					style={{
						fontSize: isMobile ? '13px' : '14px',
						color: '#121212',
						lineHeight: '1.4',
						display: '-webkit-box',
						WebkitLineClamp: 2,
						WebkitBoxOrient: 'vertical',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						fontWeight: 400,
					}}
				>
					{item.tieuDe}
				</Text>
			</div>
		);
	};

	if (!displayData.length) {
		return (
			<div
				style={{
					borderRadius: '8px',
					overflow: 'hidden',
					border: 'none',
					backgroundColor: 'transparent',
					// padding: '0 16px',
				}}
			>
				{/* Header */}
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						backgroundColor: 'transparent',
						flexWrap: isMobile ? 'wrap' : 'nowrap',
						gap: isMobile ? '12px' : '0',
					}}
				>
					<Text
						style={{
							fontSize: isMobile ? '16px' : '18px',
							fontWeight: 600,
							color: '#000',
							padding: '16px 0',
							backgroundColor: 'transparent',
							flexShrink: 0,
						}}
					>
						Diễn đàn thảo luận <Tag>{displayData.length} alo</Tag>
					</Text>
					<XemTatCaLink to='/hoc-tap/lop-tin-chi' label='Xem thêm' />
				</div>

				{/* Content - Empty State */}
				<div
					style={{
						overflow: 'hidden',
						backgroundColor: '#fff',
						borderRadius: 8,
						minHeight: isMobile ? 'auto' : '350px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						boxShadow: '0px 0px 6px 0px #0000000A',
					}}
				>
					<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không có diễn đàn' />
				</div>
			</div>
		);
	}

	return (
		<div
			style={{
				borderRadius: '8px',
				overflow: 'hidden',
				border: 'none',
				backgroundColor: 'transparent',
				padding: '0',
			}}
		>
			{/* Header */}
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					backgroundColor: 'transparent',
					flexWrap: isMobile ? 'wrap' : 'nowrap',
					gap: isMobile ? '12px' : '0',
				}}
			>
				<Text
					style={{
						fontSize: isMobile ? '16px' : '18px',
						fontWeight: 600,
						color: '#000',
						padding: '16px 0',
						backgroundColor: 'transparent',
						flexShrink: 0,
					}}
				>
					Diễn đàn thảo luận{' '}
					<Tag color={displayData.length > 0 ? 'green' : ''} style={{ marginLeft: 8 }}>
						{displayData.length}
					</Tag>
				</Text>
				<XemTatCaLink to='/hoc-tap/lop-tin-chi' label='Xem thêm' />
			</div>

			{/* Content */}
			<div
				style={{
					overflow: 'hidden',
					backgroundColor: '#fff',
					borderRadius: 8,
					padding: isMobile ? '16px' : '20px',
					// maxHeight: isMobile ? '400px' : '450px',
					overflowY: 'auto',
					minHeight: isMobile ? '300px' : '350px',
					height: '350px',
					boxShadow: '0px 0px 6px 0px #0000000A',
				}}
			>
				{displayData.map((item, index) => renderDiscussionItem(item, index))}
			</div>
		</div>
	);
};

export default CardDienDanDashboard;
