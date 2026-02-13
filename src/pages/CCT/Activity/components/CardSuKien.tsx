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
	isCompleted?: boolean;
	isDetail?: boolean;
	isPersonal?: boolean;
}) => {
	const { danhSach: dsAttribute } = useModel('cct.attributes');
	const { record, equivalencyAttributeIds, onClick, button, isCompleted, isDetail, isPersonal } = props;

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
			hoverable={onClick && true}
			className='activity-card'
			cover={
				<div className='activity-cover'>
					{isDetail ? (
						<Image src={record?.banner ?? '/images/cct/background.png'} alt={record?.name} className='activity-image' />
					) : (
						<img src={record?.banner ?? '/images/cct/background.png'} alt={record?.name} className='activity-image' />
					)}
					{isNew && (
						<div style={{ position: 'absolute', top: 0, right: 0 }}>
							<div className='new'>New</div>
						</div>
					)}
				</div>
			}
			onClick={onClick}
			styles={{ body: { padding: 0 } }}
			style={
				isExpiringSoon && remainingText && !isCompleted && !isDetail
					? {
							border: '2px solid #F19500',
						}
					: undefined
			}
		>
			<div className='activity-content-wrapper'>
				<div className='activity-header'>
					<Title level={5} className={`activity-title ${!isDetail ? 'activity-line' : ''}`}>
						{record?.name}
					</Title>
					<Flex justify='space-between' align='center' gap='small' wrap>
						<div className='card-level'>
							{dsAttribute?.map((lv, idx) => (
								<span
									key={idx}
									style={
										equivalencyAttributeIds?.includes(lv?._id)
											? { backgroundColor: '#C72127', color: '#ffffff' }
											: undefined
									}
								>
									{lv?.code}
								</span>
							))}
						</div>
						<Tag color={mapColorApprovalStatus[record?.workflow as EApprovalStatus]}>
							{mapNameApprovalStatus[record?.workflow as EApprovalStatus]}
						</Tag>
					</Flex>
				</div>
				<Space direction='vertical' className='activity-content'>
					<Space size={'small'}>
						<ClockCircleOutlined style={{ color: '#D2D3D5' }} />
						<span style={{ color: '#2E2E2E' }} className={`${!isDetail && 'one-line'}`}>
							<span style={{ fontWeight: 600 }}>
								{record?.startDate && dayjs(record?.startDate).format('HH:mm - DD/MM/YYYY')}
							</span>{' '}
							to{' '}
							<span style={{ fontWeight: 600 }}>
								{record?.endDate && dayjs(record?.endDate).format('HH:mm - DD/MM/YYYY')}
							</span>
						</span>
					</Space>
					{isPersonal ? (
						<>
							<Space size={'small'}>
								<UserOutlined style={{ color: '#D2D3D5' }} />
								<span style={{ color: '#2E2E2E' }} className={`${!isDetail && 'one-line'}`}>
									Approver: {record?.supervisorName}
								</span>
							</Space>
							<Space size={'small'}>
								<HourglassOutlined style={{ color: '#D2D3D5' }} />
								<span style={{ color: '#C72127' }} className={`${!isDetail && 'one-line'}`}>
									Evidence update before {record?.endDate && dayjs(record?.endDate).format('HH:mm DD/MM/YYYY')}
								</span>
							</Space>
						</>
					) : isCompleted ? (
						<>
							<Space size={'small'}>
								<UserOutlined style={{ color: '#D2D3D5' }} />
								<span style={{ color: '#2E2E2E' }} className={`${!isDetail && 'one-line'}`}>
									Approver:
									{record?.studentDeclarationApproverList
										?.map((item) => item?.name)
										.filter(Boolean)
										.join(', ')}
								</span>
							</Space>
							<Space size={'small'}>
								<HourglassOutlined style={{ color: '#D2D3D5' }} />
								<span style={{ color: '#C72127' }} className={`${!isDetail && 'one-line'}`}>
									Evidence update before{' '}
									{record?.allowPostEventResultsUpdate
										? record?.dueDate && dayjs(record?.dueDate).format('HH:mm DD/MM/YYYY')
										: record?.endDate && dayjs(record?.endDate).format('HH:mm DD/MM/YYYY')}
								</span>
							</Space>
						</>
					) : (
						<>
							<Space size={'small'}>
								<EnvironmentOutlined style={{ color: '#D2D3D5' }} />
								<span style={{ color: '#2E2E2E' }} className={`${!isDetail && 'one-line'}`}>
									{record?.onCampus ? record?.facilityName : record?.otherAddress}
								</span>
							</Space>
							<Space size={'small'}>
								<HourglassOutlined style={{ color: '#D2D3D5' }} />

								{isExpiringSoon && remainingText ? (
									<span style={{ color: '#F19500' }} className={!isDetail ? 'one-line' : ''}>
										Remaining time: {remainingText}
									</span>
								) : (
									<span style={{ color: '#2E2E2E' }} className={!isDetail ? 'one-line' : ''}>
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
