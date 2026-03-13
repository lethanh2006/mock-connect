import {
	EApprovalStatus,
	mapColorApprovalStatus,
	mapColorTextApprovalStatus,
	mapNameApprovalStatus,
} from '@/services/CCT/constant';
import { Tag } from 'antd';
import dayjs from 'dayjs';
import { useModel } from 'umi';

const CardNoteActivity = () => {
	const { record } = useModel('cct.activityoutcome');

	return (
		<div className='info-summary-box'>
			<div className='info-summary-status'>
				<Tag
					color={mapColorApprovalStatus[record?.workflow as EApprovalStatus]}
					style={{ color: mapColorTextApprovalStatus[record?.workflow as EApprovalStatus], fontWeight: 600 }}
				>
					{mapNameApprovalStatus[record?.workflow as EApprovalStatus]}
				</Tag>
			</div>

			<div className='custom-info-grid grid-3'>
				<div className='info-row'>
					<div className='info-item'>
						<div className='info-label'>Evidence Update Deadline</div>
						<div className='info-value'>
							{record?.dueDate ? dayjs(record?.dueDate).format('HH:mm DD/MM/YYYY') : '--'}
						</div>
					</div>
					<div className='info-item'>
						<div className='info-label'>Evidence Review Time</div>
						<div className='info-value'>
							{record?.approvalTime && dayjs(record?.approvalTime).format('HH:mm DD/MM/YYYY')}
						</div>
					</div>
					<div className='info-item'>
						<div className='info-label'>Approver</div>
						<div className='info-value'>{record?.studentDeclarationApproverName ?? '--'}</div>
					</div>
					<div className='info-item'>
						<div className='info-label'>Revision Note</div>
						<div className='info-value'>{record?.revisionNote ?? '-'}</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CardNoteActivity;
