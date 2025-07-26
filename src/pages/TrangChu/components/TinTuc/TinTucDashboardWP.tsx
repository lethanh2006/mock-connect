import { Title } from '@/pages/TinTuc/Wordpress/components/Title';
import { getImageSrc } from '@/pages/TinTuc/Wordpress/utils/getImageSrc';
import { landingUrl } from '@/services/base/constant';
import { Card, Col, Empty, Row, Spin } from 'antd';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { useEffect } from 'react';
import { history, useModel } from 'umi';

const TinTucDashboardWP = (props: { category?: number }) => {
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
			<Card variant='borderless' style={{ borderRadius: 8 }}>
				<Spin spinning={loading}>
					{isEmpty(danhSachTinTuc) ? (
						<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ paddingTop: 32 }} description='Chưa có tin tức' />
					) : (
						<Row gutter={[1, 1]} className='tin-tuc-wrapper-dashboard'>
							{danhSachTinTuc.map((tintuc, index) => {
								return (
									<Col xs={24} sm={12} md={12} lg={6} key={tintuc?.id} className={`tin-tuc-col-${index + 1}`}>
										<div
											// className="tin-tuc-card"
											style={{
												height: '104px',
												border: 'none',
												borderRadius: '4px',
												boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
												overflow: 'hidden',
												cursor: 'pointer',
												transition: 'all 0.3s ease',
												backgroundColor: '#fff',
												marginTop: '-8px',
											}}
											onClick={() => {
												history.push({
													pathname: 'tin-tuc/chi-tiet',
													// query: { _id: tintuc?.id as any, cat: linkWp?._id as any },
													search: `?_id=${tintuc?.id}&cat=${linkWp?._id}`,
												});
												window.scrollTo({ top: 0, behavior: 'smooth' });
											}}
											onMouseEnter={(e) => {
												e.currentTarget.style.transform = 'translateY(-2px)';
												e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)';
											}}
											onMouseLeave={(e) => {
												e.currentTarget.style.transform = 'translateY(0)';
												e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
											}}
										>
											<div
												// className="ant-card-body"
												style={{
													padding: '12px',
													height: '100%',
													display: 'flex',
													flexDirection: 'row',
													alignItems: 'flex-start',
													gap: '12px',
												}}
											>
												{/* Image */}
												<div
													// className="tin-tuc-image-wrapper"
													style={{
														flexShrink: 0,
														width: '80px',
														height: '80px',
														borderRadius: '6px',
														overflow: 'hidden',
													}}
												>
													<img
														src={getImageSrc({
															tinTuc: tintuc,
															targetSize: 'thumbnail',
														})}
														alt={tintuc?.title?.rendered || ''}
														style={{
															width: '100%',
															height: '100%',
															objectFit: 'cover',
														}}
													/>
												</div>

												{/* Content */}
												<div
													// className="tin-tuc-content"
													style={{
														flex: 1,
														display: 'flex',
														flexDirection: 'column',
														justifyContent: 'space-between',
														margin: 0,
														height: '100%',
													}}
												>
													<div
														title={tintuc?.title?.rendered || ''}
														// overlayClassName="custom-tooltip"
													>
														<div
															// className="tin-tuc-tieu-de"
															style={{
																fontWeight: 600,
																marginBottom: '8px',
																color: '#1a1a1a',
																fontSize: '14px',
																lineHeight: '1.4',
																display: '-webkit-box',
																WebkitLineClamp: 2,
																WebkitBoxOrient: 'vertical',
																overflow: 'hidden',
																textOverflow: 'ellipsis',
															}}
														>
															<Title
																data={tintuc}
																rows={2}
																style={{
																	margin: 0,
																	fontSize: '14px',
																	fontWeight: 600,
																	color: '#1a1a1a',
																}}
															/>
														</div>
													</div>

													{/* Date */}
													{tintuc?.date && (
														<span
															className='thoi-gian'
															style={{
																color: '#8c8c8c',
																fontSize: '14px',
																// marginTop: 'auto',
																backgroundColor: 'transparent',
																padding: 0,
															}}
														>
															{moment(tintuc?.date).format('DD/MM/YYYY')}
														</span>
													)}
												</div>
											</div>
										</div>
									</Col>
								);
							})}
						</Row>
					)}
				</Spin>
			</Card>
		</>
	);
};

export default TinTucDashboardWP;
