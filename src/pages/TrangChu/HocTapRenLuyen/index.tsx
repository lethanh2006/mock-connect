import { Col, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import CardKetQuaHocTapDashboard from './CardHocTap';
import CardRenLuyenDashboard from './CardRenLuyen';
import CardTienTrinhTotNghiep from './CardTienTrinhTotNghiep';
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
		<Row gutter={[16, 16]} style={{ height: '100%' }}>
			<Col span={24} md={8}>
				<CardKetQuaHocTapDashboard />
			</Col>

			<Col span={24} md={8}>
				<CardRenLuyenDashboard />
			</Col>

			<Col span={24} md={8}>
				<CardTienTrinhTotNghiep />
			</Col>
		</Row>
	);
};

export default CardHocTapRenLuyenDashboard;
