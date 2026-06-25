import { Button, Modal } from 'antd';
import { useIntl, history, useModel } from 'umi';
import { FilePdfOutlined } from '@ant-design/icons';
import { KyTucXa } from '@/services/KyTucXa/typings';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import PrintTemplate from '@/components/PrintTemplate';
import CheckinPrepContent from './CheckinPrepContent';

const ModalSuccessRegistration = ({ open, onClose, phong }: { open: boolean, onClose: () => void, phong?: KyTucXa.IPhong }) => {
	const intl = useIntl();
	const { record: dotDangKy } = useModel('kytucxa.dotdangky');
	const contentRef = useRef<HTMLDivElement>(null);

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

				<CheckinPrepContent phong={phong} dotDangKy={dotDangKy} />
			</PrintTemplate>
		</Modal>
	);
};

export default ModalSuccessRegistration;
