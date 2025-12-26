import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EApprovalStatus, mapColorApprovalStatus, mapNameApprovalStatus } from '@/services/CCT/constant';
import { ReloadOutlined } from '@ant-design/icons';
import { Button, Card, Col, Popconfirm, Row, Space, Spin, Tag, Tooltip, Typography } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import ChiTietActivity from './ChiTiet';

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
		<Card title='List activity'>
			<Space style={{ marginBottom: 16 }}>
				<MyDateRangePicker
					value={dateRange?.length === 2 ? [dayjs(dateRange[0]), dayjs(dateRange[1])] : null}
					onChange={(val: any) => setDateRange(val ?? [])}
					ranges={{
						[intl.formatMessage({ id: 'activity.date.homnay' })]: [dayjs().startOf('date'), dayjs().endOf('date')],
						[intl.formatMessage({ id: 'activity.date.tuannay' })]: [dayjs().startOf('week'), dayjs().endOf('week')],
						[intl.formatMessage({ id: 'activity.date.thangnay' })]: [dayjs().startOf('month'), dayjs().endOf('month')],
					}}
				/>

				<ButtonExtend icon={<ReloadOutlined />} onClick={getData}>
					{intl.formatMessage({ id: 'global.button.tailai' })}
				</ButtonExtend>
			</Space>

			<Spin spinning={loading}>
				<Row gutter={[24, 24]}>
					{danhSach?.map((item) => {
						const isFutureOrNow = dayjs(item.startDate).isSameOrAfter(dayjs());

						const disabledRegister = !!item.workflow || !item.activitiesTypeId || !isFutureOrNow;

						return (
							<Col key={item._id} xs={24} sm={12} md={8} lg={6}>
								<Card
									hoverable
									style={{
										borderRadius: 12,
										overflow: 'hidden',
										boxShadow: '0 2px 8px rgba(0,0,0,0.09)',
									}}
									styles={{ body: { padding: 0 } }}
									cover={
										<div style={{ position: 'relative' }}>
											<img
												alt={item.name}
												src={item.banner ?? '/logo.png'}
												style={{
													height: 200,
													width: '100%',
													objectFit: 'cover',
												}}
											/>

											<div
												style={{
													position: 'absolute',
													top: 16,
													left: 16,
													background: 'rgba(0,0,0,0.7)',
													color: '#fff',
													padding: '6px 12px',
													borderRadius: 6,
													fontSize: 13,
												}}
											>
												{dayjs(item.startDate).format('DD/MM/YYYY')}
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
									<div style={{ padding: 20 }}>
										<Title level={4} style={{ marginBottom: 8 }}>
											{item.name}
										</Title>

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
											onCancel={(e) => {
												e?.stopPropagation?.();
											}}
											disabled={disabledRegister}
											okText='Accept'
											cancelText='Cancel'
										>
											<div
												onClick={(e) => {
													e.stopPropagation();
												}}
											>
												<Tooltip title={!isFutureOrNow ? 'The event has started or has ended' : undefined}>
													<Button type='primary' block disabled={disabledRegister}>
														{intl.formatMessage({ id: 'activity.btn.dangky' })}
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
			</Spin>

			<ChiTietActivity getData={getData} />
		</Card>
	);
};

export default ActivityPage;
