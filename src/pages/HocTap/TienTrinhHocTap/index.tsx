import { TabViewPage } from '@/components/TabViewPage';
import SelectSongNganh from '@/pages/DaoTao/SongNganh/SelectSongNganh';
import { BookOutlined, CheckCircleOutlined, ScheduleOutlined } from '@ant-design/icons';
import { Alert, Card, Col, Row, Spin } from 'antd';
import moment from 'moment';
import { useEffect } from 'react';
import { useModel } from 'umi';
import LichSuQuyDoiDiemPage from '../QuyDoiDiem';
import TienTrinhChuongTrinhKhung from './ChuongTrinhKhung';
import TienTrinhThucTe from './TienTrinhThucTe';
import flag from './components/flag.svg';
import './components/style.less';

const TienTrinhHocTap = () => {
	const { getAllModel, record: recDotQuyDoi, setRecord } = useModel('daotao.quydoidiem.dotquydoidiem');
	const { maKhoaNganh, setMaKhoaNganh } = useModel('sinhvien.sinhvien');
	const { record: recTienTrinh, getTienTrinhTotNghiepModel, loading } = useModel('sinhvien.tientrinhtotnghiep');

	useEffect(() => {
		//Get đợt me
		getAllModel(undefined, undefined, undefined, undefined, 'current', false).then((res) => setRecord(res as any));
	}, []);

	useEffect(() => {
		//Get tiến trình
		if (!recTienTrinh && maKhoaNganh) getTienTrinhTotNghiepModel(maKhoaNganh);
	}, [maKhoaNganh]);

	return (
		<Card
			title='Tiến trình học tập'
			className='card-tien-trinh'
			extra={<SelectSongNganh style={{ width: 250 }} value={maKhoaNganh} onChange={(val) => setMaKhoaNganh(val)} />}
		>
			<Spin spinning={loading}>
				<div>Số tín chỉ đã tích lũy/Tổng số tín chỉ toàn khóa</div>

				<Row align='middle' gutter={[12, 12]}>
					<Col span={20} md={22}>
						<div className='progress-wrapper'>
							<div
								className='proress-bar'
								style={{
									width: `${
										(Number(recTienTrinh?.kqhtHocKy?.tongSoTinChiTichLuyToanKhoa) * 100) /
										Number(recTienTrinh?.ctdtKeHoach?.tongSoTinChi)
									}%`,
								}}
							>
								<div className='progress-dot' />
								<div className='progress-label'>{recTienTrinh?.kqhtHocKy?.tongSoTinChiTichLuyToanKhoa ?? '--'} tín</div>
							</div>
							<div className='progress-img'>
								<img src={flag} style={{ width: 30, height: 30 }} />
							</div>
						</div>
					</Col>
					<Col span={4} md={2} style={{ marginTop: 8 }}>
						<b style={{ color: '#B31820' }}>{recTienTrinh?.ctdtKeHoach?.tongSoTinChi ?? '--'} tín chỉ</b>
					</Col>
				</Row>
			</Spin>

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
