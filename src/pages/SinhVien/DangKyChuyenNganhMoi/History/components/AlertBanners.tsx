import dayjs from '@/utils/dayjs';
import { CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { Alert, Button, Col, Row } from 'antd';
import { history, useIntl, useModel } from 'umi';

const AlertBanners = ({ buttonRegister = false, type }: { buttonRegister?: boolean, type?: 'minor' | 'concentration' }) => {
	const intl = useIntl();
	const { record: kyHienTai } = useModel('daotao.dotdkctdt');

	return (
		<Row gutter={[0, 8]}>
			<Col span={24}>
				<Alert
					message={
						<Row justify='space-between' align='middle'>
							<Col style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
								<span>
									{kyHienTai?.thoiGianBatDau
										? (() => {
											const startDate = dayjs(kyHienTai.thoiGianBatDau).format('DD/MM/YYYY HH:mm');
											const endDate = kyHienTai?.thoiGianKetThuc ? dayjs(kyHienTai.thoiGianKetThuc).format('DD/MM/YYYY HH:mm') : '-';
											return type === 'minor'
												? intl.formatMessage({ id: 'minor.alert.registrationRange.minor' }, { startDate, endDate })
												: intl.formatMessage({ id: 'minor.alert.registrationRange.concentration' }, { startDate, endDate });
										})()
										: intl.formatMessage({ id: type === 'minor' ? 'minor.alert.registrationNotOpen.minor' : 'minor.alert.registrationNotOpen.concentration' })
									}
								</span>
							</Col>
							{buttonRegister && (
								<Col>
									<Row gutter={8} align='middle' wrap={false}>
										<Col>
											<Button
												type='primary'
												onClick={() => history.push(`/hoc-tap/dang-ky-chuyen-nganh/register?loai=${type}`)}
											>
												{type === 'minor' ? intl.formatMessage({ id: 'minor.button.registerMinor' }) : intl.formatMessage({ id: 'minor.button.registerConcentration' })}
											</Button>
										</Col>
									</Row>
								</Col>
							)}
						</Row>
					}
					type={kyHienTai?.thoiGianBatDau ? 'success' : 'warning'}
					icon={kyHienTai?.thoiGianBatDau ? <CheckCircleOutlined /> : <WarningOutlined />}
					showIcon
				/>
			</Col>
		</Row>
	);
};

export default AlertBanners;
