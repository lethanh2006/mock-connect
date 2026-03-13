import NoticeList from '@/components/RightContent/NoticeIcon/NoticeList';
import ViewThongBao from '@/pages/ThongBao/components/ViewThongBao';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Card, Modal, Tabs } from 'antd';
import { useState } from 'react';
import { Link, useIntl, useModel } from 'umi';
import TinTucDashboard from '../TinTucDashboard';

const TinTucDashboardWrapper = () => {
	const intl = useIntl();
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
						{intl.formatMessage({ id: 'tintuc.dashboard.action.viewMore' })} <ArrowRightOutlined />
					</Link>
				</div>

				<Modal
					width={800}
					styles={{ body: { padding: 0 } }}
					destroyOnClose
					onCancel={() => setVisibleThongBao(false)}
					open={visibleThongBao}
					okButtonProps={{ hidden: true }}
					cancelText={intl.formatMessage({ id: 'global.button.dong' })}
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
				<Tabs.TabPane
					key='thong-bao'
					tab={<span style={{ fontSize: 16 }}>{intl.formatMessage({ id: 'tintuc.dashboard.tabs.notification' })}</span>}
				/>
				<Tabs.TabPane
					key='tin-tuc'
					tab={<span style={{ fontSize: 16 }}>{intl.formatMessage({ id: 'tintuc.dashboard.tabs.news' })}</span>}
				/>
			</Tabs>

			{tab === 'tin-tuc' ? renderTinTuc() : renderThongBao()}
		</Card>
	);
};

export default TinTucDashboardWrapper;
