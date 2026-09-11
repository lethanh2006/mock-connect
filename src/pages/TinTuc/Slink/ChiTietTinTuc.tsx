import { formatDateTime } from '@/utils/formatDate';
import DOMPurify from 'dompurify';
import { IconCalendar, IconHuman } from '@/components/Icons';
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
							<IconCalendar /> {record?.ngayDang && formatDateTime(record?.ngayDang)}
							<Divider type='vertical' />
							<IconHuman /> {record?.nguoiDang?.hoTen}
							<Divider type='vertical' />{' '}
							<a type='link' onClick={() => changeMenu()}>
								{record?.chuDe?.name}
							</a>
						</p>
						{record?.moTa !== '' && <p className='mo-ta'>{record?.moTa}</p>}

						<div className='noi-dung' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(record?.noiDung ?? '') }} />
					</div>
				</Col>
			</Row>
		</Spin>
	);
};

export default ChiTietTinTucSlink;
