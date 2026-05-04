import { TabViewPage } from '@/components/TabViewPage';
import SelectSongNganh from '@/pages/DaoTao/SongNganh/SelectSongNganh';
import PathWayPage from '@/pages/SinhVien/PathWay';
import { LoaiChuongTrinhDaoTao } from '@/services/DaoTao/constant';
import { formatDate } from '@/utils/formatDate';
import { BookOutlined, CheckCircleOutlined, NodeIndexOutlined, ScheduleOutlined } from '@ant-design/icons';
import { Alert, Card, Col, Descriptions, Row, Spin } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useAccess, useIntl, useModel } from 'umi';
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
	const { getByIdModel, record: recLoTrinh } = useModel('sinhvien.lotrinhhoctap');
	const {
		chuongTrinhHienTai,
		loading: loadingChuongTrinh,
		getChuongTrinhHienTaiModel,
	} = useModel('daotao.chuongtrinhdaotao');
	const access = useAccess();

	const ngoaiThoiGian =
		recLoTrinh?.dotDangKyPathway?.kichHoat === false ||
		!recLoTrinh?.dotDangKyPathway?.thoiGianBatDau ||
		!recLoTrinh?.dotDangKyPathway?.thoiGianKetThuc ||
		dayjs().isBefore(recLoTrinh?.dotDangKyPathway?.thoiGianBatDau) ||
		dayjs().isAfter(recLoTrinh?.dotDangKyPathway?.thoiGianKetThuc);

	useEffect(() => {
		//Get đợt me
		getAllModel(undefined, undefined, undefined, undefined, 'current', false).then((res) => setRecord(res as any));
	}, []);

	useEffect(() => {
		//Get tiến trình
		if (!recTienTrinh && maKhoaNganh) getTienTrinhTotNghiepModel(maKhoaNganh);
		//Get đợt lộ trình học tập
		if (maKhoaNganh) {
			getByIdModel(`me?maKhoaNganh=${maKhoaNganh}`, true);
			getChuongTrinhHienTaiModel(maKhoaNganh);
		}
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
										{intl.formatMessage({ id: 'tientrinhhoctap.tin' })}
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

				{!ngoaiThoiGian && (
					<Alert
						style={{ marginBottom: 12 }}
						type='warning'
						message={intl.formatMessage(
							{ id: 'lotrinhhoctap.message' },
							{
								tenDot: recLoTrinh?.dotDangKyPathway?.ten,
								tuNgay: formatDate(recLoTrinh?.dotDangKyPathway?.thoiGianBatDau),
								denNgay: formatDate(recLoTrinh?.dotDangKyPathway?.thoiGianKetThuc),
								b: (chunks) => <b>{chunks}</b>,
							},
						)}
					/>
				)}

				<Spin spinning={loadingChuongTrinh}>
					<Descriptions
						column={{ xxl: 3, xl: 3, lg: 3, md: 3, sm: 3, xs: 1 }}
						layout='vertical'
						className='highlight'
						colon={false}
						style={{ marginBottom: 12 }}
					>
						<Descriptions.Item label={intl.formatMessage({ id: 'pathway.info.programType' })}>
							{chuongTrinhHienTai?.loai ? LoaiChuongTrinhDaoTao[chuongTrinhHienTai.loai] : chuongTrinhHienTai?.loai}
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'pathway.info.currentProgram' })}>
							{chuongTrinhHienTai?.nganh?.ten || chuongTrinhHienTai?.ten || '-'}
						</Descriptions.Item>
					</Descriptions>
				</Spin>

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
							title: intl.formatMessage({ id: 'lotrinhhoctap.title' }),
							menuKey: 'lo-trinh-hoc-tap',
							content: <PathWayPage getData={() => getByIdModel(`me?maKhoaNganh=${maKhoaNganh}`, true)} />,
							icon: <NodeIndexOutlined />,
							hide: !access.cctFilter(),
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
