import EmptyState from '@/components/EmptyState';
import { IconQuestionCircle } from '@/components/Icons';
import FormWaiting, { hideFormWaiting } from '@/components/Loading/FormWaiting';
import PageCard, { Card } from '@/components/PageCard';
import { ETinhChatDangKyTC, ETrangThaiSinhVienDKTinChi } from '@/services/DaoTao/DangKyTinChi/constant';
import { formatDateTime } from '@/utils/formatDate';
import { CardContent, Card as VinCard } from '@vinuni/ui';
import { Alert } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';
import { history, useIntl, useModel } from 'umi';
import CreditRegistrationBar from './components/CreditRegistrationBar';
import DangKyLopHocPhan from './components/DangKyLopHocPhan';
import FilterDotDangKy from './components/FilterDotDangKy';
import HuongDanDangKyTinChi from './components/HuongDanDangKyTinChi';
import PhieuDangKy from './components/PhieuDangKy';
import './components/style.less';
import ViewGhiChuDangKyTinChi from './components/ViewGhiChuDangKyTinChi';
import { buildDanhSachLopHienThi, getSoTinChiToiDa, tinhTongHocPhanDangKy, tinhTongTinChi } from './utils';

const RECAPTCHA_SITE_KEY =
	typeof APP_CONFIG_RECAPTCHA_SITE_KEY !== 'undefined' && APP_CONFIG_RECAPTCHA_SITE_KEY
		? APP_CONFIG_RECAPTCHA_SITE_KEY
		: '';

