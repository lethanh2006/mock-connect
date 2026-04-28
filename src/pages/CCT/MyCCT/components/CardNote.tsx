import {
	EStatusMyCCT,
	mapColorStatusMyCCT,
	mapColorTextStatusMyCCT,
	mapNameStatusMyCCT,
} from '@/services/CCT/constant';
import { Tag } from 'antd';
import dayjs from 'dayjs';
import '../../Activity/style.less';

const CardNoteMyCCT = (props: { myCCT: MyCCT.IRecord }) => {
	const { myCCT } = props;

	return (
		<div className='info-summary-box'>
			<div className='info-summary-status'>
				<Tag
					color={mapColorStatusMyCCT[myCCT?.status as EStatusMyCCT]}
					style={{ color: mapColorTextStatusMyCCT[myCCT?.status as EStatusMyCCT], fontWeight: 600 }}
				>
					{mapNameStatusMyCCT[myCCT?.status as EStatusMyCCT]}
				</Tag>
			</div>

			{myCCT?.status !== EStatusMyCCT.DRAFT && (
				<div className='custom-info-grid grid-3'>
					<div className='info-row'>
						<div className='info-item'>
							<div className='info-label'>Submission Time</div>
							<div className='info-value'>
								{myCCT?.submittedAt && dayjs(myCCT?.submittedAt).format('HH:mm DD/MM/YYYY')}
							</div>
						</div>
						{(myCCT?.status === EStatusMyCCT.CHANGES_REQUIRED || myCCT?.status === EStatusMyCCT.APPROVED) && (
							<div className='info-item'>
								<div className='info-label'>Review Time</div>
								<div className='info-value'>
									{myCCT?.approvedAt && dayjs(myCCT?.approvedAt).format('HH:mm DD/MM/YYYY')}
								</div>
							</div>
						)}
						{myCCT?.status === EStatusMyCCT.APPROVED && (
							<div className='info-item'>
								<div className='info-label'>Approver</div>
								<div className='info-value'>
									{[myCCT?.approvedByUsername, myCCT?.approvedByName].filter(Boolean).join(' - ')}
								</div>
							</div>
						)}
						{myCCT?.status === EStatusMyCCT.CHANGES_REQUIRED && (
							<div className='info-item'>
								<div className='info-label'>Revision Note</div>
								<div className='info-value'>{myCCT?.revisionNote ?? '-'}</div>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default CardNoteMyCCT;
