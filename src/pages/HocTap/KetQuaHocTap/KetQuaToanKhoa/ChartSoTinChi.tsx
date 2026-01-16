import { getLocale } from '@umijs/max';
import { type ApexOptions } from 'apexcharts';
import en from 'apexcharts/dist/locales/en.json';
import vi from 'apexcharts/dist/locales/vi.json';
import Chart from 'react-apexcharts';
import { useIntl, useModel } from 'umi';

const ChartSoTinChi = () => {
	const intl = useIntl();
	const { danhSach } = useModel('daotao.ketquahocky');
	const locale = getLocale();
	const defaultLocale = locale === 'vi-VN' ? 'vi' : 'en';

	const series = [
		{
			name: intl.formatMessage({ id: 'ketquahoctap.chart.tichluy' }),
			group: 'dat',
			data: danhSach.map((item) => item.tongSoTinChiTichLuyHocKy),
		},
		{
			name: intl.formatMessage({ id: 'ketquahoctap.chart.tongtichluy' }),
			group: 'tichluy',
			data: danhSach.map((item) => item.tongSoTinChiTichLuyToanKhoa),
		},
		{
			name: intl.formatMessage({ id: 'ketquahoctap.chart.chuadat' }),
			group: 'dat',
			data: danhSach.map((item) => item.tongSoTinChiNoHocKy),
		},
		{
			name: intl.formatMessage({ id: 'ketquahoctap.chart.tongchuadat' }),
			group: 'tichluy',
			data: danhSach.map((item) => item.tongSoTinChiNoToanKhoa),
		},
	];

	const options: ApexOptions = {
		chart: {
			defaultLocale,
			locales: [vi, en],
			stacked: true,
		},
		title: {
			text: intl.formatMessage({ id: 'ketquahoctap.chart.stc' }),
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
