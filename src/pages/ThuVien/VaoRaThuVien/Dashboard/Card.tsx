import StatisticsCard from '@/components/StatisticsCard';
import { Card, Empty } from 'antd';
import { useEffect } from 'react';
import { Link, useModel } from 'umi';
import ChartVaoRaThuVien from './Chart';
import StatVaoRaThuVien from './Stat';
import './style.less';

const VaoRaThuVienDashboardCard = () => {
	const { loading, thongKeVaoRaModel, thongKeVaoRa } = useModel('thuvien.vaorathuvien');
	const { thongKeMuonTraSachModel, dataThongKe } = useModel('thuvien.muonsach');

	useEffect(() => {
		thongKeVaoRaModel();
		thongKeMuonTraSachModel();
	}, []);

	return (
		<Card
			variant='borderless'
			className='card-borderless card-big-title'
			title='Lượt vào thư viện'
			extra={
				<Link to={'/thu-vien/vao-ra'} type='link' className='xem-tat-ca-link'>
					Xem thêm
				</Link>
			}
			loading={loading}
		>
			{thongKeVaoRa.length ? (
				<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
					{/* Thống kê vào ra thư viện */}
					<Card variant='borderless' style={{ borderRadius: 8 }}>
						<StatVaoRaThuVien />
					</Card>

					{/* Biểu đồ */}
					<Card variant='borderless' style={{ borderRadius: 8 }}>
						<ChartVaoRaThuVien />
					</Card>

					{/* Thống kê mượn sách */}
					<StatisticsCard
						title='Thống kê mượn sách'
						hideCard={false}
						colSpan={{ xs: 24, sm: 12, md: 12 }}
						rowGutter={12}
						data={[
							{
								title: 'Chờ xử lý',
								value: dataThongKe?.choXuLy ?? 0,
								valueColor: 'blue',
							},
							{
								title: 'Đang mượn',
								value: dataThongKe?.dangThueMuon ?? 0,
								valueColor: 'orange',
							},
							{
								title: 'Quá hạn mượn',
								value: dataThongKe?.quaHan ?? 0,
								valueColor: 'red',
							},
							{
								title: 'Đã trả',
								value: dataThongKe?.daTra ?? 0,
								valueColor: 'green',
							},
						]}
					/>
				</div>
			) : (
				<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ margin: '16px 0' }} description='Không có dữ liệu' />
			)}
		</Card>
	);
};

export default VaoRaThuVienDashboardCard;
