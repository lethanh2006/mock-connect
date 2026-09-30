import type { KetQuaHocKy } from '@/services/HocTap/KetQuaHocKy/typing';
import { getLocalizedName } from '@/utils/localeName';
import { getLocale } from '@umijs/max';
import { type ApexOptions } from 'apexcharts';
import en from 'apexcharts/dist/locales/en.json';
import vi from 'apexcharts/dist/locales/vi.json';
import { useMemo } from 'react';
import Chart from 'react-apexcharts';
import { useIntl, useModel } from 'umi';

const getHocKySortValue = (item: KetQuaHocKy.IRecord) => {
	return Number(item.maHocKy ?? item.hocKy?.ma ?? 0);
};

const ChartSoTinChi = (props: { data?: KetQuaHocKy.IRecord[] }) => {
	const intl = useIntl();
	const { data } = props;
	const { danhSach: danhSachModel } = useModel('daotao.ketquahocky');
	const danhSach = useMemo(
		() => [...(data ?? danhSachModel)].sort((a, b) => getHocKySortValue(a) - getHocKySortValue(b)),
		[data, danhSachModel],
	);

	const locale = getLocale();
	const defaultLocale = locale === 'vi-VN' ? 'vi' : 'en';

	const series = [
		{
			name: intl.formatMessage({ id: 'ketquahoctap.chart.chuadat' }),
			group: 'chuaDat',
			data: danhSach.map((item) => item.tongSoTinChiNoHocKy),
		},
		{
			name: intl.formatMessage({ id: 'ketquahoctap.chart.tichluy' }),
			group: 'dat',
			data: danhSach.map((item) => item.tongSoTinChiTichLuyHocKy),
		},
		// {
		// 	name: intl.formatMessage({ id: 'ketquahoctap.chart.tongtichluy' }),
		// 	group: 'dat',
		// 	data: danhSach.map((item) => item.tongSoTinChiTichLuyToanKhoa),
		// },
		// {
		// 	name: intl.formatMessage({ id: 'ketquahoctap.chart.tongchuadat' }),
		// 	group: 'chuaDat',
		// 	data: danhSach.map((item) => item.tongSoTinChiNoToanKhoa),
		// },
	];

	const options: ApexOptions = {
		chart: {
			defaultLocale,
			locales: [vi, en],
			stacked: false,
		},
		title: {
			// text: intl.formatMessage({ id: 'ketquahoctap.chart.stc' }),
			align: 'left',
			style: {
				fontSize: '14px',
				fontWeight: '600',
			},
		},
		dataLabels: {
			enabled: false,
		},
		grid: {
			xaxis: { lines: { show: true } },
		},
		stroke: {
			width: 0,
		},
		xaxis: {
			categories: danhSach.map((item) => item.hocKy || item.maHocKy),
			labels: {
				rotate: danhSach.length < 13 ? 0 : -25,
				rotateAlways: danhSach.length >= 13,
				hideOverlappingLabels: false,
				showDuplicates: true,
				maxHeight: 90,
				formatter: (value: any) => {
					return getLocalizedName(value, String(value ?? '')) ?? '';
				},
			},
		},
		responsive: [
			{
				breakpoint: 1600, //xxl
				options: {
					legend: { horizontalAlign: 'center', position: 'right', offsetY: 100 },
					plotOptions: {
						bar: {
							columnWidth: '40px',
						},
					},
				},
			},
			{
				breakpoint: 1248,
				options: {
					legend: { position: 'bottom', horizontalAlign: 'center', offsetY: 0 },
					xaxis: {
						labels: {
							rotate: -25,
							rotateAlways: true,
							maxHeight: 120,
						},
					},
				},
			},
			{
				breakpoint: 576,
				options: {
					legend: { show: false },
					plotOptions: { bar: { columnWidth: '70%' } },
				},
			},
			{
				breakpoint: 506,
				options: {
					legend: { show: false },
					xaxis: {
						labels: {
							show: false,
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
				columnWidth: '40px',
				borderRadius: 8,
				borderRadiusApplication: 'end',
			},
		},
		legend: {
			position: 'right',
			offsetY: 100,
		},
		colors: ['#dc2626', '#16a34a'],
	};

	return <Chart options={options} series={series} type='bar' height={222} />;
};

export default ChartSoTinChi;
