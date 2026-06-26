import PageCard from '@/components/PageCard';
import { ESettingKey } from '@/services/base/constant';
import { ETrangThaiSinhVienDKTinChi } from '@/services/DaoTao/DangKyTinChi/constant';
import { formatDateTime } from '@/utils/formatDate';
import { ipDaoTao } from '@/utils/ip';
import { FileTextOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Flex, Space, Spin } from 'antd';
import _ from 'lodash';
import { useEffect, useMemo, useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useAccess, useIntl, useModel } from 'umi';
import AlertVuotTin from './components/AlertVuotTin';
import DangKyLopHocPhan from './components/DangKyLopHocPhan';
import FilterDotDangKy from './components/FilterDotDangKy';
import ModalLichHoc from './components/ModalLichHoc';
import ModalLichSuVuotTin from './components/ModalLichSuVuotTin';
import PhieuDangKy from './components/PhieuDangKy';
import './components/style.less';
import ViewGhiChuDangKyTinChi from './components/ViewGhiChuDangKyTinChi';

const DangKyTinChiPage = () => {
	const intl = useIntl();
	const { cctFilter } = useAccess();
	const { record: recHocKy } = useModel('daotao.hocky');
	const {
		dotDangKyHienTai,
		loading,
		sinhVienDot,
		phieuDangKy,
		getPhieuDangKyModel,
		danhSachLopDangKy,
		getLopDangKyModel,
		setVisibleModal,
	} = useModel('daotao.dotdangkytinchi');
	const { getModel } = useModel('daotao.dkvuottinchi');
	const { getMeModel: getLopHc } = useModel('daotao.lophanhchinh');
	const { getByKeyModel } = useModel('tienich.caidat');
	const { khoaNganhMe } = useModel('sinhvien.sinhvien');
	const [isVerified, setIsVerified] = useState<boolean>(false);
	const [visibleLichSu, setVisibleLichSu] = useState<boolean>(false);
	const [visibleThongTin, setVisibleThongTin] = useState<boolean>(false);
	const [showFixedBar, setShowFixedBar] = useState(false);
	const [fixedBarRect, setFixedBarRect] = useState<{ left: number; width: number }>();
	const dangKyCardRef = useRef<HTMLDivElement>(null);
	const phieuDangKyRef = useRef<HTMLDivElement>(null);

	const handleCaptchaChange = (token: string | null) => {
		if (token) {
			setIsVerified(true);
		} else {
			setIsVerified(false);
		}
	};

	const getData = () => {
		getModel(undefined, undefined, undefined, undefined, undefined, 'me/page');
	};

	useEffect(() => {
		if (isVerified) {
			getLopHc();
			if (cctFilter?.()) {
				getData();
				getByKeyModel(ESettingKey.SINH_VIEN, ipDaoTao);
			}
		}
	}, [isVerified]);

	useEffect(() => {
		if (
			dotDangKyHienTai?._id &&
			dotDangKyHienTai.maHocKy === recHocKy?.ma &&
			sinhVienDot?.trangThaiSvDangKyTinChi === ETrangThaiSinhVienDKTinChi.DUOC_DK
		)
			getPhieuDangKyModel(dotDangKyHienTai._id);
	}, [recHocKy?.ma, dotDangKyHienTai?._id, sinhVienDot?.trangThaiSvDangKyTinChi]);

	const getLopDangKy = () => recHocKy?.ma && getLopDangKyModel(recHocKy.ma);

	useEffect(() => {
		getLopDangKy();
	}, [recHocKy?.ma]);

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
			setFixedBarRect({ left: rect.left, width: rect.width });
		};

		updateFixedBarRect();
		window.addEventListener('resize', updateFixedBarRect);
		window.addEventListener('scroll', updateFixedBarRect, true);

		return () => {
			window.removeEventListener('resize', updateFixedBarRect);
			window.removeEventListener('scroll', updateFixedBarRect, true);
		};
	}, []);

	const danhSachLopHienThi = useMemo(() => {
		const hocPhanCoLopThucHanh = new Set<string>();
		const maHoaLichHocTheoHocPhan: Record<string, any[]> = {};

		danhSachLopDangKy.forEach((item) => {
			if (item.tenCha && item.maHocPhan) hocPhanCoLopThucHanh.add(item.maHocPhan);
			if (item.maHocPhan) {
				maHoaLichHocTheoHocPhan[item.maHocPhan] = [
					...(maHoaLichHocTheoHocPhan[item.maHocPhan] ?? []),
					...(item.maHoaLichHoc ?? []),
				];
			}
		});

		return danhSachLopDangKy
			.filter((item) => !item.maHocPhan || !hocPhanCoLopThucHanh.has(item.maHocPhan) || !!item.tenCha)
			.map((item) =>
				item.maHocPhan && hocPhanCoLopThucHanh.has(item.maHocPhan)
					? {
							...item,
							// Gộp lịch học lớp Chính với lớp hiển thị.
							maHoaLichHoc: maHoaLichHocTheoHocPhan[item.maHocPhan] ?? [],
						}
					: item,
			);
	}, [danhSachLopDangKy]);

	const tongTinChi = useMemo(
		() =>
			_.sumBy(
				danhSachLopHienThi.filter((item) => item.hocPhan?.loaiHocPhan?.isTinhSoTinChiDangKy !== false),
				(item) => item.soTinChi,
			),
		[danhSachLopHienThi],
	);
	const tongHocPhanDangKy = useMemo(
		() => _.uniq(danhSachLopHienThi.map((item) => item.maHocPhan).filter(Boolean)).length,
		[danhSachLopHienThi],
	);
	const soTinChiToiDa =
		khoaNganhMe?.khoaNganhPhu && phieuDangKy?.soTinChiToiDaSongNganh
			? phieuDangKy.soTinChiToiDaSongNganh
			: (phieuDangKy?.soTinChiToiDa ?? 0);
	const soTinChiToiThieu = phieuDangKy?.soTinChiToiThieu ?? 0;
	const trangThaiTinChi =
		tongTinChi < soTinChiToiThieu
			? intl.formatMessage({ id: 'dangkytinchi.fixedbar.chuadusotinchi' })
			: intl.formatMessage({ id: 'dangkytinchi.fixedbar.dusotinchi' });

	if (isVerified)
		return (
			<PageCard title={intl.formatMessage({ id: 'dangkytinchi.title' })}>
				<ReCAPTCHA
					style={{
						margin: '12px auto',
						display: 'flex',
						justifyContent: 'center',
					}}
					sitekey='6LelHsEeAAAAAJmsVdeC2EPNCAVEtfRBUGSKireh'
					onChange={handleCaptchaChange}
				/>
			</PageCard>
		);

	return (
		<>
			<div ref={dangKyCardRef}>
				<PageCard title={intl.formatMessage({ id: 'dangkytinchi.title' })} extra={<FilterDotDangKy />}>
					{!!phieuDangKy?.soTinChiToiDa &&
					dotDangKyHienTai &&
					sinhVienDot?.trangThaiSvDangKyTinChi === ETrangThaiSinhVienDKTinChi.DUOC_DK ? (
						<>
							<Alert
								type='info'
								showIcon
								icon={<InfoCircleOutlined />}
								style={{ marginBottom: 12 }}
								message={
									<span>
										{intl.formatMessage(
											{ id: 'dangkytinchi.filter.thoigiandangky.title' },
											{
												thoigianbatdau: formatDateTime(dotDangKyHienTai?.thoiGianBatDau),
												thoigianketthuc: formatDateTime(dotDangKyHienTai?.thoiGianKetThuc),
												b: (chunks) => <b>{chunks}</b>,
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
										) : null}
									</span>
								}
								action={
									<Button
										type='link'
										size='small'
										icon={<FileTextOutlined />}
										onClick={() => setVisibleThongTin(true)}
									/>
								}
							/>

							{/* <Divider style={{ margin: '8px 0' }} /> */}
						</>
					) : null}

					{cctFilter?.() && <AlertVuotTin onViewLichSu={() => setVisibleLichSu(true)} />}

					<Spin spinning={loading}>
						{/* Tạm comment/bypass block điều kiện cũ: dotDangKyHienTai, sinhVienDot, trạng thái được đăng ký và số tín chỉ tối đa. */}
						<DangKyLopHocPhan />
					</Spin>
				</PageCard>
			</div>
			<div ref={phieuDangKyRef}>
				<Card
					title={intl.formatMessage({ id: 'dangkytinchi.phieudangky.danhsachdadangky.title' })}
					style={{ marginTop: 12, marginBottom: 84 }}
				>
					<PhieuDangKy
						getData={getLopDangKy}
						danhSachLopHienThi={danhSachLopHienThi}
						tongTinChi={tongTinChi}
						soTinChiToiDa={soTinChiToiDa}
						soTinChiToiThieu={soTinChiToiThieu}
					/>
				</Card>
			</div>

			<div
				className={`credit-registration-bar ${showFixedBar ? 'is-visible' : ''}`}
				style={fixedBarRect ? { left: fixedBarRect.left, width: fixedBarRect.width } : undefined}
			>
				<Flex align='center' justify='space-between' gap={16} wrap='wrap'>
					<Space size={28} wrap>
						<div className='credit-registration-bar__item'>
							<span>{intl.formatMessage({ id: 'dangkytinchi.fixedbar.duocphepdangky' })}</span>
							<b>
								{soTinChiToiThieu} - {soTinChiToiDa}{' '}
								{intl.formatMessage({ id: 'dangkytinchi.phieudangky.tinchi.title' })}
							</b>
						</div>
						<div className='credit-registration-bar__item'>
							<span>{intl.formatMessage({ id: 'dangkytinchi.trangthaidangky.dadangky' })}</span>
							<b>
								{tongHocPhanDangKy} {intl.formatMessage({ id: 'dangkytinchi.fixedbar.courses' })} ({tongTinChi}{' '}
								{intl.formatMessage({ id: 'dangkytinchi.phieudangky.tinchi.title' })})
							</b>
						</div>
						<span
							className={
								tongTinChi < soTinChiToiThieu
									? 'credit-registration-bar__status credit-registration-bar__status--warning'
									: 'credit-registration-bar__status'
							}
						>
							{trangThaiTinChi}
						</span>
					</Space>

					<Button onClick={() => setVisibleModal(true)} disabled={!danhSachLopHienThi.length}>
						{intl.formatMessage({ id: 'dangkytinchi.phieudangky.table.btn.xemtruoclichhoc' })}
					</Button>
				</Flex>
			</div>

			{/* <div className='huong-dan'>
				<div className='title-huong-dan'>
					<i>{intl.formatMessage({ id: 'dangkytinchi.thongtindangky.huongdandangky.title' })}</i>
				</div>

				<YoutubeOutlined
					className='pulse'
					onClick={() => window.open('https://www.youtube.com/watch?v=2xghlws7tAk&t=2s')}
				/>
			</div> */}

			<ModalLichSuVuotTin visible={visibleLichSu} onClose={() => setVisibleLichSu(false)} />
			<ModalLichHoc soLopHienThi={danhSachLopHienThi.length} />

			<ViewGhiChuDangKyTinChi visible={visibleThongTin} setVisible={setVisibleThongTin} />
		</>
	);
};

export default DangKyTinChiPage;
