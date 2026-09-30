import LineChart from '@/components/Chart/LineChart';
import type { KetQuaHocKy } from '@/services/HocTap/KetQuaHocKy/typing';
import { getLocalizedName } from '@/utils/localeName';
import { useMemo } from 'react';
import { useIntl, useModel } from 'umi';

const CHART_COLORS = ['#6155f5', '#00c3d0'];

const getHocKySortValue = (item: KetQuaHocKy.IRecord) => {
	return Number(item.maHocKy ?? item.hocKy?.ma ?? 0);
};

const ChartDiemTrungBinh = (props: { data?: KetQuaHocKy.IRecord[] }) => {
	const intl = useIntl();
	const { data } = props;
	const { danhSach: danhSachModel } = useModel('daotao.ketquahocky');
	const danhSach = useMemo(
		() => [...(data ?? danhSachModel)].sort((a, b) => getHocKySortValue(a) - getHocKySortValue(b)),
		[data, danhSachModel],
	);
	const formatY = (val: number) => (Math.round(val * 100) / 100).toString();

	return (
		<LineChart
			xAxis={danhSach.map((item) => item.maHocKy)}
			yAxis={[
				danhSach.map((item) => item.trungBinhHocKyThang4 ?? 0),
				danhSach.map((item) => item.trungBinhTichLuyToanKhoaThang4 ?? 0),
			]}
			yLabel={[
				intl.formatMessage({ id: 'ketquahoctap.diemtb.hk' }),
				intl.formatMessage({ id: 'ketquahoctap.diemtb.tl' }),
			]}
			colors={CHART_COLORS}
			type='line'
			formatY={formatY}
			height={222}
			otherOptions={{
				colors: CHART_COLORS,
				title: { text: undefined },
				chart: {
					toolbar: { show: false },
					zoom: { enabled: false },
				},
				xaxis: {
					categories: danhSach.map((item) => item.hocKy || item.maHocKy),
					axisBorder: { show: true, color: 'rgba(0, 0, 0, 0.1)', strokeWidth: 1 },
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
				stroke: { curve: 'smooth', width: 2 },
				markers: {
					size: 3,
					colors: ['#fff', '#fff'],
					strokeColors: CHART_COLORS,
					strokeWidth: 2,
					shape: 'circle',
					hover: { size: 4 },
				},
				grid: {
					borderColor: 'rgba(0, 0, 0, 0.06)',
					strokeDashArray: 2,
					xaxis: { lines: { show: true } },
					yaxis: { lines: { show: true } },
				},
				legend: {
					position: 'right',
					horizontalAlign: 'center',
					offsetY: 100,
				},
				responsive: [
					{
						breakpoint: 1600,
						options: {
							legend: { position: 'right', horizontalAlign: 'center', offsetY: 100 },
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
				],
				yaxis: {
					min: 0,
					max: 4,
					tickAmount: 4,
					labels: { formatter: (val: number) => val.toFixed(1) },
				},
			}}
		/>
	);
};

export default ChartDiemTrungBinh;
