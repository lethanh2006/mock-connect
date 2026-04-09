import { EOperatorType } from '@/components/Table/constant';
import ModalExpandable from '@/components/Table/ModalExpandable';
import { Activity } from '@/services/CCT/Activity/typing';
import { ActivityOutCome } from '@/services/CCT/ActivityOutcome/typing';
import { EActivityCategory, EActivityStatus, EApprovalStatus, mapNameActivityCategory } from '@/services/CCT/constant';
import dayjs from '@/utils/dayjs';
import { DashOutlined, DeleteOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Card, Col, Empty, Pagination, Popconfirm, Popover, Row, Space, Spin, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import { FilterSuKienValue } from '../Activity';
import CardChiTietSuKien from '../Activity/components/CardChiTietSuKien';
import CardSuKienCCT from '../Activity/components/CardSuKien';
import FilterSuKien from '../Activity/components/FilterSuKien';
import '../Activity/style.less';
import ChiTietActivityOutCome from './components/ChiTiet';
import FormActivityOutCome from './components/Form';
import FormPerstionActivityOutCome from './components/FormPerstion';
import StatActivityOutCome from './components/Stat';

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
	const { getAllModel: getAllAtributes } = useModel('cct.attributes');

	const [tabActive, setTabActive] = useState<EActivityCategory>(EActivityCategory.REGISTERED);
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

	return (
		<Card title='My Activity' className='table-base-card' variant='borderless'>
			<Tabs
				activeKey={tabActive}
				onChange={(tab) => {
					setTabActive(tab as EActivityCategory);
					setPage(1);
					setLimit(9);
				}}
			>
				{Object.values(EActivityCategory).map((item) => (
					<Tabs.TabPane tab={mapNameActivityCategory[item]} key={item} />
				))}
			</Tabs>

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
							type='primary'
							onClick={() => {
								setRecord({} as ActivityOutCome.IRecord);
								setEdit(false);
								setIsView(false);
								setVisibleForm(true);
							}}
						>
							Add New
						</Button>
					) : undefined
				}
				hideSelect
			/>

			<hr
				style={{
					marginTop: 16,
					marginBottom: 16,
					border: 'none',
					borderTop: '1px solid #f0f0f0',
				}}
			/>

			<StatActivityOutCome
				getData={getThongKe}
				tabActive={tabActive}
				onChangeWorkflow={setWorkflowQuery}
				currentWorkflow={workflowQuery}
			/>
			<hr
				style={{
					marginTop: 16,
					marginBottom: 16,
					border: 'none',
					borderTop: '1px solid #f0f0f0',
				}}
			/>

			<Spin spinning={loading}>
				{danhSach?.length ? (
					<>
						<Row gutter={[12, 12]}>
							{danhSach?.map((item) => {
								const equivalencyAttributeIds = item?.activities?.coCurricularActivityEquivalency?.map(
									(x) => x.attributesId,
								);

								const canDelete =
									item?.workflow === EApprovalStatus.DRAFT || item?.workflow === EApprovalStatus.EVIDENCE_REQUIRED;
								const now = dayjs();

								const startDate = item?.activities?.startDate ? dayjs(item?.activities.startDate) : null;
								const endDateUpdateEvidence = item?.dueDate ? dayjs(item?.dueDate) : null;
								const isOngoing = now.isAfter(startDate) && now.isBefore(endDateUpdateEvidence);
								const isOngoingPerstion =
									item?.workflow === EApprovalStatus.CHANGES_REQUIRED
										? now.isBefore(dayjs(item?.dueDate ? dayjs(item?.dueDate) : null))
										: true;

								const endDateSource = item?.activities?.dueDateRegistration ?? item?.activities?.endDate;
								const endDate = endDateSource ? dayjs(endDateSource) : null;
								const outTimeRegis = now.isAfter(endDate) && !item?.workflow;

								const editableWorkflow =
									item?.workflow === EApprovalStatus.DRAFT ||
									item?.workflow === EApprovalStatus.CHANGES_REQUIRED ||
									item?.workflow === EApprovalStatus.EVIDENCE_REQUIRED;

								const renderButton =
									editableWorkflow && (tabActive === EActivityCategory.REGISTERED ? isOngoing : isOngoingPerstion) ? (
										<Button block type={'primary'} onClick={() => handleEdit(item)}>
											Update Evidence
										</Button>
									) : (
										<Button block onClick={() => handleView(item)}>
											SEE MORE
										</Button>
									);

								return (
									<Col key={item._id} xs={24} sm={12} md={8} lg={8}>
										{tabActive === EActivityCategory.REGISTERED ? (
											<CardSuKienCCT
												record={{
													...item?.activities,
													activityOutcome: item,
												}}
												banner={item?.activities?.banner ?? undefined}
												name={item?.activities?.name}
												startDate={
													item?.activities?.startDate
														? dayjs(item?.activities?.startDate).format('HH:mm DD/MM/YYYY')
														: '--'
												}
												endDate={
													item?.activities?.endDate ? dayjs(item?.activities?.endDate).format('HH:mm DD/MM/YYYY') : '--'
												}
												equivalencyAttributeIds={equivalencyAttributeIds}
												onClick={() => handleView(item)}
												button={
													<Row style={{ marginTop: 12 }} gutter={[6, 0]}>
														<Col span={24}>{renderButton}</Col>
													</Row>
												}
												outTimeRegis={outTimeRegis}
												isExpired={editableWorkflow && now.isAfter(endDateUpdateEvidence)}
												isRegister
											/>
										) : (
											<CardSuKienCCT
												record={{
													...item?.activities,
													activityOutcome: item,
												}}
												banner={item?.banner ?? undefined}
												name={item?.isAwardRecognition ? item?.competition : item?.activitiesOutcomeName}
												startDate={item?.startDate ? dayjs(item?.startDate).format('HH:mm DD/MM/YYYY') : '--'}
												endDate={item?.endDate ? dayjs(item?.endDate).format('HH:mm DD/MM/YYYY') : '--'}
												equivalencyAttributeIds={item?.activitiesType?.attributes?.map((x) => x._id)}
												onClick={() => handleView(item)}
												button={
													<Row style={{ marginTop: 12 }} gutter={[6, 0]}>
														<Col span={3}>
															<Popover
																placement='bottom'
																content={
																	<Space direction='vertical' size={4} className='action-popover'>
																		<Popconfirm
																			onConfirm={(e) =>
																				putModel(`me/${item?._id}`, { workflow: EApprovalStatus.SUBMITTED }, getData)
																			}
																			title={intl.formatMessage({ id: 'activity.confirm.duyet' })}
																			placement='topLeft'
																		>
																			<Button
																				className='btn-success'
																				disabled={!canEdit(item)}
																				type='link'
																				icon={<SendOutlined />}
																				size='small'
																			>
																				{intl.formatMessage({ id: 'activity.button.duyet' })}
																			</Button>
																		</Popconfirm>

																		<Popconfirm
																			onConfirm={() =>
																				deleteActivityModel(
																					item?._id,
																					() => {
																						getData();
																						getThongKe();
																					},
																					intl.formatMessage({ id: 'global.message.xoathanhcong' }),
																				)
																			}
																			title={intl.formatMessage({ id: 'activity.confirm.xoa' })}
																			placement='topLeft'
																		>
																			<Button
																				disabled={!canDelete}
																				danger
																				type='link'
																				icon={<DeleteOutlined />}
																				size='small'
																			>
																				{intl.formatMessage({ id: 'activity.button.xoa' })}
																			</Button>
																		</Popconfirm>
																	</Space>
																}
															>
																<Button block icon={<DashOutlined />} />
															</Popover>
														</Col>
														<Col span={21}>{renderButton}</Col>
													</Row>
												}
												isPersonal
												isExpired={
													item?.workflow === EApprovalStatus.CHANGES_REQUIRED && now.isAfter(dayjs(item?.dueDate))
												}
												isAward={item?.isAwardRecognition}
											/>
										)}
									</Col>
								);
							})}
						</Row>

						{total > 0 && (
							<div className='pagination-container'>
								<Pagination
									current={page}
									pageSize={limit}
									total={total}
									onChange={handlePaginationChange}
									onShowSizeChange={handlePageSizeChange}
									pageSizeOptions={['5', '10', '20', '50']}
									disabled={loading}
									size='default'
									className='pagination'
								/>
							</div>
						)}
					</>
				) : (
					<Empty
						style={{ marginTop: 32, marginBottom: 32 }}
						description={intl.formatMessage({ id: 'global.table.index.empty' })}
						image='/images/empty.png'
					/>
				)}
			</Spin>

			<ModalExpandable
				title={edit ? 'Update Evidence' : isView ? 'Detail Evidence' : 'Add Evidence'}
				width={1000}
				onCancel={() => setVisibleForm(false)}
				footer={null}
				open={visibleForm}
				styles={
					isView
						? {
								body: { backgroundColor: '#F8F8F8', borderRadius: 2 },
								header: { backgroundColor: '#F8F8F8' },
							}
						: undefined
				}
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

							<div
								style={{
									backgroundColor: '#fff',
									display: 'flex',
									gap: 8,
									justifyContent: 'flex-end',
									margin: '15px -15px -15px -15px',
									padding: 16,
								}}
							>
								<Button onClick={() => setVisibleForm(false)}>Close</Button>
								{canEdit(record ?? ({} as ActivityOutCome.IRecord)) && (
									<Button type='primary' onClick={() => handleEdit(record)}>
										Update Evidence
									</Button>
								)}
							</div>
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

						<div
							style={{
								backgroundColor: '#fff',
								display: 'flex',
								gap: 8,
								justifyContent: 'flex-end',
								margin: '15px -15px -15px -15px',
								padding: 16,
							}}
						>
							<Button onClick={() => setVisibleForm(false)}>Close</Button>
							{canEdit(record ?? ({} as ActivityOutCome.IRecord)) && (
								<Button type='primary' onClick={() => handleEdit(record)}>
									Update Evidence
								</Button>
							)}
						</div>
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
		</Card>
	);
};

export default HistoryActivityPage;
