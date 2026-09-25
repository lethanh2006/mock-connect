import { EActivityCategory, EActivityStatus } from '@/services/CCT/constant';
import { inputFormat } from '@/utils/utils';
import { useEffect } from 'react';
import { useModel } from 'umi';
import Statistic, { StatisticItem } from './Statistic';

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

	const statisticsData: StatisticItem[] = [
		{
			title: 'Total',
			value: inputFormat(dataThongKe?.total ?? 0),
			onClick: () => handleFilter(EActivityStatus.TOTAL),
			selected: currentWorkflow === EActivityStatus.TOTAL,
		},
		{
			title: 'Action Required',
			value: inputFormat(dataThongKe?.actionRequired ?? 0),
			onClick: () => handleFilter(EActivityStatus.ACTION_REQUIRED),
			selected: currentWorkflow === EActivityStatus.ACTION_REQUIRED,
		},
		{
			title: 'Pending For Approval',
			value: inputFormat(dataThongKe?.pendingForApproval ?? 0),
			onClick: () => handleFilter(EActivityStatus.PENDING_FOR_APPROVAL),
			selected: currentWorkflow === EActivityStatus.PENDING_FOR_APPROVAL,
		},
		{
			title: 'Approved',
			value: inputFormat(dataThongKe?.approved ?? 0),
			onClick: () => handleFilter(EActivityStatus.APPROVED),
			selected: currentWorkflow === EActivityStatus.APPROVED,
		},
		{
			title: 'Rejected',
			value: inputFormat(dataThongKe?.rejected ?? 0),
			onClick: () => handleFilter(EActivityStatus.REJECTED),
			selected: currentWorkflow === EActivityStatus.REJECTED,
		},
		{
			title: 'Expired',
			value: inputFormat(dataThongKe?.expired ?? 0),
			onClick: () => handleFilter(EActivityStatus.EXPIRED),
			selected: currentWorkflow === EActivityStatus.EXPIRED,
		},
	];

	return <Statistic data={statisticsData} loading={loadingThongKe} />;
};

export default StatActivityOutCome;
