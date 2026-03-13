import LineChart from '@/components/Chart/LineChart';
import { useIntl, useModel } from 'umi';

const ChartDiemTrungBinh = () => {
	const intl = useIntl();
	const { danhSach } = useModel('daotao.ketquahocky');

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
			colors={['#0982c9', '#18b903']}
			title='Điểm trung bình'
			formatY={(val) => (Math.round(val * 100) / 100).toString()}
			height={300}
			otherOptions={{ yaxis: { min: 0, max: 4, tickAmount: 4 } }}
		/>
	);
};

export default ChartDiemTrungBinh;
