import { Activity } from '@/services/CCT/Activity/typing';
import { EApprovalStatus, mapColorApprovalStatus, mapNameApprovalStatus } from '@/services/CCT/constant';
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
	isCompleted?: boolean;
	isDetail?: boolean;
	isPersonal?: boolean;
}) => {
	const { danhSach: dsAttribute } = useModel('cct.attributes');
	const { record, equivalencyAttributeIds, onClick, button, isOutOfTime, isCompleted, isDetail, isPersonal } = props;

	const now = dayjs();
	const isNew = record?.startDate && now.isBefore(dayjs(record.startDate).add(3, 'day'));
	const endDate = record?.endDate ? dayjs(record.endDate) : null;

	const isExpiringSoon = endDate && endDate.isAfter(now) && endDate.diff(now, 'day', true) <= 3;

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

	return (
		<Card
			hoverable={!!onClick}
			className={`activity-card ${isOutOfTime ? 'activity-disabled' : ''} ${
				isExpiringSoon && remainingText && !isCompleted && !isDetail ? 'activity-expiring' : ''
			}`}
			cover={
				<div className='activity-cover'>
					{isDetail ? (
						<Image src={record?.banner ?? '/images/cct/background.png'} alt={record?.name} className='activity-image' />
					) : (
						<img src={record?.banner ?? '/images/cct/background.png'} alt={record?.name} className='activity-image' />
					)}

					{isNew && <div className='new'>New</div>}
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
									<span key={idx} className={`level-item ${isActive ? 'active' : ''} ${isOutOfTime ? 'disabled' : ''}`}>
										{lv?.code}
									</span>
								);
							})}
						</div>

						<Tag color={mapColorApprovalStatus[record?.workflow as EApprovalStatus]}>
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
						<Space size='small'>
							<UserOutlined className='icon-light' />
							<span className={`${!isDetail ? 'one-line' : ''}`}>Approver: {record?.supervisorName}</span>
						</Space>
					) : isCompleted ? (
						<>
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

							<Space size='small'>
								<HourglassOutlined className='icon-light' />
								<span className={`text-danger ${!isDetail ? 'one-line' : ''}`}>
									Evidence update before{' '}
									{record?.allowPostEventResultsUpdate
										? record?.dueDate && dayjs(record.dueDate).format('HH:mm DD/MM/YYYY')
										: record?.endDate && dayjs(record.endDate).format('HH:mm DD/MM/YYYY')}
								</span>
							</Space>
						</>
					) : (
						<>
							<Space size='small'>
								<EnvironmentOutlined className='icon-light' />
								<span className={`${!isDetail ? 'one-line' : ''}`}>
									{record?.onCampus ? record?.facilityName : record?.otherAddress}
								</span>
							</Space>

							<Space size='small'>
								<HourglassOutlined className='icon-light' />

								{isOutOfTime ? (
									<div className='text-danger one-line'>Registration is no longer valid</div>
								) : isExpiringSoon && remainingText ? (
									<span className='text-warning one-line'>Remaining time: {remainingText}</span>
								) : (
									<span className='one-line'>Register before {endDate && endDate.format('HH:mm DD/MM/YYYY')}</span>
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
