import { tienVietNam } from '@/utils/utils';
import { getLocale } from '@umijs/max';
import en from 'apexcharts/dist/locales/en.json';
import vi from 'apexcharts/dist/locales/vi.json';
import { useMemo } from 'react';
import Chart from 'react-apexcharts';
import { type DataChartType } from '.';
import './style.less';

const DonutChart = (props: DataChartType) => {
	const { xAxis, yAxis, height, colors, formatY, showTotal, width, otherOptions, type } = props;
	const locale = getLocale();
	const defaultLocale = locale === 'vi-VN' ? 'vi' : 'en';
	const options = {
		chart: {
			defaultLocale: defaultLocale,
			locales: [vi, en],
			toolbar: { show: true },
		},
		labels: xAxis,
		responsive: [
			{
				breakpoint: 480,
				options: {
					chart: {
						width: 300,
					},
					legend: {
						position: 'bottom',
						horizontalAlign: 'center',
					},
				},
			},
		],
		tooltip: {
			y: {
				formatter: (val: number) => (formatY ? formatY(val) : tienVietNam(val)),
			},
		},
		colors,
		fill: {
			colors,
		},
		plotOptions: {
			pie: {
				donut: {
					labels: {
						show: showTotal,
						total: {
							show: showTotal,
							label: 'Tổng số',
							formatter: (w: any) => {
								const val = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
								return formatY ? formatY(val) : tienVietNam(val);
							},
						},
					},
				},
			},
		},
	};

	const series = useMemo(() => yAxis?.[0] || [], [yAxis]);

	const chartOptions = useMemo(() => ({ ...options, ...otherOptions }), [options, otherOptions]);

	return (
		<Chart
			options={chartOptions}
			series={series}
			type={type === 'radian' ? 'radialBar' : 'donut'}
			height={height ?? 350}
			width={width}
		/>
	);
};

export default DonutChart;
