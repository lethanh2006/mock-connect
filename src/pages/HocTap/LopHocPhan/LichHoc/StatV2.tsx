import DonutChart from '@/components/Chart/DonutChart';
import { colorList } from '@/services/base/constant';
import { ETrangThaiLopDiemDanh } from '@/services/DaoTao/constant';
import dayjs from '@/utils/dayjs';
import { Card } from 'antd';
import { useMemo } from 'react';
import { useIntl, useModel } from 'umi';

const StatDiemDanhV2 = () => {
	const { danhSach } = useModel('daotao.thoikhoabieu');
	const intl = useIntl();

	const chartData = useMemo(() => {
		const tongSo = danhSach.length;
		const daHoc = danhSach.filter((item) => dayjs().isAfter(item.thoiGianKetThuc)).length;
		const daDiemDanh = danhSach.filter((item) => item.trangThaiDiemDanh === ETrangThaiLopDiemDanh.DA_DIEM_DANH).length;
		const chuaDiemDanh = tongSo - daDiemDanh;

		return [
			{
				label: intl.formatMessage({ id: 'lophocphan.id.lichhoc.diemdanh' }),
				value: tongSo,
				color: 'var(--color-primary)',
			},
			{
				label: intl.formatMessage({ id: 'lophocphan.id.lichhoc.sobuoidahoc' }),
				value: daHoc,
				color: colorList.GEEKBLUE.hexColor,
			},
			{
				label: intl.formatMessage({ id: 'lophocphan.id.lichhoc.sobuoidadiemdanh' }),
				value: daDiemDanh,
				color: '#52c41a',
			},
			{
				label: intl.formatMessage({ id: 'lophocphan.id.lichhoc.sobuoichuadiemdanh' }),
				value: chuaDiemDanh,
				color: '#ff4d4f',
			},
		];
	}, [danhSach, intl]);

	const unit = intl.formatMessage({ id: 'lophocphan.id.lichhoc.buoi' });
	const tongSo = chartData[0]?.value ?? 0;

	return (
		<Card
			variant='borderless'
			title={intl.formatMessage({ id: 'lophocphan.id.lichhoc.diemdanh' })}
			style={{ height: '100%' }}
			styles={{ body: { paddingTop: 8 } }}
		>
			<DonutChart
				xAxis={chartData.map((item) => item.label)}
				yLabel={[unit]}
				yAxis={[chartData.map((item) => item.value)]}
				formatY={(val) => `${val} ${unit}`}
				height={280}
				colors={chartData.map((item) => item.color)}
				otherOptions={{
					legend: {
						show: true,
						position: 'bottom',
						horizontalAlign: 'center',
						fontSize: '12px',
						formatter: (seriesName: string, opts: { w: { globals: { series: number[] } }; seriesIndex: number }) => {
							const value = opts.w.globals.series[opts.seriesIndex];
							return `${seriesName}: ${value}`;
						},
					},
					dataLabels: { enabled: false },
					chart: { toolbar: { show: false } },
					plotOptions: {
						pie: {
							donut: {
								size: '68%',
								labels: {
									show: true,
									total: {
										show: true,
										label: intl.formatMessage({ id: 'lophocphan.id.lichhoc.tong' }),
										formatter: () => String(tongSo),
									},
								},
							},
						},
					},
				}}
			/>
		</Card>
	);
};

export default StatDiemDanhV2;
