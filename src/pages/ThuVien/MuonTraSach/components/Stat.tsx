import StatisticsCard from '@/components/StatisticsCard';
import { BookOutlined, CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useEffect, useMemo } from 'react';
import { useModel } from 'umi';

const StatMuonTraSach = () => {
	const { thongKeMuonTraSachModel, dataThongKe, loadingThongKe } = useModel('thuvien.muonsach');

	useEffect(() => {
		if (!dataThongKe) thongKeMuonTraSachModel();
	}, []);

	const statisticsData = useMemo(
		() => [
			{
				title: 'Chờ xử lý',
				value: dataThongKe?.choXuLy ?? 0,
				valueColor: 'blue',
				icon: <ClockCircleOutlined />,
			},
			{
				title: 'Đang mượn',
				value: dataThongKe?.dangThueMuon ?? 0,
				valueColor: 'orange',
				icon: <BookOutlined />,
				onClick: () => {
					console.log('Xem chi tiết Đang mượn');
				},
			},
			{
				title: 'Quá hạn mượn',
				value: dataThongKe?.quaHan ?? 0,
				valueColor: 'red',
				icon: <ExclamationCircleOutlined />,
				onClick: () => {
					console.log('Xem chi tiết Quá hạn');
				},
			},
			{
				title: 'Đã trả',
				value: dataThongKe?.daTra ?? 0,
				valueColor: 'green',
				icon: <CheckCircleOutlined />,
			},
		],
		[dataThongKe],
	);

	return (
		<Spin spinning={loadingThongKe}>
			<StatisticsCard
				// borderleft
				hideCard
				title='Thống kê mượn trả sách'
				data={statisticsData}
				rowGutter={12}
				colSpan={{ md: 6 }}
				containerStyle={{ marginBottom: 12 }}
				cardStyle={{ cursor: 'pointer' }}
			/>
		</Spin>
	);
};

export default StatMuonTraSach;
