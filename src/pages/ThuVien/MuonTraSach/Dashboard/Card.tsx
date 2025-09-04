import StatisticsCard from '@/components/StatisticsCard';
import { StatisticsItem } from '@/components/StatisticsCard/typing';
import { Card } from 'antd';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useModel } from 'umi';

const ThongKeMuonSachCard = () => {
	const { thongKeMuonTraSachModel, dataThongKe } = useModel('thuvien.muonsach');

	useEffect(() => {
		thongKeMuonTraSachModel();
	}, []);

	// Chuẩn bị data cho StatisticsCard
	const statisticsData: StatisticsItem[] = [
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
	];

	return (
		<Card
			variant='borderless'
			className='card-borderless card-big-title'
			title='Thống kê mượn sách'
			extra={
				<Link to={'/thu-vien/lich-su-muon-tra'} type='link' className='xem-tat-ca-link'>
					Xem thêm
				</Link>
			}
		>
			<StatisticsCard
				data={statisticsData}
				colSpan={{ xs: 24, sm: 12, md: 12 }}
				autoBackground={{ enabled: true, lightenAmount: 0.15, alphaAmount: 0.15 }}
				cardStyle={{ padding: 14 }}
				rowGutter={12}
			/>
		</Card>
	);
};

export default ThongKeMuonSachCard;
