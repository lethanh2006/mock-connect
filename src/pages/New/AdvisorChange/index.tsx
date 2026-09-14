import ExpandText from '@/components/ExpandText';
import PageCard from '@/components/PageCard';
import TableBase from '@/components/Table';
import type { IColumn } from '@/components/Table/typing';
import AdvisorInfoCard from '@/pages/New/IDP/components/AdvisorInfoCard';
import { getMyAdvisor } from '@/services/AdvisorChange';
import {
	ADVISOR_CHANGE_REQUEST_TYPES,
	ADVISOR_CHANGE_STATUS_LABEL_KEY,
	ADVISOR_TYPE_LABEL_KEY,
	AdvisorChangeStatus,
	EAdvisorType,
} from '@/services/AdvisorChange/constant';
import { AdvisorChange } from '@/services/AdvisorChange/typing';
import { formatDate, formatDateTime } from '@/utils/formatDate';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Alert, Button, Empty, Space, Tag, Typography } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import { ADVISOR_CHANGE_STATUS_TAG_COLOR } from './advisorChangeStatusTagColor';
import AdvisorChangeForm from './components/AdvisorChangeForm';

const AdvisorChangePage = () => {
	const intl = useIntl();
	const { danhSach, getAllModel, setRecord, setEdit, setIsView, setVisibleForm } =
		useModel('advisorChange.advisorChange');
	const { record: sinhVien } = useModel('sinhvien.sinhvien');
	const [myAdvisors, setMyAdvisors] = useState<Partial<Record<EAdvisorType, AdvisorChange.IMyAdvisor>>>({});
	const [selectedAdvisorType, setSelectedAdvisorType] = useState<EAdvisorType>();

	const fetchList = () => {
		getAllModel(false, undefined, undefined, undefined, 'change-request-advisor');
		Promise.all(
			ADVISOR_CHANGE_REQUEST_TYPES.map((type) =>
				getMyAdvisor({ type })
					.then((res) => [type, res?.data?.data ?? undefined] as const)
					.catch(() => [type, undefined] as const),
			),
		).then((entries) => setMyAdvisors(Object.fromEntries(entries)));
	};

	/** Mỗi `(sinh viên, loại cố vấn)` chỉ được có 1 yêu cầu đang chờ duyệt — các loại khác nhau độc lập nhau. */
	const pendingRequestByType = new Map<EAdvisorType, AdvisorChange.IRecord>(
		((danhSach as AdvisorChange.IRecord[]) ?? [])
			.filter((item) => item.status === AdvisorChangeStatus.PENDING)
			.map((item) => [item.type, item]),
	);
	/** Loại cố vấn còn được phép gửi yêu cầu mới — dùng cho toggle trong modal lẫn để quyết định hiện nút tạo. */
	const availableTypes = ADVISOR_CHANGE_REQUEST_TYPES.filter((type) => !pendingRequestByType.has(type));

	const openCreate = () => {
		if (!availableTypes.length) return;
		setSelectedAdvisorType(availableTypes[0]);
		setRecord(undefined);
		setEdit(false);
		setIsView(false);
		setVisibleForm(true);
	};

	const columns: IColumn<AdvisorChange.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'idp.advisorChange.column.createdAt' }),
			dataIndex: 'createdAt',
			width: 150,
			render: (val: string) => formatDateTime(val),
		},
		{
			title: intl.formatMessage({ id: 'idp.advisorChange.column.type' }),
			dataIndex: 'type',
			width: 140,
			render: (val: EAdvisorType) => intl.formatMessage({ id: ADVISOR_TYPE_LABEL_KEY[val] }),
		},
		{
			title: intl.formatMessage({ id: 'idp.advisorChange.column.advisor' }),
			dataIndex: 'fromAdvisorName',
			width: 360,
			render: (val: string, rec: AdvisorChange.IRecord) => (
				<Space size={6}>
					<span>{val || '—'}</span>
					<ArrowRightOutlined style={{ fontSize: 12, color: '#8c8c8c' }} />
					<strong>{rec.toAdvisorName || '—'}</strong>
				</Space>
			),
		},
		{
			title: intl.formatMessage({ id: 'idp.advisorChange.column.reason' }),
			dataIndex: 'reason',
			width: 360,
			render: (val: string) => <ExpandText ellipsis={{ rows: 2 }}>{val}</ExpandText>,
		},
		{
			title: intl.formatMessage({ id: 'idp.advisorChange.column.status' }),
			dataIndex: 'status',
			width: 200,
			render: (val: AdvisorChangeStatus, rec: AdvisorChange.IRecord) => (
				<Space direction='vertical' size={2}>
					<Tag style={{ marginInlineEnd: 0 }} color={ADVISOR_CHANGE_STATUS_TAG_COLOR[val]}>
						{intl.formatMessage({ id: ADVISOR_CHANGE_STATUS_LABEL_KEY[val] })}
					</Tag>
					{rec.reviewedAt && (
						<Typography.Text type='secondary' style={{ fontSize: 12 }}>
							{formatDate(rec.reviewedAt)}
							{rec.reviewerName ? ` · ${rec.reviewerName}` : ''}
						</Typography.Text>
					)}
				</Space>
			),
		},
		{
			title: intl.formatMessage({ id: 'idp.advisorChange.column.reviewComment' }),
			dataIndex: 'reviewComment',
			width: 300,
			render: (val: string | null) => (val ? <ExpandText ellipsis={{ rows: 2 }}>{val}</ExpandText> : '—'),
		},
	];

	return (
		<PageCard title={intl.formatMessage({ id: 'idp.advisorChange.pageTitle' })}>
			<div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
				{ADVISOR_CHANGE_REQUEST_TYPES.map((type) => (
					<AdvisorInfoCard key={type} type={type} advisor={myAdvisors[type]} />
				))}
			</div>

			{ADVISOR_CHANGE_REQUEST_TYPES.filter((type) => pendingRequestByType.has(type)).map((type) => (
				<Alert
					key={type}
					style={{ marginBottom: 16 }}
					type='warning'
					showIcon
					message={intl.formatMessage(
						{ id: 'idp.advisorChange.pendingAlert.messageWithType' },
						{
							type: intl.formatMessage({ id: ADVISOR_TYPE_LABEL_KEY[type] }),
							date: formatDateTime(pendingRequestByType.get(type)!.createdAt),
						},
					)}
					description={intl.formatMessage({ id: 'idp.advisorChange.pendingAlert.description' })}
				/>
			))}

			<TableBase
				modelName='advisorChange.advisorChange'
				columns={columns}
				dependencies={[]}
				getData={fetchList}
				hideCard
				pageable={false}
				Form={AdvisorChangeForm}
				formProps={{
					advisorType: selectedAdvisorType,
					availableTypes,
					onTypeChange: setSelectedAdvisorType,
					currentAdvisorName: selectedAdvisorType ? myAdvisors[selectedAdvisorType]?.advisorName : undefined,
					currentAdvisorSsoId: selectedAdvisorType ? myAdvisors[selectedAdvisorType]?.advisorSsoId : undefined,
					maNganh: selectedAdvisorType === EAdvisorType.PEER_ADVISOR ? sinhVien?.nganh?.maDonVi : sinhVien?.nganh?.ma,
					onSuccess: fetchList,
				}}
				modalTitle={intl.formatMessage({ id: 'idp.advisorChange.modalTitle' })}
				widthDrawer={640}
				destroyModal
				otherProps={{
					pagination: false,
					locale: {
						emptyText: <Empty description={intl.formatMessage({ id: 'idp.advisorChange.empty' })} />,
					},
				}}
				otherButtons={
					availableTypes.length
						? [
								<Button key='create' type='primary' onClick={openCreate}>
									{intl.formatMessage({ id: 'idp.advisorChange.createButton' })}
								</Button>,
							]
						: []
				}
				buttons={{
					create: false,
					import: false,
					export: false,
					filter: false,
					globalSearch: false,
					columnSetting: false,
				}}
			/>
		</PageCard>
	);
};

export default AdvisorChangePage;
