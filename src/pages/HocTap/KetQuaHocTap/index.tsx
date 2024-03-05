import SelectSongNganh from '@/pages/DaoTao/SongNganh/SelectSongNganh';
import { Card, Tabs } from 'antd';
import { useState } from 'react';
import KetQuaToanKhoaSinhVien from './KetQuaToanKhoa';
import DiemThanhPhanSV from './components/DiemThanhPhanSV';
import MayTinhThongMinh from './components/MayTinhThongMinh';

const KetQuaHocTap = () => {
	const [maKhoaNganh, setMaKhoaNganh] = useState<string>();

	return (
		<Card
			title='Kết quả học tập'
			extra={<SelectSongNganh style={{ width: 250 }} value={maKhoaNganh} onChange={(val) => setMaKhoaNganh(val)} />}
		>
			<KetQuaToanKhoaSinhVien maKhoaNganh={maKhoaNganh} />

			<Tabs style={{ marginTop: 8 }}>
				<Tabs.TabPane tab='Điểm tổng kết' key='1'>
					<DiemThanhPhanSV maKhoaNganh={maKhoaNganh} />
				</Tabs.TabPane>

				<Tabs.TabPane tab='Máy tính thông minh' key='2'>
					<MayTinhThongMinh maKhoaNganh={maKhoaNganh} />
				</Tabs.TabPane>
			</Tabs>
		</Card>
	);
};

export default KetQuaHocTap;
