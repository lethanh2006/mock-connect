import StatisticsCard from '@/components/StatisticsCard';
import { StatisticsItem } from '@/components/StatisticsCard/typing';
import { EOperatorType } from '@/components/Table/constant';
import { EApprovalStatus } from '@/services/CCT/constant';
import { inputFormat } from '@/utils/utils';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';

const StatActivityOutCome = (props: { getData: () => void; dependency?: any }) => {
	const { getData, dependency } = props;
	const intl = useIntl();
	const { loadingThongKe, dataThongKe, filters, setFilters } = useModel('cct.activityoutcome');
	const valueFiltered = filters?.find((item) => item.field?.includes('workflow'))?.values ?? [];

	useEffect(() => {
		getData();
	}, [dependency]);

	const filterTrangThai = (workflow: EApprovalStatus | 'all') => {
		const temp = [...(filters ?? [])].filter((item) => item.field !== 'workflow');
		if (workflow !== 'all')
			temp?.push({
				active: true,
				field: 'workflow',
				values: [workflow],
				operator: EOperatorType.INCLUDE,
			});
		setFilters(temp);
	};

	const statisticsData: StatisticsItem[] = [
		{
			title: 'Total',
			value: inputFormat(dataThongKe?.total ?? 0),
			valueColor: '#134D8B',
			onClick: () => filterTrangThai('all'),
		},
		{
			title: 'Action Required',
			value: inputFormat(dataThongKe?.changesRequired ?? 0),
			valueColor: '#CE7C1E',
			onClick: () => filterTrangThai(EApprovalStatus.CHANGES_REQUIRED),
			selected: valueFiltered?.length === 1 && valueFiltered[0] === EApprovalStatus.CHANGES_REQUIRED,
		},
		{
			title: 'Pending For Approval',
			value: inputFormat(dataThongKe?.submitted ?? 0),
			valueColor: '#0E50CF',
			onClick: () => filterTrangThai(EApprovalStatus.SUBMITTED),
			selected: valueFiltered?.length === 1 && valueFiltered[0] === EApprovalStatus.SUBMITTED,
		},
		{
			title: 'Approved',
			value: inputFormat(dataThongKe?.approved ?? 0),
			valueColor: '#329323',
			onClick: () => filterTrangThai(EApprovalStatus.APPROVED),
			selected: valueFiltered?.length === 1 && valueFiltered[0] === EApprovalStatus.APPROVED,
		},
		{
			title: 'Rejected',
			value: inputFormat(dataThongKe?.rejected ?? 0),
			valueColor: '#C80F1F',
			onClick: () => filterTrangThai(EApprovalStatus.REJECTED),
			selected: valueFiltered?.length === 1 && valueFiltered[0] === EApprovalStatus.REJECTED,
		},
		{
			title: 'Draft',
			value: inputFormat(dataThongKe?.draft ?? 0),
			valueColor: '#134D8B',
			onClick: () => filterTrangThai(EApprovalStatus.DRAFT),
			selected: valueFiltered?.length === 1 && valueFiltered[0] === EApprovalStatus.DRAFT,
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
