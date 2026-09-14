import ExpandText from '@/components/ExpandText';
import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import SelectNamHoc from '@/pages/DaoTao/NamHoc/Select';
import {
	ADVISING_BOOKING_STATUS_LABEL_KEY,
	ADVISING_MODE_LABEL_KEY,
	ADVISING_TYPE_LABEL_KEY,
	AdvisingBookingStatus,
	AdvisingMode,
} from '@/services/Advising/constant';
import { Advising } from '@/services/Advising/typing';
import { formatDate, formatDateTime, formatDateTimeRange } from '@/utils/formatDate';
import { EyeOutlined, InfoCircleOutlined, ProfileOutlined } from '@ant-design/icons';
import { Button, Descriptions, Modal, Popover, Space, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import { ADVISING_BOOKING_STATUS_TAG_COLOR } from '../advisingTagColor';
import BookSessionPanel from './BookSessionPanel';

const MyBookingsPanel = () => {
	const intl = useIntl();
	const { getAllModel, danhSach, loading } = useModel('advising.advising');
	const { danhSach: danhSachNamHoc } = useModel('daotao.namhoc');
	const [namHocId, setNamHocId] = useState<string>();
	const [resultBooking, setResultBooking] = useState<Advising.IBooking>();
	const [detailBooking, setDetailBooking] = useState<Advising.IBooking>();
	const [bookModalOpen, setBookModalOpen] = useState(false);

	const maNamHoc = danhSachNamHoc.find((item) => item?._id === namHocId)?.ma;
	// TableStaticData chỉ nhận dữ liệu sẵn có, không tự gọi API như TableBase — panel tự nạp lấy.
	const fetchList = () => {
		getAllModel(false, undefined, { maNam: maNamHoc }, undefined, 'bookings/me').catch(() => {});
	};

	useEffect(() => {
		fetchList();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [maNamHoc]);

	const hasResult = (rec: Advising.IBooking) => !!(rec.objective || rec.outcome || rec.nextStep);

	/** Buổi vắng mặt cũng được cố vấn ghi nhận kết quả, nên NO_SHOW xem kết quả như COMPLETED. */
	const canViewResult = (rec: Advising.IBooking) =>
		(rec.status === AdvisingBookingStatus.COMPLETED || rec.status === AdvisingBookingStatus.NO_SHOW) &&
		hasResult(rec);

	/** Thông tin xử lý của cố vấn/hệ thống — chỉ là chú thích cho trạng thái nên gom vào popover, không bày ra cột. */
	const statusDetailRows = (rec: Advising.IBooking): { label: string; value: string }[] =>
		[
			rec.cancelledBy && {
				label: intl.formatMessage({ id: 'advisorAppointment.cancelledByLabel' }),
				// Hiển thị nguyên giá trị BE trả về, không map qua bảng nhãn.
				value: rec.cancelledBy,
			},
			rec.cancelReason && {
				label: intl.formatMessage({ id: 'advisorAppointment.cancelReason' }),
				value: rec.cancelReason,
			},
			rec.cancelledAt && {
				label: intl.formatMessage({ id: 'advisorAppointment.cancelledAt' }),
				value: formatDateTime(rec.cancelledAt),
			},
			rec.resultRecordedByName && {
				label: intl.formatMessage({ id: 'advisorAppointment.result.recordedByLabel' }),
				value: rec.resultRecordedByName,
			},
			rec.resultRecordedAt && {
				label: intl.formatMessage({ id: 'advisorAppointment.result.recordedAtLabel' }),
				value: formatDateTime(rec.resultRecordedAt),
			},
		].filter(Boolean) as { label: string; value: string }[];

	const columns: IColumn<Advising.IBooking>[] = [
		{
			title: intl.formatMessage({ id: 'advisorAppointment.column.time' }),
			dataIndex: 'startAt',
			width: 180,
			render: (val: string, rec: Advising.IBooking) => (
				<span>
					{formatDateTimeRange(val, rec.endAt)}
				</span>
			),
		},
		{
			title: intl.formatMessage({ id: 'advisorAppointment.column.advisor' }),
			dataIndex: 'advisorName',
			width: 200,
		},
		{
			title: intl.formatMessage({ id: 'advisorAppointment.column.advisingType' }),
			dataIndex: 'advisingType',
			width: 140,
			render: (val: Advising.IBooking['advisingType']) => intl.formatMessage({ id: ADVISING_TYPE_LABEL_KEY[val] }),
		},
		{
			title: intl.formatMessage({ id: 'advisorAppointment.column.mode' }),
			dataIndex: 'mode',
			width: 220,
			render: (val: Advising.IBooking['mode'], rec: Advising.IBooking) => (
				<Space direction='vertical' size={2}>
					<span>{intl.formatMessage({ id: ADVISING_MODE_LABEL_KEY[val] })}</span>
					{rec.location && (
						<Typography.Text type='secondary' style={{ fontSize: 12 }}>
							{rec.location}
						</Typography.Text>
					)}
				</Space>
			),
		},
		{
			title: intl.formatMessage({ id: 'advisorAppointment.column.topic' }),
			dataIndex: 'topic',
			width: 320,
			render: (val: string) => <ExpandText ellipsis={{ rows: 2 }}>{val}</ExpandText>,
		},
		{
			title: intl.formatMessage({ id: 'advisorAppointment.column.status' }),
			dataIndex: 'status',
			width: 160,
			render: (val: AdvisingBookingStatus, rec: Advising.IBooking) => {
				const detailRows = statusDetailRows(rec);

				return (
					<Space size={4}>
						<Tag color={ADVISING_BOOKING_STATUS_TAG_COLOR[val]} style={{ marginInlineEnd: 0 }}>
							{intl.formatMessage({ id: ADVISING_BOOKING_STATUS_LABEL_KEY[val] })}
						</Tag>
						{detailRows.length > 0 && (
							<Popover
								trigger='hover'
								placement='top'
								content={
									<div style={{ minWidth: 260, maxWidth: 320 }}>
										{detailRows.map((row) => (
											<div key={row.label} style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
												<b>{row.label}:</b> {row.value}
											</div>
										))}
									</div>
								}
							>
								<Button type='text' size='small' icon={<InfoCircleOutlined />} style={{ paddingInline: 4 }} />
							</Popover>
						)}
					</Space>
				);
			},
		},
		{
			title: intl.formatMessage({ id: 'advisorAppointment.column.action' }),
			width: 120,
			align: 'center',
			fixed: 'right',
			render: (_: any, rec: Advising.IBooking) => (
				<>
					<ButtonExtend
						tooltip={intl.formatMessage({ id: 'advisorAppointment.tooltip.viewDetail' })}
						icon={<ProfileOutlined />}
						type='link'
						onClick={(e) => {
							e.stopPropagation();
							setDetailBooking(rec);
						}}
					/>
					<ButtonExtend
						tooltip={intl.formatMessage({ id: 'advisorAppointment.tooltip.viewResult' })}
						icon={<EyeOutlined />}
						type='link'
						disabled={!canViewResult(rec)}
						onClick={(e) => {
							e.stopPropagation();
							setResultBooking(rec);
						}}
					/>
				</>
			),
		},
	];

	return (
		<>
			<TableStaticData
				columns={columns}
				data={danhSach}
				loading={loading}
				addStt
				hasTotal
				columnSetting={false}
				globalSearch={false}
				onReload={fetchList}
				emptyText={intl.formatMessage({ id: 'advisorAppointment.empty.myBookings' })}
				otherProps={{ pagination: false }}
				otherButtons={[
					<Button key='book' type='primary' onClick={() => setBookModalOpen(true)}>
						{intl.formatMessage({ id: 'advisorAppointment.button.book' })}
					</Button>,
					<SelectNamHoc
						isGetAll
						value={namHocId}
						onChange={setNamHocId}
						hasDefault
						allowClear
						style={{ width: 220 }}
					/>,
				]}
			/>

			<Modal
				open={bookModalOpen}
				title={intl.formatMessage({ id: 'advisorAppointment.button.book' })}
				onCancel={() => setBookModalOpen(false)}
				footer={null}
				width={800}
				destroyOnHidden
			>
				<BookSessionPanel onBooked={fetchList} onClose={() => setBookModalOpen(false)} />
			</Modal>

			<Modal
				open={!!detailBooking}
				title={intl.formatMessage({ id: 'advisorAppointment.detail.title' })}
				onCancel={() => setDetailBooking(undefined)}
				footer={null}
				width={640}
			>
				{detailBooking && (
					<Descriptions
						bordered
						column={1}
						size='small'
						// Nhãn dài nhất là "Thời gian ghi nhận" / "Cancellation reason"; chốt bề rộng tối thiểu và cấm
						// xuống dòng để cột nhãn không co giãn theo từng hàng và luôn đọc được trên một dòng.
						labelStyle={{ minWidth: 160, whiteSpace: 'nowrap' }}
					>
						<Descriptions.Item label={intl.formatMessage({ id: 'advisorAppointment.column.time' })}>
							{formatDateTimeRange(detailBooking.startAt, detailBooking.endAt)}
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'advisorAppointment.column.advisor' })}>
							{detailBooking.advisorName || '—'}
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'advisorAppointment.column.advisingType' })}>
							{intl.formatMessage({ id: ADVISING_TYPE_LABEL_KEY[detailBooking.advisingType] })}
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'advisorAppointment.column.mode' })}>
							{intl.formatMessage({ id: ADVISING_MODE_LABEL_KEY[detailBooking.mode] })}
							{detailBooking.location ? ` · ${detailBooking.location}` : ''}
						</Descriptions.Item>
						{/* Buổi online thì ô này là nơi ghi phòng họp, buổi offline mới là chủ đề — đổi nhãn theo hình thức. */}
						<Descriptions.Item
							label={intl.formatMessage({
								id:
									detailBooking.mode === AdvisingMode.ONLINE
										? 'advisorAppointment.column.meetingRoom'
										: 'advisorAppointment.column.topic',
							})}
						>
							<div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{detailBooking.topic || '—'}</div>
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'advisorAppointment.column.status' })}>
							<Tag color={ADVISING_BOOKING_STATUS_TAG_COLOR[detailBooking.status]}>
								{intl.formatMessage({ id: ADVISING_BOOKING_STATUS_LABEL_KEY[detailBooking.status] })}
							</Tag>
						</Descriptions.Item>
						{/* Cùng nguồn với popover ở cột trạng thái — thiếu dữ liệu thì hàng tự biến mất. */}
						{statusDetailRows(detailBooking).map((row) => (
							<Descriptions.Item key={row.label} label={row.label}>
								<div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{row.value}</div>
							</Descriptions.Item>
						))}
					</Descriptions>
				)}
			</Modal>

			<Modal
				open={!!resultBooking}
				title={intl.formatMessage({ id: 'advisorAppointment.result.title' })}
				onCancel={() => setResultBooking(undefined)}
				footer={null}
			>
				{resultBooking && (
					<div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
						{resultBooking.objective && (
							<div>
								<Typography.Text strong>
									{intl.formatMessage({ id: 'advisorAppointment.result.objective' })}
								</Typography.Text>
								<div>{resultBooking.objective}</div>
							</div>
						)}
						{resultBooking.outcome && (
							<div>
								<Typography.Text strong>
									{intl.formatMessage({ id: 'advisorAppointment.result.outcome' })}
								</Typography.Text>
								<div>{resultBooking.outcome}</div>
							</div>
						)}
						{resultBooking.nextStep && (
							<div>
								<Typography.Text strong>
									{intl.formatMessage({ id: 'advisorAppointment.result.nextStep' })}
								</Typography.Text>
								<div>{resultBooking.nextStep}</div>
							</div>
						)}
						{resultBooking.resultRecordedByName && resultBooking.resultRecordedAt && (
							<Typography.Text type='secondary' style={{ fontSize: 12 }}>
								{intl.formatMessage(
									{ id: 'advisorAppointment.result.recordedBy' },
									{ name: resultBooking.resultRecordedByName, date: formatDate(resultBooking.resultRecordedAt) },
								)}
							</Typography.Text>
						)}
					</div>
				)}
			</Modal>
		</>
	);
};

export default MyBookingsPanel;
