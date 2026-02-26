import { Activity } from '@/services/CCT/Activity/typing';
import {
	EApprovalStatus,
	mapColorApprovalStatus,
	mapColorTextApprovalStatus,
	mapNameApprovalStatus,
} from '@/services/CCT/constant';
import { ClockCircleOutlined, EnvironmentOutlined, HourglassOutlined, UserOutlined } from '@ant-design/icons';
import { Card, Flex, Image, Space, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import { JSX } from 'react';
import { useModel } from 'umi';

const { Title } = Typography;

const CardSuKienCCT = (props: {
	record: Activity.IRecord;
	equivalencyAttributeIds: string[];
	onClick?: () => void;
	button?: JSX.Element;

	isOutOfTime?: boolean;
	isExpiringSoon?: boolean;

	isDetail?: boolean;
	isPersonal?: boolean;

	activeKey?: string;
}) => {
	const { danhSach: dsAttribute } = useModel('cct.attributes');
	const {
		record,
		equivalencyAttributeIds,
		onClick,
		button,
		isOutOfTime,
		isExpiringSoon,
		isDetail,
		isPersonal,
		activeKey,
	} = props;

	const now = dayjs();
	const isNew = record?.createdAt && now.isBefore(dayjs(record.createdAt).add(3, 'day'));
	const endDate = record?.dueDateRegistration
		? dayjs(record.dueDateRegistration)
		: record?.endDate
			? dayjs(record.endDate)
			: null;

	const endDateUpdateEvidence = record?.allowPostEventResultsUpdate
		? dayjs(record.dueDate)
		: record?.endDate
			? dayjs(record.endDate)
			: null;

	const remainingText = (() => {
		if (!endDate || !endDate.isAfter(now)) return null;

		const days = endDate.diff(now, 'day');
		const hours = endDate.diff(now.add(days, 'day'), 'hour');

		if (days > 0) {
			return `${days} day${days > 1 ? 's' : ''} ${hours} hour${hours > 1 ? 's' : ''}`;
		}

		const remainingHours = endDate.diff(now, 'hour');
		return `${remainingHours} hour${remainingHours > 1 ? 's' : ''}`;
	})();

	const editableWorkflow =
		record?.workflow === EApprovalStatus.DRAFT ||
		record?.workflow === EApprovalStatus.CHANGES_REQUIRED ||
		record?.workflow === EApprovalStatus.EVIDENCE_REQUIRED;

	const outTime = isOutOfTime && activeKey !== '3';

	return (
		<Card
			hoverable={!!onClick}
			className={`activity-card ${outTime ? 'activity-disabled' : ''} ${isExpiringSoon && !record?.workflow ? 'activity-expiring' : ''}`}
			cover={
				<div className='activity-cover'>
					{isDetail ? (
						<Image src={record?.banner ?? '/images/cct/background.png'} alt={record?.name} className='activity-image' />
					) : (
						<img src={record?.banner ?? '/images/cct/background.png'} alt={record?.name} className='activity-image' />
					)}

					{activeKey === '1' && isNew && <div className='new'>New</div>}
				</div>
			}
			onClick={onClick}
			styles={{ body: { padding: 0 } }}
		>
			<div className='activity-content-wrapper'>
				<div className='activity-header'>
					<Title level={5} className={`activity-title ${!isDetail ? 'activity-line' : ''}`}>
						{record?.name}
					</Title>

					<Flex justify='space-between' align='center' gap='small' wrap>
						<div className='card-level'>
							{dsAttribute?.map((lv, idx) => {
								const isActive = equivalencyAttributeIds?.includes(lv?._id);
								return (
									<span key={idx} className={`level-item ${isActive ? 'active' : ''} ${outTime ? 'disabled' : ''}`}>
										{lv?.code}
									</span>
								);
							})}
						</div>

						<Tag
							color={mapColorApprovalStatus[record?.workflow as EApprovalStatus]}
							style={{ color: mapColorTextApprovalStatus[record?.workflow as EApprovalStatus], fontWeight: 600 }}
						>
							{mapNameApprovalStatus[record?.workflow as EApprovalStatus]}
						</Tag>
					</Flex>
				</div>

				<Space direction='vertical' className='activity-content'>
					<Space size='small'>
						<ClockCircleOutlined className='icon-light' />
						<span className={`${!isDetail ? 'one-line' : ''}`}>
							<span className='text-semibold'>
								{record?.startDate && dayjs(record.startDate).format('HH:mm - DD/MM/YYYY')}
							</span>{' '}
							to{' '}
							<span className='text-semibold'>
								{record?.endDate && dayjs(record.endDate).format('HH:mm - DD/MM/YYYY')}
							</span>
						</span>
					</Space>

					{isPersonal ? (
						isDetail ? (
							<Space size='small'>
								<EnvironmentOutlined className='icon-light' />
								<span className={`${!isDetail ? 'one-line' : ''}`}>
									{[record?.organizer, record?.location].filter(Boolean).join(', ') || '--'}
								</span>
							</Space>
						) : (
							<Space size='small'>
								<UserOutlined className='icon-light' />
								<span className={`${!isDetail ? 'one-line' : ''}`}>
									Approver: {record?.studentDeclarationApproverName}
								</span>
							</Space>
						)
					) : (
						<>
							{!record?.workflow || !!isDetail ? (
								<Space size='small'>
									<EnvironmentOutlined className='icon-light' />
									<span className={`${!isDetail ? 'one-line' : ''}`}>
										{record?.onCampus ? record?.facilityName : record?.otherAddress}
									</span>
								</Space>
							) : (
								<Space size='small'>
									<UserOutlined className='icon-light' />
									<span className={`${!isDetail ? 'one-line' : ''}`}>
										Approver:{' '}
										{record?.studentDeclarationApproverList
											?.map((item) => item?.name)
											.filter(Boolean)
											.join(', ')}
									</span>
								</Space>
							)}

							<Space size='small'>
								<HourglassOutlined className='icon-light' />

								{isOutOfTime && !record?.workflow ? (
									<div className={`text-danger ${!isDetail ? 'one-line' : ''}`}>Registration is no longer valid</div>
								) : isExpiringSoon && !record?.workflow ? (
									<span className={`text-warning ${!isDetail ? 'one-line' : ''}`}>Remaining time: {remainingText}</span>
								) : !!record?.workflow && !isDetail ? (
									<span className={`${editableWorkflow ? 'text-danger' : ''} ${!isDetail ? 'one-line' : ''}`}>
										Evidence update before {endDateUpdateEvidence && endDateUpdateEvidence.format('HH:mm DD/MM/YYYY')}
									</span>
								) : (
									<span className={`${!isDetail ? 'one-line' : ''}`}>
										Register before {endDate && endDate.format('HH:mm DD/MM/YYYY')}
									</span>
								)}
							</Space>
						</>
					)}
				</Space>
			</div>
			{button && (
				<div className='activity-footer' onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
					{button}
				</div>
			)}
		</Card>
	);
};

export default CardSuKienCCT;
