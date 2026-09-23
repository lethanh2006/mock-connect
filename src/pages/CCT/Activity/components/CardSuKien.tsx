import background from '@/assets/cct/background.png';
import { IconHourglass, IconHuman, IconPinLocation, IconStopwatch } from '@/components/Icons';
import AuthImage from '@/components/Image/AuthImage';
import { officialColors } from '@/services/base/constant';
import { Activity } from '@/services/CCT/Activity/typing';
import {
	EApprovalStatus,
	Evalidation,
	mapColorApprovalStatus,
	mapColorTextApprovalStatus,
	mapEvalidation,
	mapNameApprovalStatus,
} from '@/services/CCT/constant';
import { Card, Flex, Space, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import { JSX } from 'react';
import { useIntl, useModel } from 'umi';

const { Title } = Typography;

const CardSuKienCCT = (props: {
	record: Activity.IRecord;
	banner: string | undefined;
	name: string;
	equivalencyAttributeIds: string[];
	startDate: string;
	endDate: string;

	onClick?: () => void;
	button?: JSX.Element;

	outTimeRegis?: boolean;

	isDetail?: boolean;
	isPersonal?: boolean;
	isRegister?: boolean;

	activeKey?: string;

	isExpired?: boolean;
	isAward?: boolean;
}) => {
	const intl = useIntl();
	const { danhSach: dsAttribute } = useModel('cct.attributes');
	const {
		record,
		banner,
		name,
		startDate,
		endDate,
		equivalencyAttributeIds,
		onClick,
		button,
		outTimeRegis,
		isDetail,
		isPersonal,
		activeKey,
		isExpired,
		isRegister,
		isAward,
	} = props;

	const now = dayjs();
	const isNew = record?.createdAt && now.isBefore(dayjs(record.createdAt).add(3, 'day'));
	const endDateSource = record?.dueDateRegistration ?? record?.endDate;
	const endDateRegi = record?.dueDateRegistration
		? dayjs(record.dueDateRegistration)
		: record?.endDate
			? dayjs(record.endDate)
			: null;

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

	const remainingText = (() => {
		if (!endDateRegi || !endDateRegi.isAfter(now)) return null;

		const days = endDateRegi.diff(now, 'day');
		const hours = endDateRegi.diff(now.add(days, 'day'), 'hour');

		if (days > 0) {
			return `${days} day${days > 1 ? 's' : ''} ${hours} hour${hours > 1 ? 's' : ''}`;
		}

		const remainingHours = endDateRegi.diff(now, 'hour');
		return `${remainingHours} hour${remainingHours > 1 ? 's' : ''}`;
	})();

	const editableWorkflow =
		record?.activityOutcome?.workflow === EApprovalStatus.DRAFT ||
		record?.activityOutcome?.workflow === EApprovalStatus.CHANGES_REQUIRED ||
		record?.activityOutcome?.workflow === EApprovalStatus.EVIDENCE_REQUIRED;

	const approvalWorkflow =
		record?.activityOutcome?.workflow === EApprovalStatus.APPROVED ||
		record?.activityOutcome?.workflow === EApprovalStatus.REJECTED ||
		record?.activityOutcome?.workflow === EApprovalStatus.CHANGES_REQUIRED;

	const outTime = outTimeRegis && !record?.activityOutcome?.workflow;

	const showLocation = !record?.activityOutcome?.workflow || isDetail || activeKey === '1';

	const isExpiringSoon =
		dayjs(endDateSource) && dayjs(endDateSource).isAfter(now) && dayjs(endDateSource).diff(now, 'day', true) <= 3;

	const timeContent = (() => {
		if (outTime && !isDetail && activeKey !== '3') {
			return (
				<div className={`text-danger ${!isDetail ? 'one-line' : ''}`}>
					{intl.formatMessage({ id: 'activity.card.quahan' })}
				</div>
			);
		}

		if (isExpiringSoon && !record?.activityOutcome?.workflow) {
			return (
				<span className={`text-warning ${!isDetail ? 'one-line' : ''}`}>
					{intl.formatMessage({ id: 'activity.card.remain' })}: {remainingText}
				</span>
			);
		}

		if (activeKey !== '1' && !!record?.activityOutcome?.workflow && !isDetail) {
			return (
				<span className={`${editableWorkflow ? 'text-danger' : ''} ${!isDetail ? 'one-line' : ''}`}>
					{intl.formatMessage({ id: 'activity.card.update' })}{' '}
					{endDateUpdateEvidence ? endDateUpdateEvidence.format('HH:mm DD/MM/YYYY') : '--'}
				</span>
			);
		}

		return (
			<span className={`${!isDetail ? 'one-line' : ''}`}>
				{intl.formatMessage({ id: 'activity.card.dangky' })} {endDateRegi && endDateRegi.format('HH:mm DD/MM/YYYY')}
			</span>
		);
	})();

	return (
		<Card
			// hoverable={!!onClick}
			style={onClick ? { cursor: 'pointer' } : undefined}
			className={`activity-card ${outTime ? 'activity-disabled' : ''} ${isExpiringSoon && !record?.activityOutcome?.workflow && !isDetail ? 'activity-expiring' : ''}`}
			cover={
				<div className='activity-cover'>
					<AuthImage
						src={banner ?? background}
						fallback={background}
						alt={name}
						className='activity-image'
						isDetail={isDetail}
					/>

					{activeKey === '1' && isNew && !isRegister && (
						<div className='new'>{intl.formatMessage({ id: 'activity.card.new' })}</div>
					)}
				</div>
			}
			onClick={onClick}
			styles={{ body: { padding: 0 } }}
		>
			<div className='activity-content-wrapper'>
				<div className='activity-header'>
					<Title level={5} className={`activity-title ${!isDetail ? 'activity-line' : ''}`}>
						{name}
					</Title>

					<Flex justify='space-between' align='center' gap='small' wrap>
						{isAward ? (
							<Tag
								color={officialColors.official300}
								style={{
									color: officialColors.official500,
									fontWeight: 600,
								}}
							>
								Award
							</Tag>
						) : (
							<div className='card-level'>
								{dsAttribute?.map((lv, idx) => {
									const isActive = equivalencyAttributeIds?.includes(lv?._id);
									return (
										<span key={idx} className={`level-item ${isActive ? 'active' : ''} ${outTime ? 'disabled' : ''}`}>
											{lv?.code?.charAt(0)}
										</span>
									);
								})}
							</div>
						)}

						<Space wrap size={'small'}>
							{isExpired ? (
								<Tag
									color={officialColors.official500}
									style={{
										color: officialColors.official300,
										fontWeight: 600,
									}}
								>
									{intl.formatMessage({ id: 'activity.card.hethan' })}
								</Tag>
							) : activeKey !== '1' ? (
								<>
									<Tag
										color={mapColorApprovalStatus[record?.activityOutcome?.workflow as EApprovalStatus]}
										style={{
											color: mapColorTextApprovalStatus[record?.activityOutcome?.workflow as EApprovalStatus],
											fontWeight: 600,
										}}
									>
										{mapNameApprovalStatus[record?.activityOutcome?.workflow as EApprovalStatus]}
									</Tag>
									{record?.activityOutcome?.workflow === EApprovalStatus.APPROVED && (
										<Tag color={mapEvalidation[record?.activityOutcome?.validation as Evalidation]}>
											{record?.activityOutcome?.validation}
										</Tag>
									)}
								</>
							) : null}
						</Space>
					</Flex>
				</div>

				<Space direction='vertical' className='activity-content'>
					<Space size='small'>
						<IconStopwatch className='icon-light' />
						<span className={`${!isDetail ? 'one-line' : ''}`}>
							<span className='text-semibold'>{startDate} </span> {intl.formatMessage({ id: 'activity.card.to' })}{' '}
							<span className='text-semibold'>{endDate} </span>
						</span>
					</Space>

					{isPersonal ? (
						isDetail ? (
							<Space size='small'>
								<IconPinLocation className='icon-light' />
								<span className={`${!isDetail ? 'one-line' : ''}`}>
									{[record?.activityOutcome?.organizer, record?.activityOutcome?.location].filter(Boolean).join(', ') ||
										'--'}
								</span>
							</Space>
						) : (
							<Space size='small'>
								<IconHuman className='icon-light' />
								<span className={`${!isDetail ? 'one-line' : ''}`}>
									{intl.formatMessage({ id: 'activity.card.approver' })}:{' '}
									{record?.activityOutcome?.studentDeclarationApproverName}
								</span>
							</Space>
						)
					) : (
						<>
							<Space size='small'>
								{showLocation ? (
									<>
										<IconPinLocation className='icon-light' />
										<span className={`${!isDetail ? 'one-line' : ''}`}>
											{record?.onCampus ? record?.facilityName : record?.otherAddress}
										</span>
									</>
								) : (
									<>
										<IconHuman className='icon-light' />
										<span className={`${!isDetail ? 'one-line' : ''}`}>
											{intl.formatMessage({ id: 'activity.card.approver' })}:{' '}
											{record?.activityOutcome?.workflow === EApprovalStatus.APPROVED &&
											!record?.activityOutcome?.studentDeclarationApproverName
												? 'System'
												: approvalWorkflow
													? record?.activityOutcome?.studentDeclarationApproverName
													: record?.studentDeclarationApproverList
															?.map((item) => item?.name)
															.filter(Boolean)
															.join(', ')}
										</span>
									</>
								)}
							</Space>

							<Space size='small'>
								<IconHourglass className='icon-light' />
								{timeContent}
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
