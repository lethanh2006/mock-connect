import ButtonExtend from '@/components/Table/ButtonExtend';
import ModalExpandable from '@/components/Table/ModalExpandable';
import { EApprovalStatus } from '@/services/CCT/constant';
import { Card, Col, Empty, Popconfirm, Row, Spin, Tabs } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';
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
}

const ActivityPage = () => {
	const intl = useIntl();
	const { getAllModel, danhSach, registerActivityModel, loading, setRecord, setVisibleForm } = useModel('cct.activity');
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
		dateRange: [dayjs().startOf('month'), dayjs().endOf('month')],
	});

	const getData = () => {
		if (filter?.dateRange?.length === 2) {
			getAllModel(
				undefined,
				undefined,
				undefined,
				undefined,
				`me/from/${filter?.dateRange[0]}/to/${filter?.dateRange[1]}`,
			);
		}
	};

	useEffect(() => {
		getAllAtributes(undefined, { order: 1 }, { isActive: true });
	}, []);

	useEffect(() => {
		getData();
	}, [filter]);

	const filteredList = useMemo(() => {
		if (!danhSach) return [];
		const now = dayjs();
		const mapped = danhSach.map((item) => {
			const start = item?.startDate ? dayjs.utc(item.startDate).local() : null;
			const end = item?.endDate ? dayjs.utc(item.endDate).local() : null;
			let status: 'upcoming' | 'ongoing' | 'completed' | 'unknown' = 'unknown';
			if (start && end) {
				if (now.isBefore(start)) status = 'upcoming';
				else if (now.isAfter(end)) status = 'completed';
				else status = 'ongoing';
			}
			return {
				...item,
				__status: status,
				__start: start,
				__end: end,
			};
		});
		if (activeKey === '1') {
			return _.orderBy(_.filter(mapped, { __status: 'upcoming' }), ['__start'], ['asc']);
		}
		if (activeKey === '2') {
			return _.orderBy(
				_.filter(mapped, (item) => ['ongoing', 'upcoming'].includes(item.__status)),
				['__start'],
				['asc'],
			);
		}
		if (activeKey === '3') {
			return _.orderBy(_.filter(mapped, { __status: 'completed' }), ['__end'], ['desc']);
		}
		return mapped;
	}, [danhSach, activeKey]);

	return (
		<Card title='List activity' className='table-base-card' variant='borderless'>
			<Tabs activeKey={activeKey} onChange={(tab) => setActiveKey(tab)}>
				<Tabs.TabPane key='1' tab='Upcoming' />
				<Tabs.TabPane key='2' tab='Ongoing' />
				<Tabs.TabPane key='3' tab='Completed' />
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
				{filteredList?.length ? (
					<Row gutter={[12, 12]}>
						{filteredList?.map((item) => {
							const equivalencyAttributeIds = item?.coCurricularActivityEquivalency?.map((x) => x.attributesId);
							const now = dayjs();

							const endDateSource = item?.dueDateRegistration ?? item?.endDate;
							const endDate = endDateSource ? dayjs(endDateSource) : null;
							const startDate = item?.startDate ? dayjs(item.startDate) : null;

							const isRegistered = !!item.workflow;

							const isNotStarted = startDate && now.isBefore(startDate);
							const isEnded = endDate && now.isAfter(endDate);
							const isOngoing =
								startDate &&
								endDate &&
								(now.isAfter(startDate) || now.isSame(startDate)) &&
								(now.isBefore(endDate) || now.isSame(endDate));

							const isFullSlot = !!item?.capacity && (item?.numberOfRegisteredActivityOutcomes ?? 0) >= item.capacity;

							const editableWorkflow =
								item?.workflow === EApprovalStatus.DRAFT ||
								item?.workflow === EApprovalStatus.CHANGES_REQUIRED ||
								item?.workflow === EApprovalStatus.EVIDENCE_REQUIRED;

							const renderButton = () => {
								//chưa diễn ra + đã đăng ký
								if (isRegistered && isNotStarted) {
									return (
										<ButtonExtend block disabled>
											REGISTERED
										</ButtonExtend>
									);
								}

								//chỉ khi chưa đăng ký và chưa hết hạn
								if (!isRegistered && isFullSlot) {
									return (
										<ButtonExtend block disabled>
											FULL SLOT
										</ButtonExtend>
									);
								}

								if (editableWorkflow && isOngoing) {
									return (
										<ButtonExtend
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
											Update Evidence
										</ButtonExtend>
									);
								}

								//đã kết thúc hoặc đang diễn ra và đã đăng ký
								if (isEnded || (isRegistered && isOngoing)) {
									return (
										<ButtonExtend block disabled>
											SEE MORE
										</ButtonExtend>
									);
								}

								return (
									<Popconfirm
										title={intl.formatMessage({ id: 'activity.confirm.dangky' })}
										placement='topLeft'
										onConfirm={() => registerActivityModel(item._id, getData).then(() => setVisibleDangKy(true))}
									>
										<ButtonExtend type='primary' block>
											REGISTER NOW
										</ButtonExtend>
									</Popconfirm>
								);
							};

							const isExpiringSoon = endDate && endDate.isAfter(now) && endDate.diff(now, 'day', true) <= 3;

							return (
								<Col key={item._id} xs={24} sm={12} md={8} lg={8}>
									<CardSuKienCCT
										record={{
											...item,
											workflow: item?.workflow ?? item?.activityOutcome?.workflow,
										}}
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
										isOutOfTime={isEnded ?? undefined}
										isExpiringSoon={isExpiringSoon ?? undefined}
										activeKey={activeKey}
									/>
								</Col>
							);
						})}
					</Row>
				) : (
					<Empty
						style={{ marginTop: 32, marginBottom: 32 }}
						description={intl.formatMessage({ id: 'global.table.index.empty' })}
						image='/images/empty.png'
					/>
				)}
			</Spin>

			<ChiTietActivity getData={getData} setVisibleDangKy={setVisibleDangKy} />

			<ModalDangKyThanhCong visibleDangKy={visibleDangKy} setVisibleDangKy={setVisibleDangKy} />

			<ModalExpandable
				title={'Update Evidence'}
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
