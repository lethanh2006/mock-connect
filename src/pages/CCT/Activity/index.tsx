import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EApprovalStatus, mapColorApprovalStatus, mapNameApprovalStatus } from '@/services/CCT/constant';
import { CalendarOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Card, Col, Empty, Flex, Popconfirm, Row, Spin, Tag, Tooltip, Typography } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import ChiTietActivity from './ChiTiet';
import './style.less';

const { Title } = Typography;

const ActivityPage = () => {
	const intl = useIntl();
	const { getAllModel, danhSach, registerActivityModel, loading, setRecord, setVisibleForm } = useModel('cct.activity');

	const [dateRange, setDateRange] = useState<string[]>([
		dayjs().startOf('month').toISOString(),
		dayjs().endOf('month').toISOString(),
	]);

	const getData = () => {
		if (dateRange?.length === 2) {
			getAllModel(undefined, undefined, undefined, undefined, `me/from/${dateRange[0]}/to/${dateRange[1]}`);
		}
	};

	useEffect(() => {
		getData();
	}, [dateRange]);

	return (
		<Card title='List activity' className='table-base-card' variant='borderless'>
			<Flex justify='space-between' align='center' style={{ marginBottom: 16 }}>
				<MyDateRangePicker
					style={{ width: 300 }}
					value={dateRange?.length === 2 ? [dayjs(dateRange[0]), dayjs(dateRange[1])] : null}
					onChange={(val: any) => setDateRange(val ?? [])}
					ranges={{
						[intl.formatMessage({ id: 'activity.date.homnay' })]: [dayjs().startOf('date'), dayjs().endOf('date')],
						[intl.formatMessage({ id: 'activity.date.tuannay' })]: [dayjs().startOf('week'), dayjs().endOf('week')],
						[intl.formatMessage({ id: 'activity.date.thangnay' })]: [dayjs().startOf('month'), dayjs().endOf('month')],
					}}
				/>

				<ButtonExtend icon={<ReloadOutlined />} onClick={getData} />
			</Flex>

			<Spin spinning={loading}>
				{danhSach?.length ? (
					<Row gutter={[24, 24]}>
						{danhSach?.map((item) => {
							// const isFutureOrNow = dayjs(item.startDate).isSameOrAfter(dayjs());
							const disabledRegister = !!item.workflow || !item.activitiesTypeId;

							return (
								<Col key={item._id} xs={24} sm={12} md={8} lg={6} className='activity-col'>
									<Card
										hoverable
										className='activity-card'
										cover={
											<div className='activity-cover'>
												<img src={item.banner ?? '/metadata.png'} alt={item.name} className='activity-image' />

												<div className='activity-date'>
													<CalendarOutlined />
													<span>{dayjs(item.startDate).format('MMM DD, YYYY')}</span>
												</div>

												<div style={{ position: 'absolute', top: 16, right: 16 }}>
													<Tag color={mapColorApprovalStatus[item.workflow as EApprovalStatus]}>
														{mapNameApprovalStatus[item.workflow as EApprovalStatus]}
													</Tag>
												</div>
											</div>
										}
										onClick={() => {
											setRecord(item);
											setVisibleForm(true);
										}}
									>
										<div className='activity-content'>
											<Title level={5} className='activity-title'>
												{item?.name}
											</Title>
										</div>

										<div className='activity-footer'>
											<Popconfirm
												title={intl.formatMessage({ id: 'activity.confirm.dangky' })}
												placement='topLeft'
												onConfirm={(e) => {
													e?.stopPropagation?.();
													registerActivityModel(
														item._id,
														getData,
														intl.formatMessage({ id: 'global.message.luuthanhcong' }),
													);
												}}
												onCancel={(e) => e?.stopPropagation?.()}
												disabled={disabledRegister}
											>
												<div
													onClick={(e) => {
														e.stopPropagation();
													}}
												>
													<Tooltip
													//  title={!isFutureOrNow ? 'The event has started or has ended' : undefined}
													>
														<Button block type='default' className='activity-btn' disabled={disabledRegister}>
															Register Now
														</Button>
													</Tooltip>
												</div>
											</Popconfirm>
										</div>
									</Card>
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

			<ChiTietActivity getData={getData} />
		</Card>
	);
};

export default ActivityPage;
