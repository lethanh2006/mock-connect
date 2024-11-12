import { Tabs } from 'antd';
import { useState } from 'react';
import GiangVienDeCuongPage from '../GiangVienDeCuong';
import HocLieuDeCuongPage from '../HocLieuDeCuong';
import NoiDungHocPhanPage from '../LichTrinhChung';
import LichTrinhCuTheList from '../LichTrinhCuThe';
import ThongTinChungPage from './ThongTinChung';

const TabsDeCuongHocPhan = () => {
	const [activeKey, setActiveKey] = useState<string>('0');

	return (
		<>
			<Tabs activeKey={activeKey} onChange={(tab) => setActiveKey(tab)}>
				<Tabs.TabPane key='0' tab='Thông tin chung' />
				<Tabs.TabPane key='4' tab='Tóm tắt học phần' />
				{/* <Tabs.TabPane key='2' tab='Lịch trình cụ thể' /> */}
				<Tabs.TabPane key='1' tab='Giảng viên' />
				<Tabs.TabPane key='3' tab='Học liệu' />
			</Tabs>

			{activeKey === '0' ? (
				<ThongTinChungPage />
			) : activeKey === '1' ? (
				<GiangVienDeCuongPage />
			) : activeKey === '2' ? (
				<LichTrinhCuTheList />
			) : activeKey === '3' ? (
				<HocLieuDeCuongPage />
			) : activeKey === '4' ? (
				<NoiDungHocPhanPage />
			) : null}
		</>
	);
};

export default TabsDeCuongHocPhan;
