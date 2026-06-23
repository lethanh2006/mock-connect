import LineChart from '@/components/Chart/LineChart';
import type { KetQuaHocKy } from '@/services/HocTap/KetQuaHocKy/typing';
import { useMemo } from 'react';
import { useIntl, useModel } from 'umi';

const CHART_COLORS = ['#5B8FF9', '#68DDB5'];

const getHocKySortValue = (item: KetQuaHocKy.IRecord) => Number(item.hocKy?.ma ?? item.maHocKy ?? 0);

const ChartDiemTrungBinh = (props: { data?: KetQuaHocKy.IRecord[] }) => {
	const intl = useIntl();
	const { data } = props;
	const { danhSach: danhSachModel } = useModel('daotao.ketquahocky');
	const danhSach = useMemo(
		() => [...(data ?? danhSachModel)].sort((a, b) => getHocKySortValue(b) - getHocKySortValue(a)),
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
			// title='Điểm trung bình'
			formatY={formatY}
			height={300}
			otherOptions={{
				colors: CHART_COLORS,
				title: { text: undefined },
				chart: {
					toolbar: { show: false },
					zoom: { enabled: false },
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
				stroke: { curve: 'smooth', width: 3 },
				markers: {
					size: 3,
					strokeWidth: 2,
					strokeColors: CHART_COLORS,
					// fillOpacity: 0,
					hover: { size: 4 },
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
				],
				yaxis: {
					min: 0,
					max: 4,
					tickAmount: 4,
					labels: { formatter: formatY },
				},
			}}
		/>
	);
};

export default ChartDiemTrungBinh;
