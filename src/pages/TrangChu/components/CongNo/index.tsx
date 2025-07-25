import DonutChart from '@/components/Chart/DonutChart';
import { EOperatorType } from '@/components/Table/constant';
import { EMaTrangThaiThanhToan } from '@/services/TaiChinh/constant';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Card, Col, Empty, Row, Space } from 'antd';
import { useEffect } from 'react';
import { history, useModel } from 'umi';
import './style.less';

const CardCongNoDashboard = () => {
	const { getModel: getCongNo, loading, danhSach } = useModel('taichinh.hoadon');
	const colors = ['#14B8A6', '#FACC15']; // Teal, Yellow
	const xAxis = ['Dịch vụ sinh viên', 'Dịch vụ khác'];

	const congNoList = danhSach.filter((bill) => !bill.name?.includes('dịch vụ hành chính'));
	const dichVuList = danhSach.filter((bill) => bill.name?.includes('dịch vụ hành chính'));

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

	// Function to make percentage more dynamic for chart display
	const adjustPercentageForChart = (value: number, total: number) => {
		if (total === 0) return 0;

		const percentage = (value / total) * 100;

		// Nếu % quá lớn (>85%), làm tròn xuống nhẹ để tạo không gian
		if (percentage > 85) {
			return Math.floor(percentage * 0.95); // Giảm 5% để tạo không gian
		}

		// Nếu % quá nhỏ (<3%), làm tròn lên để dễ nhìn
		if (percentage < 3 && percentage > 0) {
			return Math.ceil(percentage * 1.85); // Tăng 85% để dễ nhìn
		}

		// Nếu % từ 3-15%, làm tròn lên một chút
		if (percentage >= 3 && percentage <= 15) {
			return Math.ceil(percentage * 1.15); // Tăng 15%
		}

		// Nếu % từ 70-85%, làm tròn xuống nhẹ
		if (percentage >= 70 && percentage <= 85) {
			return Math.floor(percentage * 0.98); // Giảm 2%
		}

		// Các trường hợp khác giữ nguyên
		return Math.round(percentage);
	};

	// Function to adjust percentage for display (only slight rounding)
	const adjustPercentageForDisplay = (value: number, total: number) => {
		if (total === 0) return 0;

		const percentage = (value / total) * 100;

		// Chỉ làm tròn sai khác tối đa 1%
		if (percentage > 99) {
			return Math.max(98, Math.round(percentage - 1));
		}

		if (percentage < 1 && percentage > 0) {
			return Math.min(2, Math.round(percentage + 1));
		}

		// Các trường hợp khác làm tròn bình thường
		return Math.round(percentage);
	};

	// Calculate data for chart
	const calculateChartData = () => {
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

		const congNoTotal = congNoPaid + (congNoDue - congNoPaid);
		const dichVuTotal = dichVuPaid + (dichVuDue - dichVuPaid);
		const congNoUnpaid = congNoDue - congNoPaid;
		const dichVuUnpaid = dichVuDue - dichVuPaid;

		return {
			total: [congNoTotal, dichVuTotal],
			paid: [congNoPaid, dichVuPaid],
			unpaid: [congNoUnpaid, dichVuUnpaid],
			grandTotal: congNoTotal + dichVuTotal,
		};
	};

	const chartData = calculateChartData();

	// Convert to percentage for radial chart with dynamic adjustment
	const maxValue = Math.max(...chartData.total);
	const yAxis = chartData.total.map((value) => {
		return adjustPercentageForChart(value, maxValue);
	});

	// Calculate display percentages (only slight adjustment)
	const displayPercentages = chartData.total.map((value) => {
		return adjustPercentageForDisplay(value, maxValue);
	});

	return (
		<Card className='dashboard-stat-card' loading={loading} style={{ borderRadius: 8 }}>
			<div className='dashboard-stat-content'>
				<div>
					<div className='header'>
						<div className='title'>
							Công nợ
							<span className='subtitle'>(Triệu đồng)</span>
						</div>
						<div>
							<InfoCircleOutlined className='info-icon' onClick={() => history.push('/tai-chinh/cong-no')} />
						</div>
					</div>

					{danhSach.length ? (
						<>
							{/* Radial Chart - similar to CardHocTap */}
							<Row gutter={[12, 0]} justify='center'>
								<Col span={24}>
									<div className='chart-container'>
										<DonutChart
											xAxis={xAxis}
											yLabel={['Công nợ']}
											yAxis={[yAxis]}
											type='radian'
											formatY={(e) => `${e.toFixed(1)}%`}
											height={180}
											width={180}
											otherOptions={{
												legend: { show: false },
												dataLabels: { enabled: false },
												chart: { toolbar: { show: false } },
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
											<div className='total-text'>Tổng CN</div>
										</div>
										{/* Percentage labels with display values (only 1% difference max) */}
										<div className='percentage-label left'>{displayPercentages[0]} %</div>
										<div className='percentage-label right'>{displayPercentages[1]} %</div>
									</div>
								</Col>
							</Row>

							{/* Legend */}
							<Row justify='center'>
								<Col span={24}>
									<div className='legend'>
										<Row gutter={[0, 8]} justify='center'>
											<Col span={24}>
												<div className='row'>
													<Space>
														<span className='dot teal' />
														<span>Dịch vụ sinh viên</span>
													</Space>
													<span className='sum-text teal'>{(chartData.total[0] / 1e6).toFixed(1)}</span>
												</div>
											</Col>
											<Col span={24}>
												<div className='row indented'>
													<Space>
														<span className='dot gray' />
														<span>Chưa thanh toán</span>
													</Space>
													<span className='sum-text gray'>{(chartData.unpaid[0] / 1e6).toFixed(1)}</span>
												</div>
											</Col>
											<Col span={24}>
												<div className='row'>
													<Space>
														<span className='dot yellow' />
														<span>Dịch vụ khác</span>
													</Space>
													<span className='sum-text yellow'>{(chartData.total[1] / 1e6).toFixed(1)}</span>
												</div>
											</Col>
											<Col span={24}>
												<div className='row indented'>
													<Space>
														<span className='dot gray' />
														<span>Chưa thanh toán</span>
													</Space>
													<span className='sum-text gray'>{(chartData.unpaid[1] / 1e6).toFixed(1)}</span>
												</div>
											</Col>
										</Row>
									</div>
								</Col>
							</Row>
						</>
					) : (
						<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Không có dữ liệu' />
					)}
				</div>
			</div>
		</Card>
	);
};

export default CardCongNoDashboard;
