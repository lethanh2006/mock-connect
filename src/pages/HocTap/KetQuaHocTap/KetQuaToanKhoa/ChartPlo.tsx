import Chart from 'react-apexcharts';

const ChartPloToanKhoa = (props: { height?: number; title?: string }) => {
	const { height = 240, title = 'Kết quả chuẩn đầu ra chương trình' } = props;

	return (
		<>
			<Chart
				options={{
					chart: {
						type: 'radar',
						toolbar: { show: false },
					},
					title: {
						text: title,
						align: 'left',
						style: {
							fontSize: '14px',
							fontWeight: '600',
						},
					},
					xaxis: {
						categories: ['PLO 1', 'PLO 2', 'PLO 3', 'PLO 4', 'PLO 5', 'PLO 6'],
					},
				}}
				series={[{ name: 'Trung bình', data: [3, 3.2, 4.3, 3.6, 4.5, 5] }]}
				type='radar'
				height={height}
				width={height}
			/>
		</>
	);
};

export default ChartPloToanKhoa;
