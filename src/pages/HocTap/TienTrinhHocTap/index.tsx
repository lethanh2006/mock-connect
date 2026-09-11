import PageCard from '@/components/PageCard';
import { TabViewPage } from '@/components/TabViewPage';
import ChuongTrinhDaoTaoModalView from '@/pages/DaoTao/ChuongTrinhDaoTao/View';
import SelectSongNganh from '@/pages/DaoTao/SongNganh/SelectSongNganh';
import { formatDate } from '@/utils/formatDate';
import { getLocalizedName } from '@/utils/localeName';
import { getPublicAssetPath } from '@/utils/path';
import { BookOutlined, ScheduleOutlined } from '@ant-design/icons';
import { IconBookOpen, IconCalendar } from '@/components/Icons';
import { Alert, Col, Descriptions, Divider, Row, Spin } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { getLocale, useAccess, useIntl, useModel } from 'umi';
import TienTrinhChuongTrinhKhung from './ChuongTrinhKhung';
import './components/style.less';
import TienTrinhThucTe from './TienTrinhThucTe';
import { tinhThongKeMinor } from './utils';

const TienTrinhHocTap = () => {
	const intl = useIntl();
	const locale = getLocale();
	const { getAllModel, record: recDotQuyDoi, setRecord } = useModel('daotao.quydoidiem.dotquydoidiem');
	const { maKhoaNganh, setMaKhoaNganh, record: recSinhVien, khoaNganhMe } = useModel('sinhvien.sinhvien');
	const { record: recTienTrinh, getTienTrinhTotNghiepModel, loading } = useModel('sinhvien.tientrinhtotnghiep');
	const {
		chuongTrinhHienTai,
		tienTrinhKhungMinors,
		loading: loadingChuongTrinh,
		getChuongTrinhHienTaiModel,
		sinhVienGetTienTrinhKhungModel,
	} = useModel('daotao.chuongtrinhdaotao');
	const [visibleChuongTrinh, setVisibleChuongTrinh] = useState(false);
	const access = useAccess();
	const isSongNganh = maKhoaNganh === khoaNganhMe?.khoaNganhPhu?.ma;
	const chuyenNganhHienTai = isSongNganh ? recSinhVien?.chuyenNganh2 : recSinhVien?.chuyenNganh;
	const tenChuyenNganhPhu = tienTrinhKhungMinors?.[0]?.nganhMinor?.tenTiengViet;
	const thongKeMinor = useMemo(() => tinhThongKeMinor(tienTrinhKhungMinors), [tienTrinhKhungMinors]);
	const tongTinChiCtdtDaDat = recTienTrinh?.kqhtHocKy?.tongSoTinChiTichLuyToanKhoa;
	const tongTinChiCtdt = recTienTrinh?.ctdtKeHoach?.tongSoTinChi;
	const tongTinChiDaDat = (tongTinChiCtdtDaDat ?? 0) + thongKeMinor.daDat;
	const tongTinChiTatCa = (tongTinChiCtdt ?? 0) + thongKeMinor.tong;
	const phanTramTinChi = tongTinChiTatCa ? Math.min(100, (tongTinChiDaDat * 100) / tongTinChiTatCa) : 0;
	const tenNganhHienThi =
		locale === 'vi-VN'
			? recTienTrinh?.ctdtKeHoach?.ten
			: (recTienTrinh?.ctdtKeHoach?.tenTiengAnh ?? recTienTrinh?.ctdtKeHoach?.ma);

	useEffect(() => {
		//Get đợt me
		getAllModel(undefined, undefined, undefined, undefined, 'current', false).then((res) => setRecord(res as any));
	}, []);

	useEffect(() => {
		//Get tiến trình
		if (!recTienTrinh && maKhoaNganh) getTienTrinhTotNghiepModel(maKhoaNganh);
		//Get đợt lộ trình học tập
		if (maKhoaNganh) {
			getChuongTrinhHienTaiModel(maKhoaNganh);
			// sinhVienGetTienTrinhKhungModel(isSongNganh);
		}
	}, [maKhoaNganh]);

	return (
		<PageCard
			title={intl.formatMessage({ id: 'menu.HocTap.DegreeAudit' })}
			extra={<SelectSongNganh style={{ width: 250 }} value={maKhoaNganh} onChange={(val) => setMaKhoaNganh(val)} />}
		>
			<Spin spinning={loadingChuongTrinh || loading}>
				<Descriptions
					column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
					layout='vertical'
					className='highlight'
					colon={false}
					style={{ marginBottom: 16 }}
				>
					<Descriptions.Item label={intl.formatMessage({ id: 'thongtincanhan.hoso.trainingProgram' })}>
						<a onClick={() => setVisibleChuongTrinh(true)}>{getLocalizedName(recTienTrinh?.ctdtKeHoach) || '-'}</a>
					</Descriptions.Item>

					<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.ctdt.college' })}>
						{chuongTrinhHienTai?.nganh?.tenDonViPhuTrach ||
							chuongTrinhHienTai?.nganh?.donVi?.ten ||
							chuongTrinhHienTai?.nganh?.maDonVi ||
							khoaNganhMe?.khoaNganhChinh?.nganh?.maDonVi ||
							khoaNganhMe?.khoaNganhChinh?.nganh?.tenDonViPhuTrach ||
							'--'}
					</Descriptions.Item>
					{chuyenNganhHienTai?.ten && (
						<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.ctdt.chuyennganh' })}>
							{chuyenNganhHienTai.ten}
						</Descriptions.Item>
					)}

					{access.cctFilter() && tenChuyenNganhPhu && (
						<Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.ctdt.chuyennganhphu' })}>
							{tenChuyenNganhPhu}
						</Descriptions.Item>
					)}
				</Descriptions>

				{/* <Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.ctdt.chuongtrinh' })} span={2}>
					<Link to='#' onClick={(e) => { e.preventDefault(); setVisibleChuongTrinh(true); }}>
						{recTienTrinh?.ctdtKeHoach?.ten || '-'}
					</Link>{' '}
					-{' '}
					{chuongTrinhHienTai?.loai ? LoaiChuongTrinhDaoTao[chuongTrinhHienTai.loai] : chuongTrinhHienTai?.loai || '-'}
				</Descriptions.Item> */}
			</Spin>

			{recDotQuyDoi?._id ? (
				<Alert
					style={{ marginBottom: 12 }}
					type='info'
					showIcon
					message={intl.formatMessage(
						{ id: 'tientrinhhoctap.message' },
						{
							tenDot: <b>{recDotQuyDoi?.tenDot}</b>,
							tuNgay: <b>{formatDate(recDotQuyDoi?.thoiGianBatDau)}</b>,
							denNgay: <b>{formatDate(recDotQuyDoi?.thoiGianKetThuc)}</b>,
						},
					)}
				/>
			) : null}

			<Spin spinning={loading}>
				<Divider dashed orientation='left' className='divider-big-title'>
					{intl.formatMessage({ id: 'tientrinhhoctap.scttichluy' })}
				</Divider>

				<Row align='middle' gutter={[12, 12]}>
					<Col span={24}>
						<div className='progress-section'>
							<div className='progress-row'>
								<div className='progress-wrapper'>
									<div
										className='proress-bar'
										style={{
											width: `${phanTramTinChi}%`,
										}}
									/>
								</div>
								<div className='progress-logo'>
									<img src={getPublicAssetPath('logo.png')} alt='' style={{ objectFit: 'contain' }} />
								</div>
							</div>
							<div className='progress-meta'>
								<div className='progress-legend'>
									<div className='progress-legend__item'>
										<span className='progress-legend__dot progress-legend__dot--primary' />
										<span className='progress-legend__text'>
											<b>{recTienTrinh?.kqhtHocKy?.tongSoTinChiTichLuyToanKhoa ?? '--'}</b>
											<span>
												{' '}
												/ {recTienTrinh?.ctdtKeHoach?.tongSoTinChi ?? '--'}{' '}
												{intl.formatMessage({ id: 'tientrinhhoctap.ctdt' })}
											</span>
										</span>
									</div>
									{!!thongKeMinor.tong && (
										<div className='progress-legend__item'>
											<span className='progress-legend__dot progress-legend__dot--minor' />
											<span className='progress-legend__text'>
												<b>{thongKeMinor.daDat}</b>
												<span>
													{' '}
													/ {thongKeMinor.tong} {intl.formatMessage({ id: 'tientrinhhoctap.ctdt.chuyennganhphu' })}
												</span>
											</span>
										</div>
									)}
								</div>
								<div className='progress-meta__logo'>
									<div className='progress-credits'>
										<b>{tongTinChiTatCa ? tongTinChiDaDat : '--'}</b>
										<span>
											{' '}
											/ {tongTinChiTatCa || '--'} {intl.formatMessage({ id: 'tientrinhhoctap.progress.tongtinchi' })}
										</span>
									</div>
								</div>
							</div>
						</div>
					</Col>
				</Row>
			</Spin>

			<TabViewPage
				hideCard
				tabType='line'
				style={{ marginTop: 8 }}
				menu={[
					{
						title: intl.formatMessage({ id: 'tientrinhhoctap.curriculumPlanner' }),
						menuKey: 'chuong-trinh-dao-tao',
						content: <TienTrinhChuongTrinhKhung />,
						icon: <IconBookOpen />,
					},
					{
						title: intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte' }),
						menuKey: 'tien-trinh-thuc-te',
						content: <TienTrinhThucTe />,
						icon: <IconCalendar />,
					},
					// {
					// 	title: intl.formatMessage({ id: 'hoctapkhac.dangkychuyennganh.title' }),
					// 	menuKey: 'dang-ky-chuyen-nganh',
					// 	content: access.cctFilter() ? <DangKyChuyenNganhHistory type='concentration' /> : <DangKyChuyenNganh />,
					// 	icon: <ProfileOutlined />,
					// },
					// {
					// 	title: intl.formatMessage({ id: 'hoctapkhac.dangkychuyennganhhep.title' }),
					// 	menuKey: 'dang-ky-chuyen-nganh-hep',
					// 	content: <DangKyChuyenNganhHistory type='minor' />,
					// 	icon: <ProfileOutlined />,
					// 	hide: !access.cctFilter(),
					// },
					// {
					// 	title: intl.formatMessage({ id: 'tientrinhhoctap.congnhan' }),
					// 	menuKey: 'cong-nhan-kqht',
					// 	content: <LichSuQuyDoiDiemPage />,
					// 	icon: <CheckCircleOutlined />,
					// },
				]}
			/>

			<ChuongTrinhDaoTaoModalView visible={visibleChuongTrinh} setVisible={setVisibleChuongTrinh} />
		</PageCard>
	);
};

export default TienTrinhHocTap;
