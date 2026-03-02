import StatisticsCard from '@/components/StatisticsCard';
import { StatisticsItem } from '@/components/StatisticsCard/typing';
import { EOperatorType } from '@/components/Table/constant';
import { accentColors, officialColors, statusBgColors, statusColors } from '@/services/base/constant';
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

	const filterTrangThai = (workflow: EApprovalStatus | EApprovalStatus[] | 'all') => {
		const temp = [...(filters ?? [])].filter((item) => item.field !== 'workflow');

		if (workflow !== 'all') {
			temp.push({
				active: true,
				field: 'workflow',
				values: Array.isArray(workflow) ? workflow : [workflow],
				operator: EOperatorType.INCLUDE,
			});
		}

		setFilters(temp);
	};

	const ACTION_REQUIRED_STATUSES = [
		EApprovalStatus.EVIDENCE_REQUIRED,
		EApprovalStatus.CHANGES_REQUIRED,
		EApprovalStatus.DRAFT,
	];

	const statisticsData: StatisticsItem[] = [
		{
			title: 'Total',
			value: inputFormat(dataThongKe?.total ?? 0),
			backgroundColor: accentColors.accent800,
			valueColor: officialColors.official300,
			onClick: () => filterTrangThai('all'),
		},
		{
			title: 'Action Required',
			value: inputFormat(
				(dataThongKe?.evidenceRequired ?? 0) + (dataThongKe?.changesRequired ?? 0) + (dataThongKe?.draft ?? 0),
			),
			backgroundColor: statusBgColors.statusBg300,
			valueColor: statusColors.status300,
			onClick: () => filterTrangThai(ACTION_REQUIRED_STATUSES),
			selected:
				valueFiltered?.length === ACTION_REQUIRED_STATUSES.length &&
				ACTION_REQUIRED_STATUSES.every((s) => valueFiltered.includes(s)),
		},
		{
			title: 'Pending For Approval',
			value: inputFormat(dataThongKe?.submitted ?? 0),
			backgroundColor: statusBgColors.statusBg200,
			valueColor: statusColors.status200,
			onClick: () => filterTrangThai(EApprovalStatus.SUBMITTED),
			selected: valueFiltered?.length === 1 && valueFiltered[0] === EApprovalStatus.SUBMITTED,
		},
		{
			title: 'Approved',
			value: inputFormat(dataThongKe?.approved ?? 0),
			backgroundColor: statusBgColors.statusBg100,
			valueColor: statusColors.status100,
			onClick: () => filterTrangThai(EApprovalStatus.APPROVED),
			selected: valueFiltered?.length === 1 && valueFiltered[0] === EApprovalStatus.APPROVED,
		},
		{
			title: 'Rejected',
			value: inputFormat(dataThongKe?.rejected ?? 0),
			backgroundColor: statusBgColors.statusBg400,
			valueColor: statusColors.status400,
			onClick: () => filterTrangThai(EApprovalStatus.REJECTED),
			selected: valueFiltered?.length === 1 && valueFiltered[0] === EApprovalStatus.REJECTED,
		},
		{
			title: 'Expired',
			value: inputFormat(dataThongKe?.expired ?? 0),
			backgroundColor: officialColors.official500,
			valueColor: officialColors.official300,
			// onClick: () => filterTrangThai(EApprovalStatus.EXPIRED),
			// selected: valueFiltered?.length === 1 && valueFiltered[0] === EApprovalStatus.EXPIRED,
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
