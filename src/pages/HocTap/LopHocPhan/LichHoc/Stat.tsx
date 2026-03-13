import { ETrangThaiUserDiemDanh, colorTrangThaiUserDiemDanh, trangThaiUserDiemDanh } from '@/services/DaoTao/constant';
import { Card, Col, Row } from 'antd';
import { useModel } from 'umi';

const StatDiemDanh = () => {
	const { danhSach } = useModel('daotao.thoikhoabieu');

	return (
		<Row gutter={[8, 8]} style={{ marginBottom: 18 }}>
			<Col span={12} md={8} xxl={4}>
				<Card className='card-stat-small'>
					<span className='num'>{danhSach.length}</span>
					<span>Tổng số buổi học</span>
				</Card>
			</Col>

			{Object.values(ETrangThaiUserDiemDanh).map((item) => (
				<Col span={12} md={8} xxl={4} key={item}>
					<Card className='card-stat-small'>
						<span className='num' style={{ color: colorTrangThaiUserDiemDanh[item] }}>
							{danhSach.filter((j) => j.trangThaiDiemDanhCaNhan === item).length}
						</span>
						<span>{trangThaiUserDiemDanh[item]}</span>
					</Card>
				</Col>
			))}
		</Row>
	);
};

export default StatDiemDanh;
