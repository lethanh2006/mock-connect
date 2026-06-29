import { primaryColor } from '@/services/base/constant';
import { tienVietNam } from '@/utils/utils';
import { getLocale } from '@umijs/max';
import { type ApexOptions } from 'apexcharts';
import en from 'apexcharts/dist/locales/en.json';
import vi from 'apexcharts/dist/locales/vi.json';
import { useMemo } from 'react';
import Chart from 'react-apexcharts';
import { type DataChartType } from '.';
import './style.less';

const ColumnChart = (props: DataChartType) => {
	const { title, xAxis, yAxis, yLabel, height, type, formatY, colors, otherOptions } = props;
	const locale = getLocale();
	const defaultLocale = locale === 'vi-VN' ? 'vi' : 'en';
	const options: ApexOptions = {
		chart: {
			defaultLocale: defaultLocale,
			locales: [vi, en],
			zoom: {
				enabled: true,
				type: 'x',
				autoScaleYaxis: false,
				zoomedArea: {
					fill: {
						color: '#90CAF9',
						opacity: 0.4,
					},
					stroke: {
						color: '#0D47A1',
						opacity: 0.4,
						width: 1,
					},
				},
			},
		},
		title: {
			text: title ?? yLabel[0],
			align: 'left',
			style: {
				fontSize: '14px',
				fontWeight: '600',
			},
		},
		plotOptions: {
			bar: {
				horizontal: false,
				columnWidth: '50%',
			},
		},
		legend: {
			position: 'right',
		},
		responsive: [
			{
				breakpoint: 1600, //xxl
				options: {
					legend: { horizontalAlign: 'center', position: 'bottom' },
					plotOptions: {
						bar: {
							columnWidth: '100%',
						},
					},
				},
			},
		],
		dataLabels: {
			enabled: false,
		},
		yaxis: {
			labels: {
				formatter: (val: number) => (formatY ? formatY(val) : tienVietNam(val)),
			},
		},
		xaxis: {
			categories: xAxis || [],
		},
		tooltip: {
			y: { formatter: (val: number) => (formatY ? formatY(val) : tienVietNam(val)) },
			intersect: false,
			shared: true,
		},
		grid: {
			borderColor: '#e0e0e0',
			strokeDashArray: 2,
			xaxis: { lines: { show: false } },
		},
	};

	const series = useMemo(
		() =>
			yLabel.map((y, index) => ({
				name: y,
				data: yAxis?.[index] || [],
				color: colors?.[index] ?? primaryColor,
			})),
		[yLabel, yAxis, colors],
	);

	const chartOptions = useMemo(() => ({ ...options, ...otherOptions }), [options, otherOptions]);

	return <Chart options={chartOptions} series={series} type={type as any} height={height ?? 350} />;
};

export default ColumnChart;
