import PageCard from '@/components/PageCard';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { ESettingKey } from '@/services/base/constant';
import {
	ELoaiDangKyTheoLop,
	ETinhChatDangKyTC,
	ETrangThaiSinhVienDKTinChi,
} from '@/services/DaoTao/DangKyTinChi/constant';
import dayjs from '@/utils/dayjs';
import { formatDateTime } from '@/utils/formatDate';
import { ipDaoTao } from '@/utils/ip';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Divider, Empty, Flex, Select, Space, Spin, Tabs } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useAccess, useIntl, useModel } from 'umi';
import AlertVuotTin from './components/AlertVuotTin';
import FilterDotDangKy from './components/FilterDotDangKy';
import FilterHocPhanDKTC from './components/FilterHocPhan';
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
	} = useModel('daotao.dotdangkytinchi');
	const { getModel } = useModel('daotao.dkvuottinchi');
	const { getMeModel: getLopHc } = useModel('daotao.lophanhchinh');
	const { getByKeyModel } = useModel('tienich.caidat');
	const { loaiDangKy, setLoaiDangKy } = useModel('hocphan.hocphan');
	const { khoaNganhMe } = useModel('sinhvien.sinhvien');
	const { tinhHocPhi } = useModel('taichinh.mucthuhocphi');
	const allLoaiDangKy = Object.values(ELoaiDangKyTheoLop);
	const [isVerified, setIsVerified] = useState<boolean>(false);
	const [visibleLichSu, setVisibleLichSu] = useState<boolean>(false);
	const [visibleThongTin, setVisibleThongTin] = useState<boolean>(false);
	const [activeKey, setActiveKey] = useState<string>('1');

	const dangTrongThoiGian =
		dotDangKyHienTai?.thoiGianBatDau &&
		dotDangKyHienTai?.thoiGianKetThuc &&
		dayjs().isSameOrAfter(dayjs(dotDangKyHienTai?.thoiGianBatDau)) &&
		dayjs().isSameOrBefore(dayjs(dotDangKyHienTai?.thoiGianKetThuc));

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
		if (dotDangKyHienTai?._id && sinhVienDot?.trangThaiSvDangKyTinChi === ETrangThaiSinhVienDKTinChi.DUOC_DK)
			getPhieuDangKyModel(dotDangKyHienTai._id);
	}, [sinhVienDot?._id]);

	const getLopDangKy = () => recHocKy?.ma && getLopDangKyModel(recHocKy.ma);

	useEffect(() => {
		getLopDangKy();
	}, [recHocKy?.ma]);

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

	const hocPhanCoLopThucHanh = danhSachLopDangKy.filter((item) => !!item.tenCha).map((item) => item.maHocPhan);
	const danhSachLopHienThi = danhSachLopDangKy
		.filter((item) => !hocPhanCoLopThucHanh.includes(item.maHocPhan) || !!item.tenCha)
		.map((item) =>
			hocPhanCoLopThucHanh.includes(item.maHocPhan)
				? {
						...item,
						// Gộp lịch học lớp Chính với lớp hiển thị
						maHoaLichHoc:
							danhSachLopDangKy
								?.filter((j) => j.maHocPhan === item.maHocPhan)
								?.map((j) => j.maHoaLichHoc ?? [])
								?.flat() ?? [],
					}
				: item,
		);

	const tongTinChi = _.sumBy(
		danhSachLopHienThi.filter((item) => item.hocPhan?.loaiHocPhan?.isTinhSoTinChiDangKy !== false),
		(item) => item.soTinChi,
	);
	const soTinChiToiDa =
		khoaNganhMe?.khoaNganhPhu && phieuDangKy?.soTinChiToiDaSongNganh
			? phieuDangKy.soTinChiToiDaSongNganh
			: (phieuDangKy?.soTinChiToiDa ?? 0);
	const soTinChiToiThieu = phieuDangKy?.soTinChiToiThieu ?? 0;
	const tongHocPhi = _.sumBy(danhSachLopHienThi, (lop) => tinhHocPhi(lop.soTinChi, lop.loai, lop.maNganh));

	return (
		<>
			<PageCard title={intl.formatMessage({ id: 'dangkytinchi.title' })}>
				<Tabs activeKey={activeKey} onChange={(tab) => setActiveKey(tab)}>
					<Tabs.TabPane key='1' tab='Đăng ký' />
					<Tabs.TabPane key='2' tab='Lịch sử đăng ký' />
				</Tabs>

				<Flex justify='space-between' align='center' style={{ marginBottom: 12 }}>
					<Space wrap>
						<FilterDotDangKy />
						{activeKey === '1' && (
							<>
								<Select
									options={allLoaiDangKy.map((item) => ({
										key: item,
										value: item,
										label: intl.formatMessage({
											id: `dangkytinchi.loaidangky.${item}`,
										}),
									}))}
									value={loaiDangKy}
									onChange={(val) => setLoaiDangKy(val)}
									style={{ width: 300 }}
								/>
								<ButtonExtend
									type='primary'
									className='custom-info-btn' // Thêm class custom vào đây
									icon={<InfoCircleOutlined />}
									onClick={() => setVisibleThongTin(true)}
								/>
							</>
						)}
					</Space>

					{/* {cctFilter?.() && (
						<Button type='primary' onClick={() => setVisibleLichSu(true)}>
							{intl.formatMessage({ id: 'dangkytinchi.vuottin.button.dangkyvuottin' })}
						</Button>
					)} */}
				</Flex>

				{!!phieuDangKy?.soTinChiToiDa &&
				dotDangKyHienTai &&
				sinhVienDot?.trangThaiSvDangKyTinChi === ETrangThaiSinhVienDKTinChi.DUOC_DK ? (
					<>
						<div className='custom-info-box'>
							<span className='info-box-icon'>
								<InfoCircleOutlined />
							</span>

							<div className='info-box-content'>
								{intl.formatMessage(
									{ id: 'dangkytinchi.filter.thoigiandangky.title' },
									{
										thoigianbatdau: formatDateTime(dotDangKyHienTai?.thoiGianBatDau),
										thoigianketthuc: formatDateTime(dotDangKyHienTai?.thoiGianKetThuc),
										span: (chunks) => <b>{chunks}</b>,
									},
								)}

								{phieuDangKy ? (
									<>
										.{' '}
										<span>
											{intl.formatMessage({ id: 'dangkytinchi.phieudangky.alert.khoangtinchi' })}:{' '}
											<b>{[soTinChiToiThieu, soTinChiToiDa].join(' - ')} tín chỉ.</b>
										</span>
									</>
								) : null}
							</div>
						</div>

						<Divider style={{ margin: '8px 0' }} />
					</>
				) : null}

				{/* <Row gutter={[8, 12]} style={{ marginBottom: 12 }}>
					<Col span={24} md={12}>
						{intl.formatMessage({ id: 'dangkytinchi.phieudangky.tongtinchi.title' })}:{' '}
						<b className={tongTinChi > soTinChiToiDa || tongTinChi < soTinChiToiThieu ? 'text-error' : 'text-success'}>
							{tongTinChi} {intl.formatMessage({ id: 'dangkytinchi.phieudangky.tinchi.title' })}
						</b>
					</Col>
					<Col span={24} md={7}>
						{intl.formatMessage({ id: 'dangkytinchi.phieudangky.hocphidukien.title' })}:{' '}
						<b>{tongHocPhi ? inputFormat(tongHocPhi) : '--'} VND</b>
					</Col>
					{phieuDangKy ? (
						<Col span={24} md={12}>
							<div
								className={
									tongTinChi > soTinChiToiDa || tongTinChi < soTinChiToiThieu
										? 'fw500 text-error'
										: 'fw500 text-success'
								}
								style={{ textAlign: 'right' }}
							>
								{intl.formatMessage({ id: 'dangkytinchi.phieudangky.alert.khoangtinchi' })}:{' '}
								{[soTinChiToiThieu, soTinChiToiDa].join(' - ')}
							</div>
						</Col>
					) : null}
				</Row> */}

				{activeKey === '1' ? (
					<>
						{cctFilter?.() && <AlertVuotTin onViewLichSu={() => setVisibleLichSu(true)} />}

						<Spin spinning={loading}>
							{dotDangKyHienTai && sinhVienDot ? (
								sinhVienDot.trangThaiSvDangKyTinChi === ETrangThaiSinhVienDKTinChi.KHONG_DUOC_DK ? (
									<Empty
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
									<Empty
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
									<FilterHocPhanDKTC tongTinChi={tongTinChi} />
								) : (
									<Empty
										description={
											<i style={{ color: '#999' }}>
												{intl.formatMessage({ id: 'dangkytinchi.thongtindangky.empty.error' })}
											</i>
										}
									/>
								)
							) : (
								<Empty
									description={
										<i style={{ color: '#999' }}>
											{intl.formatMessage({ id: 'dangkytinchi.thongtindangky.empty.khongcodotdangky' })}
										</i>
									}
								/>
							)}
						</Spin>
					</>
				) : (
					<PhieuDangKy
						getData={getLopDangKy}
						danhSachLopHienThi={danhSachLopHienThi}
						tongTinChi={tongTinChi}
						soTinChiToiDa={soTinChiToiDa}
						soTinChiToiThieu={soTinChiToiThieu}
					/>
				)}
			</PageCard>

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

			<ViewGhiChuDangKyTinChi visible={visibleThongTin} setVisible={setVisibleThongTin} />
		</>
	);
};

export default DangKyTinChiPage;
