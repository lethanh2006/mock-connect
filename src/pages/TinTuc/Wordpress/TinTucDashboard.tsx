import { ArrowRightOutlined } from '@ant-design/icons';
import { Col, Empty, Row, Spin, Tooltip } from 'antd';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { useEffect } from 'react';
import { Link, history, useModel } from 'umi';
import '../components/styles.less';
import { CardTinTuc } from '../components/TinTuc.style';
import { Title } from './components/Title';
import { getImageSrc } from './utils/getImageSrc';

const TinTucWpDashboard = (props: { category?: number }) => {
	const { danhSach: danhSachTinTuc, getDashboardModel, loading } = useModel('tintuc.tintucwp');

	useEffect(() => {
		getDashboardModel(props.category);
	}, [props.category]);

	return (
		<Spin spinning={loading}>
			{isEmpty(danhSachTinTuc) ? (
				<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ paddingTop: 32 }} description='Chưa có tin tức' />
			) : (
				<Row gutter={[12, 12]} style={{ alignItems: 'stretch', marginBottom: 12 }}>
					{danhSachTinTuc.map((tintuc) => {
						return (
							<Col span={24} key={tintuc?.id}>
								<CardTinTuc
									style={{ height: '100%' }}
									onClick={() => {
										history.push({
											pathname: 'tin-tuc/chi-tiet',
											query: { id: tintuc?.id as any },
										});
									}}
								>
									<Row gutter={12} style={{ height: '100%' }}>
										<Col xs={8}>
											<div
												style={{
													background: `url(${getImageSrc({
														tinTuc: tintuc,
														targetSize: 'thumbnail',
													})}) center center/ cover no-repeat`,
													width: '100%',
													height: '100%',
												}}
											/>
										</Col>
										<Col xs={16}>
											<Tooltip title={<Title data={tintuc} />}>
												<Title
													data={tintuc}
													rows={3}
													style={{
														fontWeight: 600,
														marginBottom: 6,
														color: 'black',
													}}
												/>
											</Tooltip>
											{tintuc?.date && <span className='thoi-gian'>{moment(tintuc?.date).format('DD/MM/YYYY')}</span>}
										</Col>
									</Row>
								</CardTinTuc>
							</Col>
						);
					})}
				</Row>
			)}

			<div style={{ textAlign: 'right' }}>
				<Link to={`/tin-tuc?category=${props.category ?? ''}`}>
					Xem thêm <ArrowRightOutlined />
				</Link>
			</div>
		</Spin>
	);
};

export default TinTucWpDashboard;
