import StatisticsCard from '@/components/StatisticsCard';
import { StatisticsItem } from '@/components/StatisticsCard/typing';
import { inputFormat } from '@/utils/utils';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const StatActivityOutCome = (props: { getData: () => void; dependency?: any }) => {
	const { getData, dependency } = props;
	const intl = useIntl();
	const { loadingThongKe, dataThongKe } = useModel('cct.activityoutcome');

	useEffect(() => {
		getData();
	}, [dependency]);

	const statisticsData: StatisticsItem[] = [
		{
			title: 'Total',
			value: inputFormat(dataThongKe?.total ?? 0),
			valueColor: '#134D8B',
		},
		{
			title: 'Action Required',
			value: inputFormat(dataThongKe?.changesRequired ?? 0),
			valueColor: '#CE7C1E',
		},
		{
			title: 'Pending For Approval',
			value: inputFormat(dataThongKe?.submitted ?? 0),
			valueColor: '#0E50CF',
		},
		{
			title: 'Approved',
			value: inputFormat(dataThongKe?.approved ?? 0),
			valueColor: '#329323',
		},
		{
			title: 'Rejected',
			value: inputFormat(dataThongKe?.rejected ?? 0),
			valueColor: '#C80F1F',
		},
		{
			title: 'Draft',
			value: inputFormat(dataThongKe?.draft ?? 0),
			valueColor: '#134D8B',
		},
	];

	return (
		<StatisticsCard
			data={statisticsData}
			loading={loadingThongKe}
			hideCard={true}
			colSpan={{ xs: 24, md: 8 }}
			rowGutter={8}
			containerStyle={{ marginBottom: 12 }}
			title=''
		/>
	);
};

export default StatActivityOutCome;
