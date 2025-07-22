import anh from '@/assets/noimg.png';
import { renderParagraph } from '@/pages/TinTuc/Slink/BlockTinTuc';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Col, Empty, Row, Spin } from 'antd';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { useEffect } from 'react';
import { Link, history, useModel } from 'umi';
// import '../components/styles.less';
// import { CardTinTuc } from '../components/TinTuc.style';

const TinTucDashboardSlink = () => {
	const { danhSach, getModel, loading } = useModel('tintuc.tintuc');

	useEffect(() => {
		getModel(undefined, undefined, undefined, 1, 5);
	}, []);

	return (
		<>
			<div
				style={{
					maxHeight: 400,
					overflowY: 'auto',
					overflowX: 'hidden',
					padding: 0,
					margin: 0,
					backgroundColor: '#fff',
					borderRadius: 8,
				}}
			>
				<Spin spinning={loading}>
					{isEmpty(danhSach) ? (
						<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ paddingTop: 32 }} description='Chưa có tin tức' />
					) : (
						<Row gutter={[1, 1]} className='tin-tuc-wrapper-dashboard'>
							{danhSach.map((tintuc, index) => (
								<Col xs={24} sm={12} md={12} lg={6} key={tintuc?._id} className={`tin-tuc-col-${index + 1}`}>
									<div
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
												// query: { id: tintuc?._id },
												search: `?id=${tintuc?._id}`,
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
												style={{
													flexShrink: 0,
													width: '80px',
													height: '80px',
													borderRadius: '6px',
													overflow: 'hidden',
												}}
											>
												<img
													src={tintuc?.urlAnhDaiDien || anh}
													alt={tintuc?.tieuDe || ''}
													style={{
														width: '100%',
														height: '100%',
														objectFit: 'cover',
													}}
												/>
											</div>

											{/* Content */}
											<div
												style={{
													flex: 1,
													display: 'flex',
													flexDirection: 'column',
													justifyContent: 'space-between',
													margin: 0,
													height: '100%',
												}}
											>
												<div title={tintuc?.tieuDe || ''}>
													<div
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
														{renderParagraph(tintuc?.tieuDe, 2, {
															margin: 0,
															fontSize: '14px',
															fontWeight: 600,
															color: '#1a1a1a',
														})}
													</div>
												</div>

												{/* Date */}
												{tintuc?.ngayDang && (
													<span
														className='thoi-gian'
														style={{
															color: '#8c8c8c',
															fontSize: '14px',
															marginTop: 'auto',
														}}
													>
														{moment(tintuc?.ngayDang).format('DD/MM/YYYY')}
													</span>
												)}
											</div>
										</div>
									</div>
								</Col>
							))}
						</Row>
					)}
				</Spin>
			</div>

			<div style={{ textAlign: 'right', marginTop: 12 }}>
				<Link to='/tin-tuc'>
					Xem thêm <ArrowRightOutlined />
				</Link>
			</div>
		</>
	);
};

export default TinTucDashboardSlink;
