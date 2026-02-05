import { TabViewPage } from '@/components/TabViewPage';
import SelectSongNganh from '@/pages/DaoTao/SongNganh/SelectSongNganh';
import { formatDate } from '@/utils/formatDate';
import { BookOutlined, CheckCircleOutlined, ScheduleOutlined } from '@ant-design/icons';
import { Alert, Card, Col, Row, Spin } from 'antd';
import { useEffect } from 'react';
import { useIntl, useModel } from 'umi';
import LichSuQuyDoiDiemPage from '../QuyDoiDiem';
import TienTrinhChuongTrinhKhung from './ChuongTrinhKhung';
import flag from './components/flag.svg';
import './components/style.less';
import TienTrinhThucTe from './TienTrinhThucTe';

const TienTrinhHocTap = () => {
	const intl = useIntl();
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
			variant='borderless'
			title={intl.formatMessage({ id: 'tientrinhhoctap.title' })}
			className='card-tien-trinh card-big-title card-borderless'
			extra={<SelectSongNganh style={{ width: 250 }} value={maKhoaNganh} onChange={(val) => setMaKhoaNganh(val)} />}
		>
			<Card variant='borderless'>
				<Spin spinning={loading}>
					<div>{intl.formatMessage({ id: 'tientrinhhoctap.scttichluy' })}</div>

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
									<div className='progress-label'>
										{recTienTrinh?.kqhtHocKy?.tongSoTinChiTichLuyToanKhoa ?? '--'}{' '}
										{intl.formatMessage({ id: 'tientrinhhoctap.tin' })} /
									</div>
								</div>
								<div className='progress-img'>
									<img src={flag} style={{ width: 30, height: 30 }} />
								</div>
							</div>
						</Col>
						<Col span={4} md={2} style={{ marginTop: 8 }}>
							<b style={{ color: '#B31820' }}>
								{recTienTrinh?.ctdtKeHoach?.tongSoTinChi ?? '--'} {intl.formatMessage({ id: 'tientrinhhoctap.tinchi' })}
							</b>
						</Col>
					</Row>
				</Spin>

				{recDotQuyDoi?._id ? (
					<Alert
						style={{ marginBottom: 12 }}
						type='info'
						message={intl.formatMessage(
							{ id: 'tientrinhhoctap.message' },
							{
								tenDot: recDotQuyDoi?.tenDot,
								tuNgay: formatDate(recDotQuyDoi?.thoiGianBatDau),
								denNgay: formatDate(recDotQuyDoi?.thoiGianKetThuc),
								b: (chunks) => <b>{chunks}</b>,
							},
						)}
					/>
				) : null}

				<TabViewPage
					hideCard
					menu={[
						{
							title: intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte' }),
							menuKey: 'tien-trinh-thuc-te',
							content: <TienTrinhThucTe />,
							icon: <ScheduleOutlined />,
						},
						{
							title: intl.formatMessage({ id: 'tientrinhhoctap.ctdt' }),
							menuKey: 'chuong-trinh-dao-tao',
							content: <TienTrinhChuongTrinhKhung />,
							icon: <BookOutlined />,
						},
						{
							title: intl.formatMessage({ id: 'tientrinhhoctap.congnhan' }),
							menuKey: 'cong-nhan-kqht',
							content: <LichSuQuyDoiDiemPage />,
							icon: <CheckCircleOutlined />,
						},
					]}
				/>
			</Card>
		</Card>
	);
};

export default TienTrinhHocTap;
