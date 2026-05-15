import { Col, Row } from 'antd';
import Activities from './components/Activities';
import CardCalendar from './components/Calendar';
import CardTienTrinh from './components/CardTienTrinh';
import Emergency from './components/Emergency';
import News from './components/News';
import QuickActions from './components/QuickActions';
import StudentServices from './components/StudentServices';
import ToDoList from './components/ToDoList';
import './styles.less';

const TrangChuV2 = () => {
	return (
		<Row gutter={[24, 24]}>
			<Col span={24}>
				<CardTienTrinh />
			</Col>
			<Col span={24}>
				<Row gutter={[12, 12]}>
					<Col span={24} md={8}>
						<CardCalendar />
					</Col>

					<Col span={24} md={8}>
						<ToDoList />
					</Col>

					<Col span={24} md={8}>
						<Activities />
					</Col>
				</Row>
			</Col>
			<Col span={24}>
				<Row gutter={[12, 12]}>
					<Col span={24} md={8}>
						<StudentServices />
					</Col>

					<Col span={24} md={8}>
						<News />
					</Col>

					<Col span={24} md={8}>
						<QuickActions />
					</Col>
				</Row>
			</Col>
			<Col span={24}>
				<Emergency />
			</Col>
		</Row>
	);
};

export default TrangChuV2;
