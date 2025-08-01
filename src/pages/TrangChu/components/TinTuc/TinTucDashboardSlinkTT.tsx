import anh from '@/assets/noimg.png';
import { renderParagraph } from '@/pages/TinTuc/Slink/BlockTinTuc';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Col, Empty, Row, Spin } from 'antd';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { useEffect } from 'react';
import { Link, history, useModel } from 'umi';
import './style.less';

// import '../components/styles.less';
// import { CardTinTuc } from '../components/TinTuc.style';

const TinTucDashboardSlink = () => {
	const { danhSach, getModel, loading } = useModel('tintuc.tintuc');

	useEffect(() => {
		getModel(undefined, undefined, undefined, 1, 5);
	}, []);

	return (
		<>
			<div className='tin-tuc-container'>
				<Spin spinning={loading}>
					{isEmpty(danhSach) ? (
						<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ paddingTop: 32 }} description='Chưa có tin tức' />
					) : (
						<Row gutter={[1, 1]} className='tin-tuc-wrapper-dashboard'>
							{danhSach.map((tintuc, index) => (
								<Col xs={24} sm={12} md={12} lg={6} key={tintuc?._id} className={`tin-tuc-col-${index + 1}`}>
									<div
										className='tin-tuc-card'
										onClick={() => {
											history.push({
												pathname: 'tin-tuc/chi-tiet',
												// query: { id: tintuc?._id },
												search: `?id=${tintuc?._id}`,
											});
											window.scrollTo({ top: 0, behavior: 'smooth' });
										}}
									>
										<div className='tin-tuc-image-wrapper'>
											<img src={tintuc?.urlAnhDaiDien || anh} alt={tintuc?.tieuDe || ''} />
										</div>
										<div className='tin-tuc-content'>
											<div title={tintuc?.tieuDe || ''}>
												<div className='tin-tuc-tieu-de'>{renderParagraph(tintuc?.tieuDe, 2, { margin: 0 })}</div>
											</div>
											{tintuc?.ngayDang && (
												<span className='thoi-gian'>{moment(tintuc?.ngayDang).format('DD/MM/YYYY')}</span>
											)}
										</div>
									</div>
								</Col>
							))}
						</Row>
					)}
				</Spin>
			</div>
			<div className='xem-them'>
				<Link to='/tin-tuc'>
					Xem thêm <ArrowRightOutlined />
				</Link>
			</div>
		</>
	);
};

export default TinTucDashboardSlink;
