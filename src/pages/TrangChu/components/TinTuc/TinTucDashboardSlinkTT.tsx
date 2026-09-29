import anh from '@/assets/noimg.png';
import EmptyState from '@/components/EmptyState';
import { IconArrowRight } from '@/components/Icons';
import { renderParagraph } from '@/pages/TinTuc/Slink/BlockTinTuc';
import { formatDate } from '@/utils/formatDate';
import { Col, Row, Spin } from 'antd';
import { isEmpty } from 'lodash';
import { useEffect } from 'react';
import { history, Link, useModel } from 'umi';
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
						<EmptyState compact description='Chưa có tin tức' />
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
												<span className='thoi-gian'>{formatDate(tintuc?.ngayDang)}</span>
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
					Xem thêm <IconArrowRight />
				</Link>
			</div>
		</>
	);
};

export default TinTucDashboardSlink;
