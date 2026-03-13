import { Empty } from 'antd';
import { useEffect } from 'react';
import Chart from 'react-apexcharts';
import { useMediaQuery } from 'react-responsive';
import { useIntl, useModel } from 'umi';

const ChartPloToanKhoa = (props: { maKhoaNganh: string }) => {
	const intl = useIntl();
	const { maKhoaNganh } = props;
	const { thongKePLO, thongKeDiemPLOSinhVienModel } = useModel('daotao.diemhpsvhk');
	const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

	useEffect(() => {
		if (maKhoaNganh) {
			thongKeDiemPLOSinhVienModel(maKhoaNganh);
		}
	}, [maKhoaNganh]);

	const ploData = thongKePLO?.danhSachChuanDauRaMucTieu || [];

	if (!ploData.length) {
		return (
			<Empty
				description={intl.formatMessage({ id: 'ketquahoctap.chart.toankhoa.empty' })}
				image={Empty.PRESENTED_IMAGE_SIMPLE}
			/>
		);
	}

	const sortedPloData = [...ploData].sort((a: any, b: any) => {
		const parseCode = (code: string) => code.split('.').map(Number);
		const aParts = parseCode(a.maPlo);
		const bParts = parseCode(b.maPlo);
		for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
			if ((aParts[i] || 0) !== (bParts[i] || 0)) {
				return (aParts[i] || 0) - (bParts[i] || 0);
			}
		}
		return 0;
	});

	const chartOptions = {
		chart: {
			type: 'radar' as const,
			toolbar: { show: false },
		},
		title: {
			text: intl.formatMessage({ id: 'ketquahoctap.chart.toankhoa.ketqua' }),
			align: 'left',
			style: {
				fontSize: '14px',
				fontWeight: '600',
			},
		},
		xaxis: {
			categories: sortedPloData.map((plo: any) => plo.maPlo),
		},
		legend: {
			position: isMobile ? 'bottom' : 'right',
		},
		tooltip: {
			custom: ({ series, dataPointIndex }: any) => {
				const plo = sortedPloData[dataPointIndex];
				return `
					<div style="padding:6px 8px;max-width:260px;white-space:normal;word-break:break-word;font-size:12px;">
						<div>
							<strong>${plo.maPlo}</strong>
							<span style="font-size:11px; color:#666; margin-left:6px;">${plo.ten}</span>
						</div>
						<div style="margin-top:4px">
							<span style="color:#3b82f6;">●</span> ${intl.formatMessage({ id: 'ketquahoctap.chart.toankhoa.plo' })}: 
							<b>${series[0][dataPointIndex].toFixed(2)}</b><br/>
							<span style="color:#10b981;">●</span> ${intl.formatMessage({ id: 'ketquahoctap.chart.toankhoa.min' })}: 
							<b>${series[1][dataPointIndex]}</b>
						</div>
					</div>
				`;
			},
		},
	};

	const chartSeries = [
		{
			name: intl.formatMessage({ id: 'ketquahoctap.chart.toankhoa.plo' }),
			data: sortedPloData.map((plo: any) => Number(plo.trungBinhPi.toFixed(2))),
		},
		{
			name: intl.formatMessage({ id: 'ketquahoctap.chart.toankhoa.min' }),
			data: sortedPloData.map((plo: any) => plo.diemPloToiThieu),
		},
	];

	return <Chart options={chartOptions as any} series={chartSeries} type='radar' height={300} width='100%' />;
};

export default ChartPloToanKhoa;
