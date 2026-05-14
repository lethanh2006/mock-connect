import background from '@/assets/cct/background.png';
import { EOperatorType } from '@/components/Table/constant';
import ModalExpandable from '@/components/Table/ModalExpandable';
import { EApprovalStatus } from '@/services/CCT/constant';
import { Button, Card, Col, Empty, Pagination, Popconfirm, Row, Spin, Tabs } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import FormActivityOutCome from '../History/components/Form';
import ChiTietActivity from './ChiTiet';
import CardSuKienCCT from './components/CardSuKien';
import ModalDangKyThanhCong from './components/DangKyThanhCong';
import FilterSuKien from './components/FilterSuKien';
import './style.less';

dayjs.extend(utc);

export interface FilterSuKienValue {
	search?: string;
	dateRange?: Dayjs[] | [];
	regiStatus?: 'All' | 'Registered' | 'NotRegistered';
}

const ActivityPage = () => {
	const intl = useIntl();
	const {
		getModel,
		danhSach,
		page,
		limit,
		setPage,
		setLimit,
		registerActivityModel,
		loading,
		setRecord,
		setVisibleForm,
		total,
	} = useModel('cct.activity');
	const {
		setVisibleForm: setVisibleFormActivityOutcome,
		visibleForm: visibleFormActivityOutcome,
		handleEdit,
	} = useModel('cct.activityoutcome');
	const { getAllModel: getAllAtributes } = useModel('cct.attributes');
	const [activeKey, setActiveKey] = useState<string>('1');
	const [visibleDangKy, setVisibleDangKy] = useState<boolean>(false);

	const [filter, setFilter] = useState<FilterSuKienValue>({
		search: undefined,
		dateRange: [],
		regiStatus: undefined,
	});

	const getData = () => {
		const now = dayjs().toISOString();
		const filters: any[] = [];

		if (activeKey === '1') {
			filters.push({
				active: true,
				field: 'startDate',
				values: [now],
				operator: EOperatorType.GREAT_THAN,
			});
		}

		if (activeKey === '2') {
			filters.push(
				{
					active: true,
					field: 'startDate',
					values: [now],
					operator: EOperatorType.LESS_EQUAL,
				},
				{
					active: true,
					field: 'endDate',
					values: [now],
					operator: EOperatorType.GREAT_EQUAL,
				},
			);
		}

		if (activeKey === '3') {
			filters.push({
				active: true,
				field: 'endDate',
				values: [now],
				operator: EOperatorType.LESS_THAN,
			});
		}

		if (!!filter?.search) {
			filters.push({
				active: true,
				field: 'name',
				values: [filter?.search],
				operator: EOperatorType.CONTAIN,
			});
		}

		if (!!filter?.dateRange?.length) {
			filters.push({
				active: true,
				field: ['startDate'],
				values: [filter?.dateRange[0], filter?.dateRange[1]],
				operator: EOperatorType.BETWEEN,
			});
		}

		getModel(
			undefined,
			filters,
			activeKey === '2'
				? {
						startDate: -1,
					}
				: activeKey === '1'
					? {
							startDate: 1,
						}
					: activeKey === '3'
						? {
								endDate: -1,
							}
						: undefined,
			undefined,
			9,
			'me/page',
			{
				registerStatus: filter?.regiStatus,
			},
		);
	};

	useEffect(() => {
		getAllAtributes(undefined, { order: 1 }, { isActive: true });
	}, []);

	useEffect(() => {
		getData();
	}, [activeKey, filter, page, limit]);

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

	return (
		<Card title={intl.formatMessage({ id: 'activity.list' })} className='table-base-card' variant='borderless'>
			<Tabs
				activeKey={activeKey}
				onChange={(tab) => {
					setActiveKey(tab);
					setPage(1);
					setLimit(9);
				}}
			>
				<Tabs.TabPane key='1' tab={intl.formatMessage({ id: 'activity.upcoming' })} />
				<Tabs.TabPane key='2' tab={intl.formatMessage({ id: 'activity.ongoing' })} />
				<Tabs.TabPane key='3' tab={intl.formatMessage({ id: 'activity.completed' })} />
			</Tabs>

			<FilterSuKien value={filter} onChange={setFilter} onReload={getData} />

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
								const equivalencyAttributeIds = item?.coCurricularActivityEquivalency?.map((x) => x.attributesId);
								const now = dayjs();

								const startDate = item?.startDate ? dayjs(item.startDate) : null;
								const endDateUpdateEvidence =
									item?.activityOutcome?.workflow === EApprovalStatus.CHANGES_REQUIRED
										? item?.activityOutcome?.dueDate
											? dayjs(item?.activityOutcome?.dueDate)
											: null
										: item?.allowPostEventResultsUpdate
											? item.dueDate
												? dayjs(item.dueDate)
												: null
											: item?.endDate
												? dayjs(item.endDate)
												: null;

								const isOngoing = now.isAfter(startDate) && now.isBefore(endDateUpdateEvidence);

								const endDateSource = item?.dueDateRegistration ?? item?.endDate;
								const endDate = endDateSource ? dayjs(endDateSource) : null;
								const outTimeRegis = now.isAfter(endDate) && !item?.activityOutcome?.workflow;

								const isRegistered = !!item?.activityOutcome?.workflow;
								const isNotStarted = startDate && now.isBefore(startDate);

								const isFullSlot = !!item?.capacity && (item?.numberOfRegisteredActivityOutcomes ?? 0) >= item.capacity;

								const editableWorkflow =
									item?.activityOutcome?.workflow === EApprovalStatus.DRAFT ||
									item?.activityOutcome?.workflow === EApprovalStatus.CHANGES_REQUIRED ||
									item?.activityOutcome?.workflow === EApprovalStatus.EVIDENCE_REQUIRED;

								const isExpired = activeKey === '3' && editableWorkflow && now.isAfter(endDateUpdateEvidence);

								const renderButton = () => {
									//Chưa đăng ký
									if (isRegistered && isNotStarted) {
										return (
											<Button block disabled>
												{intl.formatMessage({ id: 'activity.dangky' })}
											</Button>
										);
									}

									//Đã đăng ký và trong thời gian cập nhật minh chứng
									if (editableWorkflow && isOngoing) {
										return (
											<Button
												block
												type='primary'
												onClick={() => {
													setVisibleForm(false);
													handleEdit({
														...item?.activityOutcome,
														activities: item,
													});
												}}
											>
												{intl.formatMessage({ id: 'activity.update' })}
											</Button>
										);
									}

									//Hết số lượng đăng ký
									if (!isRegistered && isFullSlot) {
										return (
											<Button block disabled>
												{intl.formatMessage({ id: 'activity.full' })}
											</Button>
										);
									}

									//Đã đăng ký và ngoài thời gian cập nhật minh chứng
									if (isRegistered || (activeKey === '3' && !isRegistered) || outTimeRegis) {
										return (
											<Button
												block
												onClick={() => {
													setRecord(item);
													setVisibleForm(true);
												}}
											>
												{intl.formatMessage({ id: 'activity.see' })}
											</Button>
										);
									}

									return (
										<Popconfirm
											title={intl.formatMessage({ id: 'activity.confirm.dangky' })}
											placement='topLeft'
											onConfirm={() => registerActivityModel(item._id, getData).then(() => setVisibleDangKy(true))}
										>
											<Button type='primary' block>
												{intl.formatMessage({ id: 'activity.now' })}
											</Button>
										</Popconfirm>
									);
								};

								return (
									<Col key={item._id} xs={24} sm={12} md={8} lg={8}>
										<CardSuKienCCT
											record={{
												...item,
												activityOutcome: item?.activityOutcome,
											}}
											banner={item?.banner ?? background}
											name={item?.name}
											startDate={item?.startDate ? dayjs(item?.startDate).format('HH:mm DD/MM/YYYY') : '--'}
											endDate={item?.endDate ? dayjs(item?.endDate).format('HH:mm DD/MM/YYYY') : '--'}
											equivalencyAttributeIds={equivalencyAttributeIds}
											onClick={() => {
												setRecord(item);
												setVisibleForm(true);
											}}
											button={
												<Row style={{ padding: '12px 4px 4px 4px' }} gutter={[6, 0]}>
													<Col span={24}>{renderButton()}</Col>
												</Row>
											}
											outTimeRegis={outTimeRegis && activeKey !== '3'}
											activeKey={activeKey}
											isExpired={isExpired}
										/>
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
									showSizeChanger={false}
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
						image='/student/images/empty.png'
					/>
				)}
			</Spin>

			<ChiTietActivity getData={getData} setVisibleDangKy={setVisibleDangKy} activeKey={activeKey} />

			<ModalDangKyThanhCong visibleDangKy={visibleDangKy} setVisibleDangKy={setVisibleDangKy} />

			<ModalExpandable
				title={intl.formatMessage({ id: 'activity.update' })}
				width={1000}
				onCancel={() => setVisibleFormActivityOutcome(false)}
				footer={null}
				open={visibleFormActivityOutcome}
			>
				<FormActivityOutCome getData={getData} />
			</ModalExpandable>
		</Card>
	);
};

export default ActivityPage;
