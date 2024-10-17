import NoticeList from '@/components/RightContent/NoticeIcon/NoticeList';
import ViewThongBao from '@/pages/ThongBao/components/ViewThongBao';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Card, Modal, Tabs } from 'antd';
import { useState } from 'react';
import { Link, useModel } from 'umi';
import TinTucDashboard from '../TinTucDashboard';

const TinTucDashboardWrapper = () => {
	const { danhSach: danhsachThongBao, setRecord, record } = useModel('thongbao.noticeicon');
	const [tab, setTab] = useState<string>('thong-bao');
	const [visibleThongBao, setVisibleThongBao] = useState<boolean>(false);

	const renderThongBao = () => {
		return (
			<>
				<NoticeList
					onClick={(item) => (setRecord(item), setVisibleThongBao(true))}
					title={''}
					tabKey={''}
					list={danhsachThongBao}
					showClear={false}
				/>

				<div style={{ textAlign: 'right', marginTop: 12 }}>
					<Link to='/thong-bao'>
						Xem thêm <ArrowRightOutlined />
					</Link>
				</div>

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

	const renderTinTuc = () => <TinTucDashboard />;

	return (
		<Card bodyStyle={{ paddingTop: 0 }}>
			<Tabs onChange={setTab} accessKey='tab'>
				<Tabs.TabPane key='thong-bao' tab={<span style={{ fontSize: 16 }}>Thông báo</span>} />
				<Tabs.TabPane key='tin-tuc' tab={<span style={{ fontSize: 16 }}>Tin tức</span>} />
			</Tabs>

			{tab === 'tin-tuc' ? renderTinTuc() : renderThongBao()}
		</Card>
	);
};

export default TinTucDashboardWrapper;
