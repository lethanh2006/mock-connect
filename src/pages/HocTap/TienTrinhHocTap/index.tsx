import { TabViewPage } from '@/components/TabViewPage';
import ChuongTrinhDaoTaoModalView from '@/pages/DaoTao/ChuongTrinhDaoTao/View';
import SelectSongNganh from '@/pages/DaoTao/SongNganh/SelectSongNganh';
import PathWayPage from '@/pages/SinhVien/PathWay';
import { getManyKhoiLuaChonKhoaNganh, getPathwayChoice } from '@/services/DaoTao/ChuongTrinhDaoTao';
import { LoaiChuongTrinhDaoTao } from '@/services/DaoTao/constant';
import { formatDate } from '@/utils/formatDate';
import { BookOutlined, CheckCircleOutlined, NodeIndexOutlined, ScheduleOutlined } from '@ant-design/icons';
import { Alert, Card, Col, Descriptions, Divider, Row, Spin, Tooltip, Typography } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Link, useAccess, useIntl, useModel } from 'umi';
import LichSuQuyDoiDiemPage from '../QuyDoiDiem';
import TienTrinhChuongTrinhKhung from './ChuongTrinhKhung';
import flag from './components/flag.svg';
import './components/style.less';
import TienTrinhThucTe from './TienTrinhThucTe';
import PageCard from '@/components/PageCard';

