import { Col, Flex, Row } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import Activities from './components/Activities';
import CardCalendar from './components/Calendar';
import CardTienTrinh from './components/CardTienTrinh';
import CreditProgress from './components/CreditProgress';
import Emergency from './components/Emergency';
import News from './components/News';
// import QuickActions from './components/QuickActions';
import WelcomeCard from './components/WelcomeCard';
import './styles.less';

const TrangChuV2 = () => {
	const { getTienTrinhTotNghiepModel } = useModel('sinhvien.tientrinhtotnghiep');
	const { getKhoaNganhMeModel } = useModel('sinhvien.sinhvien');
	const { sinhVienGetTienTrinhKhungModel } = useModel('daotao.chuongtrinhdaotao');

	useEffect(() => {
		getKhoaNganhMeModel().then((res) => {
			if (res?.khoaNganhChinh?.ma) getTienTrinhTotNghiepModel(res.khoaNganhChinh.ma);
			sinhVienGetTienTrinhKhungModel(false);
		});
	}, []);

	return (
		<Row gutter={[24, 24]}>
			<Col xs={24} lg={16} xl={17}>
				<Flex vertical gap={24}>
					<WelcomeCard />

					<Row gutter={[12, 12]}>
						<Col span={24} md={24}>
							<CardCalendar />
						</Col>

						{/* <Col span={24} md={8}>
							<ToDoList />
						</Col> */}

						<Col span={24} md={24}>
							<Activities />
						</Col>
					</Row>

					<Row gutter={[12, 12]}>
						<Col span={24} md={24}>
							<News />
						</Col>

						{/* <Col span={24} md={8}>
							<QuickActions />
						</Col> */}
					</Row>
				</Flex>
			</Col>

			<Col xs={24} lg={8} xl={7}>
				<Flex vertical gap={12}>
					<CardTienTrinh />
					<CreditProgress />
					{/* <StudentServices /> */}
					<Emergency />
				</Flex>
			</Col>
		</Row>
	);
};

export default TrangChuV2;
