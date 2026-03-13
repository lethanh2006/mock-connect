import { Card, Col, Row } from 'antd';
import Chart from 'react-apexcharts';
import './components/style.less';
import WelcomeCard from './components/XinChao';
import './styles.less';

const PRIMARY_COLOR = '#C72127';
const PERCENT_COLOR = '#134D8B';
const PERCENT_COLOR_LIGHT = '#134D8Bcc';

const baseChartOptions: ApexCharts.ApexOptions = {
	chart: {
		toolbar: { show: false },
		fontFamily: 'Inter, Roboto, Arial, sans-serif',
		animations: {
			enabled: true,
			easing: 'easeinout',
			speed: 600,
		},
	},
	grid: {
		borderColor: '#E5E7EB',
		strokeDashArray: 3,
		padding: { left: 12, right: 12 },
	},
	dataLabels: { enabled: false },
	legend: {
		position: 'top',
		horizontalAlign: 'right',
		fontSize: '12px',
	},
	tooltip: {
		theme: 'light',
		style: { fontSize: '12px' },
	},
};

const radarOptions: ApexCharts.ApexOptions = {
	...baseChartOptions,
	chart: { type: 'radar' },
	colors: [PERCENT_COLOR],
	stroke: { width: 2 },
	fill: { opacity: 0.18 },
	markers: {
		size: 4,
		colors: [PERCENT_COLOR],
		strokeColors: '#fff',
		strokeWidth: 2,
	},
	xaxis: {
		categories: ['E', 'X', 'C', 'E', 'L'],
		labels: { style: { fontSize: '12px', fontWeight: 500 } },
	},
	yaxis: {
		min: 0,
		max: 100,
		tickAmount: 4,
	},
};

const radarSeries = [
	{
		name: 'Achievement Level',
		data: [75, 60, 80, 70, 85],
	},
];

const excelStats = [
	{ label: 'E', percent: 80, count: 400 },
	{ label: 'X', percent: 65, count: 325 },
	{ label: 'C', percent: 70, count: 350 },
	{ label: 'E2', percent: 60, count: 300 },
	{ label: 'L', percent: 90, count: 450 },
];

const excelOptions: ApexCharts.ApexOptions = {
	...baseChartOptions,
	colors: [PERCENT_COLOR_LIGHT, PRIMARY_COLOR],
	plotOptions: {
		bar: {
			columnWidth: '38%',
			borderRadius: 6,
		},
	},
	stroke: {
		width: [0, 3],
		curve: 'smooth',
	},
	markers: {
		size: 4,
		colors: [PRIMARY_COLOR],
	},
	fill: {
		opacity: [0.85, 1],
	},
	xaxis: {
		categories: excelStats.map((i) => i.label),
		labels: { style: { fontSize: '12px' } },
	},
	yaxis: [
		{
			max: 100,
			title: { text: 'Percentage (%)' },
		},
		{
			opposite: true,
			title: { text: 'Number' },
		},
	],
};

const excelSeries = [
	{
		name: 'Percentage (%)',
		type: 'column',
		data: excelStats.map((i) => i.percent),
	},
	{
		name: 'Number',
		type: 'line',
		data: excelStats.map((i) => i.count),
	},
];

const cardProps = {
	size: 'small' as const,
	variant: 'borderless' as const,
	styles: {
		body: { padding: 8 },
		header: { fontWeight: 600, fontSize: 14 },
	},
};

const TrangChu = () => {
	return (
		<Row gutter={[24, 24]}>
			<Col span={24}>
				<Row gutter={[16, 16]}>
					<Col span={24} md={24}>
						<WelcomeCard />
					</Col>
					{/* <Col span={24} md={6}>
						<CardThongBaoDashboard />
					</Col>
					<Col span={24} md={6}>
						<CardSuKienSapToi />
					</Col> */}
				</Row>
			</Col>

			<Col span={24}>
				<Row gutter={[16, 16]}>
					<Col span={24} md={8}>
						<Card title='EXCEL Competency Matrix' {...cardProps}>
							<Chart options={radarOptions} series={radarSeries} type='radar' height={320} />
						</Card>
					</Col>

					<Col span={24} md={16}>
						<Card title='EXCEL Participation Rate' {...cardProps}>
							<Chart options={excelOptions} series={excelSeries} type='line' height={320} />
						</Card>
					</Col>
				</Row>
			</Col>
			{/* <Col span={24}>
				<CardLopHocPhan />
			</Col>

			<Col span={24}>
				<Row gutter={[16, 16]}>
					<Col xs={24} sm={12} md={16} lg={16} xl={18}>
						<CardBaiTapDashboard isDashBoard />
					</Col>
					<Col xs={24} sm={12} md={8} lg={8} xl={6}>
						<LichDashboard />
					</Col>
				</Row>
			</Col>

			<Col span={24}>
				<Row gutter={[16, 16]}>
					<Col xs={24} sm={12} md={16} lg={18} xl={18}>
						<CardHocTapRenLuyenDashboard />
					</Col>

					<Col xs={24} sm={12} md={8} lg={6} xl={6}>
						<CardDichVuSinhVien />
					</Col>
				</Row>
			</Col> */}

			<Col span={24}>
				<Row className='diendan-thuvien-banner' gutter={[16, 16]}>
					<Col span={24} md={12}>
						<Row gutter={[16, 16]}>
							{/* <Col span={24} className='nq57-ptit'>
							<img
								src='/images/nq57-ptit.png'
								alt='Tuổi trẻ PTIT với Nghị quyết 57'
								title='Tuổi trẻ PTIT với Nghị quyết 57'
								onClick={() => {}}
							/>
						</Col> */}

							{/* <Col className='card-diendan' span={24}>
								<CardDienDanDashboard typeLop='all' />
							</Col> */}
						</Row>
					</Col>

					<Col span={24} md={12}>
						<Row gutter={[16, 16]}>
							{/* <Col span={24}>
							<CardCuocThiDashboard />
						</Col> */}
							<Col span={24}>{/* <VaoRaThuVienDashboardCard /> */}</Col>
							<Col span={24}>
								{/* <ChatbotBanner /> */}
								{/* <ThongKeMuonSachCard /> */}
							</Col>
						</Row>
					</Col>
				</Row>
			</Col>

			<Col span={24} className='tintuc-dashboard'>
				{/* <TinTucDashboardWrapper /> */}
			</Col>
		</Row>
	);
};

export default TrangChu;
