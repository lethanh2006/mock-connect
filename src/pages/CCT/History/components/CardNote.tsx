import {
	EApprovalStatus,
	mapColorApprovalStatus,
	mapColorTextApprovalStatus,
	mapNameApprovalStatus,
} from '@/services/CCT/constant';
import { Tag } from 'antd';
import dayjs from 'dayjs';
import { useIntl, useModel } from 'umi';

const formatTime = (time?: string | Date) => (time ? dayjs(time).format('HH:mm DD/MM/YYYY') : '--');

const CardNoteActivity = () => {
	const intl = useIntl();
	const { record } = useModel('cct.activityoutcome');

	const workflow = record?.workflow as EApprovalStatus;

	const isSubmitted = workflow === EApprovalStatus.SUBMITTED;
	const isApproved = workflow === EApprovalStatus.APPROVED;
	const isRejected = workflow === EApprovalStatus.REJECTED;
	const isChangesRequired = workflow === EApprovalStatus.CHANGES_REQUIRED;

	const showCard = isSubmitted || isApproved || isRejected || isChangesRequired;

	if (!showCard) return null;

	return (
		<div className='info-summary-box'>
			<div className='info-summary-status'>
				<Tag
					color={mapColorApprovalStatus[workflow]}
					style={{
						color: mapColorTextApprovalStatus[workflow],
						fontWeight: 600,
					}}
				>
					{mapNameApprovalStatus[workflow]}
				</Tag>
			</div>

			<div className='custom-info-grid grid-3'>
				<div className='info-row'>
					{isSubmitted && (
						<div className='info-item'>
							<div className='info-label'>{intl.formatMessage({ id: 'activity.cardnote.submissionTime' })}</div>
							<div className='info-value'>{formatTime(record?.submittedAt)}</div>
						</div>
					)}

					{isApproved && (
						<>
							<div className='info-item'>
								<div className='info-label'>{intl.formatMessage({ id: 'activity.cardnote.submissionTime' })}</div>
								<div className='info-value'>{formatTime(record?.submittedAt)}</div>
							</div>

							<div className='info-item'>
								<div className='info-label'>{intl.formatMessage({ id: 'activity.cardnote.reviewTime' })}</div>
								<div className='info-value'>{formatTime(record?.approvalTime)}</div>
							</div>

							<div className='info-item'>
								<div className='info-label'>{intl.formatMessage({ id: 'activity.cardnote.approver' })}</div>
								<div className='info-value'>{record?.studentDeclarationApproverName ?? '--'}</div>
							</div>
						</>
					)}

					{isRejected && (
						<>
							<div className='info-item'>
								<div className='info-label'>{intl.formatMessage({ id: 'activity.cardnote.submissionTime' })}</div>
								<div className='info-value'>{formatTime(record?.submittedAt)}</div>
							</div>

							<div className='info-item'>
								<div className='info-label'>{intl.formatMessage({ id: 'activity.cardnote.reviewTime' })}</div>
								<div className='info-value'>{formatTime(record?.approvalTime)}</div>
							</div>

							<div className='info-item'>
								<div className='info-label'>{intl.formatMessage({ id: 'activity.cardnote.approver' })}</div>
								<div className='info-value'>{record?.studentDeclarationApproverName ?? '--'}</div>
							</div>

							<div className='info-item'>
								<div className='info-label'>{intl.formatMessage({ id: 'activity.cardnote.rejectNote' })}</div>
								<div className='info-value'>{record?.activityRejectionNote ?? '--'}</div>
							</div>
						</>
					)}

					{isChangesRequired && (
						<>
							<div className='info-item'>
								<div className='info-label'>{intl.formatMessage({ id: 'activity.cardnote.submissionTime' })}</div>
								<div className='info-value'>{formatTime(record?.submittedAt)}</div>
							</div>

							<div className='info-item'>
								<div className='info-label'>{intl.formatMessage({ id: 'activity.cardnote.deadline' })}</div>
								<div className='info-value'>{formatTime(record?.dueDate)}</div>
							</div>

							<div className='info-item'>
								<div className='info-label'>{intl.formatMessage({ id: 'activity.cardnote.reviewTime' })}</div>
								<div className='info-value'>{formatTime(record?.approvalTime)}</div>
							</div>

							<div className='info-item'>
								<div className='info-label'>{intl.formatMessage({ id: 'activity.cardnote.approver' })}</div>
								<div className='info-value'>{record?.studentDeclarationApproverName ?? '--'}</div>
							</div>

							<div className='info-item'>
								<div className='info-label'>{intl.formatMessage({ id: 'activity.cardnote.revisionNote' })}</div>
								<div className='info-value'>{record?.revisionNote ?? '--'}</div>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default CardNoteActivity;
