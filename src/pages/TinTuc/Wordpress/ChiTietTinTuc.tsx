import { CalendarOutlined } from '@ant-design/icons';
import { Col, Divider, Row, Spin } from 'antd';
import moment from 'moment';
import { history, useModel } from 'umi';
import '../components/styles.less';

const ChiTietTinTucWpPage = () => {
	const { record: recChuDe } = useModel('tintuc.chude');
	const { loading, record, setPage } = useModel('tintuc.tintucwp');

	const changeMenu = () => {
		history.push(`/tin-tuc#${recChuDe?._id}`);
		setPage(1);
	};

	return (
		<Spin spinning={loading}>
			<Row gutter={[16, 16]} justify='center'>
				<Col lg={17} span={24}>
					<div id='content'>
						<h4 dangerouslySetInnerHTML={{ __html: record?.title?.rendered ?? '' }} />
						<p className='ngay-dang'>
							<CalendarOutlined /> {record?.date && moment(record?.date).format('DD MMMM YYYY, HH:mm ')}
							<Divider type='vertical' />{' '}
							<a type='link' onClick={() => changeMenu()}>
								{recChuDe?.name}
							</a>
						</p>
						<div className='noi-dung' dangerouslySetInnerHTML={{ __html: record?.content?.rendered ?? '' }} />
					</div>
				</Col>
			</Row>
		</Spin>
	);
};

export default ChiTietTinTucWpPage;
