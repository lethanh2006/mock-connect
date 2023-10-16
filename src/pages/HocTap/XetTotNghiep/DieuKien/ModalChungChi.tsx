import { Card, Tabs } from 'antd';
import { useState } from 'react';
import TableChungChiDauRa from './TableChungChiDauRa';
import TableChungChiSinhVien from './TableChungChiSinhVien';

const ModalChungChiCTDT = () => {
	const [activeTab, setActiveTab] = useState('1');

	return (
		<Card bodyStyle={{ paddingTop: 0 }}>
			<Tabs hideAdd activeKey={activeTab} onChange={(tab) => setActiveTab(tab)}>
				<Tabs.TabPane tab='Chứng chỉ của tôi' key='1' />
				<Tabs.TabPane tab='Chuẩn đầu ra' key='2' />
			</Tabs>
			{activeTab === '1' ? <TableChungChiSinhVien /> : <TableChungChiDauRa />}
		</Card>
	);
};

export default ModalChungChiCTDT;
