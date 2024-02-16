import { Card, Tabs } from 'antd';
import KetQuaToanKhoaSinhVien from './KetQuaToanKhoa';
import DiemThanhPhanSV from './components/DiemThanhPhanSV';
import MayTinhThongMinh from './components/MayTinhThongMinh';

const KetQuaHocTap = () => {
	return (
		<Card title='Kết quả học tập'>
			<KetQuaToanKhoaSinhVien />

			<Tabs style={{ marginTop: 8 }}>
				<Tabs.TabPane tab='Điểm tổng kết' key='1'>
					<DiemThanhPhanSV />
				</Tabs.TabPane>

				<Tabs.TabPane tab='Máy tính thông minh' key='2'>
					<MayTinhThongMinh />
				</Tabs.TabPane>
			</Tabs>
		</Card>
	);
};

export default KetQuaHocTap;
