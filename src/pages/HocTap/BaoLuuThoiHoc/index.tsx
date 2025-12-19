import { Col, Row } from 'antd';
import { useIntl } from 'umi';
import BaoLuuThoiHocTable from './table';

const BaoLuuThoiHoc = () => {
	const intl = useIntl();
	return (
		<Row gutter={[0, 12]}>
			<Col span={24}>
				<div className='fw500'>{intl.formatMessage({ id: 'hoctapkhac.baoluu.lichsubaoluu.title' })}</div>
				<BaoLuuThoiHocTable />
			</Col>
			<Col span={24}>
				<div className='fw500'>{intl.formatMessage({ id: 'hoctapkhac.thoihoc.lichsuthoihoc.title' })}</div>
				<BaoLuuThoiHocTable isThoiHoc />
			</Col>
		</Row>
	);
};

export default BaoLuuThoiHoc;
