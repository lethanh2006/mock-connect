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
import { InfoCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Alert, Card, Col, Empty, Row, Select, Space, Spin } from 'antd';
import { useEffect, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useAccess, useIntl, useModel } from 'umi';
import AlertVuotTin from './components/AlertVuotTin';
import DangKyLopHocPhan from './components/DangKyLopHocPhan';
import FilterDotDangKy from './components/FilterDotDangKy';
import ModalLichSuVuotTin from './components/ModalLichSuVuotTin';
import PhieuDangKy from './components/PhieuDangKy';
import './components/style.less';
import ViewGhiChuDangKyTinChi from './components/ViewGhiChuDangKyTinChi';

const DangKyTinChiPage = () => {
	const intl = useIntl();
	const { cctFilter } = useAccess();
	const { dotDangKyHienTai, loading, sinhVienDot, phieuDangKy } = useModel('daotao.dotdangkytinchi');
	const { getModel } = useModel('daotao.dkvuottinchi');
	const { getMeModel: getLopHc } = useModel('daotao.lophanhchinh');
	const { getByKeyModel } = useModel('tienich.caidat');
	const { loaiDangKy, setLoaiDangKy } = useModel('hocphan.hocphan');
	const allLoaiDangKy = Object.values(ELoaiDangKyTheoLop);
	const [isVerified, setIsVerified] = useState<boolean>(false);
	const [visibleLichSu, setVisibleLichSu] = useState<boolean>(false);
	const [visibleThongTin, setVisibleThongTin] = useState<boolean>(false);

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

	return !isVerified ? (
		<Row gutter={[12, 12]}>
			<Col span={24}>
				<PageCard title={intl.formatMessage({ id: 'dangkytinchi.title' })}>
					<Card
						title={
							<Space>
								<FilterDotDangKy />
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
									style={{ width: 250 }}
								/>
								<ButtonExtend icon={<QuestionCircleOutlined />} onClick={() => setVisibleThongTin(true)} />
							</Space>
						}
						// extra={
						// 	cctFilter?.() && (
						// 		<Button type='primary' onClick={() => setVisibleLichSu(true)}>
						// 			{intl.formatMessage({ id: 'dangkytinchi.vuottin.button.dangkyvuottin' })}
						// 		</Button>
						// 	)
						// }
						className='card-borderless'
						variant='borderless'
					>
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
									<>
										{dotDangKyHienTai && sinhVienDot?.trangThaiSvDangKyTinChi === ETrangThaiSinhVienDKTinChi.DUOC_DK ? (
											<Alert
												type={dangTrongThoiGian ? 'info' : 'error'}
												showIcon
												icon={<InfoCircleOutlined />}
												message={
													<span className={dangTrongThoiGian ? 'text-info' : 'text-error'}>
														{intl.formatMessage(
															{ id: 'dangkytinchi.filter.thoigiandangky.title' },
															{
																thoigianbatdau: formatDateTime(dotDangKyHienTai?.thoiGianBatDau),
																thoigianketthuc: formatDateTime(dotDangKyHienTai?.thoiGianKetThuc),
																span: (chunks) => <span className='fw500'>{chunks}</span>,
															},
														)}
													</span>
												}
											/>
										) : null}

										<DangKyLopHocPhan />
									</>
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
					</Card>
				</PageCard>
			</Col>
			<Col span={24}>
				<Card title={intl.formatMessage({ id: 'dangkytinchi.phieudangky.danhsachdadangky.title' })}>
					<PhieuDangKy />
				</Card>
			</Col>

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
		</Row>
	) : (
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
};

export default DangKyTinChiPage;
