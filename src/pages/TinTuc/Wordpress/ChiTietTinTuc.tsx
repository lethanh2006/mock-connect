import { CalendarOutlined } from '@ant-design/icons';
import { Col, Row, Spin } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import '../components/styles.less';

const ChiTietTinTucWpPage = () => {
	const { loading, record } = useModel('tintuc.tintucwp');

	return (
		<Spin spinning={loading}>
			<Row gutter={[16, 16]} justify='center'>
				<Col lg={17} span={24}>
					<div id='content'>
						<h4>{record?.title?.rendered ?? ''}</h4>
						{record?.date && (
							<p className='ngay-dang'>
								<CalendarOutlined /> {moment(record?.date).format('DD MMMM YYYY, HH:mm ')}
							</p>
						)}
						<div className='noi-dung' dangerouslySetInnerHTML={{ __html: record?.content?.rendered ?? '' }} />
					</div>
				</Col>
			</Row>
		</Spin>
	);
};

export default ChiTietTinTucWpPage;
