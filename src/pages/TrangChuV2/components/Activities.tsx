import background from '@/assets/cct/background.png';
import EmptyState from '@/components/EmptyState';
import { Button } from '@/components/Icons';
import { Col, Row } from '@/components/MyGrid';
import { Card } from '@/components/PageCard';
import { EOperatorType } from '@/components/Table/constant';
import ModalExpandable from '@/components/Table/ModalExpandable';
import ChiTietActivity from '@/pages/CCT/Activity/ChiTiet';
import ModalDangKyThanhCong from '@/pages/CCT/Activity/components/DangKyThanhCong';
import FormActivityOutCome from '@/pages/CCT/History/components/Form';
import { Activity } from '@/services/CCT/Activity/typing';
import { EApprovalStatus } from '@/services/CCT/constant';
import { Flex, Popconfirm, Spin } from 'antd';
import ActivityCard from './ActivityCard';

import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
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
	const { getAllModel: getAllAtributes, danhSach: dsAttribute } = useModel('cct.attributes');
	const [activeKey] = useState<string>('2');
	const [visibleDangKy, setVisibleDangKy] = useState<boolean>(false);

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
			className='vin-dashboard-card'
			title={
				<Flex justify='space-between' align='center'>
					<h3
						className='title'
						style={{ margin: 0, fontSize: 'inherit', fontWeight: 'inherit', color: 'var(--color-text, inherit)' }}
					>
						{intl.formatMessage({ id: 'trangchu.v2.academicProgress.activities' })}
					</h3>
				</Flex>
			}
			styles={{
				body: { padding: 0 },
			}}
		>
			<div className='activities'>
				<Spin spinning={loading}>
					{danhSach?.length ? (
						<Row gutter={[12, 12]}>
							{danhSach.map((item) => {
								const equivalencyAttributeIds = item?.coCurricularActivityEquivalency?.map(
									(x: Activity.IEquivalency) => x.attributesId,
								);
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
								// const isExpired = activeKey === '3' && editableWorkflow && now.isAfter(endDateUpdateEvidence);

								const renderButton = () => {
									if (isRegistered && isNotStarted) {
										return (
											<Button className='w-full' disabled>
												{intl.formatMessage({ id: 'activity.dangky' })}
											</Button>
										);
									}
									if (editableWorkflow && isOngoing) {
										return (
											<Button
												className='w-full'
												variant='default'
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
											<Button className='w-full' disabled>
												{intl.formatMessage({ id: 'activity.full' })}
											</Button>
										);
									}
									if (isRegistered || (activeKey === '3' && !isRegistered) || outTimeRegis) {
										return (
											<Button
												className='w-full'
												variant='secondary'
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
											<Button variant='default' className='w-full'>
												{intl.formatMessage({ id: 'activity.now' })}
											</Button>
										</Popconfirm>
									);
								};

								const dateFormat = 'DD/MM/YYYY, HH:mm';
								const registerSource = item?.dueDateRegistration ?? item?.endDate;
								const isNew = item?.createdAt && dayjs().isBefore(dayjs(item.createdAt).add(3, 'day'));
								const attributes = (dsAttribute ?? []).map((attribute: AttributesManagement.IRecord) => {
									const letter = attribute.code?.charAt(0)?.toUpperCase() ?? '';
									return {
										id: attribute._id,
										letter,
										active: equivalencyAttributeIds?.includes(attribute._id),
									};
								});

								return (
									<Col xs={24} md={12} xxl={8} key={item._id}>
										<ActivityCard
											title={item?.name}
											banner={item?.banner ?? background}
											isNew={!!isNew}
											attributes={attributes}
											startDate={item?.startDate ? dayjs(item.startDate).format(dateFormat) : '--'}
											endDate={item?.endDate ? dayjs(item.endDate).format(dateFormat) : '--'}
											location={item?.onCampus ? item?.facilityName : item?.otherAddress}
											registerBefore={registerSource ? dayjs(registerSource).format(dateFormat) : '--'}
											approvalStatus={item?.activityOutcome?.workflow}
											onClick={() => {
												setRecord(item);
												setVisibleForm(true);
											}}
											action={renderButton()}
										/>
									</Col>
								);
							})}
						</Row>
					) : (
						<EmptyState className='my-8' compact description={intl.formatMessage({ id: 'global.table.index.empty' })} />
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
