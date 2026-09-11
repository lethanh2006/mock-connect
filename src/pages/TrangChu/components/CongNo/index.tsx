import DonutChart from '@/components/Chart/DonutChart';
import { EOperatorType } from '@/components/Table/constant';
import { EMaTrangThaiThanhToan } from '@/services/TaiChinh/constant';
import { IconArrowRight } from '@/components/Icons';
import { Card, Col, Empty, Row, Space, Tooltip } from 'antd';
import { useEffect } from 'react';
import { Link, useIntl, useModel } from 'umi';
import './style.less';

const CardCongNoDashboard = () => {
	const intl = useIntl();
	const { getModel: getCongNo, loading, danhSach } = useModel('taichinh.hoadon');
	const colors = ['#14B8A6', '#FACC15']; // Teal, Yellow
	const xAxis = [
		intl.formatMessage({ id: 'trangchu.hoctaprenluyen.congno.dichvu' }),
		intl.formatMessage({ id: 'trangchu.hoctaprenluyen.congno.dichvukhac' }),
	];

	useEffect(() => {
		// Get công nợ
		getCongNo(
			undefined,
			[
				{
					field: 'status',
					values: [EMaTrangThaiThanhToan.DONG],
					operator: EOperatorType.NOT_INCLUDE,
				},
			],
			100,
		);
	}, []);

	// Calculate data for chart
	const calculateChartData = () => {
		const congNoList = danhSach.filter((bill) => !bill.name?.includes('dịch vụ hành chính'));
		const dichVuList = danhSach.filter((bill) => bill.name?.includes('dịch vụ hành chính'));

		// Dịch vụ sinh viên (congNoList)
		const congNoPaid = congNoList
			.map(
				(bill) =>
					bill?.billItems
						?.filter((item) => item.status !== EMaTrangThaiThanhToan.DONG)
						?.reduce((acc, item) => acc + (item.amountPaid || 0), 0) ?? 0,
			)
			.reduce((acc, item) => acc + item, 0);
		const congNoDue = congNoList
			.map(
				(bill) =>
					bill?.billItems
						?.filter((item) => item.status !== EMaTrangThaiThanhToan.DONG)
						?.reduce((acc, item) => acc + (item.amountDue ?? 0) - (item.amountDiscount ?? 0), 0) ?? 0,
			)
			.reduce((acc, item) => acc + item, 0);

		// Dịch vụ khác (dichVuList)
		const dichVuPaid = dichVuList
			.map(
				(bill) =>
					bill?.billItems
						?.filter((item) => item.status !== EMaTrangThaiThanhToan.DONG)
						?.reduce((acc, item) => acc + (item.amountPaid || 0), 0) ?? 0,
			)
			.reduce((acc, item) => acc + item, 0);
		const dichVuDue = dichVuList
			.map(
				(bill) =>
					bill?.billItems
						?.filter((item) => item.status !== EMaTrangThaiThanhToan.DONG)
						?.reduce((acc, item) => acc + (item.amountDue ?? 0) - (item.amountDiscount ?? 0), 0) ?? 0,
			)
			.reduce((acc, item) => acc + item, 0);

		const congNoUnpaid = congNoDue - congNoPaid;
		const dichVuUnpaid = dichVuDue - dichVuPaid;
		return {
			total: [congNoDue, dichVuDue],
			paid: [congNoPaid, dichVuPaid],
			unpaid: [congNoUnpaid, dichVuUnpaid],
			grandTotal: congNoDue + dichVuDue,
		};
	};

	const chartData = calculateChartData();
	const yAxis = chartData.total.map((value, index) => (chartData.paid[index] / value) * 100);

	return (
		<Card className='dashboard-stat-card' variant='borderless' loading={loading}>
			<div className='dashboard-stat-content'>
				<div>
					<div className='header'>
						<div className='title'>
							{intl.formatMessage({ id: 'trangchu.hoctaprenluyen.congno.title' })}{' '}
							<span className='subtitle'>
								({intl.formatMessage({ id: 'trangchu.hoctaprenluyen.congno.trieudong' })})
							</span>
						</div>

						<Tooltip title={intl.formatMessage({ id: 'trangchu.hoctaprenluyen.congno.xemchitiet' })}>
							<Link to='/tai-chinh/cong-no'>
								<IconArrowRight />
							</Link>
						</Tooltip>
					</div>

					{danhSach.length ? (
						<>
							{/* Radial Chart - similar to CardHocTap */}
							<div className='chart-container'>
								<DonutChart
									xAxis={xAxis}
									yLabel={[`${intl.formatMessage({ id: 'trangchu.hoctaprenluyen.congno.title' })}`]}
									yAxis={[yAxis]}
									type='radian'
									formatY={(e) => `${e.toFixed(1)}%`}
									height={180}
									width={180}
									otherOptions={{
										legend: { show: false },
										dataLabels: { enabled: false },
										chart: { toolbar: { show: false } },
										tooltip: { enabled: true },
										plotOptions: {
											radialBar: {
												dataLabels: { show: false },
												hollow: { size: '35px' },
											},
										},
										responsive: [
											{
												breakpoint: 480,
												options: {
													chart: { width: 150, height: 150 },
													legend: { show: false },
													plotOptions: {
														radialBar: {
															hollow: { size: '30px' },
														},
													},
												},
											},
										],
										// Thêm stroke để bo tròn các góc
										stroke: {
											lineCap: 'round' as 'round', // Bo tròn các đầu
										},
									}}
									colors={colors}
								/>
								<div className='center-label'>
									<div className='total-value'>{(chartData.grandTotal / 1e6).toFixed(1)}</div>
									<div className='total-text'>
										{intl.formatMessage({ id: 'trangchu.hoctaprenluyen.congno.tongso' })}
									</div>
								</div>

								<div className='percentage-label left'>{yAxis[0].toFixed(1)}%</div>
								<div className='percentage-label right'>{yAxis[1].toFixed(1)}%</div>
							</div>

							{/* Legend */}
							<div className='legend'>
								<Row gutter={[0, 4]} justify='center'>
									<Col span={24}>
										<div className='row'>
											<Space>
												<span className='dot' style={{ backgroundColor: colors[0] }} />
												<span>{intl.formatMessage({ id: 'trangchu.hoctaprenluyen.congno.dichvu' })}</span>
											</Space>
											<span className='sum-text' style={{ color: colors[0] }}>
												{Math.round(chartData.total[0] / 1e4) / 100}
											</span>
										</div>
									</Col>
									<Col span={24}>
										<div className='row indented'>
											<Space>
												<span className='dot gray' />
												<span>{intl.formatMessage({ id: 'trangchu.hoctaprenluyen.congno.chuathanhtoan' })}</span>
											</Space>
											<span className='sum-text gray'>{Math.round(chartData.unpaid[0] / 1e4) / 100}</span>
										</div>
									</Col>
									<Col span={24}>
										<div className='row'>
											<Space>
												<span className='dot' style={{ backgroundColor: colors[1] }} />
												<span>{intl.formatMessage({ id: 'trangchu.hoctaprenluyen.congno.dichvukhac' })}</span>
											</Space>
											<span className='sum-text' style={{ color: colors[1] }}>
												{Math.round(chartData.total[1] / 1e4) / 100}
											</span>
										</div>
									</Col>
									<Col span={24}>
										<div className='row indented'>
											<Space>
												<span className='dot gray' />
												<span>{intl.formatMessage({ id: 'trangchu.hoctaprenluyen.congno.chuathanhtoan' })}</span>
											</Space>
											<span className='sum-text gray'>{Math.round(chartData.unpaid[1] / 1e4) / 100}</span>
										</div>
									</Col>
								</Row>
							</div>
						</>
					) : (
						<Empty
							image={Empty.PRESENTED_IMAGE_SIMPLE}
							description={intl.formatMessage({ id: 'global.table.index.empty' })}
						/>
					)}
				</div>
			</div>
		</Card>
	);
};

export default CardCongNoDashboard;
