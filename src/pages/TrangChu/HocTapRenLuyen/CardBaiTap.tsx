import { colorTrangThaiNopBaiTap, mapTrangThaiNopBaiTap } from '@/services/DaoTao/BaiTap/constants';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Card, Empty, List, Statistic, Tag } from 'antd';
import moment from 'moment';
import { history, Link, useModel } from 'umi';

const CardBaiTapDashboard = () => {
	const { danhSach, loading } = useModel('daotao.baitap');
	// Data đã get ở LichDashboard rồi => ko cần get lại nữa

	return (
		<Card
			title='Bài tập sắp tới'
			loading={loading}
			extra={
				<Link to='/hoc-tap/lop-tin-chi'>
					Xem thêm <ArrowRightOutlined />
				</Link>
			}
		>
			<div style={{ maxHeight: 300, overflow: 'auto' }}>
				{danhSach.filter((i) => i.assignment.thoiGianKetThuc >= new Date()).length ? (
					<List
						itemLayout='horizontal'
						className='dashboard-list-lhp'
						dataSource={danhSach}
						renderItem={(item) => (
							<List.Item onClick={() => history.push(`/hoc-tap/lop-tin-chi/${item.assignment.lopHocPhanId}#bai-tap`)}>
								<List.Item.Meta
									title={
										<>
											{item.assignment.tenLopHocPhan}{' '}
											<Tag color={colorTrangThaiNopBaiTap[item.trangThai]}>{mapTrangThaiNopBaiTap[item.trangThai]}</Tag>
										</>
									}
									description={<div className='description-3lines'>{item.assignment.noiDung}</div>}
								/>
								{item.assignment.thoiGianKetThuc ? (
									<div className='countdown'>
										<Statistic.Countdown title='Còn hạn' value={moment(item.assignment.thoiGianKetThuc).valueOf()} />
									</div>
								) : null}
							</List.Item>
						)}
					/>
				) : (
					<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không có bài tập' />
				)}
			</div>
		</Card>
	);
};

export default CardBaiTapDashboard;
