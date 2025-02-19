import { ArrowRightOutlined, CheckCircleOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Card, Empty, List } from 'antd';
import moment from 'moment';
import { history, Link, useModel } from 'umi';

const CardDienDanDashboard = () => {
	const { danhSach, loading } = useModel('diendan.baidang');

	const lastNameChar = (ten: string) => ten.split(' ')?.at(-1)?.[0]?.toUpperCase();

	return (
		<Card
			title='Diễn đàn thảo luận'
			loading={loading}
			extra={
				<Link to='/hoc-tap/lop-tin-chi'>
					Xem thêm <ArrowRightOutlined />
				</Link>
			}
		>
			<div style={{ maxHeight: 300, overflow: 'auto' }}>
				{danhSach.length ? (
					<List
						itemLayout='vertical'
						className='dashboard-list-lhp'
						dataSource={danhSach}
						renderItem={(item) => (
							<List.Item
								onClick={() => history.push(`/hoc-tap/lop-tin-chi/${item.lopHocPhanId}?idBaiViet=${item._id}#dien-dan`)}
							>
								<List.Item.Meta
									title={
										<>
											{item?.thongTinNguoiDang?.hoTen}
											{item?.thongTinNguoiDang?.isGiaoVien && (
												<CheckCircleOutlined style={{ color: 'green', marginLeft: 6 }} title='Giảng viên' />
											)}
										</>
									}
									avatar={
										<Avatar
											src={item.thongTinNguoiDang.avatar ? <img src={item.thongTinNguoiDang.avatar} /> : undefined}
											icon={
												!item.thongTinNguoiDang.avatar
													? lastNameChar(item.thongTinNguoiDang.hoTen) ?? <UserOutlined />
													: undefined
											}
											alt='avatar'
										/>
									}
									description={[item.lopHocPhan?.ten, moment(item?.ngayDang ?? item.createdAt).calendar()].join(' • ')}
								/>
								<div className='description-3lines'>{item.tieuDe}</div>
							</List.Item>
						)}
					/>
				) : (
					<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không có diễn đàn' />
				)}
			</div>
		</Card>
	);
};

export default CardDienDanDashboard;
