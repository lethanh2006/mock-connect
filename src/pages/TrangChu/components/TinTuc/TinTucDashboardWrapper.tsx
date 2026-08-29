import PageCard from '@/components/PageCard';
import { Tabs } from 'antd';
import { Link, useIntl } from 'umi';
import TinTucDashboard from './TinTucDashboard';

const TinTucDashboardWrapper = () => {
	const intl = useIntl();

	return (
		<PageCard
			level={2}
			hideInnerCard
			title={
				<Tabs
					accessKey='tab'
					tabBarStyle={{
						border: 'none',
						marginBottom: 0, // Giảm khoảng cách dưới của tab bar
						paddingBottom: '4px', // Giảm padding để gạch chân sát hơn
					}}
				>
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
			<TinTucDashboard />
		</PageCard>
	);
};

export default TinTucDashboardWrapper;
