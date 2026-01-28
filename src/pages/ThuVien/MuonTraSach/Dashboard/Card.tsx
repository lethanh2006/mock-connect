import StatisticsCard from '@/components/StatisticsCard';
import { StatisticsItem } from '@/components/StatisticsCard/typing';
import { Card } from 'antd';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useIntl, useModel } from 'umi';

const ThongKeMuonSachCard = () => {
	const intl = useIntl();
	const { thongKeMuonTraSachModel, dataThongKe } = useModel('thuvien.muonsach');

	useEffect(() => {
		thongKeMuonTraSachModel();
	}, []);

	// Chuẩn bị data cho StatisticsCard
	const statisticsData: StatisticsItem[] = [
		{
			title: intl.formatMessage({ id: 'trangchu.hoctaprenluyen.muontra.choxuly' }),
			value: dataThongKe?.choXuLy ?? 0,
			valueColor: 'blue',
		},
		{
			title: intl.formatMessage({ id: 'trangchu.hoctaprenluyen.muontra.dangmuon' }),
			value: dataThongKe?.dangThueMuon ?? 0,
			valueColor: 'orange',
		},
		{
			title: intl.formatMessage({ id: 'trangchu.hoctaprenluyen.muontra.quahan' }),
			value: dataThongKe?.quaHan ?? 0,
			valueColor: 'red',
		},
		{
			title: intl.formatMessage({ id: 'trangchu.hoctaprenluyen.muontra.datra' }),
			value: dataThongKe?.daTra ?? 0,
			valueColor: 'green',
		},
	];

	return (
		<Card
			variant='borderless'
			className='card-borderless'
			title={intl.formatMessage({ id: 'trangchu.hoctaprenluyen.muontra.title' })}
			extra={
				<Link to={'/thu-vien/lich-su-muon-tra'} type='link' className='xem-tat-ca-link'>
					{intl.formatMessage({ id: 'trangchu.hoctaprenluyen.muontra.xemthem' })}
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
