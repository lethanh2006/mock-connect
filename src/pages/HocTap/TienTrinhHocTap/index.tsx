import { Alert, Card, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import TienTrinhChuongTrinhKhung from './ChuongTrinhKhung';
import TienTrinhThucTe from './TienTrinhThucTe';
import './components/style.less';
import { useModel } from 'umi';
import { ETrangThaiDotQuyDoiDiem } from '@/services/HocTap/constant';
import { EOperatorType } from '@/components/Table/constant';
import moment from 'moment';

const TienTrinhHocTap = () => {
	const [activeTabKey, setActiveTabKey] = useState<string>('2');
	const { getModel, danhSach } = useModel('daotao.quydoidiem.dotquydoidiem');

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
	}, []);

	return (
		<Card title='Tiến trình học tập' className='card-tien-trinh'>
			{danhSach.length > 0 ? (
				<Alert
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

				<Tabs.TabPane tab='Lịch sử xin công nhận KQHT' key='3'>
					{/* <TienTrinhChuongTrinhKhung /> */}
					<></>
				</Tabs.TabPane>
			</Tabs>
		</Card>
	);
};

export default TienTrinhHocTap;
