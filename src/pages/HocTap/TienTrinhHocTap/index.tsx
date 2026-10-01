import PageCard from '@/components/PageCard';
import { TabViewPage } from '@/components/TabViewPage';
import ChuongTrinhDaoTaoModalView from '@/pages/DaoTao/ChuongTrinhDaoTao/View';
import SelectSongNganh from '@/pages/DaoTao/SongNganh/SelectSongNganh';
import { formatDate } from '@/utils/formatDate';
import { getLocalizedName } from '@/utils/localeName';
import { getPublicAssetPath } from '@/utils/path';
import { CardContent, Card as VinCard } from '@vinuni/ui';
import { Alert, Divider, Spin } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useAccess, useIntl, useModel } from 'umi';
import TienTrinhChuongTrinhKhung from './ChuongTrinhKhung';
import './components/style.less';
import TienTrinhThucTe from './TienTrinhThucTe';
import { tinhThongKeMinor } from './utils';

const TienTrinhHocTap = () => {
	const intl = useIntl();
	const { getAllModel, record: recDotQuyDoi, setRecord } = useModel('daotao.quydoidiem.dotquydoidiem');
	const { maKhoaNganh, setMaKhoaNganh, record: recSinhVien, khoaNganhMe } = useModel('sinhvien.sinhvien');
	const { record: recTienTrinh, getTienTrinhTotNghiepModel, loading } = useModel('sinhvien.tientrinhtotnghiep');
	const {
		chuongTrinhHienTai,
		tienTrinhKhungMinors,
		loading: loadingChuongTrinh,
		getChuongTrinhHienTaiModel,
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
	const phanTramTinChiChinh = tongTinChiTatCa
		? Math.min(100, Math.max(0, ((tongTinChiCtdtDaDat ?? 0) * 100) / tongTinChiTatCa))
		: 0;
	const phanTramTinChiMinor = tongTinChiTatCa
		? Math.min(100 - phanTramTinChiChinh, Math.max(0, (thongKeMinor.daDat * 100) / tongTinChiTatCa))
		: 0;
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
			className='degree-audit-page'
			stickyHeader
			title={intl.formatMessage({ id: 'menu.HocTap.DegreeAudit' })}
			extra={<SelectSongNganh className='field-w-250' value={maKhoaNganh} onChange={(val) => setMaKhoaNganh(val)} />}
		>
			<VinCard>
				<CardContent>
					<div className='ctdt-summary-frame'>
						<Spin spinning={loadingChuongTrinh || loading}>
							<div className='ctdt-summary'>
								<div className='ctdt-summary__row'>
									<div className='ctdt-summary__item'>
										<span className='ctdt-summary__label'>
											{intl.formatMessage({ id: 'tientrinhhoctap.ctdt.programName' })}
										</span>
										<button
											type='button'
											className='ctdt-summary__value ctdt-summary__value--action'
											onClick={() => setVisibleChuongTrinh(true)}
										>
											{getLocalizedName(recTienTrinh?.ctdtKeHoach) || '-'}
										</button>
									</div>

									<div className='ctdt-summary__item'>
										<span className='ctdt-summary__label'>
											{intl.formatMessage({ id: 'tientrinhhoctap.ctdt.college' })}
										</span>
										<span className='ctdt-summary__value'>
											{chuongTrinhHienTai?.nganh?.tenDonViPhuTrach ||
												chuongTrinhHienTai?.nganh?.donVi?.ten ||
												chuongTrinhHienTai?.nganh?.maDonVi ||
												khoaNganhMe?.khoaNganhChinh?.nganh?.maDonVi ||
												khoaNganhMe?.khoaNganhChinh?.nganh?.tenDonViPhuTrach ||
												'--'}
										</span>
									</div>

									<div className='ctdt-summary__item'>
										<span className='ctdt-summary__label'>
											{intl.formatMessage({ id: 'tientrinhhoctap.ctdt.chuyennganh' })}
										</span>
										<span className='ctdt-summary__value'>{chuyenNganhHienTai?.ten || '--'}</span>
									</div>

									{access.cctFilter() && (
										<div className='ctdt-summary__item'>
											<span className='ctdt-summary__label'>
												{intl.formatMessage({ id: 'tientrinhhoctap.ctdt.chuyennganhphu' })}
											</span>
											<span className='ctdt-summary__value'>{tenChuyenNganhPhu || '--'}</span>
										</div>
									)}
								</div>
							</div>

							{/* <Descriptions.Item label={intl.formatMessage({ id: 'tientrinhhoctap.ctdt.chuongtrinh' })} span={2}>
					<Link to='#' onClick={(e) => { e.preventDefault(); setVisibleChuongTrinh(true); }}>
						{recTienTrinh?.ctdtKeHoach?.ten || '-'}
					</Link>{' '}
					-{' '}
					{chuongTrinhHienTai?.loai ? LoaiChuongTrinhDaoTao[chuongTrinhHienTai.loai] : chuongTrinhHienTai?.loai || '-'}
				</Descriptions.Item> */}
						</Spin>
					</div>

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
						<div className='tien-trinh-progress'>
							<Divider dashed orientation='left' className='divider-big-title'>
								<span className='tien-trinh-progress__title'>
									{intl.formatMessage({ id: 'tientrinhhoctap.scttichluy' })}
								</span>
							</Divider>
							<div className='progress-section'>
								<div className='progress-row'>
									<div
										className='progress-wrapper'
										role='progressbar'
										aria-label={intl.formatMessage({ id: 'tientrinhhoctap.scttichluy' })}
										aria-valuemin={0}
										aria-valuemax={tongTinChiTatCa}
										aria-valuenow={Math.max(0, Math.min(tongTinChiTatCa, tongTinChiDaDat))}
									>
										<div
											className='progress-fill progress-fill--primary'
											style={{ width: `${phanTramTinChiChinh}%` }}
										/>
										{phanTramTinChiMinor > 0 && (
											<div
												className='progress-fill progress-fill--minor'
												style={{ width: `${phanTramTinChiMinor}%` }}
											/>
										)}
									</div>
									<img className='progress-logo' src={getPublicAssetPath('logo.png')} alt='' />
								</div>
								<div className='progress-meta'>
									<div className='progress-legend'>
										<div className='progress-legend__item'>
											<span className='progress-legend__dot progress-legend__dot--primary' />
											<span className='progress-legend__text'>
												<b>{tongTinChiCtdtDaDat ?? '--'}</b>
												<span>
													/{tongTinChiCtdt ?? '--'} {intl.formatMessage({ id: 'tientrinhhoctap.ctdt' })}
												</span>
											</span>
										</div>
										{!!thongKeMinor.tong && (
											<div className='progress-legend__item'>
												<span className='progress-legend__dot progress-legend__dot--minor' />
												<span className='progress-legend__text'>
													<b>{thongKeMinor.daDat}</b>
													<span>
														/{thongKeMinor.tong} {intl.formatMessage({ id: 'tientrinhhoctap.ctdt.chuyennganhphu' })}
													</span>
												</span>
											</div>
										)}
									</div>
									<div className='progress-credits'>
										<b>{tongTinChiTatCa ? tongTinChiDaDat : '--'}</b>
										<span>
											/{tongTinChiTatCa || '--'} {intl.formatMessage({ id: 'tientrinhhoctap.progress.tongtinchi' })}
										</span>
									</div>
								</div>
							</div>
						</div>
					</Spin>

					<div className='tien-trinh-tabs'>
						<TabViewPage
							offsetTop={64}
							hideCard
							tabType='line'
							tabStyle={{ backgroundColor: 'var(--ds-bg-mortared)' }}
							contentStyle={{ marginTop: 0 }}
							menu={[
								{
									title: intl.formatMessage({ id: 'tientrinhhoctap.curriculumPlanner' }),
									menuKey: 'chuong-trinh-dao-tao',
									content: <TienTrinhChuongTrinhKhung />,
									// icon: <IconBookOpen />,
								},
								{
									title: intl.formatMessage({ id: 'tientrinhhoctap.tientrinhthucte' }),
									menuKey: 'tien-trinh-thuc-te',
									content: <TienTrinhThucTe />,
									// icon: <IconCalendar />,
								},
								// {
								// 	title: intl.formatMessage({ id: 'hoctapkhac.dangkychuyennganh.title' }),
								// 	menuKey: 'dang-ky-chuyen-nganh',
								// 	content: access.cctFilter() ? <DangKyChuyenNganhHistory type='concentration' /> : <DangKyChuyenNganh />,
								// },
								// {
								// 	title: intl.formatMessage({ id: 'hoctapkhac.dangkychuyennganhhep.title' }),
								// 	menuKey: 'dang-ky-chuyen-nganh-hep',
								// 	content: <DangKyChuyenNganhHistory type='minor' />,
								// 	hide: !access.cctFilter(),
								// },
								// {
								// 	title: intl.formatMessage({ id: 'tientrinhhoctap.congnhan' }),
								// 	menuKey: 'cong-nhan-kqht',
								// 	content: <LichSuQuyDoiDiemPage />,
								// },
							]}
						/>
					</div>

					<ChuongTrinhDaoTaoModalView visible={visibleChuongTrinh} setVisible={setVisibleChuongTrinh} />
				</CardContent>
			</VinCard>
		</PageCard>
	);
};

export default TienTrinhHocTap;
