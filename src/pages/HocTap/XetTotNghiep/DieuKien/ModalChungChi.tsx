import { Card, Tabs, Modal } from 'antd';
import { useState } from 'react';
import TableChungChiDauRa from './TableChungChiDauRa';
import TableChungChiSinhVien from './TableChungChiSinhVien';
import { useModel } from 'umi';

const ModalChungChiCTDT = () => {
	const { visibleForm, setVisibleForm, recordChungChi } = useModel('sinhvien.tientrinhtotnghiep');
	const [activeTab, setActiveTab] = useState('1');

	return (
		<Modal
			width={800}
			bodyStyle={{ padding: 0 }}
			destroyOnClose
			visible={visibleForm}
			onCancel={() => setVisibleForm(false)}
			okButtonProps={{ hidden: true }}
			cancelText='Đóng'
			title={`Loại chứng chỉ ${recordChungChi?.loaiChungChi?.ten.toLocaleLowerCase()}`}
		>
			<Card bodyStyle={{ paddingTop: 0 }}>
				<Tabs hideAdd activeKey={activeTab} onChange={(tab) => setActiveTab(tab)}>
					<Tabs.TabPane tab='Chứng chỉ của tôi' key='1' />
					<Tabs.TabPane tab='Chuẩn đầu ra' key='2' />
				</Tabs>
				{activeTab === '1' ? <TableChungChiSinhVien /> : <TableChungChiDauRa />}
			</Card>
		</Modal>
	);
};

export default ModalChungChiCTDT;
