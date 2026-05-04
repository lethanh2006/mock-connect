import PageCard from '@/components/PageCard';
import { formatDateTime } from '@/utils/formatDate';
import { ArrowRightOutlined, CheckCircleOutlined, FilterOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Dropdown, Empty, Space, Spin, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { history, Link, useIntl, useModel } from 'umi';
import './style.less';

const { Text } = Typography;

type FilterType = 'ngay-dang' | 'chua-xem' | 'hoat-dong-moi-nhat';

const CardDienDanDashboard = (props: { typeLop: 'all' | 'lop-hoc-phan' | 'lop-hanh-chinh' }) => {
	const intl = useIntl();
	const { record: recHocKy } = useModel('daotao.hocky');
	const { danhSach, loading, getDienDanSinhVienModel } = useModel('diendan.baidang');
	const { initialState } = useModel('@@initialState');
	const { record: recordSinhVien } = useModel('sinhvien.sinhvien');
	const [sortMode, setSortMode] = useState<'ngay-dang' | 'chua-xem' | 'hoat-dong-moi-nhat'>('ngay-dang');

	const [screenSize, setScreenSize] = useState({
		width: window.innerWidth,
		height: window.innerHeight,
	});

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
		getDienDanSinhVienModel(undefined, sortMode, recHocKy?.ma, { ghimBaiViet: -1 }, props.typeLop);
	}, [recHocKy?.ma, props.typeLop, sortMode]);

	const isMobile = screenSize.width <= 768;

	const filterOptions = [
		{
			key: 'ngay-dang',
			label: intl.formatMessage({ id: 'trangchu.hoctaprenluyen.diemdan.ngaydang' }),
			icon: <ArrowRightOutlined />,
		},
		{
			key: 'chua-xem',
			label: intl.formatMessage({ id: 'trangchu.hoctaprenluyen.diemdan.chuaxem' }),
			icon: <CheckCircleOutlined />,
		},
		{
			key: 'hoat-dong-moi-nhat',
			label: intl.formatMessage({ id: 'trangchu.hoctaprenluyen.diemdan.moinhat' }),
			icon: <FilterOutlined />,
		},
	];

	const getFilterLabel = () =>
		filterOptions.find((f) => f.key === sortMode)?.label ||
		intl.formatMessage({ id: 'trangchu.hoctaprenluyen.diemdan.sapxep' });

	const handleFilterChange = (filterType: FilterType) => {
		setSortMode(filterType);
	};

	const renderDiscussionItem = (item: any, index: number) => {
		const isUnread =
			currentUserSsoId && !item.danhSachDaXem?.some((viewer: { ssoId: string }) => viewer.ssoId === currentUserSsoId);

		return (
			<div
				key={item._id}
				className={`card-diendan-wrapper ${isUnread ? 'card-diendan-unread' : ''}`}
				onClick={() => {
					item.lopHocPhanId
						? history.push(`/hoc-tap/lop-tin-chi/${item.lopHocPhanId}?idBaiViet=${item._id}#dien-dan`)
						: history.push(`/lop-hanh-chinh/${item.lopHanhChinhId}?idBaiViet=${item._id}#dien-dan`);
				}}
			>
				{/* Tên lớp học phần */}
				<div className='card-diendan-lop'>
					<Text className='card-diendan-lop-text'>#{item.lopHocPhan?.ten || item.lopHanhChinh?.ten}</Text>
					<ArrowRightOutlined style={{ fontSize: '10px', color: '#1890ff' }} />
				</div>

				{/* Nội dung */}
				<div className='card-diendan-content'>
					<Avatar
						size={isMobile ? 36 : 40}
						src={item?.thongTinNguoiDang?.avatar ? item.thongTinNguoiDang.avatar : undefined}
						icon={
							item?.thongTinNguoiDang?.avatar ? undefined : item?.thongTinNguoiDang?.hoTen ? (
								lastNameChar(item.thongTinNguoiDang.hoTen)
							) : (
								<UserOutlined />
							)
						}
						alt='avatar'
						className='avatar'
					/>

					<div className='card-diendan-content-right'>
						{/* Tên người đăng */}
						<div className='card-diendan-user-info'>
							<Text className='card-diendan-user-info-name'>{item?.thongTinNguoiDang?.hoTen}</Text>
							<Tag color={isUnread ? 'red' : ''} style={{ marginLeft: 4 }}>
								{isUnread
									? intl.formatMessage({ id: 'trangchu.hoctaprenluyen.diemdan.moi' })
									: intl.formatMessage({ id: 'trangchu.hoctaprenluyen.diemdan.daxem' })}
							</Tag>
						</div>

						{/* Thời gian */}
						<Text className='card-diendan-time'>
							{item?.thongTinNguoiDang?.isGiaoVien && (
								<CheckCircleOutlined
									style={{ color: '#52c41a', fontSize: '12px', marginRight: 4 }}
									title={intl.formatMessage({ id: 'trangchu.hoctaprenluyen.diemdan.giangvien' })}
								/>
							)}
							{formatDateTime(item?.ngayDang ?? item.createdAt)}
							{item.danhSachBinhLuan?.length > 0 && (
								<Text
									style={{
										marginLeft: 8,
										fontSize: '12px',
										color: '#8c8c8c',
									}}
								>
									({item.danhSachBinhLuan.length}{' '}
									{intl.formatMessage({ id: 'trangchu.hoctaprenluyen.diemdan.binhluan' })})
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
			title={
				<Space>
					{intl.formatMessage({ id: 'trangchu.hoctaprenluyen.diemdan.title' })}{' '}
					<Tag color={danhSach.length > 0 ? 'green' : ''}>{danhSach.length}</Tag>
				</Space>
			}
			styles={danhSach.length ? {} : { body: { height: '100%' } }}
			extra={
				<Space>
					<Dropdown
						menu={{
							items: filterOptions.map((option) => ({
								key: option.key,
								label: (
									<Space>
										{option.icon}
										{option.label}
									</Space>
								),
							})),
							onClick: ({ key }) => handleFilterChange(key as FilterType),
						}}
						trigger={['click']}
						placement='bottomRight'
					>
						<Button size='small' icon={<FilterOutlined />} type={sortMode !== 'ngay-dang' ? 'primary' : 'default'}>
							{isMobile ? '' : getFilterLabel()}
						</Button>
					</Dropdown>

					<Link to='/hoc-tap/lop-tin-chi' className='xem-tat-ca-link'>
						{intl.formatMessage({ id: 'trangchu.hoctaprenluyen.diemdan.xemthem' })}
					</Link>
				</Space>
			}
		>
			<PageCard hideInnerCard style={{ borderRadius: 8, maxHeight: '348px', overflowX: 'scroll' }}>
				<Spin spinning={loading}>
					{danhSach.length ? (
						danhSach.map((item, index) => renderDiscussionItem(item, index))
					) : (
						<Empty
							image={Empty.PRESENTED_IMAGE_SIMPLE}
							description={
								sortMode === 'chua-xem'
									? intl.formatMessage({ id: 'trangchu.hoctaprenluyen.diemdan.empty' })
									: intl.formatMessage({ id: 'global.table.index.empty' })
							}
						/>
					)}
				</Spin>
			</PageCard>
		</Card>
	);
};

export default CardDienDanDashboard;
