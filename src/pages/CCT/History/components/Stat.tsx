import StatisticsCard from '@/components/StatisticsCard';
import { StatisticsItem } from '@/components/StatisticsCard/typing';
import { EOperatorType } from '@/components/Table/constant';
import { accentColors, officialColors, statusBgColors, statusColors } from '@/services/base/constant';
import { EActivityCategory, EApprovalStatus } from '@/services/CCT/constant';
import { inputFormat } from '@/utils/utils';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';

const StatActivityOutCome = (props: { getData: () => void; tabActive?: EActivityCategory }) => {
	const { getData, tabActive } = props;
	const intl = useIntl();
	const { loadingThongKe, dataThongKe, filters, setFilters } = useModel('cct.activityoutcome');
	const valueFiltered = filters?.find((item) => item.field?.includes('workflow'))?.values ?? [];
	const [statusExpired, setStatusExpired] = useState<boolean>(false);

	useEffect(() => {
		getData();
	}, [tabActive]);

	const filterTrangThai = (workflow: EApprovalStatus | EApprovalStatus[] | 'all') => {
		setStatusExpired(false);

		if (workflow === 'all') {
			setFilters([]);
			return;
		}

		const now = dayjs().toISOString();
		const workflows = Array.isArray(workflow) ? workflow : [workflow];

		const filtersToSet: any[] = [
			{
				active: true,
				field: 'workflow',
				values: workflows,
				operator: EOperatorType.INCLUDE,
			},
		];

		const isActionRequired =
			workflows.length === ACTION_REQUIRED_STATUSES.length &&
			ACTION_REQUIRED_STATUSES.every((s) => workflows.includes(s));

		if (isActionRequired) {
			filtersToSet.push({
				active: true,
				field: 'dueDate',
				values: [now],
				operator: EOperatorType.GREAT_THAN,
			});
		}

		setFilters(filtersToSet);
	};

	const filterExpiredPersonal = () => {
		setStatusExpired(true);
		const now = dayjs().toISOString();

		setFilters([
			{
				active: true,
				field: 'workflow',
				values: [EApprovalStatus.CHANGES_REQUIRED, EApprovalStatus.DRAFT, EApprovalStatus.EVIDENCE_REQUIRED],
				operator: EOperatorType.INCLUDE,
			},
			{
				active: true,
				field: 'dueDate',
				values: [now],
				operator: EOperatorType.LESS_THAN,
			},
		]);
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
				ACTION_REQUIRED_STATUSES.every((s) => valueFiltered.includes(s)) &&
				!statusExpired,
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
			onClick: () => filterExpiredPersonal(),
			selected: statusExpired,
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
