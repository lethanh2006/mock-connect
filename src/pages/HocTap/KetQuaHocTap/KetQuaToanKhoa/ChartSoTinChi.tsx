import vi from '@/components/Chart/vi.json';
import { type ApexOptions } from 'apexcharts';
import Chart from 'react-apexcharts';
import { useModel } from 'umi';

const ChartSoTinChi = () => {
	const { danhSach } = useModel('daotao.ketquahocky');

	const series = [
		{
			name: 'Số TC tích lũy HK',
			group: 'dat',
			data: danhSach.map((item) => item.tongSoTinChiTichLuyHocKy),
		},
		{
			name: 'Tổng số TC tích luỹ',
			group: 'tichluy',
			data: danhSach.map((item) => item.tongSoTinChiTichLuyToanKhoa),
		},
		{
			name: 'Số TC nợ trong HK',
			group: 'dat',
			data: danhSach.map((item) => item.tongSoTinChiNoHocKy),
		},
		{
			name: 'Tổng số TC nợ',
			group: 'tichluy',
			data: danhSach.map((item) => item.tongSoTinChiNoToanKhoa),
		},
	];

	const options: ApexOptions = {
		chart: {
			defaultLocale: 'vi',
			locales: [vi],
			stacked: true,
		},
		title: {
			text: 'Số tín chỉ',
			align: 'left',
			style: {
				fontSize: '14px',
				fontWeight: '600',
			},
		},
		dataLabels: {
			enabled: false,
		},
		stroke: {
			width: [1, 1, 1, 1],
		},
		xaxis: {
			categories: danhSach.map((item) => item.maHocKy),
		},
		responsive: [
			{
				breakpoint: 1600, //xxl
				options: {
					legend: { horizontalAlign: 'center', position: 'bottom' },
					plotOptions: {
						bar: {
							columnWidth: '70%',
						},
					},
				},
			},
		],
		tooltip: {
			shared: true,
			intersect: false,
		},
		plotOptions: {
			bar: {
				horizontal: false,
				columnWidth: '60%',
			},
		},
		legend: {
			position: 'right',
		},
		colors: ['#86c4ee', '#a5e03d', '#F3DE2C', '#fc7e4d'],
	};

	return <Chart options={options} series={series} type='bar' height={300} />;
};

export default ChartSoTinChi;
