import { Typography } from 'antd';
import { useIntl } from 'umi';
import { KyTucXa } from '@/services/KyTucXa/typings';
import { useMemo } from 'react';
import dayjs from '@/utils/dayjs';

interface CheckinPrepContentProps {
	phong?: KyTucXa.IPhong;
	dotDangKy?: KyTucXa.IDotDangKy;
}

const CheckinPrepContent = ({ phong, dotDangKy }: CheckinPrepContentProps) => {
	const intl = useIntl();

	const numBedLabel = useMemo(() => {
		if (!phong) return intl.formatMessage({ id: 'kytucxa.dangky.success.checkin.location' });
		return [phong.ma, phong.toaNha?.ten, phong.ten].filter(Boolean).join(' · ');
	}, [phong]);

	return (
		<>
			<p style={{ marginBottom: 16, fontSize: 14 }}>
				{intl.formatMessage({ id: 'kytucxa.dangky.success.desc' })}
			</p>

			<div style={{ display: 'flex', flexDirection: 'column', gap: 8, color: '#2e2e2e', fontSize: 13 }}>
				<div>
					<Typography.Text strong style={{ fontSize: 14, color: '#2e2e2e' }}>1. {intl.formatMessage({ id: 'kytucxa.dangky.success.doc.title' })}</Typography.Text>
					<ul style={{ paddingLeft: 20, marginTop: 8, marginBottom: 0 }}>
						<li style={{ marginBottom: 4 }}>{intl.formatMessage({ id: 'kytucxa.dangky.success.doc.1' })}</li>
						<li style={{ marginBottom: 4 }}>{intl.formatMessage({ id: 'kytucxa.dangky.success.doc.2' })}</li>
						<li style={{ marginBottom: 4 }}>{intl.formatMessage({ id: 'kytucxa.dangky.success.doc.3' })}</li>
						<li style={{ marginBottom: 4 }}>
							{intl.formatMessage({ id: 'kytucxa.dangky.success.doc.4' })} <span style={{ color: '#cc2424', cursor: 'pointer', textDecoration: 'underline' }}>{intl.formatMessage({ id: 'kytucxa.dangky.success.doc.here' })}</span>)
						</li>
					</ul>
				</div>

				<div>
					<Typography.Text strong style={{ fontSize: 14, color: '#2e2e2e' }}>2. {intl.formatMessage({ id: 'kytucxa.dangky.success.items.title' })}</Typography.Text>
					<ul style={{ paddingLeft: 20, marginTop: 8, marginBottom: 0 }}>
						<li style={{ marginBottom: 4 }}>{intl.formatMessage({ id: 'kytucxa.dangky.success.items.1' })}</li>
						<li style={{ marginBottom: 4 }}>{intl.formatMessage({ id: 'kytucxa.dangky.success.items.2' })}</li>
						<li style={{ marginBottom: 4 }}>{intl.formatMessage({ id: 'kytucxa.dangky.success.items.3' })}</li>
						<li style={{ marginBottom: 4 }}>{intl.formatMessage({ id: 'kytucxa.dangky.success.items.4' })}</li>
						<li style={{ marginBottom: 4 }}>{intl.formatMessage({ id: 'kytucxa.dangky.success.items.5' })}</li>
					</ul>
				</div>

				<div>
					<Typography.Text strong style={{ fontSize: 14, color: '#2e2e2e' }}>3. {intl.formatMessage({ id: 'kytucxa.dangky.success.financial.title' })}</Typography.Text>
					<ul style={{ paddingLeft: 20, marginTop: 8, marginBottom: 0 }}>
						<li style={{ marginBottom: 4 }}>{intl.formatMessage({ id: 'kytucxa.dangky.success.financial.1' })}</li>
					</ul>
				</div>

				<div>
					<Typography.Text strong style={{ fontSize: 14, color: '#2e2e2e' }}>4. {intl.formatMessage({ id: 'kytucxa.dangky.success.checkin.title' })}</Typography.Text>
					<ul style={{ paddingLeft: 20, marginTop: 8, marginBottom: 0 }}>
						<li style={{ marginBottom: 4 }}>{intl.formatMessage({ id: 'kytucxa.dangky.success.checkin.dateLabel' })} {dotDangKy?.ngayChuyenVao ? dayjs(dotDangKy.ngayChuyenVao).format('DD/MM/YYYY') : intl.formatMessage({ id: 'kytucxa.dangky.success.checkin.date' })}</li>
						<li style={{ marginBottom: 4 }}>{intl.formatMessage({ id: 'kytucxa.dangky.success.checkin.locationLabel' })} {numBedLabel}</li>
						<li style={{ marginBottom: 4 }}>{intl.formatMessage({ id: 'kytucxa.dangky.success.checkin.hoursLabel' })} {intl.formatMessage({ id: 'kytucxa.dangky.success.checkin.hours' })}</li>
						<li style={{ marginBottom: 4 }}>{intl.formatMessage({ id: 'kytucxa.dangky.success.checkin.contactLabel' })} {intl.formatMessage({ id: 'kytucxa.dangky.success.checkin.contact' })}</li>
					</ul>
				</div>

				<div>
					<Typography.Text strong style={{ fontSize: 14, color: '#2e2e2e' }}>5. {intl.formatMessage({ id: 'kytucxa.dangky.success.reminders.title' })}</Typography.Text>
					<ul style={{ paddingLeft: 20, marginTop: 8, marginBottom: 0 }}>
						<li style={{ marginBottom: 4 }}>{intl.formatMessage({ id: 'kytucxa.dangky.success.reminders.1' })}</li>
						<li style={{ marginBottom: 4 }}>{intl.formatMessage({ id: 'kytucxa.dangky.success.reminders.2' })}</li>
						<li style={{ marginBottom: 4 }}>{intl.formatMessage({ id: 'kytucxa.dangky.success.reminders.3' })}</li>
					</ul>
				</div>
			</div>
		</>
	);
};

export default CheckinPrepContent;
