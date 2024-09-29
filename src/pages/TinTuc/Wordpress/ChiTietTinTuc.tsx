import { ArrowLeftOutlined, CalendarOutlined } from '@ant-design/icons';
import { Card, Col, Row, Spin } from 'antd';
import moment from 'moment';
import queryString from 'query-string';
import { useEffect } from 'react';
import { useModel } from 'umi';
import '../styles.less';

const ChiTietTinTucWpPage = () => {
	const { getByIdModel, loading, record } = useModel('tintuc.tintucwp');
	const { location } = window;
	const { id } = queryString.parse(location.search);

	const fetchData = async () => {
		try {
			getByIdModel(id as string).then((response) => {
				window.scrollTo({ top: 0, behavior: 'smooth' });
			});
		} catch (error) {
			window.history.back();
		}
	};

	useEffect(() => {
		fetchData();
	}, [id]);

	return (
		<Card
			title={
				<span onClick={() => window.history.back()} style={{ cursor: 'pointer' }}>
					<ArrowLeftOutlined /> Quay lại
				</span>
			}
		>
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
		</Card>
	);
};

export default ChiTietTinTucWpPage;
