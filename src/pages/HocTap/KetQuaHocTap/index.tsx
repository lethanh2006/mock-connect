import SelectSongNganh from '@/pages/DaoTao/SongNganh/SelectSongNganh';
import { Card, Space, Tabs } from 'antd';
import { useModel } from 'umi';
import KetQuaToanKhoaSinhVien from './KetQuaToanKhoa';
import DiemThanhPhanSV from './components/DiemThanhPhanSV';
import MayTinhThongMinh from './components/MayTinhThongMinh';

const KetQuaHocTap = () => {
	const { maKhoaNganh, setMaKhoaNganh } = useModel('sinhvien.sinhvien');

	return (
		<Card
			title={
				<Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
					<span>Kết quả học tập</span>
					<SelectSongNganh style={{ width: 250 }} value={maKhoaNganh} onChange={(val) => setMaKhoaNganh(val)} />
				</Space>
			}
		>
			<KetQuaToanKhoaSinhVien maKhoaNganh={maKhoaNganh} loadData={false} />

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
