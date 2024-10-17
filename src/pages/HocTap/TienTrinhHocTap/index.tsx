import SelectSongNganh from '@/pages/DaoTao/SongNganh/SelectSongNganh';
import { Alert, Card, Tabs } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import LichSuQuyDoiDiemPage from '../QuyDoiDiem';
import TienTrinhChuongTrinhKhung from './ChuongTrinhKhung';
import TienTrinhThucTe from './TienTrinhThucTe';
import './components/style.less';

const TienTrinhHocTap = () => {
	const { getAllModel, record: recDotQuyDoi, setRecord } = useModel('daotao.quydoidiem.dotquydoidiem');
	const { maKhoaNganh, setMaKhoaNganh } = useModel('sinhvien.sinhvien');
	const [activeTabKey, setActiveTabKey] = useState<string>('2');

	useEffect(() => {
		//Get đợt me
		getAllModel(undefined, undefined, undefined, undefined, 'current', false).then((res) => setRecord(res as any));
	}, []);

	return (
		<Card
			title='Tiến trình học tập'
			className='card-tien-trinh'
			extra={<SelectSongNganh style={{ width: 250 }} value={maKhoaNganh} onChange={(val) => setMaKhoaNganh(val)} />}
		>
			{recDotQuyDoi?._id ? (
				<Alert
					style={{ marginBottom: 12 }}
					type='info'
					message={
						<>
							Đợt công nhận kết quả học tập <b>{recDotQuyDoi?.tenDot}</b> đang diễn ra từ{' '}
							<b>{moment(recDotQuyDoi?.thoiGianBatDau).format('DD/MM/YYYY')}</b> đến{' '}
							<b>{moment(recDotQuyDoi?.thoiGianKetThuc).format('DD/MM/YYYY')}</b>. Bạn có thể đăng ký quy đổi điểm các
							học phần trong chương trình đào tạo
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

				<Tabs.TabPane tab='Công nhận KQHT' key='3'>
					<LichSuQuyDoiDiemPage />
				</Tabs.TabPane>
			</Tabs>
		</Card>
	);
};

export default TienTrinhHocTap;
