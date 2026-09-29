import {
	EStatusMyCCT,
	mapColorStatusMyCCT,
	mapColorTextStatusMyCCT,
	mapNameStatusMyCCT,
} from '@/services/CCT/constant';
import dayjs from 'dayjs';
import './CardNote.less';

const formatTime = (time?: string | Date) => (time ? dayjs(time).format('HH:mm DD/MM/YYYY') : '--');

const CardNoteMyCCT = (props: { myCCT: MyCCT.IRecord }) => {
	const { myCCT } = props;
	const status = myCCT?.status as EStatusMyCCT;
	const isApproved = status === EStatusMyCCT.APPROVED;
	const isChangesRequired = status === EStatusMyCCT.CHANGES_REQUIRED;

	return (
		<div className='mycct-note'>
			<span
				className='mycct-note__status'
				style={{
					background: mapColorStatusMyCCT[status],
					color: mapColorTextStatusMyCCT[status],
				}}
			>
				{mapNameStatusMyCCT[status]}
			</span>

			{status !== EStatusMyCCT.DRAFT && (
				<div className='mycct-note__fields'>
					<div className='mycct-note__item'>
						<div className='mycct-note__label'>Submission Time</div>
						<div className='mycct-note__value'>{formatTime(myCCT?.submittedAt)}</div>
					</div>
					{(isChangesRequired || isApproved) && (
						<div className='mycct-note__item'>
							<div className='mycct-note__label'>Review Time</div>
							<div className='mycct-note__value'>{formatTime(myCCT?.approvedAt)}</div>
						</div>
					)}
					{isApproved && (
						<div className='mycct-note__item'>
							<div className='mycct-note__label'>Approver</div>
							<div className='mycct-note__value'>
								{[myCCT?.approvedByUsername, myCCT?.approvedByName].filter(Boolean).join(' - ') || '--'}
							</div>
						</div>
					)}
					{isChangesRequired && (
						<div className='mycct-note__item mycct-note__item--wide'>
							<div className='mycct-note__label'>Revision Note</div>
							<div className='mycct-note__value'>{myCCT?.revisionNote ?? '--'}</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default CardNoteMyCCT;
