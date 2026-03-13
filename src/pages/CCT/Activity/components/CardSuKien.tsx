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
import { ClockCircleOutlined, EnvironmentOutlined, HourglassOutlined, UserOutlined } from '@ant-design/icons';
import { Card, Flex, Image, Space, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import { JSX } from 'react';
import { useModel } from 'umi';

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
}) => {
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
			return <div className={`text-danger ${!isDetail ? 'one-line' : ''}`}>Registration is no longer valid</div>;
		}

		if (isExpiringSoon && !record?.activityOutcome?.workflow) {
			return <span className={`text-warning ${!isDetail ? 'one-line' : ''}`}>Remaining time: {remainingText}</span>;
		}

		if (activeKey !== '1' && !!record?.activityOutcome?.workflow && !isDetail) {
			return (
				<span className={`${editableWorkflow ? 'text-danger' : ''} ${!isDetail ? 'one-line' : ''}`}>
					Evidence update before {endDateUpdateEvidence ? endDateUpdateEvidence.format('HH:mm DD/MM/YYYY') : '--'}
				</span>
			);
		}

		return (
			<span className={`${!isDetail ? 'one-line' : ''}`}>
				Register before {endDateRegi && endDateRegi.format('HH:mm DD/MM/YYYY')}
			</span>
		);
	})();

	return (
		<Card
			hoverable={!!onClick}
			className={`activity-card ${outTime ? 'activity-disabled' : ''} ${isExpiringSoon && !record?.activityOutcome?.workflow && !isDetail ? 'activity-expiring' : ''}`}
			cover={
				<div className='activity-cover'>
					{isDetail ? (
						<Image src={banner ?? '/images/cct/background.png'} alt={name} className='activity-image' />
					) : (
						<img src={banner ?? '/images/cct/background.png'} alt={name} className='activity-image' />
					)}

					{activeKey === '1' && isNew && !isRegister && <div className='new'>New</div>}
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

						<Space wrap size={'small'}>
							{isExpired ? (
								<Tag
									color={officialColors.official500}
									style={{
										color: officialColors.official300,
										fontWeight: 600,
									}}
								>
									Expired
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
						<ClockCircleOutlined className='icon-light' />
						<span className={`${!isDetail ? 'one-line' : ''}`}>
							<span className='text-semibold'>{startDate} </span> to <span className='text-semibold'>{endDate} </span>
						</span>
					</Space>

					{isPersonal ? (
						isDetail ? (
							<Space size='small'>
								<EnvironmentOutlined className='icon-light' />
								<span className={`${!isDetail ? 'one-line' : ''}`}>
									{[record?.activityOutcome?.organizer, record?.activityOutcome?.location].filter(Boolean).join(', ') ||
										'--'}
								</span>
							</Space>
						) : (
							<Space size='small'>
								<UserOutlined className='icon-light' />
								<span className={`${!isDetail ? 'one-line' : ''}`}>
									Approver: {record?.activityOutcome?.studentDeclarationApproverName}
								</span>
							</Space>
						)
					) : (
						<>
							<Space size='small'>
								{showLocation ? (
									<>
										<EnvironmentOutlined className='icon-light' />
										<span className={`${!isDetail ? 'one-line' : ''}`}>
											{record?.onCampus ? record?.facilityName : record?.otherAddress}
										</span>
									</>
								) : (
									<>
										<UserOutlined className='icon-light' />
										<span className={`${!isDetail ? 'one-line' : ''}`}>
											Approver:{' '}
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
								<HourglassOutlined className='icon-light' />
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