const DangKyTinChiPage = () => {
	const intl = useIntl();
	const { record: recHocKy } = useModel('daotao.hocky');
	const { dotDangKyHienTai, loading, sinhVienDot, phieuDangKy, danhSachLopDangKy, getLopDangKyModel, setVisibleModal } =
		useModel('daotao.dotdangkytinchi');
	const { loading: loadingHocKy } = useModel('daotao.hocky');
	// const { getMeModel: getLopHc } = useModel('daotao.lophanhchinh');
	const { setPage } = useModel('lophocphan.lophocphan');
	// const { getByKeyModel } = useModel('tienich.caidat');
	const { khoaNganhMe } = useModel('sinhvien.sinhvien');
	const [visibleThongTin, setVisibleThongTin] = useState<boolean>(false);
	const [showFixedBar, setShowFixedBar] = useState(false);
	const [fixedBarRect, setFixedBarRect] = useState<{ left: number; width: number }>();
	const dangKyCardRef = useRef<HTMLDivElement>(null);
	const phieuDangKyRef = useRef<HTMLDivElement>(null);
	const danhSachLopHienThi = useMemo(() => buildDanhSachLopHienThi(danhSachLopDangKy), [danhSachLopDangKy]);
	const tongTinChi = useMemo(() => tinhTongTinChi(danhSachLopHienThi), [danhSachLopHienThi]);
	const tongHocPhanDangKy = useMemo(() => tinhTongHocPhanDangKy(danhSachLopHienThi), [danhSachLopHienThi]);
	const soTinChiToiDa = getSoTinChiToiDa(phieuDangKy, khoaNganhMe);
	const soTinChiToiThieu = phieuDangKy?.soTinChiToiThieu ?? 0;
	const dotHocKySynced = dotDangKyHienTai?.maHocKy === recHocKy?.ma;
	const isWaitingSinhVienDot = dotHocKySynced && !!dotDangKyHienTai?._id && sinhVienDot === undefined;
	const isPageLoading = loading || loadingHocKy || isWaitingSinhVienDot;

	// const getData = async () => {
	// 	getModel(undefined, undefined, undefined, undefined, undefined, 'me/page');
	// };

	// useEffect(() => {
	// 	getLopHc();
	// 	if (cctFilter?.()) {
	// 		getData();
	// 		getByKeyModel(ESettingKey.SINH_VIEN, ipDaoTao);
	// 	}
	// }, []);

	const getLopDangKy = async () => {
		if (recHocKy?.ma) return getLopDangKyModel(recHocKy.ma);
		return undefined;
	};

	useEffect(() => {
		if (!recHocKy?.ma) return;
		setPage(1);
		getLopDangKy();
	}, [recHocKy?.ma]);

	useEffect(() => {
		if (!isPageLoading) {
			hideFormWaiting();
			return undefined;
		}

		FormWaiting(intl.formatMessage({ id: 'dangkytinchi.loading.message' }));

		return () => {
			hideFormWaiting();
		};
	}, [isPageLoading]);

	useEffect(() => {
		const node = phieuDangKyRef.current;
		if (!node) return undefined;

		const observer = new IntersectionObserver(
			([entry]) => {
				setShowFixedBar(!entry.isIntersecting);
			},
			{ threshold: 0.05 },
		);

		observer.observe(node);
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		const updateFixedBarRect = () => {
			const node = dangKyCardRef.current;
			if (!node) return;

			const rect = node.getBoundingClientRect();
			const left = rect.left;
			const width = rect.width;
			setFixedBarRect((prev) => (prev?.left === left && prev?.width === width ? prev : { left, width }));
		};

		updateFixedBarRect();
		window.addEventListener('resize', updateFixedBarRect);
		window.addEventListener('scroll', updateFixedBarRect, true);

		return () => {
			window.removeEventListener('resize', updateFixedBarRect);
			window.removeEventListener('scroll', updateFixedBarRect, true);
		};
	}, []);

	return (
		<GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_SITE_KEY}>
			<PageCard
				stickyHeader
				className='course-registration-page'
				title={intl.formatMessage({ id: 'dangkytinchi.title' })}
				extra={<FilterDotDangKy />}
			>
				<div ref={dangKyCardRef} className='course-registration-section course-registration-section--available'>
					<VinCard className='course-registration-card course-registration-card--available'>
						<CardContent>
							{!!phieuDangKy?.soTinChiToiDa &&
							dotDangKyHienTai &&
							sinhVienDot?.trangThaiSvDangKyTinChi === ETrangThaiSinhVienDKTinChi.DUOC_DK ? (
								<Alert
									className='course-registration-period-alert'
									type='info'
									showIcon
									icon={
										<svg width='20' height='20' viewBox='0 0 20 20' fill='none' aria-hidden='true'>
											<path
												d='M9.08301 0C14.0993 0.000175944 18.1668 4.06668 18.167 9.08301C18.1668 14.0993 14.0993 18.1668 9.08301 18.167C4.06668 18.1668 0.000175948 14.0993 0 9.08301C0.000175748 4.06668 4.06668 0.000175744 9.08301 0ZM9.08301 1.5C4.89511 1.50018 1.50018 4.89511 1.5 9.08301C1.50018 13.2709 4.89511 16.6668 9.08301 16.667C13.2709 16.6668 16.6668 13.2709 16.667 9.08301C16.6668 4.89511 13.2709 1.50018 9.08301 1.5ZM9.83301 12.083H10.749C11.1631 12.083 11.4988 12.4189 11.499 12.833C11.4988 13.2471 11.1631 13.583 10.749 13.583H8.33301V8.16602H7.41602C7.00195 8.16584 6.66602 7.83012 6.66602 7.41602C6.66619 7.00206 7.00206 6.66619 7.41602 6.66602H9.83301V12.083ZM9.08301 3.66602C9.77326 3.66602 10.3328 4.22581 10.333 4.91602V4.9209C10.333 5.61125 9.77336 6.1709 9.08301 6.1709C8.39265 6.1709 7.83301 5.61125 7.83301 4.9209V4.91602C7.83318 4.22581 8.39276 3.66602 9.08301 3.66602Z'
												fill='#1D4ED8'
												transform='translate(0.916 0.916)'
											/>
										</svg>
									}
									message={
										<span>
											{intl.formatMessage(
												{ id: 'dangkytinchi.filter.thoigiandangky.title' },
												{
													thoigianbatdau: formatDateTime(dotDangKyHienTai?.thoiGianBatDau),
													thoigianketthuc: formatDateTime(dotDangKyHienTai?.thoiGianKetThuc),
													b: (chunks) => <b className='course-registration-period-time'>{chunks}</b>,
												},
											)}
											{phieuDangKy ? (
												<>
													.{' '}
													<span>
														{intl.formatMessage({ id: 'dangkytinchi.phieudangky.alert.khoangtinchi' })}{' '}
														<b>
															{[soTinChiToiThieu, soTinChiToiDa].join('-')}{' '}
															{intl.formatMessage({ id: 'dangkytinchi.phieudangky.tinchi.title' })}.
														</b>
													</span>
												</>
											) : null}{' '}
											<button
												className='course-registration-period-link'
												type='button'
												onClick={() => setVisibleThongTin(true)}
											>
												{intl.formatMessage({ id: 'dangkytinchi.alert.seefull' })}
											</button>
										</span>
									}
								/>
							) : null}

							{dotDangKyHienTai && sinhVienDot ? (
								sinhVienDot.trangThaiSvDangKyTinChi === ETrangThaiSinhVienDKTinChi.KHONG_DUOC_DK ? (
									<EmptyState
										description={
											<>
												<span className='text-error'>
													{intl.formatMessage({ id: 'dangkytinchi.empty.khongduocphepdangky' })}
												</span>
												<br />
												{intl.formatMessage({ id: 'dangkytinchi.empty.ghichu' })}: {sinhVienDot.ghiChu ?? '--'}
											</>
										}
									/>
								) : dotDangKyHienTai.tinhChatDangKy === ETinhChatDangKyTC.XOA ? (
									<EmptyState
										description={
											<i style={{ color: '#999' }}>
												{intl.formatMessage(
													{ id: 'dangkytinchi.empty.alert' },
													{
														b: (chunks) => <b>{chunks}</b>,
													},
												)}{' '}
											</i>
										}
									/>
								) : !!phieuDangKy?.soTinChiToiDa ? (
									<>
										{sinhVienDot?.ghiChu && (
											<div className='course-registration-note'>
												{<IconQuestionCircle />} {intl.formatMessage({ id: 'dangkytinchi.empty.ghichu' })}:{' '}
												<i style={{ color: 'gray' }}>{sinhVienDot.ghiChu}.</i>
											</div>
										)}
										<div className='course-registration-description'>
											{intl.formatMessage(
												{ id: 'dangkytinchi.thongtindangky.alert' },
												{
													link_tien_trinh: (chunks: any) => (
														<a
															href='/hoc-tap/tien-trinh-hoc-tap'
															onClick={(e) => {
																e.preventDefault();
																history.push('/hoc-tap/tien-trinh-hoc-tap');
															}}
														>
															{chunks}
														</a>
													),

													link_ket_qua: (chunks: any) => (
														<a
															href='/hoc-tap/ket-qua-hoc-tap'
															onClick={(e) => {
																e.preventDefault();
																history.push('/hoc-tap/ket-qua-hoc-tap');
															}}
														>
															{chunks}
														</a>
													),
												},
											)}
										</div>

										<DangKyLopHocPhan
											tongTinChi={tongTinChi}
											soTinChiToiDa={soTinChiToiDa}
											danhSachLopHienThi={danhSachLopHienThi}
											onReload={getLopDangKy}
										/>
									</>
								) : (
									<EmptyState
										description={
											<i style={{ color: '#999' }}>{intl.formatMessage({ id: 'global.formWaiting.dangxuly' })}</i>
										}
									/>
								)
							) : (
								<EmptyState
									description={
										<i style={{ color: '#999' }}>
											{intl.formatMessage({ id: 'dangkytinchi.thongtindangky.empty.khongcodotdangky' })}
										</i>
									}
								/>
							)}
						</CardContent>
					</VinCard>
				</div>

				<div ref={phieuDangKyRef} className='course-registration-section course-registration-section--registered'>
					<Card
						className='course-registration-card course-registration-card--registered'
						title={intl.formatMessage({ id: 'dangkytinchi.phieudangky.danhsachdadangky.title' })}
					>
						<PhieuDangKy
							danhSachLopHienThi={danhSachLopHienThi}
							tongTinChi={tongTinChi}
							soTinChiToiDa={soTinChiToiDa}
							soTinChiToiThieu={soTinChiToiThieu}
							onReload={getLopDangKy}
						/>
					</Card>
				</div>

				<CreditRegistrationBar
					showFixedBar={showFixedBar}
					fixedBarRect={fixedBarRect}
					danhSachLopHienThi={danhSachLopHienThi}
					soTinChiToiThieu={soTinChiToiThieu}
					soTinChiToiDa={soTinChiToiDa}
					tongHocPhanDangKy={tongHocPhanDangKy}
					tongTinChi={tongTinChi}
					onViewSchedule={() => setVisibleModal(true)}
					disabledViewSchedule={!danhSachLopHienThi.length}
				/>

				<HuongDanDangKyTinChi />

				<ViewGhiChuDangKyTinChi visible={visibleThongTin} setVisible={setVisibleThongTin} />
			</PageCard>
		</GoogleReCaptchaProvider>
	);
};

export default DangKyTinChiPage;
