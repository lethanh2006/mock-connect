import StatisticsCard from '@/components/StatisticsCard';
import { StatisticsItem } from '@/components/StatisticsCard/typing';
import { accentColors, officialColors, statusBgColors, statusColors } from '@/services/base/constant';
import { EActivityCategory, EActivityStatus } from '@/services/CCT/constant';
import { inputFormat } from '@/utils/utils';
import { useEffect } from 'react';
import { useModel } from 'umi';

const StatActivityOutCome = (props: {
	getData: () => void;
	tabActive?: EActivityCategory;
	onChangeWorkflow: (val: EActivityStatus) => void;
	currentWorkflow?: string;
}) => {
	const { getData, tabActive, onChangeWorkflow, currentWorkflow } = props;
	const { loadingThongKe, dataThongKe } = useModel('cct.activityoutcome');

	useEffect(() => {
		getData();
	}, [tabActive]);

	const handleFilter = (key: EActivityStatus) => {
		if (currentWorkflow === key) {
			onChangeWorkflow(EActivityStatus.TOTAL);
			return;
		}

		onChangeWorkflow(key);
	};

	const statisticsData: StatisticsItem[] = [
		{
			title: 'Total',
			value: inputFormat(dataThongKe?.total ?? 0),
			backgroundColor: accentColors.accent800,
			valueColor: officialColors.official300,
			onClick: () => handleFilter(EActivityStatus.TOTAL),
			selected: currentWorkflow === EActivityStatus.TOTAL,
		},
		{
			title: 'Action Required',
			value: inputFormat(dataThongKe?.actionRequired ?? 0),
			backgroundColor: statusBgColors.statusBg300,
			valueColor: statusColors.status300,
			onClick: () => handleFilter(EActivityStatus.ACTION_REQUIRED),
			selected: currentWorkflow === EActivityStatus.ACTION_REQUIRED,
		},
		{
			title: 'Pending For Approval',
			value: inputFormat(dataThongKe?.pendingForApproval ?? 0),
			backgroundColor: statusBgColors.statusBg200,
			valueColor: statusColors.status200,
			onClick: () => handleFilter(EActivityStatus.PENDING_FOR_APPROVAL),
			selected: currentWorkflow === EActivityStatus.PENDING_FOR_APPROVAL,
		},
		{
			title: 'Approved',
			value: inputFormat(dataThongKe?.approved ?? 0),
			backgroundColor: statusBgColors.statusBg100,
			valueColor: statusColors.status100,
			onClick: () => handleFilter(EActivityStatus.APPROVED),
			selected: currentWorkflow === EActivityStatus.APPROVED,
		},
		{
			title: 'Rejected',
			value: inputFormat(dataThongKe?.rejected ?? 0),
			backgroundColor: statusBgColors.statusBg400,
			valueColor: statusColors.status400,
			onClick: () => handleFilter(EActivityStatus.REJECTED),
			selected: currentWorkflow === EActivityStatus.REJECTED,
		},
		{
			title: 'Expired',
			value: inputFormat(dataThongKe?.expired ?? 0),
			backgroundColor: officialColors.official500,
			valueColor: officialColors.official300,
			onClick: () => handleFilter(EActivityStatus.EXPIRED),
			selected: currentWorkflow === EActivityStatus.EXPIRED,
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
