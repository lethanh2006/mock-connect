import dayjs from '@/utils/dayjs';
import { IconShieldCheck, IconShieldInfo, IconWarningTriangle } from '@/components/Icons';
import { Alert, Button, Col, Row } from 'antd';
import { history, useIntl, useModel } from 'umi';

const AlertBanners = ({
	buttonRegister = false,
	type,
}: {
	buttonRegister?: boolean;
	type?: 'minor' | 'concentration';
}) => {
	const intl = useIntl();
	const { record: kyDangKy, isRegistrationOpen, registrationStatus } = useModel('daotao.dotdkctdt');

	const hasRegistrationTime = !!kyDangKy?.thoiGianBatDau;
	const startDate = kyDangKy?.thoiGianBatDau ? dayjs(kyDangKy.thoiGianBatDau).format('DD/MM/YYYY HH:mm') : '-';
	const endDate = kyDangKy?.thoiGianKetThuc ? dayjs(kyDangKy.thoiGianKetThuc).format('DD/MM/YYYY HH:mm') : '-';

	const getMessageId = () => {
		if (!hasRegistrationTime) {
			return type === 'minor'
				? 'minor.alert.registrationNotOpen.minor'
				: 'minor.alert.registrationNotOpen.concentration';
		}

		switch (registrationStatus) {
			case 'open':
				return type === 'minor'
					? 'minor.alert.registrationRange.minor'
					: 'minor.alert.registrationRange.concentration';
			case 'upcoming':
				return type === 'minor'
					? 'minor.alert.registrationUpcoming.minor'
					: 'minor.alert.registrationUpcoming.concentration';
			case 'closed':
				return type === 'minor'
					? 'minor.alert.registrationClosed.minor'
					: 'minor.alert.registrationClosed.concentration';
			default:
				return type === 'minor'
					? 'minor.alert.registrationNotOpen.minor'
					: 'minor.alert.registrationNotOpen.concentration';
		}
	};

	const alertType = isRegistrationOpen ? 'success' : registrationStatus === 'upcoming' ? 'info' : 'warning';
	const alertIcon = isRegistrationOpen ? <IconShieldCheck /> : registrationStatus === 'upcoming' ? <IconShieldInfo /> : <IconWarningTriangle />;

	return (
		<Row gutter={[0, 8]}>
			<Col span={24}>
				<Alert
					message={
						<Row justify='space-between' align='middle'>
							<Col style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
								<span>
									{intl.formatMessage({ id: getMessageId() }, { startDate, endDate, date: startDate })}
								</span>
							</Col>
							{buttonRegister && isRegistrationOpen && (
								<Col>
									<Row gutter={8} align='middle' wrap={false}>
										<Col>
											<Button
												type='primary'
												onClick={() => history.push(`/hoc-tap/dang-ky-chuyen-nganh/register?loai=${type}`)}
											>
												{type === 'minor'
													? intl.formatMessage({ id: 'minor.button.registerMinor' })
													: intl.formatMessage({ id: 'minor.button.registerConcentration' })}
											</Button>
										</Col>
									</Row>
								</Col>
							)}
						</Row>
					}
					type={alertType}
					icon={alertIcon}
					showIcon
				/>
			</Col>
		</Row>
	);
};

export default AlertBanners;
