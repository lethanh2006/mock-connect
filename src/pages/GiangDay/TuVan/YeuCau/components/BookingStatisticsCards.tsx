import StatisticsCard from '@/components/StatisticsCard';
import { StatisticsItem } from '@/components/StatisticsCard/typing';
import { colorList } from '@/services/base/constant';
import { useIntl, useModel } from 'umi';

const BookingStatisticsCards = () => {
	const intl = useIntl();
	const { bookingStats, loadingBookingStats } = useModel('tuvan.yeucau');

	const statisticsData: StatisticsItem[] = [
		{
			title: intl.formatMessage({ id: 'tuvan.stat.total' }),
			value: bookingStats?.total ?? 0,
			valueColor: colorList.PURPLE.hexColor,
		},
		{
			title: intl.formatMessage({ id: 'tuvan.stat.confirmed' }),
			value: bookingStats?.confirmed ?? 0,
			valueColor: colorList.BLUE.hexColor,
		},
		{
			title: intl.formatMessage({ id: 'tuvan.stat.completed' }),
			value: bookingStats?.completed ?? 0,
			valueColor: colorList.GREEN.hexColor,
		},
		{
			title: intl.formatMessage({ id: 'tuvan.stat.noShow' }),
			value: bookingStats?.noShow ?? 0,
			valueColor: colorList.ORANGE.hexColor,
		},
		{
			title: intl.formatMessage({ id: 'tuvan.stat.cancelled' }),
			value: bookingStats?.cancelled ?? 0,
			valueColor: colorList.RED.hexColor,
		},
	];

	return (
		<StatisticsCard
			data={statisticsData}
			loading={loadingBookingStats}
			hideCard
			containerStyle={{ marginBottom: 16 }}
			colSpan={{ xs: 12, sm: 12, md: 8, lg: 6, xl: 6 }}
			rowGutter={8}
			autoBackground={{ enabled: true, lightenAmount: 0.1, alphaAmount: 0.1 }}
		/>
	);
};

export default BookingStatisticsCards;
