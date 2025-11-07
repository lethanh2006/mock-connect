import dayjs from '@/utils/dayjs';
import { ArrowRightOutlined, CheckCircleOutlined, FilterOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Dropdown, Empty, Space, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { history, Link, useModel } from 'umi';
import './style.less';

const { Text } = Typography;

type FilterType = 'ngay-dang' | 'chua-xem' | 'hoat-dong-moi-nhat';

const CardDienDanDashboard = (props: { typeLop: 'all' | 'lop-hoc-phan' | 'lop-hanh-chinh' }) => {
	const { record: recHocKy } = useModel('daotao.hocky');
	const { danhSach, loading, getAllModel, getDienDanSinhVienModel } = useModel('diendan.baidang');
	const { initialState } = useModel('@@initialState');
	const { record: recordSinhVien } = useModel('sinhvien.sinhvien');
	const [sortMode, setSortMode] = useState<'ngay-dang' | 'chua-xem' | 'hoat-dong-moi-nhat'>('ngay-dang');

	const [screenSize, setScreenSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});
	const [currentFilter, setCurrentFilter] = useState<FilterType>('ngay-dang');

	const currentUserSsoId = recordSinhVien?.ssoId || initialState?.currentUser?.ssoId;

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
		// TODO: Fix getData
		// getDienDanSinhVienModel(undefined, sortMode, recHocKy?.ma, { ghimBaiViet: -1 }, props.typeLop);
	}, [recHocKy?.ma, props.typeLop, sortMode]);

	useEffect(() => {
		// getAllModel(undefined, undefined, undefined, undefined, 'many/lop-hoc-phan/me');
	}, []);

	const isMobile = screenSize.width <= 768;

	// ======= Filter & Sort =======
	const getFilteredData = () => {
		let filteredData = [...danhSach];

		switch (currentFilter) {
			case 'ngay-dang':
				filteredData.sort(
					(a, b) => dayjs(b.ngayDang || b.createdAt).valueOf() - dayjs(a.ngayDang || a.createdAt).valueOf(),
				);
				break;

			case 'chua-xem':
				filteredData = filteredData.filter(
					(item) =>
						!item.danhSachDaXem?.some(
							(viewer) => viewer.ssoId === currentUserSsoId || viewer.ssoId === recordSinhVien?.ssoId,
						),
				);
				break;

			case 'hoat-dong-moi-nhat':
				filteredData.sort((a, b) => {
					const aLatest =
						a.danhSachBinhLuan?.length > 0
							? Math.max(
									dayjs(a.ngayDang || a.createdAt).valueOf(),
									...a.danhSachBinhLuan.map((c) => dayjs(c.ngayDang || c.createdAt).valueOf()),
								)
							: dayjs(a.ngayDang || a.createdAt).valueOf();

					const bLatest =
						b.danhSachBinhLuan?.length > 0
							? Math.max(
									dayjs(b.ngayDang || b.createdAt).valueOf(),
									...b.danhSachBinhLuan.map((c) => dayjs(c.ngayDang || c.createdAt).valueOf()),
								)
							: dayjs(b.ngayDang || b.createdAt).valueOf();

					return bLatest - aLatest;
				});
				break;
		}

		return filteredData;
	};

	const displayData = getFilteredData();

	const filterOptions = [
		{ key: 'ngay-dang', label: 'Ngày đăng', icon: <ArrowRightOutlined /> },
		{ key: 'chua-xem', label: 'Chưa xem', icon: <CheckCircleOutlined /> },
		{ key: 'hoat-dong-moi-nhat', label: 'Mới nhất', icon: <FilterOutlined /> },
	];

	const getFilterLabel = () => filterOptions.find((f) => f.key === currentFilter)?.label || 'Sắp xếp';

	const handleFilterChange = (filterType: FilterType) => {
		// setCurrentFilter(filterType);
		setSortMode(filterType);
	};

	const renderDiscussionItem = (item: any, index: number) => {
		const isUnread =
			currentUserSsoId && !item.danhSachDaXem?.some((viewer: { ssoId: string }) => viewer.ssoId === currentUserSsoId);

		return (
			<div
				key={item._id}
				className={`card-diendan-wrapper ${isUnread ? 'card-diendan-unread' : ''}`}
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
							<Tag color={isUnread ? 'red' : ''} style={{ marginLeft: 4 }}>
								{isUnread ? 'Mới' : 'Đã xem'}
							</Tag>
						</div>

						{/* Thời gian */}
						<Text className='card-diendan-time'>
							{item?.thongTinNguoiDang?.isGiaoVien && (
								<CheckCircleOutlined
									style={{ color: '#52c41a', fontSize: '12px', marginRight: 4 }}
									title='Giảng viên'
								/>
							)}
							{dayjs(item?.ngayDang ?? item.createdAt).format('HH:mm DD/MM/YYYY')}
							{item.danhSachBinhLuan?.length > 0 && (
								<Text
									style={{
										marginLeft: 8,
										fontSize: '12px',
										color: '#8c8c8c',
									}}
								>
									({item.danhSachBinhLuan.length} bình luận)
								</Text>
							)}
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
				<Space>
					Diễn đàn thảo luận
					<Tag color={displayData.length > 0 ? 'green' : ''}>{displayData.length}</Tag>
				</Space>
			}
			extra={
				<Space>
					<Dropdown
						menu={{
							items: filterOptions.map((option) => ({
								key: option.key,
								label: option.label,
								icon: option.icon,
								onClick: () => handleFilterChange(option.key as FilterType),
							})),
						}}
						trigger={['click']}
						placement='bottomRight'
					>
						<Button size='small' icon={<FilterOutlined />} type={currentFilter !== 'ngay-dang' ? 'primary' : 'default'}>
							{isMobile ? '' : getFilterLabel()}
						</Button>
					</Dropdown>
					<Link to='/hoc-tap/lop-tin-chi' className='xem-tat-ca-link'>
						Xem thêm
					</Link>
				</Space>
			}
			loading={loading}
		>
			<Card variant='borderless' style={{ borderRadius: 8, maxHeight: '348px', overflowX: 'scroll' }}>
				{displayData.length ? (
					displayData.map((item, index) => renderDiscussionItem(item, index))
				) : (
					<Empty
						image={Empty.PRESENTED_IMAGE_SIMPLE}
						style={{ margin: '16px 0' }}
						description={currentFilter === 'chua-xem' ? 'Không có bài viết chưa xem' : 'Không có dữ liệu'}
					/>
				)}
			</Card>
		</Card>
	);
};

export default CardDienDanDashboard;
