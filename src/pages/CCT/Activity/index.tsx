import ButtonExtend from '@/components/Table/ButtonExtend';
import { CheckCircleFilled } from '@ant-design/icons';
import { Card, Col, Empty, Modal, Popconfirm, Row, Space, Spin, Tabs, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import ChiTietActivity from './ChiTiet';
import CardSuKienCCT from './components/CardSuKien';
import FilterSuKien from './components/FilterSuKien';
import './style.less';

const { Title } = Typography;

export interface FilterSuKienValue {
	search?: string;
	dateRange?: Dayjs[] | [];
}

const ActivityPage = () => {
	const intl = useIntl();
	const { getAllModel, danhSach, registerActivityModel, loading, setRecord, setVisibleForm } = useModel('cct.activity');
	const { getAllModel: getAllAtributes } = useModel('cct.attributes');
	const [activeKey, setActiveKey] = useState<string>('1');
	const [visibleDangKy, setVisibleDangKy] = useState<boolean>(false);

	const [filter, setFilter] = useState<FilterSuKienValue>({
		search: '',
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
				{danhSach?.length ? (
					<Row gutter={[12, 12]}>
						{danhSach?.map((item) => {
							const disabledRegister = !!item.workflow;
							const equivalencyAttributeIds = item?.coCurricularActivityEquivalency?.map((x) => x.attributesId);
							const fullSlot = false;

							const now = Date.now();
							const endDateSource = item?.allowPostEventResultsUpdate ? item?.dueDate : item?.endDate;
							const isOutOfTime =
								(item?.startDate && now < new Date(item.startDate).getTime()) ||
								(endDateSource && now > new Date(endDateSource).getTime());

							return (
								<Col key={item._id} xs={24} sm={12} md={8} lg={8}>
									<CardSuKienCCT
										record={{
											...item,
											workflow: item?.workflow,
										}}
										equivalencyAttributeIds={equivalencyAttributeIds}
										onClick={() => {
											setRecord(item);
											setVisibleForm(true);
										}}
										button={
											<Row style={{ padding: '12px 4px 4px 4px' }} gutter={[6, 0]}>
												<Col span={24}>
													{disabledRegister || isOutOfTime ? (
														<ButtonExtend block disabled>
															SEE MORE
														</ButtonExtend>
													) : fullSlot ? (
														<ButtonExtend block disabled>
															FULL SLOT
														</ButtonExtend>
													) : (
														<Popconfirm
															title={intl.formatMessage({ id: 'activity.confirm.dangky' })}
															placement='topLeft'
															onConfirm={() =>
																registerActivityModel(item._id, getData).then(() => setVisibleDangKy(true))
															}
														>
															<ButtonExtend type='primary' block>
																REGISTER NOW
															</ButtonExtend>
														</Popconfirm>
													)}
												</Col>
											</Row>
										}
										isCompleted={activeKey === '3'}
										isOutOfTime={isOutOfTime}
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

			<ChiTietActivity getData={getData} setVisibleDangKy={setVisibleDangKy} activeKey={activeKey} />

			<Modal open={visibleDangKy} onCancel={() => setVisibleDangKy(false)} footer={null} centered width={400}>
				<Space direction='vertical' size={24} align='center' style={{ width: '100%' }}>
					<div
						style={{
							width: 90,
							height: 90,
							borderRadius: '50%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<CheckCircleFilled style={{ fontSize: 48, color: '#329323' }} />
					</div>
				</Space>

				<div style={{ textAlign: 'center', marginTop: 12 }}>
					<Title level={4} style={{ color: '#329323' }}>
						You have successfully registered
					</Title>
				</div>
			</Modal>
		</Card>
	);
};

export default ActivityPage;
