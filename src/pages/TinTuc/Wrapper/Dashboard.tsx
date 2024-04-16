import { useModel } from 'umi';
import TinTucDashboard from '../TinTucDashboard';
import TinTucWpDashboard from '../Wordpress/TinTucDashboard';
import { useState } from 'react';
import NoticeList from '@/components/RightContent/NoticeIcon/NoticeList';
import { Card, Modal, Tabs } from 'antd';
import ViewThongBao from '@/pages/ThongBao/components/ViewThongBao';

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

	const renderTinTuc = () => (APP_CONFIG_TIN_TUC_WP ? <TinTucWpDashboard /> : <TinTucDashboard />);

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
