import LineChart from '@/components/Chart/LineChart';
import { useModel } from 'umi';

const ChartDiemTrungBinh = () => {
	const { danhSach } = useModel('daotao.ketquahocky');

	return (
		<LineChart
			xAxis={danhSach.map((item) => item.maHocKy)}
			yAxis={[
				danhSach.map((item) => item.trungBinhHocKyThang4),
				danhSach.map((item) => item.trungBinhTichLuyToanKhoaThang4),
			]}
			yLabel={['TB học kỳ', 'TB tích lũy']}
			colors={['#0982c9', '#18b903']}
			title='Điểm trung bình'
			formatY={(val) => (Math.round(val * 100) / 100).toString()}
			height={300}
			otherOptions={{ yaxis: { min: 0, max: 4, tickAmount: 4 } }}
		/>
	);
};

export default ChartDiemTrungBinh;
