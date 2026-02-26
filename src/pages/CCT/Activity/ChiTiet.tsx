import ButtonExtend from '@/components/Table/ButtonExtend';
import { EApprovalStatus } from '@/services/CCT/constant';
import { Modal, Popconfirm, Space } from 'antd';
import dayjs from 'dayjs';
import { useIntl, useModel } from 'umi';
import CardChiTietSuKien from './components/CardChiTietSuKien';

const ChiTietActivity = (props: { getData?: () => void; setVisibleDangKy?: (val: boolean) => void }) => {
	const { getData, setVisibleDangKy } = props;
	const intl = useIntl();
	const { visibleForm, setVisibleForm, record, registerActivityModel } = useModel('cct.activity');
	const { deleteActivityModel, handleEdit } = useModel('cct.activityoutcome');

	const isInTimeRange = () => {
		const now = dayjs();
		const start = dayjs(record?.startDate);
		const end = dayjs(record?.endDate);

		if (!start.isValid() || !end.isValid()) return false;

		return now.isBetween(start, end, null, '[]');
	};

	const editableWorkflow =
		record?.workflow === EApprovalStatus.DRAFT ||
		record?.workflow === EApprovalStatus.CHANGES_REQUIRED ||
		record?.workflow === EApprovalStatus.EVIDENCE_REQUIRED;

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
							workflow: record?.activityOutcome?.workflow,
							validation: record?.activityOutcome?.validation,

							rolesId: record?.activityOutcome?.rolesId,
							tracks: record?.activityOutcome?.tracks,
							levels: record?.activityOutcome?.levels,

							evidenceFile: record?.activityOutcome?.evidenceFile,

							reflection: record?.activityOutcome?.reflection,
							revisionNote: record?.activityOutcome?.revisionNote,
						} as any
					}
					infoEvidence={!!record?.workflow && record?.workflow !== EApprovalStatus.EVIDENCE_REQUIRED}
				/>
			</div>

			<div
				style={{
					backgroundColor: '#fff',
					display: 'flex',
					gap: 8,
					justifyContent: !record?.workflow ? 'flex-end' : 'space-between',
					margin: '15px -15px -15px -15px',
					padding: 16,
				}}
			>
				{editableWorkflow && (
					<Popconfirm
						title='Confirm cancellation of activity registration'
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

					{!record?.workflow ? (
						<ButtonExtend
							type='primary'
							onClick={() =>
								registerActivityModel(record?._id ?? '', getData).then(() => {
									setVisibleForm(false);
									setVisibleDangKy && setVisibleDangKy(true);
								})
							}
							disabled={!!record?.workflow}
						>
							REGISTER NOW
						</ButtonExtend>
					) : editableWorkflow && isInTimeRange() ? (
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
					) : null}
				</Space>
			</div>
		</Modal>
	);
};

export default ChiTietActivity;
