import { Card, Tabs } from 'antd';
import { useState } from 'react';

import { Link, useIntl } from 'umi';
import TinTucDashboard from './TinTucDashboard';
import TinTucDashboardWP from './TinTucDashboardWP';

const TinTucDashboardWrapper = () => {
	const intl = useIntl();
	const [tab, setTab] = useState<string>('giao-vu');
	const [visibleThongBao, setVisibleThongBao] = useState<boolean>(false);

	const renderTinTuc = () => <TinTucDashboard />;

	return (
		<Card
			variant='borderless'
			className='card-borderless'
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
					<Tabs.TabPane
						key='giao-vu'
						tab={
							<span style={{ fontSize: 18, fontWeight: 600 }}>
								{intl.formatMessage({ id: 'trangchu.hoctaprenluyen.tintuc.giaovu' })}
							</span>
						}
					/>
					<Tabs.TabPane
						key='tin-tuc'
						tab={
							<span style={{ fontSize: 18, fontWeight: 600 }}>
								{intl.formatMessage({ id: 'trangchu.hoctaprenluyen.tintuc.tintuc' })}
							</span>
						}
					/>
				</Tabs>
			}
			extra={
				<Link to='/tin-tuc' className='xem-tat-ca-link'>
					{intl.formatMessage({ id: 'trangchu.hoctaprenluyen.tintuc.xemtatca' })}
				</Link>
			}
		>
			{/* Chỉ PTIT */}
			{tab === 'giao-vu' ? <TinTucDashboardWP category={344} /> : tab === 'tin-tuc' && renderTinTuc()}
		</Card>
	);
};

export default TinTucDashboardWrapper;
