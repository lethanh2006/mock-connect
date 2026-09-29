import background from '@/assets/cct/background.png';
import EmptyState from '@/components/EmptyState';
import { IconHumanCheck } from '@/components/Icons';
import PageCard from '@/components/PageCard';
import { EOperatorType } from '@/components/Table/constant';
import ModalExpandable from '@/components/Table/ModalExpandable';
import { TabViewPage } from '@/components/TabViewPage';
import ActivityCard from '@/pages/TrangChuV2/components/ActivityCard';
import { Activity } from '@/services/CCT/Activity/typing';
import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import { EActivityCategory, EActivityStatus, EApprovalStatus, mapNameActivityCategory } from '@/services/CCT/constant';
import dayjs from '@/utils/dayjs';
import { Button } from '@vinuni/ui';
import { Divider, Pagination, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import { FilterSuKienValue } from '../Activity';
import CardChiTietSuKien from '../Activity/components/CardChiTietSuKien';
import FilterSuKien from '../Activity/components/FilterSuKien';
import '../Activity/style.less';
import ActionMenu from './components/ActionMenu';
import ChiTietActivityOutCome from './components/ChiTiet';
import FormActivityOutCome from './components/Form';
import FormPerstionActivityOutCome from './components/FormPerstion';
import StatActivityOutCome from './components/Stat';

const PAGE_SIZE = 9;

const HistoryActivityPage = () => {
	const intl = useIntl();
	const {
		page,
		limit,
		setPage,
		setLimit,
		danhSach,
		getModel,
		handleEdit,
		handleView,
		getAnalyticsStudentModel,
		loading,
		visibleForm,
		setVisibleForm,
		total,
		setEdit,
		setIsView,
		setRecord,
		deleteActivityModel,
		putModel,
		edit,
		isView,
		record,
		filters,
	} = useModel('cct.activityoutcome');
	const { getAllModel: getAllAtributes, danhSach: dsAttribute } = useModel('cct.attributes');

	const [tabActive, setTabActive] = useState<EActivityCategory>(() => {
		const hash = window.location.hash.replace('#', '') as EActivityCategory;
		return Object.values(EActivityCategory).includes(hash) ? hash : EActivityCategory.REGISTERED;
	});
	const [filter, setFilter] = useState<FilterSuKienValue>({
		search: undefined,
		dateRange: [],
	});
	const [workflowQuery, setWorkflowQuery] = useState<EActivityStatus>(EActivityStatus.TOTAL);

	const now = dayjs();

	const getData = () => {
		const filters: any[] = [];

		if (!!filter?.search) {
			filters.push({
				active: true,
				field: tabActive === EActivityCategory.REGISTERED ? ['activities', 'name'] : 'activitiesOutcomeName',
				values: [filter?.search],
				operator: EOperatorType.CONTAIN,
			});
		}

		if (!!filter?.dateRange?.length) {
			filters.push({
				active: true,
				field: tabActive === EActivityCategory.REGISTERED ? ['activities', 'startDate'] : 'startDate',
				values: [filter?.dateRange[0], filter?.dateRange[1]],
				operator: EOperatorType.BETWEEN,
			});
		}

		getModel(
			{
				activityCategory: tabActive,
			},
			filters,
			undefined,
			undefined,
			9,
			'me/page',
			{
				status: workflowQuery,
			},
		);
	};

	const getThongKe = () => {
		getAnalyticsStudentModel(tabActive);
	};

	useEffect(() => {
		getThongKe();
	}, [tabActive]);

	useEffect(() => {
		if (limit !== PAGE_SIZE) {
			setLimit(PAGE_SIZE);
			return;
		}
		getData();
	}, [tabActive, filter, page, limit, filters, workflowQuery]);

	useEffect(() => {
		getAllAtributes(undefined, { order: 1 }, { isActive: true });
	}, []);

	const isInTimeRange = (rec: ActivityOutCome.IRecord) => {
		const now = dayjs();

		const start = dayjs(rec?.activities?.startDate);
		const end = rec?.dueDate ? dayjs(rec?.dueDate) : null;

		if (!start.isValid() || !end?.isValid()) return false;

		return now.isAfter(start) && now.isBefore(end);
	};

	const canEdit = (rec: ActivityOutCome.IRecord) => {
		const isWorkflowValid = [
			EApprovalStatus.DRAFT,
			EApprovalStatus.CHANGES_REQUIRED,
			EApprovalStatus.EVIDENCE_REQUIRED,
		].includes(rec?.workflow);

		if (!isWorkflowValid) return false;

		if (rec?.activityCategory === EActivityCategory.REGISTERED) {
			return isInTimeRange(rec);
		}

		return rec?.workflow === EApprovalStatus.CHANGES_REQUIRED ? rec?.dueDate && now.isBefore(dayjs(rec.dueDate)) : true;
	};

	const handlePaginationChange = (newPage: number, newPageSize: number) => {
		if (newPageSize !== limit) {
			setPage(1);
			setLimit(newPageSize);
		} else {
			setPage(newPage);
		}
	};

	const handlePageSizeChange = (current: number, size: number) => {
		setPage(1);
		setLimit(size);
	};

	const endDateUpdateEvidence = record?.dueDate ? dayjs(record?.dueDate) : null;

	const editableWorkflow =
		record?.workflow === EApprovalStatus.DRAFT ||
		record?.workflow === EApprovalStatus.CHANGES_REQUIRED ||
		record?.workflow === EApprovalStatus.EVIDENCE_REQUIRED;

	const isExpired = editableWorkflow && now.isAfter(endDateUpdateEvidence);

	const attributeSource = (dsAttribute ?? []) as AttributesManagement.IRecord[];

	const isDetailView = isView && (tabActive === EActivityCategory.REGISTERED || !record?.isAwardRecognition);
	const detailFooter = (
		<div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
			<Button variant='outline' onClick={() => setVisibleForm(false)}>
				{intl.formatMessage({ id: 'activity.history.close' })}
			</Button>
			{canEdit(record ?? ({} as ActivityOutCome.IRecord)) && (
				<Button variant='default' onClick={() => handleEdit(record)}>
					{intl.formatMessage({ id: 'activity.history.updateEvidence' })}
				</Button>
			)}
		</div>
	);

	return (
		<PageCard
			stickyHeader
			className='activity-history-page'
			title={intl.formatMessage({ id: 'activity.history.title' })}
		>
			<div className='page-card-custom'>
				<TabViewPage
					hideCard
					offsetTop={0}
					tabType='line'
					tabStyle={{ padding: '12px 0 2px 8px' }}
					contentStyle={{ marginTop: 0 }}
					onChange={(tab) => {
						setTabActive(tab as EActivityCategory);
						setPage(1);
						setLimit(PAGE_SIZE);
					}}
					menu={Object.values(EActivityCategory).map((item) => ({
						title: mapNameActivityCategory[item],
						menuKey: item,
						content: (
							<>
								<div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '16px 24px' }}>
									<FilterSuKien
										value={filter}
										onChange={setFilter}
										onReload={() => {
											getData();
											getThongKe();
										}}
										button={
											tabActive === EActivityCategory.PERSONAL_CO_CURRICULAR ? (
												<Button
													variant='default'
													size='sm'
													onClick={() => {
														setRecord({} as ActivityOutCome.IRecord);
														setEdit(false);
														setIsView(false);
														setVisibleForm(true);
													}}
												>
													{intl.formatMessage({ id: 'activity.history.addNew' })}
												</Button>
											) : undefined
										}
										hideSelect
									/>

									<StatActivityOutCome
										getData={getThongKe}
										tabActive={tabActive}
										onChangeWorkflow={setWorkflowQuery}
										currentWorkflow={workflowQuery}
									/>
								</div>

								<Divider style={{ margin: 0 }} />

								<Spin spinning={loading}>
									{danhSach?.length ? (
										<>
											<div className='history-activity-grid'>
												{danhSach?.map((item) => {
													const isRegistered = tabActive === EActivityCategory.REGISTERED;
													const equivalencyAttributeIds = isRegistered
														? item?.activities?.coCurricularActivityEquivalency?.map((x) => x.attributesId)
														: item?.activitiesType?.attributes?.map((x) => x?._id);
													const attributes = attributeSource.map((attribute: AttributesManagement.IRecord) => ({
														id: attribute._id,
														letter: attribute.code?.charAt(0)?.toUpperCase() ?? '',
														active: equivalencyAttributeIds?.includes(attribute._id),
													}));

													const canDelete =
														item?.workflow === EApprovalStatus.DRAFT ||
														item?.workflow === EApprovalStatus.EVIDENCE_REQUIRED;
													const now = dayjs();

													const startDate = isRegistered
														? item?.activities?.startDate
															? dayjs(item.activities.startDate)
															: null
														: item?.startDate
															? dayjs(item.startDate)
															: null;
													const endDateUpdateEvidence = item?.dueDate ? dayjs(item.dueDate) : null;
													const isOngoing = now.isAfter(startDate) && now.isBefore(endDateUpdateEvidence);
													const isOngoingPerstion =
														item?.workflow === EApprovalStatus.CHANGES_REQUIRED
															? now.isBefore(dayjs(item?.dueDate ? dayjs(item.dueDate) : null))
															: true;

													const editableWorkflow =
														item?.workflow === EApprovalStatus.DRAFT ||
														item?.workflow === EApprovalStatus.CHANGES_REQUIRED ||
														item?.workflow === EApprovalStatus.EVIDENCE_REQUIRED;

													const renderButton =
														editableWorkflow && (isRegistered ? isOngoing : isOngoingPerstion) ? (
															<Button style={{ width: '100%' }} variant='default' onClick={() => handleEdit(item)}>
																{intl.formatMessage({ id: 'activity.history.updateEvidence' })}
															</Button>
														) : (
															<Button style={{ width: '100%' }} variant='outline' onClick={() => handleView(item)}>
																{intl.formatMessage({ id: 'activity.history.seeMore' })}
															</Button>
														);

													const dateFormat = 'DD/MM/YYYY, HH:mm';
													const startSource = isRegistered ? item?.activities?.startDate : item?.startDate;
													const endSource = isRegistered ? item?.activities?.endDate : item?.endDate;
													const registerSource = isRegistered
														? (item?.activities?.dueDateRegistration ?? item?.activities?.endDate)
														: (item?.dueDate ?? item?.endDate);
													const createdAt = isRegistered ? item?.activities?.createdAt : item?.createdAt;
													const isNew = createdAt && now.isBefore(dayjs(createdAt).add(3, 'day'));
													const title = isRegistered
														? item?.activities?.name
														: item?.isAwardRecognition
															? item?.competition
															: item?.activitiesOutcomeName;
													const location = isRegistered
														? item?.activities?.onCampus
															? item?.activities?.facilityName
															: item?.activities?.otherAddress
														: [item?.organizer, item?.location].filter(Boolean).join(', ');

													return (
														<ActivityCard
															key={item._id}
															title={title || '--'}
															banner={(isRegistered ? item?.activities?.banner : item?.banner) ?? background}
															isNew={!!isNew}
															attributes={attributes}
															startDate={startSource ? dayjs(startSource).format(dateFormat) : '--'}
															endDate={endSource ? dayjs(endSource).format(dateFormat) : '--'}
															location={location}
															registerBefore={registerSource ? dayjs(registerSource).format(dateFormat) : '--'}
															approvalStatus={
																isRegistered && editableWorkflow && now.isAfter(endDateUpdateEvidence)
																	? EApprovalStatus.EXPIRED
																	: item?.workflow
															}
															deadline={
																isRegistered ? (
																	<span
																		className={
																			editableWorkflow && isOngoing
																				? 'activity-figma-card__deadline--danger'
																				: undefined
																		}
																	>
																		{intl.formatMessage({ id: 'activity.history.updateBefore' })}{' '}
																		{endDateUpdateEvidence ? endDateUpdateEvidence.format(dateFormat) : '--'}
																	</span>
																) : (
																	<span>
																		{intl.formatMessage({ id: 'activity.history.approvedBy' })}{' '}
																		{item?.studentDeclarationApproverName ?? '--'}
																	</span>
																)
															}
															deadlineIcon={
																isRegistered ? undefined : <IconHumanCheck className='activity-figma-card__icon' />
															}
															extraTags={
																item?.workflow === EApprovalStatus.APPROVED && item?.validation ? (
																	<span className='activity-figma-card__status activity-figma-card__status--VERIFIED'>
																		{item.validation}
																	</span>
																) : undefined
															}
															onClick={() => handleView(item)}
															action={
																isRegistered ? (
																	renderButton
																) : (
																	<div style={{ display: 'flex', gap: 8, width: '100%' }}>
																		<div style={{ flex: 1 }}>{renderButton}</div>
																		<ActionMenu
																			canSubmit={canEdit(item)}
																			canDelete={canDelete}
																			onSubmit={() =>
																				putModel(`me/${item?._id}`, { workflow: EApprovalStatus.SUBMITTED }, getData)
																			}
																			onDelete={() =>
																				deleteActivityModel(
																					item?._id,
																					() => {
																						getData();
																						getThongKe();
																					},
																					intl.formatMessage({ id: 'global.message.xoathanhcong' }),
																				)
																			}
																		/>
																	</div>
																)
															}
														/>
													);
												})}
											</div>

											{total > 0 && (
												<div className='pagination-container'>
													<Pagination
														current={page}
														pageSize={limit}
														total={total}
														onChange={handlePaginationChange}
														onShowSizeChange={handlePageSizeChange}
														pageSizeOptions={['5', '10', '20', '50']}
														showSizeChanger={false}
														disabled={loading}
														size='default'
														className='pagination'
													/>
												</div>
											)}
										</>
									) : (
										<EmptyState
											style={{ marginTop: 32, marginBottom: 32 }}
											description={intl.formatMessage({ id: 'global.table.index.empty' })}
										/>
									)}
								</Spin>
							</>
						),
					}))}
				/>
			</div>
			<ModalExpandable
				title={
					edit
						? intl.formatMessage({ id: 'activity.history.updateEvidence' })
						: isView
							? intl.formatMessage({ id: 'activity.history.detailEvidence' })
							: intl.formatMessage({ id: 'activity.history.addEvidence' })
				}
				width={1000}
				onCancel={() => setVisibleForm(false)}
				className={isDetailView ? 'activity-detail-modal' : undefined}
				footer={isDetailView ? detailFooter : null}
				open={visibleForm}
				destroyOnClose
			>
				{tabActive === EActivityCategory.REGISTERED ? (
					isView ? (
						<>
							<CardChiTietSuKien
								record={
									{
										...record?.activities,
										activityOutcome: record,
									} as Activity.IRecord
								}
								evidenceDeadline={record?.dueDate ? dayjs(record?.dueDate).format('HH:mm DD/MM/YYYY') : '--'}
								infoEvidence={!!record?.workflow}
								isExpired={isExpired}
								isRegister
							/>
						</>
					) : (
						<FormActivityOutCome
							getData={() => {
								getData();
								getThongKe();
							}}
						/>
					)
				) : isView && !record?.isAwardRecognition ? (
					<>
						<ChiTietActivityOutCome recOutcome={record ?? ({} as ActivityOutCome.IRecord)} />
					</>
				) : (
					<FormPerstionActivityOutCome
						getData={() => {
							getData();
							getThongKe();
						}}
					/>
				)}
			</ModalExpandable>
		</PageCard>
	);
};

export default HistoryActivityPage;
