import { EOperatorType } from '@/components/Table/constant';
import { ETrangThaiDotQuyDoiDiem } from '@/services/HocTap/constant';
import { Alert, Card, Tabs } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import LichSuQuyDoiDiemPage from '../KetQuaHocTap/components/LichSuQuyDoiDiem';
import TienTrinhChuongTrinhKhung from './ChuongTrinhKhung';
import TienTrinhThucTe from './TienTrinhThucTe';
import './components/style.less';

const TienTrinhHocTap = () => {
	const [activeTabKey, setActiveTabKey] = useState<string>('2');
	const { getModel, danhSach } = useModel('daotao.quydoidiem.dotquydoidiem');
	const { getThongTinCuaToiModel, getKhoaNganhMeModel } = useModel('sinhvien.sinhvien');

	useEffect(() => {
		getModel({ trangThai: ETrangThaiDotQuyDoiDiem.DA_BAN_HANH }, [
			{
				active: true,
				field: 'thoiGianBatDau',
				operator: EOperatorType.LESS_EQUAL,
				values: [moment().toISOString()],
			},
			{
				active: true,
				field: 'thoiGianKetThuc',
				operator: EOperatorType.GREAT_EQUAL,
				values: [moment().toISOString()],
			},
		]);
		getThongTinCuaToiModel();
		getKhoaNganhMeModel();
	}, []);

	return (
		<Card title='Tiến trình học tập' className='card-tien-trinh'>
			{danhSach.length > 0 ? (
				<Alert
					style={{ marginBottom: 12 }}
					type='info'
					description={
						<>
							Đợt công nhận kết quả học tập <b>{danhSach[0].tenDot}</b> đang diễn ra từ{' '}
							<b>{moment(danhSach[0].thoiGianBatDau).format('DD/MM/YYYY')}</b> đến{' '}
							<b>{moment(danhSach[0].thoiGianKetThuc).format('DD/MM/YYYY')}</b>. Bạn có thể đăng ký quy đổi điểm các học
							phần trong chương trình đào tạo
						</>
					}
				/>
			) : null}

			<Tabs accessKey={activeTabKey} onChange={(tab) => setActiveTabKey(tab)} style={{ overflow: 'inherit' }}>
				<Tabs.TabPane tab='Tiến trình thực tế' key='2'>
					<TienTrinhThucTe />
				</Tabs.TabPane>

				<Tabs.TabPane tab='Chương trình đào tạo' key='1'>
					<TienTrinhChuongTrinhKhung />
				</Tabs.TabPane>

				<Tabs.TabPane tab='Lịch sử công nhận KQHT' key='3'>
					<LichSuQuyDoiDiemPage />
				</Tabs.TabPane>
			</Tabs>
		</Card>
	);
};

export default TienTrinhHocTap;
