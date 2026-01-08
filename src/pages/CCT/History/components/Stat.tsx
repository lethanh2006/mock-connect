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
			valueColor: '#1677ff',
		},
		{
			title: 'Submitted',
			value: inputFormat(dataThongKe?.submitted ?? 0),
			valueColor: '#13c2c2',
		},
		{
			title: 'Approved',
			value: inputFormat(dataThongKe?.approved ?? 0),
			valueColor: '#52c41a',
		},
		{
			title: 'Changes Required',
			value: inputFormat(dataThongKe?.changesRequired ?? 0),
			valueColor: '#faad14',
		},
		{
			title: 'Rejected',
			value: inputFormat(dataThongKe?.rejected ?? 0),
			valueColor: '#ff4d4f',
		},
		{
			title: 'Draft',
			value: inputFormat(dataThongKe?.draft ?? 0),
			valueColor: '#8c8c8c',
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
