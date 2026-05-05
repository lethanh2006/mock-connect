import { ESettingKey } from '@/services/base/constant';
import { ETinhChatDangKyTC, ETrangThaiSinhVienDKTinChi } from '@/services/DaoTao/DangKyTinChi/constant';
import { ipDaoTao } from '@/utils/ip';
import { QuestionCircleOutlined, YoutubeOutlined } from '@ant-design/icons';
import { Button, Card, Col, Divider, Empty, Row, Spin } from 'antd';
import { useEffect, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { history, useAccess, useIntl, useModel } from 'umi';
import AlertVuotTin from './components/AlertVuotTin';
import DangKyLopHocPhan from './components/DangKyLopHocPhan';
import FilterDotDangKy from './components/FilterDotDangKy';
import ModalLichSuVuotTin from './components/ModalLichSuVuotTin';
import PhieuDangKy from './components/PhieuDangKy';
import './components/style.less';
import PageCard from '@/components/PageCard';

const DangKyTinChiPage = () => {
	const intl = useIntl();
	const { cctFilter } = useAccess();
	const { dotDangKyHienTai, loading, sinhVienDot, phieuDangKy } = useModel('daotao.dotdangkytinchi');
	const { getModel } = useModel('daotao.dkvuottinchi');
	const { getMeModel: getLopHc } = useModel('daotao.lophanhchinh');
	const { getByKeyModel } = useModel('tienich.caidat');

	const [isVerified, setIsVerified] = useState<boolean>(false);
	const [visibleLichSu, setVisibleLichSu] = useState<boolean>(false);

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
		<Card className='card-big-title card-borderless' variant='borderless' title={intl.formatMessage({ id: 'dangkytinchi.title' })}>
			<Row gutter={[16, 16]}>
				<Col span={24}>
					<Card
						title={<FilterDotDangKy />}
						extra={
							cctFilter?.() && (
								<Button type='primary' onClick={() => setVisibleLichSu(true)}>
									{intl.formatMessage({ id: 'dangkytinchi.vuottin.button.dangkyvuottin' })}
								</Button>
							)
						}
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
										<Divider style={{ marginTop: 24 }}>
											{intl.formatMessage({ id: 'dangkytinchi.thongtindangky.title' })}
										</Divider>
										{sinhVienDot?.ghiChu && (
											<div>
												{<QuestionCircleOutlined />} {intl.formatMessage({ id: 'dangkytinchi.empty.ghichu' })}:{' '}
												<i style={{ color: 'gray' }}>{sinhVienDot.ghiChu}.</i>
											</div>
										)}
										<div style={{ marginBottom: 12 }}>
											{intl.formatMessage(
												{ id: 'dangkytinchi.thongtindangky.alert' },
												{
													link_tien_trinh: (chunks: any) => (
														<a
															href='./tien-trinh-hoc-tap'
															onClick={(e) => {
																e.preventDefault();
																history.push('./tien-trinh-hoc-tap');
															}}
														>
															{chunks}
														</a>
													),

													link_ket_qua: (chunks: any) => (
														<a
															href='./ket-qua-hoc-tap'
															onClick={(e) => {
																e.preventDefault();
																history.push('./ket-qua-hoc-tap');
															}}
														>
															{chunks}
														</a>
													),
												},
											)}
										</div>

										{cctFilter?.() && (
											<div style={{ marginBottom: 12 }}>
												<i className='text-info'>{intl.formatMessage({ id: 'dangkytinchi.waitlist.alert' })}</i>
											</div>
										)}

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
				</Col>
				<Col span={24}>
					<PageCard title={intl.formatMessage({ id: 'dangkytinchi.phieudangky.danhsachdadangky.title' })}>
						<PhieuDangKy />
					</PageCard>
				</Col>
			</Row>

			<div className='huong-dan'>
				<div className='title-huong-dan'>
					<i>{intl.formatMessage({ id: 'dangkytinchi.thongtindangky.huongdandangky.title' })}</i>
				</div>

				<YoutubeOutlined
					className='pulse'
					onClick={() => window.open('https://www.youtube.com/watch?v=2xghlws7tAk&t=2s')}
				/>
			</div>

			<ModalLichSuVuotTin visible={visibleLichSu} onClose={() => setVisibleLichSu(false)} />
		</Card>
	) : (
		<Card>
			<ReCAPTCHA
				style={{
					margin: '12px auto',
					display: 'flex',
					justifyContent: 'center',
				}}
				sitekey='6LelHsEeAAAAAJmsVdeC2EPNCAVEtfRBUGSKireh'
				onChange={handleCaptchaChange}
			/>
		</Card>
	);
};

export default DangKyTinChiPage;
