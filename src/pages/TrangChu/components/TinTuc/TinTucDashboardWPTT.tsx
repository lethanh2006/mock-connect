import { landingUrl } from '@/services/base/constant';
import { Col, Empty, Row, Spin } from 'antd';
import { isEmpty } from 'lodash';
import { useEffect } from 'react';
import { history, useModel } from 'umi';
// import '../components/styles.less';
// import { CardTinTuc } from '../components/TinTuc.style';
import { Title } from '@/pages/TinTuc/Wordpress/components/Title';
import { getImageSrc } from '@/pages/TinTuc/Wordpress/utils/getImageSrc';
import moment from 'moment';
import './styles.less';

const TinTucDashboardWPTT = (props: { category?: number }) => {
	const { category } = props;
	const { danhSach: danhSachChuDe } = useModel('tintuc.chude');
	const { danhSach: danhSachTinTuc, getDashboardModel, loading } = useModel('tintuc.tintucwp');

	const linkWp = danhSachChuDe?.filter((item) => item?.isTinTucWP)?.[0];
	const idCategory = danhSachChuDe?.filter((item) => item?.isTinTucWP)?.map((items) => items?.idCategoryWp);
	const chuDe = danhSachChuDe?.find((item) => item?.idCategoryWp === category);

	useEffect(() => {
		if (category) {
			getDashboardModel([category], linkWp?.linkWP ?? landingUrl);
		} else {
			if (linkWp?.linkWP && idCategory?.length) {
				getDashboardModel(idCategory, linkWp?.linkWP);
			}
		}
	}, [linkWp?.linkWP, idCategory?.length, category]);

	return (
		<>
			<>
				<div className='tin-tuc-container'>
					<Spin spinning={loading}>
						{isEmpty(danhSachTinTuc) ? (
							<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ paddingTop: 32 }} description='Chưa có tin tức' />
						) : (
							<Row gutter={[1, 1]} className='tin-tuc-wrapper-dashboard'>
								{danhSachTinTuc.map((tintuc, index) => (
									<Col xs={24} sm={12} md={12} lg={6} key={tintuc?.id} className={`tin-tuc-col-${index + 1}`}>
										<div
											className='tin-tuc-card'
											onClick={() => {
												history.push({
													pathname: 'tin-tuc/chi-tiet',
													// query: { _id: tintuc?.id as any, cat: linkWp?._id as any },
													search: `?_id=${tintuc?.id}&cat=${linkWp?._id}`,
												});
												window.scrollTo({ top: 0, behavior: 'smooth' });
											}}
										>
											<div className='tin-tuc-image-wrapper'>
												<img
													src={getImageSrc({ tinTuc: tintuc, targetSize: 'thumbnail' })}
													alt={tintuc?.title?.rendered || ''}
												/>
											</div>
											<div className='tin-tuc-content'>
												<div title={tintuc?.title?.rendered || ''}>
													<div className='tin-tuc-tieu-de'>
														<Title data={tintuc} rows={2} style={{ margin: 0 }} />
													</div>
												</div>
												{tintuc?.date && <span className='thoi-gian'>{moment(tintuc?.date).format('DD/MM/YYYY')}</span>}
											</div>
										</div>
									</Col>
								))}
							</Row>
						)}
					</Spin>
				</div>
				{/* Uncomment if needed */}
				{/* <div className="xem-them">
        <Link to={category ? `/tin-tuc#${chuDe?._id ?? 'all'}` : '/tin-tuc'}>
          Xem thêm <ArrowRightOutlined />
        </Link>
      </div> */}
			</>
		</>
	);
};

export default TinTucDashboardWPTT;
