import { EApprovalStatus, mapColorApprovalStatus, mapNameApprovalStatus } from '@/services/CCT/constant';
import { Tag } from 'antd';
import { useModel } from 'umi';

const CardNoteActivity = () => {
	const { record } = useModel('cct.activityoutcome');

	return (
		<div className='info-summary-box'>
			<div className='info-summary-status'>
				<Tag color={mapColorApprovalStatus[record?.workflow as EApprovalStatus]}>
					{mapNameApprovalStatus[record?.workflow as EApprovalStatus]}
				</Tag>
			</div>

			<div className='custom-info-grid grid-3'>
				<div className='info-row'>
					<div className='info-item'>
						<div className='info-label'>Evidence Update Deadline</div>
						<div className='info-value'>--</div>
					</div>
					<div className='info-item'>
						<div className='info-label'>Evidence Review Time</div>
						<div className='info-value'>--</div>
					</div>
					<div className='info-item'>
						<div className='info-label'>Approver</div>
						<div className='info-value'>--</div>
					</div>
					<div className='info-item'>
						<div className='info-label'>Revision Note</div>
						<div className='info-value'>--</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CardNoteActivity;
