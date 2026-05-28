import background from '@/assets/cct/background.png';
import { EOperatorType } from '@/components/Table/constant';
import ModalExpandable from '@/components/Table/ModalExpandable';
import ChiTietActivity from '@/pages/CCT/Activity/ChiTiet';
import CardSuKienCCT from '@/pages/CCT/Activity/components/CardSuKien';
import ModalDangKyThanhCong from '@/pages/CCT/Activity/components/DangKyThanhCong';
import FormActivityOutCome from '@/pages/CCT/History/components/Form';
import { EApprovalStatus } from '@/services/CCT/constant';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Card, Carousel, Col, Empty, Flex, Popconfirm, Row, Spin } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { useIntl, useModel } from 'umi';
import '../../CCT/Activity/style.less';

const Activities = () => {
	const intl = useIntl();
	const { getModel, danhSach, registerActivityModel, loading, setRecord, setVisibleForm } = useModel('cct.activity');
	const {
		setVisibleForm: setVisibleFormActivityOutcome,
		visibleForm: visibleFormActivityOutcome,
		handleEdit,
	} = useModel('cct.activityoutcome');
	const { getAllModel: getAllAtributes } = useModel('cct.attributes');
	const [activeKey, setActiveKey] = useState<string>('2');
	const [visibleDangKy, setVisibleDangKy] = useState<boolean>(false);

	const carouselRef = useRef<any>(null);

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

		getModel(
			undefined,
			filters,
			activeKey === '2'
				? { startDate: -1 }
				: activeKey === '1'
					? { startDate: 1 }
					: activeKey === '3'
						? { endDate: -1 }
						: undefined,
			undefined,
			10,
			'me/page',
		);
	};

	useEffect(() => {
		getAllAtributes(undefined, { order: 1 }, { isActive: true });
	}, []);

	useEffect(() => {
		getData();
	}, [activeKey]);

	return (
		<Card
			title={
				<Flex justify='space-between' align='center'>
					<span className='title'>Activities</span>
					{danhSach && danhSach.length > 1 && (
						<div className='pagination-controls'>
							<button className='nav-btn' onClick={() => carouselRef.current?.prev()}>
								<LeftOutlined />
							</button>
							<button className='nav-btn' onClick={() => carouselRef.current?.next()}>
								<RightOutlined />
							</button>
						</div>
					)}
				</Flex>
			}
			styles={{
				body: { padding: 0 },
			}}
		>
			<div className='activities'>
				<Spin spinning={loading}>
					{danhSach?.length ? (
						<Carousel
							ref={carouselRef}
							autoplay
							autoplaySpeed={5000}
							dots={false}
							infinite={danhSach.length > 1}
							effect='scrollx'
						>
							{danhSach.map((item) => {
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
									if (isRegistered && isNotStarted) {
										return (
											<Button block disabled>
												{intl.formatMessage({ id: 'activity.dangky' })}
											</Button>
										);
									}
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
									if (!isRegistered && isFullSlot) {
										return (
											<Button block disabled>
												{intl.formatMessage({ id: 'activity.full' })}
											</Button>
										);
									}
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
									<div key={item._id}>
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
									</div>
								);
							})}
						</Carousel>
					) : (
						<Empty
							style={{ marginTop: 32, marginBottom: 32 }}
							description={intl.formatMessage({ id: 'global.table.index.empty' })}
							image='/student/images/empty.png'
						/>
					)}
				</Spin>
			</div>

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

export default Activities;
