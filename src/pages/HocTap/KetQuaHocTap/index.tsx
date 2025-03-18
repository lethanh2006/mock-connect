import { TabViewPage } from '@/components/TabViewPage';
import SelectSongNganh from '@/pages/DaoTao/SongNganh/SelectSongNganh';
import { PicCenterOutlined, SnippetsOutlined } from '@ant-design/icons';
import { Card, Space } from 'antd';
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

			<div style={{ marginTop: 8 }}>
				<TabViewPage
					hideCard
					destroyInactiveTab={false}
					menu={[
						{
							title: 'Điểm tổng kết',
							menuKey: 'diem',
							content: <DiemThanhPhanSV maKhoaNganh={maKhoaNganh} />,
							icon: <PicCenterOutlined />,
						},
						{
							title: 'Máy tính thông minh',
							menuKey: 'may-tinh',
							content: <MayTinhThongMinh maKhoaNganh={maKhoaNganh} />,
							icon: <SnippetsOutlined />,
						},
					]}
				/>
			</div>
		</Card>
	);
};

export default KetQuaHocTap;
