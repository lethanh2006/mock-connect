import { Button, Modal, Typography } from 'antd';
import { useIntl, history, useModel } from 'umi';
import { FilePdfOutlined } from '@ant-design/icons';
import { KyTucXa } from '@/services/KyTucXa/typings';
import { useMemo, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import PrintTemplate from '@/components/PrintTemplate';

const ModalSuccessRegistration = ({ open, onClose, phong }: { open: boolean, onClose: () => void, phong?: KyTucXa.IPhong }) => {
	const intl = useIntl();
	const { loaiPhongMap } = useModel('kytucxa.loaiphong');
	const contentRef = useRef<HTMLDivElement>(null);

	const numBedLabel = useMemo(() => {
		if (!phong) return intl.formatMessage({ id: 'kytucxa.dangky.success.checkin.location' });
		return [phong.ma, phong.toaNha?.ten, phong.maLoaiPhongKtx ? loaiPhongMap.get(phong.maLoaiPhongKtx)?.ten : undefined].filter(Boolean).join(' · ');
	}, [phong, loaiPhongMap]);

	const handlePrint = useReactToPrint({
		contentRef: contentRef,
		documentTitle: intl.formatMessage({ id: 'kytucxa.dangky.success.title' }),
	});

	return (
		<Modal
			open={open}
			onCancel={onClose}
			footer={
				<div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
					<Button 
						icon={<FilePdfOutlined />} 
						size="large" 
						title={intl.formatMessage({ id: 'kytucxa.dangky.success.exportPdf' })}
						onClick={() => handlePrint()}
					/>
					<Button 
						type="primary" 
						size="large" 
						onClick={() => {
							onClose();
							history.push('/ky-tuc-xa/lich-su');
						}}
					>
						{intl.formatMessage({ id: 'kytucxa.dangky.success.paymentNow' })}
					</Button>
				</div>
			}
			width={800}
			destroyOnClose
			title={<span style={{ fontSize: 18, fontWeight: 700 }}>{intl.formatMessage({ id: 'kytucxa.dangky.success.title' })}</span>}
		>
			<PrintTemplate ref={contentRef} title={intl.formatMessage({ id: 'kytucxa.dangky.success.title' })}>
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
							<li style={{ marginBottom: 4 }}>Date: {intl.formatMessage({ id: 'kytucxa.dangky.success.checkin.date' })}</li>
							<li style={{ marginBottom: 4 }}>Location: {numBedLabel}</li>
							<li style={{ marginBottom: 4 }}>Hours: {intl.formatMessage({ id: 'kytucxa.dangky.success.checkin.hours' })}</li>
							<li style={{ marginBottom: 4 }}>Contact: {intl.formatMessage({ id: 'kytucxa.dangky.success.checkin.contact' })}</li>
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
			</PrintTemplate>
		</Modal>
	);
};

export default ModalSuccessRegistration;
