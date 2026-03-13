import { ETinhChatDangKyTC, ETrangThaiSinhVienDKTinChi } from '@/services/DaoTao/DangKyTinChi/constant';
import { QuestionCircleOutlined, YoutubeOutlined } from '@ant-design/icons';
import { Card, Divider, Empty, Spin } from 'antd';
import { useEffect, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { history, useIntl, useModel } from 'umi';
import DangKyLopHocPhan from './components/DangKyLopHocPhan';
import FilterDotDangKy from './components/FilterDotDangKy';
import PhieuDangKy from './components/PhieuDangKy';
import './components/style.less';

const DangKyTinChiPage = () => {
	const intl = useIntl();
	const { dotDangKyHienTai, loading, sinhVienDot, phieuDangKy } = useModel('daotao.dotdangkytinchi');
	const { getMeModel: getLopHc } = useModel('daotao.lophanhchinh');
	const [isVerified, setIsVerified] = useState<boolean>(false);

	const handleCaptchaChange = (token: string | null) => {
		if (token) {
			setIsVerified(true);
		} else {
			setIsVerified(false);
		}
	};

	useEffect(() => {
		if (isVerified) {
			getLopHc();
		}
	}, [isVerified]);

	return isVerified ? (
		<Card className='card-big-title' title={intl.formatMessage({ id: 'dangkytinchi.title' })}>
			<FilterDotDangKy />

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
							<DangKyLopHocPhan />
						</>
					) : (
						<Empty
							description={
								<i style={{ color: '#999' }}>{intl.formatMessage({ id: 'dangkytinchi.thongtindangky.empty.error' })}</i>
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

			<PhieuDangKy />

			<div className='huong-dan'>
				<div className='title-huong-dan'>
					<i>{intl.formatMessage({ id: 'dangkytinchi.thongtindangky.huongdandangky.title' })}</i>
				</div>

				<YoutubeOutlined
					className='pulse'
					onClick={() => window.open('https://www.youtube.com/watch?v=2xghlws7tAk&t=2s')}
				/>
			</div>
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
