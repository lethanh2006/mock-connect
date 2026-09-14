import PageCard from '@/components/PageCard';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import SelectNamHoc from '@/pages/DaoTao/NamHoc/Select';
import {
	ADVISING_MODE_LABEL_KEY,
	ADVISING_SLOT_STATUS_LABEL_KEY,
	AdvisingMode,
	AdvisingSlotStatus,
} from '@/services/TuVan/constant';
import type { TuVan } from '@/services/TuVan/typing';
import dayjs from '@/utils/dayjs';
import { formatDate, formatDateTime, formatTimeRange } from '@/utils/formatDate';
import { CloseCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm, Tag, Typography } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import { ADVISING_MODE_TAG_COLOR, SLOT_STATUS_TAG_COLOR } from '../tagColors';
import CancelSlotModal from './components/CancelSlotModal';
import SlotFormContent from './components/SlotFormContent';

const IdpTuVanKhaDungPage = () => {
	const intl = useIntl();
	const { handleEdit, deleteModel, getMyListModel, maNamHoc, setMaNamHoc } = useModel('tuvan.khadung');
	const [cancelTarget, setCancelTarget] = useState<TuVan.ISlot>();

	const columns: IColumn<TuVan.ISlot>[] = [
		{
			title: intl.formatMessage({ id: 'tuvan.column.date' }),
			dataIndex: 'startAt',
			width: 120,
			sortable: true,
			render: (val: string) => (val ? formatDate(val) : '—'),
		},
		{
			title: intl.formatMessage({ id: 'tuvan.column.time' }),
			width: 180,
			render: (_: any, rec: TuVan.ISlot) =>
				dayjs(rec.startAt).isSame(rec.endAt, 'day')
					? formatTimeRange(rec.startAt, rec.endAt)
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
			title: intl.formatMessage({ id: 'tuvan.column.locationOrLink' }),
			width: 220,
			render: (_: any, rec: TuVan.ISlot) => {
				// OFFLINE ca chỉ có `location`, ONLINE ca chỉ có `meetingLink` — không gửi/nhận cả 2.
				const val = rec.location || rec.meetingLink;
				return val ? (
					<Typography.Paragraph ellipsis={{ rows: 1, tooltip: val }} style={{ marginBottom: 0 }}>
						{val}
					</Typography.Paragraph>
				) : (
					'—'
				);
			},
		},
		{
			title: intl.formatMessage({ id: 'tuvan.column.booked' }),
			width: 100,
			align: 'center',
			render: (_: any, rec: TuVan.ISlot) => `${rec.bookedCount ?? 0}/${rec.capacity}`,
		},
		{
			title: intl.formatMessage({ id: 'tuvan.column.slotStatus' }),
			dataIndex: 'status',
			width: 130,
			align: 'center',
			filterType: 'select',
			filterData: Object.values(AdvisingSlotStatus).map((item) => ({
				value: item,
				label: intl.formatMessage({ id: ADVISING_SLOT_STATUS_LABEL_KEY[item] }),
			})),
			render: (val: AdvisingSlotStatus, rec: TuVan.ISlot) =>
				val === AdvisingSlotStatus.OPEN && rec.bookedCount >= rec.capacity ? (
					<Tag color='default'>{intl.formatMessage({ id: 'tuvan.slotStatus.FULL' })}</Tag>
				) : (
					<Tag color={SLOT_STATUS_TAG_COLOR[val]}>
						{intl.formatMessage({ id: ADVISING_SLOT_STATUS_LABEL_KEY[val] })}
					</Tag>
				),
		},
		{
			title: intl.formatMessage({ id: 'tuvan.column.action' }),
			width: 140,
			align: 'center',
			fixed: 'right',
			render: (_: any, rec: TuVan.ISlot) => {
				const cancelled = rec.status !== AdvisingSlotStatus.OPEN;
				// BE chỉ cho xoá cứng khi chưa có SV nào đặt — có booking thì phải Huỷ (có lý do) thay vì Xoá.
				const hasBookings = rec.bookedCount > 0;
				return (
					<>
						<ButtonExtend
							tooltip={intl.formatMessage({ id: cancelled ? 'tuvan.tooltip.slotCancelledHint' : 'tuvan.tooltip.edit' })}
							icon={<EditOutlined />}
							type='link'
							onClick={() => handleEdit(rec)}
							disabled={cancelled}
						/>
						<ButtonExtend
							tooltip={intl.formatMessage({
								id: cancelled ? 'tuvan.tooltip.slotCancelledHint' : 'tuvan.tooltip.cancel',
							})}
							icon={<CloseCircleOutlined />}
							type='link'
							danger
							onClick={() => setCancelTarget(rec)}
							disabled={cancelled}
						/>
						<Popconfirm
							title={intl.formatMessage({ id: 'tuvan.confirm.deleteSlot' })}
							placement='topRight'
							onConfirm={() => deleteModel(rec._id, getMyListModel)}
							disabled={hasBookings}
						>
							<ButtonExtend
								tooltip={intl.formatMessage({
									id: hasBookings ? 'tuvan.tooltip.slotHasBookingsHint' : 'tuvan.tooltip.delete',
								})}
								icon={<DeleteOutlined />}
								type='link'
								danger
								disabled={hasBookings}
							/>
						</Popconfirm>
					</>
				);
			},
		},
	];

	return (
		<PageCard title={intl.formatMessage({ id: 'tuvan.khadung.title' })}>
			<TableBase<TuVan.ISlot>
				modelName='tuvan.khadung'
				columns={columns}
				dependencies={[maNamHoc]}
				getData={() => getMyListModel()}
				hideCard
				Form={SlotFormContent}
				modalTitle={intl.formatMessage({ id: 'tuvan.khadung.modalTitle' })}
				widthDrawer={900}
				destroyModal
				buttons={{ create: true, import: false, export: false }}
				otherProps={{ rowKey: '_id' }}
				otherButtons={[
					<SelectNamHoc isGetAll allowClear selectMa value={maNamHoc} onChange={setMaNamHoc} style={{ width: 260 }} />,
				]}
			/>

			<CancelSlotModal
				record={cancelTarget}
				onCancel={() => setCancelTarget(undefined)}
				onSuccess={() => setCancelTarget(undefined)}
			/>
		</PageCard>
	);
};

export default IdpTuVanKhaDungPage;
