import PageCard from '@/components/PageCard';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import { IDP_STATUS_LABEL_KEY, IdpStatus } from '@/services/IdpCoVan/constant';
import type { IdpCoVan } from '@/services/IdpCoVan/typing';
import dayjs from '@/utils/dayjs';
import { formatDateTime } from '@/utils/formatDate';
import { AuditOutlined, EyeOutlined, FilePdfOutlined, LoadingOutlined } from '@ant-design/icons';
import { Tabs, Tag, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useIntl, useModel } from 'umi';
import './components/IdpDetail.less';
import IdpExportTemplate from './components/IdpExportTemplate';
import IdpRecordModalContent from './components/IdpRecordModalContent';
import { STATUS_TAG_COLOR } from './statusTagColor';
import { exportNodeToPdf } from './utils/exportIdpPdf';

const EIdpTab = {
	ALL: 'ALL',
	APPROVED: 'APPROVED',
} as const;
type EIdpTab = (typeof EIdpTab)[keyof typeof EIdpTab];

const IdpCoVanPage = () => {
	const intl = useIntl();
	const { isView, record, getMyStudentsIdpModel, getApprovedIdpModel, handleView, setVisibleForm } =
		useModel('idp.covanidp');
	const [tab, setTab] = useState<EIdpTab>(EIdpTab.ALL);
	const [exportingRecord, setExportingRecord] = useState<IdpCoVan.IIdpListItem>();
	const exportRef = useRef<HTMLDivElement>(null);

	const getData = () => (tab === EIdpTab.APPROVED ? getApprovedIdpModel() : getMyStudentsIdpModel());

	useEffect(() => {
		if (!exportingRecord || !exportRef.current) return;

		const codeOrId = exportingRecord.studentCode ?? exportingRecord._id;
		const filename = `IDP_${codeOrId}_${dayjs(exportingRecord.updatedAt).format('YYYYMMDD')}.pdf`;

		exportNodeToPdf(exportRef.current, filename)
			.catch(() => {})
			.finally(() => setExportingRecord(undefined));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [exportingRecord]);

	const onReviewSuccess = () => {
		setVisibleForm(false);
		getData();
	};

	const columns: IColumn<IdpCoVan.IIdpListItem>[] = [
		{
			title: intl.formatMessage({ id: 'idpcovan.column.studentCode' }),
			dataIndex: 'studentCode',
			width: 130,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'idpcovan.column.studentName' }),
			dataIndex: 'studentName',
			width: 220,
			filterType: 'string',
			render: (val: string) => <Typography.Text strong>{val}</Typography.Text>,
		},
		{
			title: intl.formatMessage({ id: 'idpcovan.column.maNganh' }),
			dataIndex: 'program',
			width: 200,
			filterType: 'string',
			render: (val: string) => val || '—',
		},
		{
			title: intl.formatMessage({ id: 'idpcovan.column.status' }),
			dataIndex: 'status',
			width: 150,
			align: 'center',
			filterType: 'select',
			filterData: Object.values(IdpStatus).map((status) => ({
				value: status,
				label: intl.formatMessage({ id: IDP_STATUS_LABEL_KEY[status] }),
			})),
			render: (val: IdpStatus) => (
				<Tag color={STATUS_TAG_COLOR[val]}>{intl.formatMessage({ id: IDP_STATUS_LABEL_KEY[val] })}</Tag>
			),
		},
		{
			title: intl.formatMessage({ id: 'idpcovan.column.isEffective' }),
			dataIndex: 'isEffective',
			width: 150,
			align: 'center',
			filterType: 'select',
			filterData: [
				{ value: true, label: intl.formatMessage({ id: 'idpcovan.effective.yes' }) },
				{ value: false, label: intl.formatMessage({ id: 'idpcovan.effective.no' }) },
			] as any,
			render: (val?: boolean) =>
				val ? <Tag color='success'>{intl.formatMessage({ id: 'idpcovan.effective.yes' })}</Tag> : '—',
		},
		{
			title: intl.formatMessage({ id: 'idpcovan.column.createdAt' }),
			dataIndex: 'createdAt',
			width: 160,
			render: (val: string) => (val ? formatDateTime(val) : '—'),
		},
		{
			title: intl.formatMessage({ id: 'idpcovan.column.reviewedAt' }),
			dataIndex: 'reviewedAt',
			width: 160,
			render: (val: string | null) => (val ? formatDateTime(val) : '—'),
		},
		{
			title: intl.formatMessage({ id: 'idpcovan.column.reviewComment' }),
			dataIndex: 'reviewComment',
			width: 260,
			render: (val: string | null) =>
				val ? (
					<Typography.Paragraph ellipsis={{ rows: 2, tooltip: val }} style={{ marginBottom: 0 }}>
						{val}
					</Typography.Paragraph>
				) : (
					'—'
				),
		},
		{
			title: intl.formatMessage({ id: 'idpcovan.column.action' }),
			width: 110,
			align: 'center',
			fixed: 'right',
			render: (_: any, rec: IdpCoVan.IIdpListItem) => (
				<div onClick={(e) => e.stopPropagation()}>
					<ButtonExtend
						tooltip={intl.formatMessage({
							id: rec.status === IdpStatus.PENDING ? 'idpcovan.tooltip.review' : 'idpcovan.tooltip.viewDetail',
						})}
						icon={rec.status === IdpStatus.PENDING ? <AuditOutlined /> : <EyeOutlined />}
						type='link'
						onClick={() => handleView(rec)}
					/>
					<ButtonExtend
						tooltip={intl.formatMessage({ id: 'idpcovan.tooltip.export' })}
						icon={exportingRecord?._id === rec._id ? <LoadingOutlined /> : <FilePdfOutlined />}
						type='link'
						disabled={!!exportingRecord}
						onClick={() => setExportingRecord(rec)}
					/>
				</div>
			),
		},
	];

	return (
		<PageCard title={intl.formatMessage({ id: 'idpcovan.title' })}>
			<TableBase<IdpCoVan.IIdpListItem>
				modelName='idp.covanidp'
				columns={columns}
				dependencies={[tab]}
				getData={getData}
				hideCard
				Form={IdpRecordModalContent}
				formProps={{ onSuccess: onReviewSuccess }}
				modalTitle={intl.formatMessage(
					{ id: 'idpcovan.modal.studentTitle' },
					{ name: record?.studentName ?? '', code: record?.studentCode ?? '' },
				)}
				widthDrawer={isView ? 794 : 1000}
				destroyModal
				buttons={{ create: false, import: false, export: false }}
				otherProps={{
					rowKey: '_id',
				}}
			>
				<Tabs
					activeKey={tab}
					onChange={(key) => setTab(key as EIdpTab)}
					items={[
						{ key: EIdpTab.ALL, label: intl.formatMessage({ id: 'idpcovan.tab.all' }) },
						{ key: EIdpTab.APPROVED, label: intl.formatMessage({ id: 'idpcovan.tab.approved' }) },
					]}
				/>
			</TableBase>

			{exportingRecord && (
				<div style={{ position: 'fixed', top: 0, left: -10000, zIndex: -1 }}>
					<IdpExportTemplate
						ref={exportRef}
						content={exportingRecord.content}
						studentName={exportingRecord.studentName ?? undefined}
						studentCode={exportingRecord.studentCode ?? undefined}
						program={exportingRecord.program ?? undefined}
						advisorName={exportingRecord.advisorName ?? undefined}
					/>
				</div>
			)}
		</PageCard>
	);
};

export default IdpCoVanPage;
