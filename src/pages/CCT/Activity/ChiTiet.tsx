import ButtonExtend from '@/components/Table/ButtonExtend';
import { Activity } from '@/services/CCT/Activity/typing';
import { EApprovalStatus } from '@/services/CCT/constant';
import { Modal, Popconfirm, Space } from 'antd';
import dayjs from 'dayjs';
import { useIntl, useModel } from 'umi';
import CardChiTietSuKien from './components/CardChiTietSuKien';

const ChiTietActivity = (props: {
	getData?: () => void;
	setVisibleDangKy?: (val: boolean) => void;
	activeKey?: string;
}) => {
	const { getData, setVisibleDangKy, activeKey } = props;
	const intl = useIntl();
	const { visibleForm, setVisibleForm, record, registerActivityModel } = useModel('cct.activity');
	const { deleteActivityModel, handleEdit } = useModel('cct.activityoutcome');

	const now = dayjs();
	const startDate = record?.startDate ? dayjs(record.startDate) : null;
	const endDateSource = record?.dueDateRegistration ?? record?.endDate;
	const endDate = endDateSource ? dayjs(endDateSource) : null;

	const endDateUpdateEvidence =
		record?.activityOutcome?.workflow === EApprovalStatus.CHANGES_REQUIRED
			? record?.activityOutcome?.dueDate
				? dayjs(record?.activityOutcome?.dueDate)
				: null
			: record?.allowPostEventResultsUpdate
				? record.dueDate
					? dayjs(record.dueDate)
					: null
				: record?.endDate
					? dayjs(record.endDate)
					: null;

	const isOngoing = now.isAfter(startDate) && now.isBefore(endDateUpdateEvidence);

	const editableWorkflow =
		record?.activityOutcome?.workflow === EApprovalStatus.DRAFT ||
		record?.activityOutcome?.workflow === EApprovalStatus.CHANGES_REQUIRED ||
		record?.activityOutcome?.workflow === EApprovalStatus.EVIDENCE_REQUIRED;

	const isFullSlot = !!record?.capacity && (record?.numberOfRegisteredActivityOutcomes ?? 0) >= record.capacity;

	const outTime = now.isAfter(endDate) && !record?.activityOutcome?.workflow;

	const isExpired = activeKey === '3' && editableWorkflow && now.isAfter(endDateUpdateEvidence);

	return (
		<Modal
			title='Activity Detail'
			open={visibleForm}
			onCancel={() => setVisibleForm(false)}
			width={1000}
			footer={null}
			styles={{
				body: { backgroundColor: '#F8F8F8', borderRadius: 2 },
				header: { backgroundColor: '#F8F8F8' },
			}}
		>
			<div style={{ marginTop: -12 }}>
				<CardChiTietSuKien
					record={
						{
							...record,
							activityOutcome: record?.activityOutcome,
						} as Activity.IRecord
					}
					evidenceDeadline={
						record?.activityOutcome?.workflow === EApprovalStatus.CHANGES_REQUIRED
							? record?.activityOutcome?.dueDate
								? dayjs(record?.activityOutcome?.dueDate).format('HH:mm DD/MM/YYYY')
								: '--'
							: record?.allowPostEventResultsUpdate
								? record?.dueDate
									? dayjs(record?.dueDate).format('HH:mm DD/MM/YYYY')
									: '--'
								: record?.endDate
									? dayjs(record?.endDate).format('HH:mm DD/MM/YYYY')
									: '--'
					}
					infoEvidence={
						(!!record?.activityOutcome?.workflow && record?.activityOutcome?.workflow !== EApprovalStatus.EXPIRED) ||
						(record?.activityOutcome?.workflow === EApprovalStatus.EXPIRED && !!record?.activityOutcome?._id)
					}
					activeKey={activeKey}
					isExpired={isExpired}
				/>
			</div>

			<div
				style={{
					backgroundColor: '#fff',
					display: 'flex',
					gap: 8,
					justifyContent:
						record?.activityOutcome?.workflow !== EApprovalStatus.EVIDENCE_REQUIRED || activeKey === '3'
							? 'flex-end'
							: 'space-between',
					margin: '15px -15px -15px -15px',
					padding: 16,
				}}
			>
				{record?.activityOutcome?.workflow === EApprovalStatus.EVIDENCE_REQUIRED && activeKey !== '3' && (
					<Popconfirm
						title='Confirm cancellation of activity registration ?'
						placement='topLeft'
						onConfirm={() => deleteActivityModel(record?._id ?? '', getData).then(() => setVisibleForm(false))}
					>
						<ButtonExtend type='link' className='btn-unregister'>
							UNREGISTER
						</ButtonExtend>
					</Popconfirm>
				)}

				<Space wrap>
					<ButtonExtend onClick={() => setVisibleForm(false)}>CLOSE</ButtonExtend>

					{!record?.activityOutcome?.workflow && !isFullSlot ? (
						<Popconfirm
							title='Confirm activity registration ?'
							placement='topLeft'
							onConfirm={() =>
								registerActivityModel(record?.activityOutcome?._id ?? '', getData).then(() => {
									setVisibleForm(false);
									setVisibleDangKy && setVisibleDangKy(true);
								})
							}
							disabled={outTime}
						>
							<ButtonExtend type='primary' disabled={outTime}>
								REGISTER NOW
							</ButtonExtend>
						</Popconfirm>
					) : editableWorkflow && isOngoing ? (
						<ButtonExtend
							type='primary'
							onClick={() => {
								setVisibleForm(false);
								handleEdit({
									...record?.activityOutcome,
									activities: record,
								});
							}}
						>
							Update Evidence
						</ButtonExtend>
					) : isFullSlot && !record?.activityOutcome?.workflow ? (
						<ButtonExtend disabled>FULL SLOT</ButtonExtend>
					) : null}
				</Space>
			</div>
		</Modal>
	);
};

export default ChiTietActivity;
