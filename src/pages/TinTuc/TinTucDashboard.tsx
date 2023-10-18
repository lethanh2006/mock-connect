import anh from '@/assets/noimg.png';
import NoticeList from '@/components/RightContent/NoticeIcon/NoticeList';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Card, Col, Empty, Modal, Row, Spin, Tabs, Tooltip } from 'antd';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link, history, useModel } from 'umi';
import ViewThongBao from '../ThongBao/components/ViewThongBao';
import { renderParagraph } from './BlockTinTuc';
import { CardTinTuc } from './TinTuc.style';
import './styles.less';

const TinTucDashboard = () => {
	const { danhSach, getModel, loading } = useModel('tintuc.tintuc');
	const { danhSach: danhsachThongBao, setRecord, record } = useModel('thongbao.noticeicon');
	const [tab, setTab] = useState<string>('tin-tuc');
	const [visibleThongBao, setVisibleThongBao] = useState<boolean>(false);

	useEffect(() => {
		getModel(undefined, undefined, undefined, 1, 5);
	}, []);

	const renderThongBao = () => {
		return (
			<>
				<NoticeList
					onClick={(item) => (setRecord(item), setVisibleThongBao(true))}
					title={''}
					tabKey={''}
					list={danhsachThongBao}
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

	const renderTinTuc = () => {
		if (!loading && isEmpty(danhSach)) {
			return <Empty style={{ paddingTop: 32 }} description='Chưa có tin tức' />;
		}
		return (
			<>
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
											<span className='thoi-gian'>{moment(tintuc?.ngayDang).format('HH:mm DD/MM/YYYY')}</span>
										)}
									</Col>
								</Row>
							</CardTinTuc>
						</Col>
					))}
				</Row>

				<div style={{ textAlign: 'right' }}>
					<Link to='/tin-tuc'>
						Xem thêm <ArrowRightOutlined />
					</Link>
				</div>
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
