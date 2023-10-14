import { ArrowRightOutlined } from '@ant-design/icons';
import { Button, Card, Col, Empty, Row, Spin, Tooltip } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { history, useModel } from 'umi';
import { CardTinTuc } from './TinTuc.style';
import './styles.less';
import { getImageSrc } from './utils/getImageSrc';
import { Title } from './components/Title';

interface Props {
	hiddenTitle?: boolean;
}

const TinTucDashboard = ({ hiddenTitle }: Props) => {
	const { danhSach, getDashboardModel, loading } = useModel('tintuc.tintucwp');

	useEffect(() => {
		getDashboardModel();
	}, []);

	return (
		<Card title={`${!hiddenTitle ? 'Tin tức' : ''}`} bordered={false} bodyStyle={{ padding: 0 }}>
			<Spin spinning={loading}>
				{danhSach && danhSach.length > 0 ? (
					<>
						<Row gutter={[12, 12]} style={{ alignItems: 'stretch', marginBottom: 12 }}>
							{danhSach.map((tintuc) => {
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
													{tintuc?.date && (
														<span className='thoi-gian'>{moment(tintuc?.date).format('HH:mm DD/MM/YYYY')}</span>
													)}
												</Col>
											</Row>
										</CardTinTuc>
									</Col>
								);
							})}
						</Row>

						<Button
							style={{ marginTop: 10 }}
							type='link'
							onClick={() => {
								history.push('/tin-tuc');
							}}
						>
							Xem thêm <ArrowRightOutlined />
						</Button>
					</>
				) : (
					<Empty style={{ paddingTop: 32 }} description='Chưa có tin tức' />
				)}
			</Spin>
		</Card>
	);
};

export default TinTucDashboard;
