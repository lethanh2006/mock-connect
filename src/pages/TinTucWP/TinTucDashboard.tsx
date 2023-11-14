import NoticeList from '@/components/RightContent/NoticeIcon/NoticeList';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Card, Col, Empty, Modal, Row, Spin, Tabs, Tooltip } from 'antd';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link, history, useModel } from 'umi';
import ViewThongBao from '../ThongBao/components/ViewThongBao';
import { CardTinTuc } from './TinTuc.style';
import { Title } from './components/Title';
import './styles.less';
import { getImageSrc } from './utils/getImageSrc';

const TinTucDashboard = () => {
	const { danhSach: danhSachTinTuc, getDashboardModel, loading } = useModel('tintuc.tintucwp');
	const { danhSach: dánhachThongBao, setRecord, record } = useModel('thongbao.noticeicon');
	const [tab, setTab] = useState<string>('tin-tuc');
	const [visibleThongBao, setVisibleThongBao] = useState<boolean>(false);

	useEffect(() => {
		getDashboardModel();
	}, []);

	const renderTinTuc = () => {
		if (!loading && isEmpty(danhSachTinTuc)) {
			return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{ paddingTop: 32 }} description='Chưa có tin tức' />;
		}
		return (
			<>
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

				<div style={{ textAlign: 'right' }}>
					<Link to='/tin-tuc'>
						Xem thêm <ArrowRightOutlined />
					</Link>
				</div>
			</>
		);
	};

	const renderThongBao = () => {
		return (
			<>
				<NoticeList
					onClick={(item) => (setRecord(item), setVisibleThongBao(true))}
					title={''}
					tabKey={''}
					list={dánhachThongBao}
				/>

				<Modal
					width={800}
					bodyStyle={{ padding: 0 }}
					destroyOnClose
					onCancel={() => setVisibleThongBao(false)}
					visible={visibleThongBao}
					okButtonProps={{ hidden: true }}
					cancelText='Đóng'
				>
					<ViewThongBao record={record} />
				</Modal>
			</>
		);
	};

	return (
		<Card bodyStyle={{ paddingTop: 0 }}>
			<Spin spinning={loading}>
				<Tabs onChange={setTab} accessKey='tab'>
					<Tabs.TabPane key='tin-tuc' tab={<span style={{ fontSize: 16 }}>Tin tức</span>} />
					<Tabs.TabPane key='thong-bao' tab={<span style={{ fontSize: 16 }}>Thông báo</span>} />
				</Tabs>
				{tab === 'tin-tuc' ? renderTinTuc() : renderThongBao()}
			</Spin>
		</Card>
	);
};

export default TinTucDashboard;
