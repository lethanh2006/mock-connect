import StatisticsCard from '@/components/StatisticsCard';
import { StatisticsItem } from '@/components/StatisticsCard/typing';
import { colorList } from '@/services/base/constant';
import { useIntl, useModel } from 'umi';

const IdpStatisticsCards = () => {
	const intl = useIntl();
	const { advisorStats, loadingAdvisorStats } = useModel('idp.covansinhvien');

	const statisticsData: StatisticsItem[] = [
		{
			title: intl.formatMessage({ id: 'idpcovan.stat.totalStudents' }),
			value: advisorStats?.totalStudents ?? 0,
			valueColor: colorList.PURPLE.hexColor,
		},
		{
			title: intl.formatMessage({ id: 'idpcovan.stat.studentsWithIdp' }),
			value: advisorStats?.studentsWithIdp ?? 0,
			valueColor: colorList.GREEN.hexColor,
		},
		{
			title: intl.formatMessage({ id: 'idpcovan.stat.studentsWithoutIdp' }),
			value: advisorStats?.studentsWithoutIdp ?? 0,
			valueColor: colorList.ORANGE.hexColor,
		},
		{
			title: intl.formatMessage({ id: 'idpcovan.stat.studentsWithBooking' }),
			value: advisorStats?.studentsWithBooking ?? 0,
			valueColor: colorList.BLUE.hexColor,
		},
		{
			title: intl.formatMessage({ id: 'idpcovan.stat.studentsWithoutBooking' }),
			value: advisorStats?.studentsWithoutBooking ?? 0,
			valueColor: colorList.RED.hexColor,
		},
	];

	return (
		<StatisticsCard
			data={statisticsData}
			loading={loadingAdvisorStats}
			hideCard
			containerStyle={{ marginBottom: 16 }}
			colSpan={{ xs: 12, sm: 12, md: 8, lg: 6, xl: 6 }}
			rowGutter={8}
			autoBackground={{ enabled: true, lightenAmount: 0.1, alphaAmount: 0.1 }}
		/>
	);
};

export default IdpStatisticsCards;
