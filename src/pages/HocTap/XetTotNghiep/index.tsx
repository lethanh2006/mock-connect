import { Col, Row } from 'antd';
import CardDieuKienTotNghiep from './DieuKien';
import CardXetTotNghiep from './DotXetTotNghiep';
import './style.less';

const XetTotNghiepPage = () => {
	return (
		<Row gutter={[16, 16]}>
			<Col span={24}>
				<CardDieuKienTotNghiep />
			</Col>

			<Col span={24}>
				<CardXetTotNghiep />
			</Col>
		</Row>
	);
};

export default XetTotNghiepPage;