const TienTrinhHocTap = () => {
	const intl = useIntl();
	const { getAllModel, record: recDotQuyDoi, setRecord } = useModel('daotao.quydoidiem.dotquydoidiem');
	const { maKhoaNganh, setMaKhoaNganh, record: recSinhVien, khoaNganhMe } = useModel('sinhvien.sinhvien');
	const { record: recTienTrinh, getTienTrinhTotNghiepModel, loading } = useModel('sinhvien.tientrinhtotnghiep');
	const { getByIdModel, record: recLoTrinh } = useModel('sinhvien.lotrinhhoctap');
	const {
		chuongTrinhHienTai,
		loading: loadingChuongTrinh,
		getChuongTrinhHienTaiModel,
		setRecord: setChuongTrinh,
	} = useModel('daotao.chuongtrinhdaotao');
	const [visibleChuongTrinh, setVisibleChuongTrinh] = useState(false);
	const [chosenPathways, setChosenPathways] = useState<string[]>([]);
	const [loadingPathway, setLoadingPathway] = useState(false);
	const [currentHash, setCurrentHash] = useState(window.location.hash.replace('#', ''));
	const access = useAccess();

	useEffect(() => {
		const handleHashChange = () => {
			setCurrentHash(window.location.hash.replace('#', ''));
		};
		window.addEventListener('hashchange', handleHashChange);
		return () => window.removeEventListener('hashchange', handleHashChange);
	}, []);

	const isSongNganh = maKhoaNganh === khoaNganhMe?.khoaNganhPhu?.ma;
	const chuyenNganhHienTai = isSongNganh ? recSinhVien?.chuyenNganh2 : recSinhVien?.chuyenNganh;

	const ngoaiThoiGian =
		recLoTrinh?.dotDangKyPathway?.kichHoat === false ||
		!recLoTrinh?.dotDangKyPathway?.thoiGianBatDau ||
		!recLoTrinh?.dotDangKyPathway?.thoiGianKetThuc ||
		dayjs().isBefore(recLoTrinh?.dotDangKyPathway?.thoiGianBatDau) ||
		dayjs().isAfter(recLoTrinh?.dotDangKyPathway?.thoiGianKetThuc);

	const fetchChosenPathways = async () => {
		if (!maKhoaNganh) return;
		setLoadingPathway(true);
		try {
			const resKhoi = await getManyKhoiLuaChonKhoaNganh(maKhoaNganh);
			const khoiList = resKhoi?.data?.data || [];
			if (khoiList.length > 0) {
				const choiceResponses = await Promise.all(
					khoiList.map((khoi: any) => getPathwayChoice(maKhoaNganh, khoi.ma))
				);
				const names = choiceResponses
					.map((res: any) => res?.data?.data?.khoiKienThuc?.ten)
					.filter(Boolean);
				setChosenPathways(names);
			} else {
				setChosenPathways([]);
			}
		} catch (error) {
			setChosenPathways([]);
		} finally {
			setLoadingPathway(false);
		}
	};

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
			fetchChosenPathways();
		}
	}, [maKhoaNganh]);

	useEffect(() => {
		if (maKhoaNganh && recLoTrinh?._id) {
			fetchChosenPathways();
		}
	}, [recLoTrinh?._id]);

	return (
		<PageCard
			title={intl.formatMessage({ id: 'tientrinhhoctap.title' })}
			extra={<SelectSongNganh style={{ width: 250 }} value={maKhoaNganh} onChange={(val) => setMaKhoaNganh(val)} />}
		>
			<Card variant='borderless'>
				<Spin spinning={loadingChuongTrinh || loading}>
					<Descriptions
						column={{ xxl: 3, xl: 3, lg: 3, md: 3, sm: 3, xs: 1 }}
						layout='vertical'
						className='highlight'
						colon={false}
						style={{ marginBottom: 16 }}
					>
						<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.ctdt.chuongtrinh' })}>
							<Link
								to='#'
								onClick={(e) => {
									e.preventDefault();
									setVisibleChuongTrinh(true);
								}}
							>
								{recTienTrinh?.ctdtKeHoach?.ten || '-'}
							</Link>
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.ctdt.loai' })}>
							{chuongTrinhHienTai?.loai ? LoaiChuongTrinhDaoTao[chuongTrinhHienTai.loai] : chuongTrinhHienTai?.loai || '-'}
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'pathway.info.currentProgram' })}>
							{chuongTrinhHienTai?.nganh?.ten || chuongTrinhHienTai?.ten || '-'}
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.ctdt.chuyennganh' })}>
							{(chuyenNganhHienTai as any)?.ten || (
								<i>{intl.formatMessage({ id: 'tientrinhhoctap.ctdt.dangcapnhat' })}</i>
							)}
						</Descriptions.Item>
						{access.cctFilter() && khoaNganhMe?.khoaNganhPhu && (
							<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.ctdt.chuyennganhphu' })}>
								{khoaNganhMe.khoaNganhPhu.ten || (
									<i>{intl.formatMessage({ id: 'tientrinhhoctap.ctdt.dangcapnhat' })}</i>
								)}
							</Descriptions.Item>
						)}
						{access.cctFilter() && (
							<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.ctdt.pathway' })}>
								<Spin spinning={loadingPathway} size='small'>
									{chosenPathways.length > 0 ? (
										<Tooltip title={chosenPathways.join(', ')}>
											<div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
												<Typography.Paragraph
													style={{ maxWidth: '100%', marginBottom: 0, flex: 1 }}
													ellipsis={{ rows: 2, tooltip: false }}
												>
													{chosenPathways.join(', ')}
												</Typography.Paragraph>
												{currentHash !== 'lo-trinh-hoc-tap' && (
													<a
														href='#lo-trinh-hoc-tap'
														style={{ fontSize: 12, whiteSpace: 'nowrap' }}
														onClick={() => {
															window.location.hash = 'lo-trinh-hoc-tap';
														}}
													>
														{intl.formatMessage({ id: 'pathway.button.viewMore' })}
													</a>
												)}
											</div>
										</Tooltip>
									) : (
										<i>{intl.formatMessage({ id: 'tientrinhhoctap.ctdt.dangcapnhat' })}</i>
									)}
								</Spin>
							</Descriptions.Item>
						)}
					</Descriptions>
				</Spin>

				<Spin spinning={loading}>
					<Divider dashed orientation='left'>
						{intl.formatMessage({ id: 'tientrinhhoctap.scttichluy' })}
					</Divider>

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
			<ChuongTrinhDaoTaoModalView visible={visibleChuongTrinh} setVisible={setVisibleChuongTrinh} />
		</PageCard>
	);
};

export default TienTrinhHocTap;
