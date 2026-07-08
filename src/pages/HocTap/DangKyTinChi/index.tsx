import PageCard from '@/components/PageCard';
import { ESettingKey } from '@/services/base/constant';
import { ETrangThaiSinhVienDKTinChi } from '@/services/DaoTao/DangKyTinChi/constant';
import { formatDateTime } from '@/utils/formatDate';
import { ipDaoTao } from '@/utils/ip';
import { FileTextOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Spin } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useAccess, useIntl, useModel } from 'umi';
import CreditRegistrationBar from './components/CreditRegistrationBar';
import DangKyLopHocPhan from './components/DangKyLopHocPhan';
import FilterDotDangKy from './components/FilterDotDangKy';
import HuongDanDangKyTinChi from './components/HuongDanDangKyTinChi';
import ModalLichSuVuotTin from './components/ModalLichSuVuotTin';
import PhieuDangKy from './components/PhieuDangKy';
import './components/style.less';
import ViewGhiChuDangKyTinChi from './components/ViewGhiChuDangKyTinChi';
import { buildDanhSachLopHienThi, getSoTinChiToiDa, tinhTongHocPhanDangKy, tinhTongTinChi } from './utils';

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

	const danhSachLopHienThi = useMemo(() => buildDanhSachLopHienThi(danhSachLopDangKy), [danhSachLopDangKy]);
	const tongTinChi = useMemo(() => tinhTongTinChi(danhSachLopHienThi), [danhSachLopHienThi]);
	const tongHocPhanDangKy = useMemo(() => tinhTongHocPhanDangKy(danhSachLopHienThi), [danhSachLopHienThi]);
	const soTinChiToiDa = getSoTinChiToiDa(phieuDangKy, khoaNganhMe);
	const soTinChiToiThieu = phieuDangKy?.soTinChiToiThieu ?? 0;

	const handleCaptchaChange = (token: string | null) => {
		setIsVerified(!!token);
	};

	// useEffect(() => {
	// 	getKhoaNganhMeModel();
	// 	getByKeyModel(ESettingKey.SINH_VIEN, ipDaoTao);
	// }, []);

	const getData = async () => {
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

	const getLopDangKy = async () => {
		if (recHocKy?.ma) await getLopDangKyModel(recHocKy.ma);
	};

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
								<Button type='link' size='small' icon={<FileTextOutlined />} onClick={() => setVisibleThongTin(true)} />
							}
						/>
					) : null}

					{/* {cctFilter?.() && <AlertVuotTin onViewLichSu={() => setVisibleLichSu(true)} />} */}

					<Spin spinning={loading}>
						{/* Tạm comment/bypass block điều kiện cũ: dotDangKyHienTai, sinhVienDot, trạng thái được đăng ký và số tín chỉ tối đa. */}
						<DangKyLopHocPhan
							tongTinChi={tongTinChi}
							soTinChiToiDa={soTinChiToiDa}
							danhSachLopHienThi={danhSachLopHienThi}
						/>
					</Spin>
				</PageCard>
			</div>

			<div ref={phieuDangKyRef}>
				<Card
					title={intl.formatMessage({ id: 'dangkytinchi.phieudangky.danhsachdadangky.title' })}
					style={{ marginTop: 12, marginBottom: 84 }}
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

			<ModalLichSuVuotTin visible={visibleLichSu} onClose={() => setVisibleLichSu(false)} />
			<ViewGhiChuDangKyTinChi visible={visibleThongTin} setVisible={setVisibleThongTin} />
		</>
	);
};

export default DangKyTinChiPage;
