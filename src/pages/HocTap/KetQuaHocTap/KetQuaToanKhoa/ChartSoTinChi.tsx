import type { KetQuaHocKy } from '@/services/HocTap/KetQuaHocKy/typing';
import { getLocale } from '@umijs/max';
import { type ApexOptions } from 'apexcharts';
import en from 'apexcharts/dist/locales/en.json';
import vi from 'apexcharts/dist/locales/vi.json';
import { useMemo } from 'react';
import Chart from 'react-apexcharts';
import { useIntl, useModel } from 'umi';

const getHocKySortValue = (item: KetQuaHocKy.IRecord) => {
	return Number(item.hocKy?.ma ?? item.maHocKy ?? 0);
};

const ChartSoTinChi = (props: { data?: KetQuaHocKy.IRecord[] }) => {
	const intl = useIntl();
	const { data } = props;
	const { danhSach: danhSachModel } = useModel('daotao.ketquahocky');
	const danhSach = useMemo(
		() => [...(data ?? danhSachModel)].sort((a, b) => getHocKySortValue(b) - getHocKySortValue(a)),
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
			stacked: true,
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
		stroke: {
			width: [1, 1, 1, 1],
		},
		xaxis: {
			categories: danhSach.map((item) => item.hocKy || item.maHocKy),
			labels: {
				rotate: -25,
				rotateAlways: true,
				hideOverlappingLabels: false,
				showDuplicates: true,
				trim: false,
				maxHeight: 90,
				formatter: (value: any) => {
					return value?.ten || value;
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
			offsetY: 100,
		},
		colors: ['#f3de2c', '#86c4ee'],
	};

	return <Chart options={options} series={series} type='bar' height={300} />;
};

export default ChartSoTinChi;
