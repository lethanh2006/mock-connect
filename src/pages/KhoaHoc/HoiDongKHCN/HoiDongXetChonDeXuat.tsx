import { ETrangThaiXetDuyetDangKy } from '@/services/KhoaHoc/DeTaiKHCN/constants';
import { ELoaiHoiDongKHCN } from '@/services/KhoaHoc/HoiDongKHCN/constants';
import { Card, Tabs } from 'antd';
import { useModel } from 'umi';
import HoiDongKHCNPage from '.';
import TableDeTaiHoiDong from './components/DeTaiHoiDong';
import { useMemo } from 'react';
import type { DeTaiKHCN } from '@/services/KhoaHoc/DeTaiKHCN/typings';

const HoiDongXetChonDeXuat = () => {
	const { danhSach: danhSachHoiDong } = useModel('khoahoc.hoidongkhcn');

	const listDeTaiInAllHoiDong = useMemo(() => {
		const result: DeTaiKHCN.IRecord[] = [];
		danhSachHoiDong.map((hoiDong) => {
			hoiDong.danhSachDeTai.map((deTai) => {
				result.push({ ...deTai, tenHoiDong: hoiDong.ten });
			});
		});
		return result;
	}, [danhSachHoiDong.map((item) => item._id)]);

	return (
		<Card bodyStyle={{ paddingTop: 4 }} title='Lập hội đồng xét chọn đề xuất đề tài NCKH'>
			<Tabs>
				<Tabs.TabPane key={'Danh sách hội đồng'} tab='Danh sách hội đồng' tabKey='Danh sách hội đồng'>
					<HoiDongKHCNPage
						hideCard
						conditionDeTaiNgoaiHoiDong={{ trangThaiXetDuyetDangKy: ETrangThaiXetDuyetDangKy.CHUA_DUYET }}
						loaiHoiDongKhcn={ELoaiHoiDongKHCN.XET_DUYET}
						// title='Hội đồng xét chọn đề xuất đề tài NCKH'
					/>
				</Tabs.TabPane>
				<Tabs.TabPane key={'Danh sách đề tài'} tab='Danh sách đề tài' tabKey='Danh sách đề tài'>
					<TableDeTaiHoiDong showTenHoiDong mode='view' data={listDeTaiInAllHoiDong} />
				</Tabs.TabPane>
			</Tabs>
		</Card>
	);
};

export default HoiDongXetChonDeXuat;
