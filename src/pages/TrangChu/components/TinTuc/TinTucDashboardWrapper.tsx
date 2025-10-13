import { Card, Tabs } from 'antd';
import { useState } from 'react';

import { Link } from 'umi';
import TinTucDashboard from './TinTucDashboard';
import TinTucDashboardWP from './TinTucDashboardWP';

const TinTucDashboardWrapper = () => {
	const [tab, setTab] = useState<string>('giao-vu');
	const [visibleThongBao, setVisibleThongBao] = useState<boolean>(false);

	const renderTinTuc = () => <TinTucDashboard />;

	return (
		<Card
			variant='borderless'
			className='card-borderless card-big-title'
			title={
				<Tabs
					onChange={setTab}
					accessKey='tab'
					tabBarStyle={{
						border: 'none',
						marginBottom: 0, // Giảm khoảng cách dưới của tab bar
						paddingBottom: '4px', // Giảm padding để gạch chân sát hơn
					}}
				>
					<Tabs.TabPane key='giao-vu' tab={<span style={{ fontSize: 18, fontWeight: 600 }}>Tin Giáo vụ</span>} />
					<Tabs.TabPane key='tin-tuc' tab={<span style={{ fontSize: 18, fontWeight: 600 }}>Tin tức</span>} />
				</Tabs>
			}
			extra={
				<Link to='/tin-tuc' className='xem-tat-ca-link'>
					Xem tất cả
				</Link>
			}
		>
			{/* Chỉ PTIT */}
			{tab === 'giao-vu' ? <TinTucDashboardWP category={344} /> : tab === 'tin-tuc' && renderTinTuc()}
		</Card>
	);
};

export default TinTucDashboardWrapper;
