import {
	ADVISING_BOOKING_STATUS_LABEL_KEY,
	ADVISING_CANCELLED_BY_LABEL_KEY,
	ADVISING_MODE_LABEL_KEY,
	ADVISING_TYPE_LABEL_KEY,
	AdvisingBookingStatus,
} from '@/services/TuVan/constant';
import dayjs from '@/utils/dayjs';
import { formatDate, formatDateTime, formatTimeRange } from '@/utils/formatDate';
import { Descriptions, Space, Tag } from 'antd';
import { useIntl, useModel } from 'umi';
import { BOOKING_STATUS_TAG_COLOR } from '../../tagColors';

const BookingDetailContent: React.FC = () => {
	const intl = useIntl();
	const { record } = useModel('tuvan.yeucau');

	if (!record) return null;

	const isCancelled = record.status === AdvisingBookingStatus.CANCELLED;
	const hasResult = !!(record.objective || record.outcome || record.nextStep);

	return (
		<Space direction='vertical' size={16} style={{ display: 'flex' }}>
			<Descriptions bordered size='small' column={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 }}>
				<Descriptions.Item label={intl.formatMessage({ id: 'tuvan.detail.studentName' })}>
					{record.studentName ?? '—'}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'tuvan.detail.studentId' })}>
					{record.studentCode ?? '—'}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'tuvan.column.date' })}>
					{formatDate(record.startAt)}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'tuvan.column.time' })}>
					{dayjs(record.startAt).isSame(record.endAt, 'day')
						? formatTimeRange(record.startAt, record.endAt)
						: `${formatDateTime(record.startAt)} - ${formatDateTime(record.endAt)}`}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'tuvan.column.mode' })}>
					{intl.formatMessage({ id: ADVISING_MODE_LABEL_KEY[record.mode] })}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'tuvan.column.locationOrLink' })}>
					{record.location || '—'}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'tuvan.detail.advisingType' })}>
					{intl.formatMessage({ id: ADVISING_TYPE_LABEL_KEY[record.advisingType] })}
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'tuvan.column.bookingStatus' })}>
					<Tag color={BOOKING_STATUS_TAG_COLOR[record.status]}>
						{intl.formatMessage({ id: ADVISING_BOOKING_STATUS_LABEL_KEY[record.status] })}
					</Tag>
				</Descriptions.Item>
				<Descriptions.Item label={intl.formatMessage({ id: 'tuvan.detail.topic' })} span={2}>
					{record.topic || '—'}
				</Descriptions.Item>
			</Descriptions>

			{isCancelled && (
				<Descriptions bordered size='small' column={1} title={intl.formatMessage({ id: 'tuvan.detail.cancelInfo' })}>
					<Descriptions.Item label={intl.formatMessage({ id: 'tuvan.detail.cancelledBy' })}>
						{record.cancelledBy ? intl.formatMessage({ id: ADVISING_CANCELLED_BY_LABEL_KEY[record.cancelledBy] }) : '—'}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'tuvan.detail.cancelReason' })}>
						{record.cancelReason || '—'}
					</Descriptions.Item>
					<Descriptions.Item label={intl.formatMessage({ id: 'tuvan.detail.cancelledAt' })}>
						{record.cancelledAt ? formatDateTime(record.cancelledAt) : '—'}
					</Descriptions.Item>
				</Descriptions>
			)}

			{hasResult && (
				<Descriptions bordered size='small' column={1} title={intl.formatMessage({ id: 'tuvan.detail.resultInfo' })}>
					{record.objective && (
						<Descriptions.Item label={intl.formatMessage({ id: 'tuvan.detail.objective' })}>
							{record.objective}
						</Descriptions.Item>
					)}
					{record.outcome && (
						<Descriptions.Item label={intl.formatMessage({ id: 'tuvan.detail.outcome' })}>
							{record.outcome}
						</Descriptions.Item>
					)}
					{record.nextStep && (
						<Descriptions.Item label={intl.formatMessage({ id: 'tuvan.detail.nextStep' })}>
							{record.nextStep}
						</Descriptions.Item>
					)}
				</Descriptions>
			)}
		</Space>
	);
};

export default BookingDetailContent;
