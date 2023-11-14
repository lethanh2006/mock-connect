import { Col, Row } from 'antd';
import BaoLuuThoiHocTable from './table';

const BaoLuuThoiHoc = () => {
	return (
		<Row gutter={[0, 12]}>
			<Col span={24}>
				<BaoLuuThoiHocTable />
			</Col>
			<Col span={24}>
				<BaoLuuThoiHocTable isThoiHoc />
			</Col>
		</Row>
	);
};

export default BaoLuuThoiHoc;
