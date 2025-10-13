import { Card, Col, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import CardCongNoDashboard from '../components/CongNo';
import CardKetQuaHocTapDashboard from './CardHocTap';
import CardRenLuyenDashboard from './CardRenLuyen';
import './style.less';

const CardHocTapRenLuyenDashboard = () => {
	const { getTienTrinhTotNghiepModel } = useModel('sinhvien.tientrinhtotnghiep');
	const { getKhoaNganhMeModel } = useModel('sinhvien.sinhvien');

	useEffect(() => {
		getKhoaNganhMeModel().then((res) => {
			if (res?.khoaNganhChinh?.ma) getTienTrinhTotNghiepModel(res?.khoaNganhChinh?.ma);
		});
	}, []);

	return (
		<Card
			title='Thống kê dữ liệu'
			variant='borderless'
			className='card-borderless card-big-title'
			style={{ height: '100%' }}
		>
			<Row gutter={[16, 16]} style={{ height: '100%' }}>
				<Col xs={24} sm={24} md={12} lg={8} xl={8}>
					<CardKetQuaHocTapDashboard />
				</Col>

				<Col xs={24} sm={24} md={12} lg={8} xl={8}>
					<CardRenLuyenDashboard />
				</Col>

				{/* <Col span={24} md={8}>
						<CardTienTrinhTotNghiep />
					</Col> */}

				<Col xs={24} sm={24} md={24} lg={8} xl={8}>
					<CardCongNoDashboard />
				</Col>
			</Row>
		</Card>
	);
};

export default CardHocTapRenLuyenDashboard;
