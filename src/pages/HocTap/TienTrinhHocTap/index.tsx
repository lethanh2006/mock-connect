import { TabViewPage } from '@/components/TabViewPage';
import SelectSongNganh from '@/pages/DaoTao/SongNganh/SelectSongNganh';
import { BookOutlined, CheckCircleOutlined, ScheduleOutlined } from '@ant-design/icons';
import { Alert, Card } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';
import LichSuQuyDoiDiemPage from '../QuyDoiDiem';
import TienTrinhChuongTrinhKhung from './ChuongTrinhKhung';
import TienTrinhThucTe from './TienTrinhThucTe';
import './components/style.less';

const TienTrinhHocTap = () => {
	const { getAllModel, record: recDotQuyDoi, setRecord } = useModel('daotao.quydoidiem.dotquydoidiem');
	const { maKhoaNganh, setMaKhoaNganh } = useModel('sinhvien.sinhvien');

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

			<TabViewPage
				hideCard
				menu={[
					{
						title: 'Tiến trình thực tế',
						menuKey: 'tien-trinh-thuc-te',
						content: <TienTrinhThucTe />,
						icon: <ScheduleOutlined />,
					},
					{
						title: 'Chương trình đào tạo',
						menuKey: 'chuong-trinh-dao-tao',
						content: <TienTrinhChuongTrinhKhung />,
						icon: <BookOutlined />,
					},
					{
						title: 'Công nhận KQHT',
						menuKey: 'cong-nhan-kqht',
						content: <LichSuQuyDoiDiemPage />,
						icon: <CheckCircleOutlined />,
					},
				]}
			/>
		</Card>
	);
};

export default TienTrinhHocTap;
