import { getTransactionMePage } from '@/services/TaiChinh/KenhThanhToan';
import { inputFormat } from '@/utils/utils';
import { Button, Image, message } from 'antd';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useIntl } from 'umi';
import type { IPaymentCollect } from './typing';

interface PaymentCollectViewProps {
	data: IPaymentCollect;
	transactionIdentityCodes: string[];
	onExpired: () => void;
	onSuccess: () => void;
}

type ViewStatus = 'pending' | 'success' | 'expired';

const getQrSrc = (qrImage: string) => {
	if (qrImage.startsWith('data:image/')) return qrImage;
	return `data:image/png;base64,${qrImage}`;
};

const PaymentCollectView: React.FC<PaymentCollectViewProps> = ({
	data,
	transactionIdentityCodes,
	onExpired,
	onSuccess,
}) => {
	const intl = useIntl();
	const [timeLeft, setTimeLeft] = useState<number>(0);
	const [viewStatus, setViewStatus] = useState<ViewStatus>('pending');
	const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const expiredTime = useMemo(() => new Date(data.expiredAt).getTime(), [data.expiredAt]);

	// --- Countdown timer ---
	useEffect(() => {
		const timer = setInterval(() => {
			const now = Date.now();
			const remaining = Math.max(0, Math.floor((expiredTime - now) / 1000));
			setTimeLeft(remaining);
			if (remaining <= 0) {
				clearInterval(timer);
				setViewStatus('expired');
			}
		}, 1000);

		return () => clearInterval(timer);
	}, [expiredTime]);

	// --- Polling transaction status ---
	useEffect(() => {
		if (viewStatus !== 'pending') return;

		pollingRef.current = setInterval(async () => {
			try {
				if (Date.now() >= expiredTime) {
					setViewStatus('expired');
					if (pollingRef.current) clearInterval(pollingRef.current);
					return;
				}

				const res = await getTransactionMePage();
				const transactions: any[] = res?.data?.data ?? [];
				if (Array.isArray(transactions) && transactionIdentityCodes.length > 0) {
				const hasSuccess = transactions.some(
					(t: any) =>
						t.status === 'success' &&
						transactionIdentityCodes.includes(t.identityCode ?? t.billIdentityCode ?? ''),
				);
					if (hasSuccess) {
						setViewStatus('success');
						if (pollingRef.current) clearInterval(pollingRef.current);
					}
				}
			} catch {
				// silent fail — tiếp tục polling
			}
		}, 4000);

		return () => {
			if (pollingRef.current) clearInterval(pollingRef.current);
		};
	}, [viewStatus, expiredTime, transactionIdentityCodes]);

	// --- Callbacks ---
	useEffect(() => {
		if (viewStatus === 'success') {
			onSuccess();
		}
	}, [viewStatus, onSuccess]);

	const handleCancel = useCallback(() => {
		if (pollingRef.current) clearInterval(pollingRef.current);
		onExpired();
	}, [onExpired]);

	const handleRetry = useCallback(() => {
		if (pollingRef.current) clearInterval(pollingRef.current);
		onExpired();
	}, [onExpired]);

	const handleCopyAccount = useCallback(() => {
		navigator.clipboard.writeText(data.accountNumber ?? '');
		message.success(intl.formatMessage({ id: 'taichinh.thanhtoan.paycollect.copied' }));
	}, [data.accountNumber, intl]);

	const formatTime = (seconds: number) => {
		const m = Math.floor(seconds / 60);
		const s = seconds % 60;
		return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
	};

	// Expired view
	if (viewStatus === 'expired') {
		return (
			<div className='payment-collect-view'>
				<div className='payment-collect-view__expired'>
					<div className='payment-collect-view__expired-icon'>❌</div>
					<div className='payment-collect-view__expired-title'>
						{intl.formatMessage({ id: 'taichinh.thanhtoan.paycollect.expired.title' })}
					</div>
					<div className='payment-collect-view__expired-desc'>
						{intl.formatMessage({ id: 'taichinh.thanhtoan.paycollect.expired.desc' })}
					</div>
					<Button type='primary' size='large' onClick={handleRetry} style={{ marginTop: 16 }}>
						{intl.formatMessage({ id: 'taichinh.thanhtoan.paycollect.retry' })}
					</Button>
				</div>
			</div>
		);
	}

	// Success view
	if (viewStatus === 'success') {
		return (
			<div className='payment-collect-view'>
				<div className='payment-collect-view__success'>
					<div className='payment-collect-view__success-icon'>✅</div>
					<div className='payment-collect-view__success-title'>
						{intl.formatMessage({ id: 'taichinh.thanhtoan.paycollect.success.title' })}
					</div>
				</div>
			</div>
		);
	}

	// Pending view — hiển thị QR + thông tin
	return (
		<div className='payment-collect-view'>
			<div className='payment-collect-view__header'>
				{intl.formatMessage({ id: 'taichinh.thanhtoan.paycollect.title' })}
			</div>

			<div className='payment-collect-view__qr'>
				<Image
					src={getQrSrc(data.qrImage)}
					width={220}
					height={220}
					preview={false}
					style={{ borderRadius: 8 }}
					alt='QR thanh toán'
				/>
			</div>

			<div className='payment-collect-view__hint'>
				{intl.formatMessage({ id: 'taichinh.thanhtoan.paycollect.hint' })}
			</div>

			<div className='payment-collect-view__info'>
				<div className='payment-collect-view__info-row'>
					<span className='payment-collect-view__info-label'>
						{intl.formatMessage({ id: 'taichinh.thanhtoan.paycollect.bankName' })}
					</span>
					<span className='payment-collect-view__info-value'>{data.bankName}</span>
				</div>

				<div className='payment-collect-view__info-row'>
					<span className='payment-collect-view__info-label'>
						{intl.formatMessage({ id: 'taichinh.thanhtoan.paycollect.accountNumber' })}
					</span>
					<span className='payment-collect-view__info-value payment-collect-view__info-value--copyable'>
						{data.accountNumber}
						<Button type='link' size='small' onClick={handleCopyAccount} style={{ padding: '0 4px', marginLeft: 8 }}>
							📋
						</Button>
					</span>
				</div>

				<div className='payment-collect-view__info-row'>
					<span className='payment-collect-view__info-label'>
						{intl.formatMessage({ id: 'taichinh.thanhtoan.paycollect.amount' })}
					</span>
					<span className='payment-collect-view__info-value payment-collect-view__info-value--amount'>
						{inputFormat(data.totalAmount)}₫
					</span>
				</div>

				<div className='payment-collect-view__info-row'>
					<span className='payment-collect-view__info-label'>
						{intl.formatMessage({ id: 'taichinh.thanhtoan.paycollect.reference' })}
					</span>
					<span className='payment-collect-view__info-value'>{data.invoiceReference}</span>
				</div>
			</div>

			<div className='payment-collect-view__timer'>
				<span className='payment-collect-view__timer-icon'>⏱</span>
				<span className={`payment-collect-view__timer-value ${timeLeft <= 120 ? 'payment-collect-view__timer-value--urgent' : ''}`}>
					{formatTime(timeLeft)}
				</span>
			</div>

			<div className='payment-collect-view__status'>
				<span className='payment-collect-view__status-dot' />
				{intl.formatMessage({ id: 'taichinh.thanhtoan.paycollect.pending' })}
			</div>

			<div className='payment-collect-view__footer'>
				<Button block size='large' onClick={handleCancel}>
					{intl.formatMessage({ id: 'taichinh.thanhtoan.paycollect.cancel' })}
				</Button>
			</div>
		</div>
	);
};

export default PaymentCollectView;