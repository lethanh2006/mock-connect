import { IdpStatus, type IdpReviewStatus } from '@/services/IdpCoVan/constant';
import { Button } from 'antd';
import { useState } from 'react';
import { useIntl } from 'umi';
import IdpReviewModal from './IdpReviewModal';

type IdpReviewActionsProps = {
	id: string;
	studentName?: string;
	onSuccess?: () => void;
};

const IdpReviewActions: React.FC<IdpReviewActionsProps> = ({ id, studentName, onSuccess }) => {
	const intl = useIntl();
	const [status, setStatus] = useState<IdpReviewStatus>();

	return (
		<>
			<div className='form-footer'>
				<Button type='primary' className='btn-success' onClick={() => setStatus(IdpStatus.APPROVED)}>
					{intl.formatMessage({ id: 'idpcovan.review.button.APPROVED' })}
				</Button>
				<Button type='primary' className='btn-warning' onClick={() => setStatus(IdpStatus.REVISION_REQUESTED)}>
					{intl.formatMessage({ id: 'idpcovan.review.button.REVISION_REQUESTED' })}
				</Button>
				<Button type='primary' danger onClick={() => setStatus(IdpStatus.REJECTED)}>
					{intl.formatMessage({ id: 'idpcovan.review.button.REJECTED' })}
				</Button>
			</div>

			<IdpReviewModal
				status={status}
				id={id}
				studentName={studentName}
				onCancel={() => setStatus(undefined)}
				onSuccess={() => {
					setStatus(undefined);
					onSuccess?.();
				}}
			/>
		</>
	);
};

export default IdpReviewActions;
