import anh from '@/assets/noimg.png';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Col, Empty, Row, Spin, Tooltip } from 'antd';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { useEffect } from 'react';
import { Link, history, useModel } from 'umi';
import '../components/styles.less';
import { CardTinTuc } from '../components/TinTuc.style';
import { renderParagraph } from './BlockTinTuc';

const TinTucDashboardSlink = () => {
	const { danhSach, getModel, loading } = useModel('tintuc.tintuc');

	useEffect(() => {
		getModel(undefined, undefined, undefined, 1, 5);
	}, []);

	return (
		<Spin spinning={loading}>
			{isEmpty(danhSach) ? (
				<Empty style={{ paddingTop: 32 }} description='Chưa có tin tức' />
			) : (
				<Row gutter={[12, 12]} style={{ alignItems: 'stretch', marginBottom: 12 }}>
					{danhSach.map((tintuc) => (
						<Col span={24} key={tintuc?._id}>
							<CardTinTuc
								style={{ height: '100%' }}
								onClick={() => {
									history.push({
										pathname: 'tin-tuc/chi-tiet',
										query: { id: tintuc?._id },
									});
								}}
							>
								<Row gutter={12} style={{ height: '100%' }}>
									<Col xs={8}>
										<div
											style={{
												background: tintuc?.urlAnhDaiDien
													? `url(${tintuc?.urlAnhDaiDien}) center center/ cover no-repeat`
													: `url(${anh}) center center/ cover no-repeat`,
												width: '100%',
												height: '100%',
											}}
										/>
									</Col>
									<Col xs={16}>
										<Tooltip title={tintuc?.tieuDe}>
											{renderParagraph(tintuc?.tieuDe, 3, {
												fontWeight: 600,
												marginBottom: 6,
												color: 'black',
											})}
										</Tooltip>
										{tintuc?.ngayDang && (
											<span className='thoi-gian'>{moment(tintuc?.ngayDang).format('DD/MM/YYYY')}</span>
										)}
									</Col>
								</Row>
							</CardTinTuc>
						</Col>
					))}
				</Row>
			)}

			<div style={{ textAlign: 'right' }}>
				<Link to='/tin-tuc'>
					Xem thêm <ArrowRightOutlined />
				</Link>
			</div>
		</Spin>
	);
};

export default TinTucDashboardSlink;
