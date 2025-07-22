import { Card, Tabs } from 'antd';
import { useState } from 'react';
import XemTatCaLink from '../ViewMore';
import TinTucDashboard2 from './TinTucDashboard';
import TinTucDashboardWP2 from './TinTucDashboardWP';

const TinTucDashboardWrapper = () => {
	const [tab, setTab] = useState<string>('giao-vu');
	const [visibleThongBao, setVisibleThongBao] = useState<boolean>(false);

	const renderTinTuc = () => <TinTucDashboard2 />;

	return (
		<Card
			bodyStyle={{ paddingTop: 0 }}
			style={{ borderRadius: 8, backgroundColor: 'transparent', border: 'none', margin: '0 -8px' }}
		>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<Tabs onChange={setTab} accessKey='tab' style={{ flex: 1 }} tabBarStyle={{ border: 'none' }}>
					<Tabs.TabPane key='giao-vu' tab={<span style={{ fontSize: 16, fontWeight: 600 }}>Tin Giáo vụ</span>} />
					<Tabs.TabPane key='tin-tuc' tab={<span style={{ fontSize: 16, fontWeight: 600 }}>Tin tức</span>} />
				</Tabs>

				{/* Nút "Xem tất cả" */}
				<XemTatCaLink to='/tin-tuc' />
			</div>

			{/* Chỉ PTIT */}
			{tab === 'giao-vu' ? <TinTucDashboardWP2 category={344} /> : tab === 'tin-tuc' && renderTinTuc()}
		</Card>
	);
};

export default TinTucDashboardWrapper;
