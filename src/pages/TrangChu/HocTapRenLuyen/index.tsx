import { Card, Col, Row, Skeleton } from 'antd';
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

	const { loading } = useModel('lophocphan.lophocphan');

	return (
		<Card
			title={<span style={{ fontSize: 18 }}>Thống kê dữ liệu</span>}
			style={{
				background: 'transparent',
				border: 'none',
				marginBottom: 0,
				boxShadow: 'none',
				height: '100%',
			}}
			headStyle={{
				borderBottom: 'none',
				background: 'transparent',
				marginBottom: 0,
				paddingBottom: 0,
			}}
			bodyStyle={{ paddingTop: 0 }}
		>
			{/* Nội dung bên trong Card */}

			{loading ? (
				<Skeleton active />
			) : (
				<Row gutter={[16, 16]} style={{ height: '100%', margin: '0 -16px' }}>
					<Col span={24} md={8}>
						<CardKetQuaHocTapDashboard />
					</Col>

					<Col span={24} md={8}>
						<CardRenLuyenDashboard />
					</Col>

					{/* <Col span={24} md={8}>
						<CardTienTrinhTotNghiep />
					</Col> */}

					<Col span={24} md={8}>
						<CardCongNoDashboard />
					</Col>
				</Row>
			)}
		</Card>
	);
};

export default CardHocTapRenLuyenDashboard;
