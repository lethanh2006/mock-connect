import ExpandText from '@/components/ExpandText';
import PageCard from '@/components/PageCard';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import { getMyAdvisor } from '@/services/AdvisorChange';
import { EAdvisorType } from '@/services/AdvisorChange/constant';
import { AdvisorChange } from '@/services/AdvisorChange/typing';
import { getCurrentIdp } from '@/services/Idp';
import { IDP_STATUS_LABEL_KEY, IdpStatus } from '@/services/Idp/constant';
import { Idp } from '@/services/Idp/typing';
import dayjs from '@/utils/dayjs';
import { formatDate, formatDateTime } from '@/utils/formatDate';
import { EditOutlined, EyeOutlined, FilePdfOutlined, LoadingOutlined } from '@ant-design/icons';
import { Alert, Collapse, Empty, Space, Tag, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useIntl, useModel } from 'umi';
import AdvisorInfoCard from './components/AdvisorInfoCard';
import IdpDetailView from './components/IdpDetailView';
import IdpExportTemplate from './components/IdpExportTemplate';
import IdpModalContent from './components/IdpModalContent';
import { STATUS_TAG_COLOR } from './statusTagColor';
import { exportNodeToPdf } from './utils/exportIdpPdf';

const buildSummary = (firstPage: Idp.IRecord[]): Idp.ISummary => {
	const latest = firstPage[0];
	const effective = firstPage.find((item) => item.status === IdpStatus.APPROVED);

	return {
		effectiveId: effective?._id ?? null,
		effectiveApprovedAt: effective?.reviewedAt ?? null,
		latestId: latest?._id ?? null,
		latestStatus: latest?.status ?? null,
		latestComment: latest?.reviewComment ?? null,
	};
};

const isEditableStatus = (status?: IdpStatus | null) =>
	status === IdpStatus.DRAFT || status === IdpStatus.REVISION_REQUESTED;

// Chờ duyệt cũng không cho tạo bản mới — chỉ khi đã có kết quả (duyệt/từ chối) hoặc chưa từng khai báo mới cho tạo.
const isCreateBlockedStatus = (status?: IdpStatus | null) =>
	status === IdpStatus.DRAFT || status === IdpStatus.REVISION_REQUESTED || status === IdpStatus.PENDING;

