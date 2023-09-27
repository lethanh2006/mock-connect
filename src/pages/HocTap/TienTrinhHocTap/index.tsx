import { Card, Tabs } from 'antd';
import { useState } from 'react';
import TienTrinhChuongTrinhKhung from './ChuongTrinhKhung';
import TienTrinhThucTe from './TienTrinhThucTe';
import './components/style.less';

const TienTrinhHocTap = () => {
	const [activeTabKey, setActiveTabKey] = useState<string>('1');

	return (
		<Card title='Tiến trình học tập' className='card-tien-trinh'>
			<Tabs accessKey={activeTabKey} onChange={(tab) => setActiveTabKey(tab)} style={{ overflow: 'inherit' }}>
				<Tabs.TabPane tab='Chương trình đào tạo' key='1'>
					<TienTrinhChuongTrinhKhung />
				</Tabs.TabPane>

				<Tabs.TabPane tab='Tiến trình thực tế' key='2'>
					<TienTrinhThucTe />
				</Tabs.TabPane>
			</Tabs>
		</Card>
	);
};

export default TienTrinhHocTap;
