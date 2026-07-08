import { formatDateTime } from '@/utils/formatDate';
import { sanitizeObject } from '@/utils/utils';
import { CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { Col, Divider, Row, Spin } from 'antd';
import { history, useModel } from 'umi';
import '../components/styles.less';

const ChiTietTinTucSlink = () => {
	const { loading, record, setPage } = useModel('tintuc.tintuc');

	const changeMenu = () => {
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
							<CalendarOutlined /> {record?.ngayDang && formatDateTime(record?.ngayDang)}
							<Divider type='vertical' />
							<UserOutlined /> {record?.nguoiDang?.hoTen}
							<Divider type='vertical' />{' '}
							<a type='link' onClick={() => changeMenu()}>
								{record?.chuDe?.name}
							</a>
						</p>
						{record?.moTa !== '' && <p className='mo-ta'>{record?.moTa}</p>}

						<div className='noi-dung' dangerouslySetInnerHTML={{ __html: sanitizeObject(record?.noiDung ?? '') }} />
					</div>
				</Col>
			</Row>
		</Spin>
	);
};

export default ChiTietTinTucSlink;
