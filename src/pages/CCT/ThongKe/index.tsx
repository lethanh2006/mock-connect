import { highlightColor, primaryColor } from '@/services/base/constant';
import { RiseOutlined, ThunderboltOutlined, TrophyOutlined } from '@ant-design/icons';
import { Card, Col, Divider, Flex, Row, Space, Spin, Tag, Typography } from 'antd';
import { useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useModel } from 'umi';

const { Text } = Typography;

const ThongKeCCT = () => {
	const {
		loadingLevels,
		dataThongKeLevels,
		thongKeLevelsModel,
		loadingAttributes,
		dataThongKeAttributes,
		thongKeAttributesModel,
		loadingActivityType,
		dataThongKeActivityType,
		thongKeActivityTypeModel,
	} = useModel('cct.activityoutcome');

	useEffect(() => {
		const fetchAll = async () => {
			try {
				await Promise.all([thongKeLevelsModel(), thongKeAttributesModel(), thongKeActivityTypeModel()]);
			} catch (error) {
				console.error('Fetch statistics error:', error);
			}
		};

		fetchAll();
	}, []);

	const totalActivities = dataThongKeActivityType?.reduce((sum, a) => sum + a.count, 0);
	const totalMembers = dataThongKeLevels?.reduce((sum, l) => sum + l.count, 0);

	const levelChart = {
		series: [
			{
				name: 'Count',
				data: dataThongKeLevels?.map((l) => l.count),
			},
		],
		options: {
			chart: {
				type: 'bar',
				toolbar: { show: false },
				animations: { enabled: true, easing: 'easeinout' },
			},
			colors: [primaryColor],
			plotOptions: {
				bar: {
					borderRadius: 8,
					columnWidth: '55%',
					dataLabels: { position: 'top' },
				},
			},
			dataLabels: {
				enabled: true,
				offsetY: -20,
				style: { fontSize: '12px', fontWeight: 'bold', colors: [primaryColor] },
				formatter: (val: number) => `${val}`,
			},
			xaxis: {
				categories: dataThongKeLevels?.map((l) => l.name),
				axisBorder: { show: false },
				axisTicks: { show: false },
				labels: { style: { fontSize: '12px', fontWeight: 500 } },
			},
			yaxis: {
				title: { text: 'Number of members', style: { fontSize: '12px' } },
				min: 0,
			},
			grid: { borderColor: '#f1f1f1', strokeDashArray: 4 },
			tooltip: {
				y: { formatter: (val: number) => `${val} members` },
				theme: 'dark',
			},
		},
	};

	const radarChart = {
		series: [
			{
				name: 'Percentage %',
				data: dataThongKeAttributes?.map((a) => a.percentage),
			},
		],
		options: {
			chart: {
				type: 'radar',
				toolbar: { show: false },
				dropShadow: { enabled: true, blur: 8, opacity: 0.2, top: 2, left: 2 },
			},
			colors: [highlightColor],
			stroke: { width: 2, colors: [highlightColor] },
			fill: { opacity: 0.2, colors: [highlightColor] },
			markers: { size: 4, colors: [highlightColor], strokeColor: '#fff', strokeWidth: 2 },
			xaxis: {
				categories: dataThongKeAttributes?.map((a) => a.name),
				labels: { style: { fontSize: '12px', fontWeight: 500 } },
			},
			yaxis: { min: 0, max: 40, tickAmount: 4 },
			tooltip: {
				y: { formatter: (val: number) => `${val}%` },
				theme: 'dark',
			},
		},
	};

	const pieChart = {
		series: dataThongKeActivityType?.map((a) => a.count),
		options: {
			chart: { type: 'pie', toolbar: { show: false } },
			labels: dataThongKeActivityType?.map((a) => a.name),
			colors: [primaryColor, highlightColor, '#f39c12', '#2ecc71'],
			legend: { position: 'bottom', fontSize: '12px', fontWeight: 500 },
			dataLabels: {
				enabled: true,
				style: { fontSize: '12px', fontWeight: 'bold' },
				formatter: (val: number, opts: any) => {
					const percentage = ((opts.w.config.series[opts.seriesIndex] / totalActivities) * 100).toFixed(1);
					return `${percentage}%`;
				},
			},
			plotOptions: {
				pie: {
					donut: { size: '0%' },
					expandOnClick: true,
					customScale: 1,
				},
			},
			tooltip: {
				y: { formatter: (val: number) => `${val} activities` },
				theme: 'dark',
			},
		},
	};

	return (
		<>
			{/* <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
				<Col xs={24} sm={8}>
					<Card
						variant='borderless'
						style={{
							background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`,
							borderRadius: 16,
							boxShadow: '0 8px 20px rgba(19,77,139,0.15)',
						}}
					>
						<Statistic
							title={<Text style={{ color: 'white', fontSize: 14, opacity: 0.9 }}>Tổng thành viên</Text>}
							value={totalMembers}
							prefix={<TeamOutlined style={{ color: 'white' }} />}
							valueStyle={{ color: 'white', fontSize: 32, fontWeight: 'bold' }}
						/>
					</Card>
				</Col>
				<Col xs={24} sm={8}>
					<Card
						variant='borderless'
						style={{
							background: `linear-gradient(135deg, ${highlightColor} 0%, ${highlightColor}dd 100%)`,
							borderRadius: 16,
							boxShadow: '0 8px 20px rgba(199,33,39,0.15)',
						}}
					>
						<Statistic
							title={<Text style={{ color: 'white', fontSize: 14, opacity: 0.9 }}>Tổng hoạt động</Text>}
							value={totalActivities}
							prefix={<FireOutlined style={{ color: 'white' }} />}
							valueStyle={{ color: 'white', fontSize: 32, fontWeight: 'bold' }}
						/>
					</Card>
				</Col>
			</Row> */}

			<Row gutter={[24, 24]}>
				<Col span={24}>
					<Spin spinning={loadingLevels}>
						<Card
							title={
								<Space>
									<RiseOutlined style={{ color: primaryColor, fontSize: 20 }} />
									<span style={{ color: primaryColor, fontWeight: 600 }}>Level Distribution (Quality & Depth)</span>
								</Space>
							}
							variant='borderless'
						>
							<ReactApexChart options={levelChart.options as any} series={levelChart.series} type='bar' height={350} />
							<Flex justify='center' gap={32} style={{ marginTop: 16 }}>
								{dataThongKeLevels?.map((level, idx) => (
									<Tag
										key={idx}
										color={idx === 0 ? primaryColor : highlightColor}
										style={{ fontSize: 13, padding: '4px 12px' }}
									>
										{level.name}: {level.percentage}%
									</Tag>
								))}
							</Flex>
						</Card>
					</Spin>
				</Col>

				<Col xs={24} md={12}>
					<Spin spinning={loadingAttributes}>
						<Card
							title={
								<Space>
									<ThunderboltOutlined style={{ color: highlightColor, fontSize: 20 }} />
									<span style={{ color: primaryColor, fontWeight: 600 }}>Core Competencies (Radar)</span>
								</Space>
							}
							variant='borderless'
						>
							<ReactApexChart
								options={radarChart.options as any}
								series={radarChart.series}
								type='radar'
								height={350}
							/>
							<Divider style={{ margin: '16px 0 8px' }} />
							<Flex justify='center' wrap='wrap' gap={16}>
								{dataThongKeAttributes?.map((attr, idx) => (
									<div key={idx} style={{ textAlign: 'center', minWidth: 80 }}>
										<Text strong style={{ color: primaryColor }}>
											{attr.name}
										</Text>
										<br />
										<Text style={{ color: highlightColor, fontWeight: 'bold', fontSize: 18 }}>{attr.percentage}%</Text>
									</div>
								))}
							</Flex>
						</Card>
					</Spin>
				</Col>

				<Col xs={24} md={12}>
					<Spin spinning={loadingActivityType}>
						<Card
							title={
								<Space>
									<TrophyOutlined style={{ color: primaryColor, fontSize: 20 }} />
									<span style={{ color: primaryColor, fontWeight: 600 }}>Activity Types</span>
								</Space>
							}
							variant='borderless'
						>
							<ReactApexChart options={pieChart.options as any} series={pieChart.series} type='pie' height={350} />
						</Card>
					</Spin>
				</Col>
			</Row>
		</>
	);
};

export default ThongKeCCT;
