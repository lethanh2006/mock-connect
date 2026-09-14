import PageCard from '@/components/PageCard';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import SelectNamHoc from '@/pages/DaoTao/NamHoc/Select';
import {
	ADVISING_BOOKING_STATUS_LABEL_KEY,
	ADVISING_MODE_LABEL_KEY,
	ADVISING_TYPE_LABEL_KEY,
	AdvisingBookingStatus,
	AdvisingMode,
} from '@/services/TuVan/constant';
import type { TuVan } from '@/services/TuVan/typing';
import dayjs from '@/utils/dayjs';
import { formatDate, formatDateTime, formatTimeRange } from '@/utils/formatDate';
import { CloseCircleOutlined, EditOutlined, EyeOutlined, FileDoneOutlined } from '@ant-design/icons';
import { Tag, Tooltip, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import { ADVISING_MODE_TAG_COLOR, BOOKING_STATUS_TAG_COLOR } from '../tagColors';
import BookingFormContent from './components/BookingFormContent';
import BookingStatisticsCards from './components/BookingStatisticsCards';
import CancelBookingModal from './components/CancelBookingModal';
import RecordResultModal from './components/RecordResultModal';
import './index.less';

const getRecordResultDisabledReasonKey = (rec: TuVan.IBooking): string | undefined => {
	if (rec.resultRecordedAt) return 'tuvan.tooltip.resultAlreadyRecordedHint';
	if (rec.status !== AdvisingBookingStatus.CONFIRMED) return 'tuvan.tooltip.resultNotConfirmedHint';
	return undefined;
};

const getEditBookingDisabledReasonKey = (rec: TuVan.IBooking): string | undefined => {
	if (rec.status !== AdvisingBookingStatus.CONFIRMED) return 'tuvan.tooltip.editBookingDisabledHint';
	return undefined;
};

const getCancelBookingDisabledReasonKey = (rec: TuVan.IBooking): string | undefined => {
	if (rec.status !== AdvisingBookingStatus.CONFIRMED) return 'tuvan.tooltip.cancelBookingDisabledHint';
	return undefined;
};

const isOverdueUnresolved = (rec: TuVan.IBooking): boolean =>
	rec.status === AdvisingBookingStatus.CONFIRMED && dayjs().isAfter(dayjs(rec.endAt));

const IdpTuVanYeuCauPage = () => {
	const intl = useIntl();
	const { record, edit, isView, handleView, handleEdit, getMyListModel, getBookingStatsModel, maNamHoc, setMaNamHoc } =
		useModel('tuvan.yeucau');
	const [resultTarget, setResultTarget] = useState<TuVan.IBooking>();
	const [cancelTarget, setCancelTarget] = useState<TuVan.IBooking>();

	useEffect(() => {
		getBookingStatsModel();
	}, [maNamHoc]);

	const columns: IColumn<TuVan.IBooking>[] = [
		{
			title: intl.formatMessage({ id: 'tuvan.column.studentCode' }),
			dataIndex: 'studentCode',
			width: 130,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'tuvan.column.studentName' }),
			dataIndex: 'studentName',
			width: 200,
			filterType: 'string',
			render: (val: string) => <Typography.Text strong>{val}</Typography.Text>,
		},
		{
			title: intl.formatMessage({ id: 'tuvan.column.studentEmail' }),
			dataIndex: 'studentEmail',
			width: 200,
			filterType: 'string',
			render: (val?: string) => val || '—',
		},
		{
			title: intl.formatMessage({ id: 'tuvan.column.studentPhone' }),
			dataIndex: 'studentPhone',
			width: 140,
			filterType: 'string',
			render: (val?: string) => val || '—',
		},
		{
			title: intl.formatMessage({ id: 'tuvan.column.studentAddress' }),
			dataIndex: 'studentAddress',
			width: 220,
			render: (val?: string) =>
				val ? (
					<Typography.Paragraph ellipsis={{ rows: 1, tooltip: val }} style={{ marginBottom: 0 }}>
						{val}
					</Typography.Paragraph>
				) : (
					'—'
				),
		},
		{
			title: intl.formatMessage({ id: 'tuvan.column.date' }),
			width: 200,
			render: (_: any, rec: TuVan.IBooking) =>
				dayjs(rec.startAt).isSame(rec.endAt, 'day')
					? `${formatDate(rec.startAt)} (${formatTimeRange(rec.startAt, rec.endAt)})`
					: `${formatDateTime(rec.startAt)} - ${formatDateTime(rec.endAt)}`,
		},
		{
			title: intl.formatMessage({ id: 'tuvan.column.mode' }),
			dataIndex: 'mode',
			width: 110,
			align: 'center',
			filterType: 'select',
			filterData: Object.values(AdvisingMode).map((item) => ({
				value: item,
				label: intl.formatMessage({ id: ADVISING_MODE_LABEL_KEY[item] }),
			})),
			render: (val: AdvisingMode) => (
				<Tag color={ADVISING_MODE_TAG_COLOR[val]}>{intl.formatMessage({ id: ADVISING_MODE_LABEL_KEY[val] })}</Tag>
			),
		},
		{
			title: intl.formatMessage({ id: 'tuvan.detail.advisingType' }),
			dataIndex: 'advisingType',
			width: 150,
			render: (val: TuVan.IBooking['advisingType']) =>
				val ? <Tag>{intl.formatMessage({ id: ADVISING_TYPE_LABEL_KEY[val] })}</Tag> : '—',
		},
		{
			title: intl.formatMessage({ id: 'tuvan.detail.topic' }),
			dataIndex: 'topic',
			width: 260,
			render: (val: string) =>
				val ? (
					<Typography.Paragraph ellipsis={{ rows: 2, tooltip: val }} style={{ marginBottom: 0 }}>
						{val}
					</Typography.Paragraph>
				) : (
					'—'
				),
		},
		{
			title: intl.formatMessage({ id: 'tuvan.column.bookingStatus' }),
			dataIndex: 'status',
			width: 150,
			align: 'center',
			filterType: 'select',
			filterData: Object.values(AdvisingBookingStatus).map((status) => ({
				value: status,
				label: intl.formatMessage({ id: ADVISING_BOOKING_STATUS_LABEL_KEY[status] }),
			})),
			render: (val: AdvisingBookingStatus, rec: TuVan.IBooking) => {
				const tag = (
					<Tag color={BOOKING_STATUS_TAG_COLOR[val]}>
						{intl.formatMessage({ id: ADVISING_BOOKING_STATUS_LABEL_KEY[val] })}
					</Tag>
				);
				return isOverdueUnresolved(rec) ? (
					<Tooltip title={intl.formatMessage({ id: 'tuvan.tooltip.overdueUnresolved' })}>{tag}</Tooltip>
				) : (
					tag
				);
			},
		},
		{
			title: intl.formatMessage({ id: 'tuvan.column.createdAt' }),
			dataIndex: 'createdAt',
			width: 160,
			sortable: true,
			render: (val: string) => (val ? formatDateTime(val) : '—'),
		},
		{
			title: intl.formatMessage({ id: 'tuvan.column.action' }),
			width: 230,
			align: 'center',
			fixed: 'right',
			render: (_: any, rec: TuVan.IBooking) => {
				const recordResultDisabledReasonKey = getRecordResultDisabledReasonKey(rec);
				const editDisabledReasonKey = getEditBookingDisabledReasonKey(rec);
				const cancelDisabledReasonKey = getCancelBookingDisabledReasonKey(rec);
				return (
					<>
						<ButtonExtend
							tooltip={intl.formatMessage({ id: 'tuvan.tooltip.viewDetail' })}
							icon={<EyeOutlined />}
							type='link'
							onClick={() => handleView(rec)}
						/>
						<ButtonExtend
							tooltip={intl.formatMessage({ id: editDisabledReasonKey ?? 'tuvan.tooltip.editBooking' })}
							icon={<EditOutlined />}
							type='link'
							onClick={() => handleEdit(rec)}
							disabled={!!editDisabledReasonKey}
						/>
						<ButtonExtend
							tooltip={intl.formatMessage({ id: recordResultDisabledReasonKey ?? 'tuvan.tooltip.recordResult' })}
							icon={<FileDoneOutlined />}
							type='link'
							onClick={() => setResultTarget(rec)}
							disabled={!!recordResultDisabledReasonKey}
						/>
						<ButtonExtend
							tooltip={intl.formatMessage({ id: cancelDisabledReasonKey ?? 'tuvan.tooltip.cancelBooking' })}
							icon={<CloseCircleOutlined />}
							type='link'
							danger
							onClick={() => setCancelTarget(rec)}
							disabled={!!cancelDisabledReasonKey}
						/>
					</>
				);
			},
		},
	];

	const modalTitle = isView
		? intl.formatMessage(
				{ id: 'tuvan.yeucau.modalTitle' },
				{ name: record?.studentName ?? '', code: record?.studentCode ?? '' },
			)
		: edit
			? intl.formatMessage(
					{ id: 'tuvan.yeucau.form.editTitle' },
					{ name: record?.studentName ?? '', code: record?.studentCode ?? '' },
				)
			: intl.formatMessage({ id: 'tuvan.yeucau.form.createTitle' });

	return (
		<PageCard title={intl.formatMessage({ id: 'tuvan.yeucau.title' })}>
			<BookingStatisticsCards />

			<TableBase<TuVan.IBooking>
				modelName='tuvan.yeucau'
				columns={columns}
				dependencies={[maNamHoc]}
				getData={() => getMyListModel()}
				hideCard
				Form={BookingFormContent}
				modalTitle={modalTitle}
				widthDrawer={800}
				destroyModal
				buttons={{ create: true, import: false, export: false }}
				otherProps={{
					rowKey: '_id',
					rowClassName: (rec: TuVan.IBooking) => (isOverdueUnresolved(rec) ? 'tuvan-row-overdue' : ''),
				}}
				otherButtons={[
					<SelectNamHoc
						isGetAll
						allowClear
						selectMa
						value={maNamHoc}
						onChange={setMaNamHoc}
						style={{ width: 260 }}
					/>,
				]}
			/>

			<RecordResultModal
				record={resultTarget}
				onCancel={() => setResultTarget(undefined)}
				onSuccess={() => setResultTarget(undefined)}
			/>

			<CancelBookingModal
				record={cancelTarget}
				onCancel={() => setCancelTarget(undefined)}
				onSuccess={() => setCancelTarget(undefined)}
			/>
		</PageCard>
	);
};

export default IdpTuVanYeuCauPage;
