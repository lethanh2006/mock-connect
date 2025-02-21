import LineChart from '@/components/Chart/LineChart';
import { useModel } from 'umi';

const ChartVaoRaThuVien = () => {
	const { thongKeVaoRa } = useModel('thuvien.vaorathuvien');

	return (
		<div className='chart-thu-vien'>
			<LineChart
				xAxis={thongKeVaoRa.map((i) => `${i.thang + 1}/${i.nam}`)}
				yAxis={[thongKeVaoRa.map((i) => i.totalCI)]}
				yLabel={['Số lượt']}
				height={100}
				otherOptions={{
					chart: { zoom: { enabled: false }, toolbar: { show: false }, animations: { enabled: false } },
					stroke: { width: 2 },
					dataLabels: { enabled: false },
					grid: { show: false },
					title: { text: undefined },
					xaxis: { labels: { show: false } },
					yaxis: { labels: { show: false } },
					tooltip: { enabled: false },
				}}
			/>
		</div>
	);
};

export default ChartVaoRaThuVien;
