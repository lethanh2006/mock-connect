import { CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { Col, Divider, Row, Spin } from 'antd';
import moment from 'moment';
import { history, useModel } from 'umi';
import '../components/styles.less';

const ChiTietTinTucSlink = () => {
	const { setTabActive } = useModel('tintuc.chude');
	const { loading, record, setPage } = useModel('tintuc.tintuc');

	const changeMenu = () => {
		setTabActive(record?.chuDe?._id ?? '');
		history.push(`/tin-tuc#${record?.chuDe?._id}`);
		setPage(1);
	};

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
							<Divider type='vertical' />{' '}
							<a type='link' onClick={() => changeMenu()}>
								{record?.chuDe?.name}
							</a>
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