const IDP = () => {
	const intl = useIntl();
	const {
		getModel,
		page,
		record,
		isView,
		loading,
		handleEdit,
		handleView,
		setRecord,
		setEdit,
		setIsView,
		setVisibleForm,
	} = useModel('idp.idp');
	const { record: sinhVien } = useModel('sinhvien.sinhvien');
	const [summary, setSummary] = useState<Idp.ISummary>();
	const [effectiveRecord, setEffectiveRecord] = useState<Idp.IRecord>();
	const [currentIdp, setCurrentIdp] = useState<Idp.IRecord | null>();
	const [facultyAdvisor, setFacultyAdvisor] = useState<AdvisorChange.IMyAdvisor>();
	const [exportingRecord, setExportingRecord] = useState<Idp.IRecord>();
	const exportRef = useRef<HTMLDivElement>(null);
	const facultyAdvisorName = facultyAdvisor?.advisorName;

	useEffect(() => {
		getMyAdvisor({ type: EAdvisorType.FACULTY_ADVISOR })
			.then((res) => setFacultyAdvisor(res?.data?.data ?? undefined))
			.catch(() => setFacultyAdvisor(undefined));
	}, []);

	const fetchCurrentIdp = () => {
		getCurrentIdp()
			.then((res) => setCurrentIdp(res?.data?.data ?? null))
			.catch(() => setCurrentIdp(null));
	};

	useEffect(() => {
		if (!exportingRecord || !exportRef.current) return;

		const filename = `IDP_${sinhVien?.ma ?? exportingRecord._id}_${dayjs(exportingRecord.updatedAt).format('YYYYMMDD')}.pdf`;

		exportNodeToPdf(exportRef.current, filename)
			.catch(() => {})
			.finally(() => setExportingRecord(undefined));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [exportingRecord]);

	const fetchList = async () => {
		const records = ((await getModel(undefined, undefined, undefined, undefined, undefined, 'me/page').catch(
			() => [],
		)) ?? []) as Idp.IRecord[];
		if (page === 1) {
			setSummary(buildSummary(records));
			setEffectiveRecord(records.find((item) => item.status === IdpStatus.APPROVED));
		}
		fetchCurrentIdp();
	};

	const openCreate = () => {
		setRecord(undefined);
		setEdit(false);
		setIsView(false);
		setVisibleForm(true);
	};

	const handleCreateNew = () => (effectiveRecord ? handleEdit(effectiveRecord) : openCreate());

	const canCreate = !loading && !isCreateBlockedStatus(summary?.latestStatus);

	// Khoá + ngành gộp một cột dạng "(mã khoá) tên khoá - tên ngành"; thiếu vế nào thì bỏ hẳn vế đó
	// thay vì để lại dấu ngoặc rỗng hoặc dấu gạch nối lơ lửng.
	const khoaSinhVien = sinhVien?.khoaSinhVien;
	const cohortLabel = [khoaSinhVien?.ma && `(${khoaSinhVien.ma})`, khoaSinhVien?.ten].filter(Boolean).join(' ');
	const cohortProgramLabel = [cohortLabel, sinhVien?.nganh?.ten].filter(Boolean).join(' - ') || '—';

	const columns: IColumn<Idp.IRecord>[] = [
		{
			title: intl.formatMessage({ id: 'idp.column.studentCode' }),
			dataIndex: '_id',
			key: 'studentCode',
			width: 130,
			render: () => sinhVien?.ma ?? '—',
		},
		{
			title: intl.formatMessage({ id: 'idp.column.cohortProgram' }),
			dataIndex: '_id',
			key: 'cohortProgram',
			width: 320,
			render: () => cohortProgramLabel,
		},
		{
			title: intl.formatMessage({ id: 'idp.column.updatedAt' }),
			dataIndex: 'updatedAt',
			width: 150,
			render: (val: string) => (val ? formatDateTime(val) : '—'),
		},
		{
			title: intl.formatMessage({ id: 'idp.column.status' }),
			dataIndex: 'status',
			width: 140,
			render: (val: IdpStatus) => (
				<Tag color={STATUS_TAG_COLOR[val]}>{intl.formatMessage({ id: IDP_STATUS_LABEL_KEY[val] })}</Tag>
			),
		},
		{
			title: intl.formatMessage({ id: 'idp.column.reviewComment' }),
			dataIndex: 'reviewComment',
			width: 320,
			render: (val: string | null) => (val ? <ExpandText ellipsis={{ rows: 2 }}>{val}</ExpandText> : '—'),
		},
		{
			title: intl.formatMessage({ id: 'idp.column.effective' }),
			dataIndex: '_id',
			// Trùng `dataIndex` với cột id gốc nên phải đặt key riêng cho column settings.
			key: 'isEffective',
			width: 120,
			align: 'center',
			render: (val: string) =>
				val === summary?.effectiveId ? (
					<Tag color='success'>{intl.formatMessage({ id: 'idp.tag.effective' })}</Tag>
				) : null,
		},
		{
			title: intl.formatMessage({ id: 'idp.column.action' }),
			width: 100,
			align: 'center',
			fixed: 'right',
			render: (_: any, rec: Idp.IRecord) => (
				<div onClick={(e) => e.stopPropagation()}>
					{rec._id === summary?.latestId && isEditableStatus(rec.status) && (
						<ButtonExtend
							tooltip={intl.formatMessage({ id: 'idp.tooltip.edit' })}
							icon={<EditOutlined />}
							type='link'
							onClick={() => handleEdit(rec)}
						/>
					)}
					<ButtonExtend
						tooltip={intl.formatMessage({ id: 'idp.tooltip.view' })}
						icon={<EyeOutlined />}
						type='link'
						onClick={() => handleView(rec)}
					/>
					<ButtonExtend
						tooltip={intl.formatMessage({ id: 'idp.tooltip.export' })}
						icon={exportingRecord?._id === rec._id ? <LoadingOutlined /> : <FilePdfOutlined />}
						type='link'
						disabled={!!exportingRecord}
						onClick={() => setExportingRecord(rec)}
					/>
				</div>
			),
		},
	];

	const renderBanner = () => {
		if (!summary) return null;
		const { effectiveApprovedAt, latestStatus, latestComment } = summary;

		// Chưa khai báo bản nào: lời mời khai báo nằm ở empty state của bảng.
		if (!latestStatus) return null;

		const showComment =
			(latestStatus === IdpStatus.REJECTED || latestStatus === IdpStatus.REVISION_REQUESTED) && !!latestComment;

		let type: 'success' | 'info' | 'warning' = 'info';
		let bannerMessage = '';

		switch (latestStatus) {
			case IdpStatus.DRAFT:
				bannerMessage = intl.formatMessage({ id: 'idp.banner.draft' });
				break;
			case IdpStatus.REVISION_REQUESTED:
				type = 'warning';
				bannerMessage = intl.formatMessage({ id: 'idp.banner.revisionRequested' });
				break;
			case IdpStatus.PENDING:
				bannerMessage = intl.formatMessage({ id: 'idp.banner.pending' });
				break;
			case IdpStatus.REJECTED:
				type = 'warning';
				bannerMessage = intl.formatMessage({ id: 'idp.banner.rejected' });
				break;
			default: {
				// APPROVED
				type = 'success';
				const approvedText = effectiveApprovedAt ? formatDate(effectiveApprovedAt) : '—';
				bannerMessage = intl.formatMessage({ id: 'idp.banner.approved' }, { date: approvedText });
			}
		}

		return (
			<Alert
				style={{ marginBottom: 16 }}
				type={type}
				showIcon
				message={bannerMessage}
				description={
					showComment
						? intl.formatMessage({ id: 'idp.banner.reviewComment' }, { comment: latestComment as string })
						: undefined
				}
			/>
		);
	};

	return (
		<PageCard title={intl.formatMessage({ id: 'idp.title' })}>
			{renderBanner()}

			<div style={{ display: 'flex', marginBottom: 16 }}>
				<AdvisorInfoCard
					type={EAdvisorType.FACULTY_ADVISOR}
					advisor={facultyAdvisor}
					style={{ flex: '0 1 560px', maxWidth: '100%' }}
				/>
			</div>

			{currentIdp && (
				<Collapse
					defaultActiveKey={['current']}
					style={{ marginBottom: 16 }}
					items={[
						{
							key: 'current',
							label: (
								<Space size={8} wrap>
									<Typography.Text strong>
										{intl.formatMessage({ id: 'idp.currentEffective.title' })}
									</Typography.Text>
									<Tag color='success'>{intl.formatMessage({ id: 'idp.tag.effective' })}</Tag>
									{currentIdp.reviewedAt && (
										<Typography.Text type='secondary' style={{ fontSize: 12 }}>
											{intl.formatMessage(
												{ id: 'idp.currentEffective.approvedAt' },
												{ date: formatDate(currentIdp.reviewedAt) },
											)}
										</Typography.Text>
									)}
								</Space>
							),
							children: (
								<IdpDetailView
									content={currentIdp.content}
									studentName={sinhVien?.ten}
									studentCode={sinhVien?.ma}
									program={sinhVien?.nganh?.ten}
									facultyAdvisorName={facultyAdvisorName}
								/>
							),
						},
					]}
				/>
			)}

			<TableBase
				modelName='idp.idp'
				columns={columns}
				dependencies={[]}
				getData={fetchList}
				hideCard
				Form={IdpModalContent}
				formProps={{ onSuccess: fetchList }}
				modalTitle={
					isView
						? intl.formatMessage({ id: 'idp.modal.view' })
						: intl.formatMessage({
								id: record && isEditableStatus(record.status) ? 'idp.modal.edit' : 'idp.modal.create',
							})
				}
				// Xem chi tiết: modal rộng đúng bằng khổ A4 của IdpExportTemplate (794px).
				widthDrawer={isView ? 794 : 1200}
				destroyModal
				onCreateClick={handleCreateNew}
				createButtonText={intl.formatMessage({ id: 'idp.button.create' })}
				createButtonTooltip={intl.formatMessage({ id: 'idp.button.create.tooltip' })}
				otherProps={{
					rowKey: '_id',
					locale: {
						emptyText: <Empty description={intl.formatMessage({ id: 'idp.empty.title' })} />,
					},
				}}
				buttons={{
					create: canCreate,
					import: false,
					export: false,
					filter: false,
					globalSearch: false,
					columnSetting: false,
				}}
			/>

			{exportingRecord && (
				<div style={{ position: 'fixed', top: 0, left: -10000, zIndex: -1 }}>
					<IdpExportTemplate
						ref={exportRef}
						content={exportingRecord.content}
						studentName={sinhVien?.ten}
						studentCode={sinhVien?.ma}
						program={sinhVien?.nganh?.ten}
						facultyAdvisorName={facultyAdvisorName}
					/>
				</div>
			)}
		</PageCard>
	);
};

export default IDP;
