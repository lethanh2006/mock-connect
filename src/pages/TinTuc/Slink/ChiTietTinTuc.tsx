import { CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { Col, Divider, Row, Spin } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import '../components/styles.less';

const ChiTietTinTucSlink = () => {
	const { loading, record } = useModel('tintuc.tintuc');

	return (
		<Spin spinning={loading}>
			<Row gutter={[16, 16]} justify='center'>
				<Col lg={17} span={24}>
					<div id='content'>
						<h4>{record?.tieuDe ?? ''}</h4>
						<p className='ngay-dang'>
							<CalendarOutlined /> {record?.ngayDang && moment(record?.ngayDang).format('DD MMMM YYYY, HH:mm ')}
							<Divider type='vertical' />
							<UserOutlined /> {record?.nguoiDang?.hoTen}
						</p>
						{record?.moTa !== '' && <p className='mo-ta'>{record?.moTa}</p>}

						<div className='noi-dung' dangerouslySetInnerHTML={{ __html: record?.noiDung ?? '' }} />
					</div>
				</Col>
			</Row>
		</Spin>
	);
};

export default ChiTietTinTucSlink;
