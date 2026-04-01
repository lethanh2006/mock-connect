import { ETrangThaiDangKyChuyenNganh } from '@/services/DaoTao/DangKyChuyenNganh/constant';
import { Breadcrumb, Card, Col, Row } from 'antd';
import { useEffect } from 'react';
import { useIntl, useLocation, useModel, useNavigate } from 'umi';
import AlertBanners from '../History/components/AlertBanners';
import DanhSachChuyenNganhList from './components/DanhSachChuyenNganhList';

const RegisterPage = () => {
	const intl = useIntl();
	const location = useLocation() as any;
	const navigate = useNavigate();
	const searchParams = new URLSearchParams(location.search);
	const loai = searchParams.get('loai') || 'minor';
	const isMinor = loai.toLowerCase() === 'minor';
	const pageTitle = isMinor
		? intl.formatMessage({ id: 'minor.register.title.minor' })
		: intl.formatMessage({ id: 'minor.register.title.concentration' });
	const { fetchPhieuDangKyHienTai, phieuDangKyTheoDot, fetchPhieuDangKyTheoDot } = useModel(
		'sinhvien.dangkychuyennganh.dangkychuyennganh',
	);
	const { record: dotDangKy, fetchDotDangKy, isRegistrationOpen } = useModel('daotao.dotdkctdt');
	const { getModel } = useModel('daotao.nganhchuyennganh');

	const hasRegisteredChoice = !!(phieuDangKyTheoDot?.maCtdt || phieuDangKyTheoDot?.maChuyenNganh);
	const shouldHideButton =
		hasRegisteredChoice || (!!phieuDangKyTheoDot && phieuDangKyTheoDot?.trangThai !== ETrangThaiDangKyChuyenNganh.NHAP);

	useEffect(() => {
		fetchDotDangKy(loai as 'minor' | 'concentration');
		getModel(undefined, undefined, undefined, undefined, undefined, isMinor ? 'phu/page' : 'me/page');
	}, [loai]);

	useEffect(() => {
		if (dotDangKy?._id) {
			fetchPhieuDangKyHienTai(dotDangKy?._id);
			if (!phieuDangKyTheoDot) {
				fetchPhieuDangKyTheoDot(dotDangKy?._id);
			}
		}
	}, [dotDangKy?._id]);
	return (
		<>
			<Card
				variant='borderless'
				className='card-big-title card-borderless'
				extra={
					<Breadcrumb
						items={[
							{ title: intl.formatMessage({ id: 'minor.breadcrumb.student' }) },
							{
								title: isMinor
									? intl.formatMessage({ id: 'minor.breadcrumb.minor' })
									: intl.formatMessage({ id: 'minor.breadcrumb.concentration' }),
								onClick: () => navigate(isMinor ? '/hoc-tap/khac#dang-ky-chuyen-nganh-hep' : '/hoc-tap/khac'),
							},
							{ title: pageTitle },
						]}
					/>
				}
				title={pageTitle}
			>
				<Row gutter={[0, 16]}>
					<Col span={24}>
						<Card variant='borderless'>
							<AlertBanners type={isMinor ? 'minor' : 'concentration'} />
						</Card>
					</Col>
					<Col span={24}>
						<DanhSachChuyenNganhList isMinor={isMinor} hiddenButton={shouldHideButton} />
					</Col>
				</Row>
			</Card>
		</>
	);
};

export default RegisterPage;
