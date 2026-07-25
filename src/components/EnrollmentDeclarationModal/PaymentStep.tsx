import { CheckCircleFilled, DollarCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useIntl } from 'umi';
import styles from './index.less';

type PaymentStepProps = {
	onGoToPayment: () => void;
};

const PaymentStep = ({ onGoToPayment }: PaymentStepProps) => {
	const intl = useIntl();

	return (
		<div className={styles.paymentStep}>
			<CheckCircleFilled className={styles.paymentSuccessIcon} />
			<h2 className={styles.paymentTitle}>
				{intl.formatMessage({ id: 'global.enrollmentDeclaration.payment.title' })}
			</h2>
			<p className={styles.paymentDesc}>
				{intl.formatMessage(
					{ id: 'global.enrollmentDeclaration.payment.description' },
					{
						here: (
							<span
								role='button'
								tabIndex={0}
								className={styles.paymentHereLink}
								onClick={onGoToPayment}
								onKeyDown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') onGoToPayment();
								}}
							>
								{intl.formatMessage({ id: 'global.enrollmentDeclaration.payment.here' })}
							</span>
						),
					},
				)}
			</p>

			<Button type='primary' size='large' icon={<DollarCircleOutlined />} className={styles.paymentButton} onClick={onGoToPayment}>
				{intl.formatMessage({ id: 'global.enrollmentDeclaration.payment.goToPayment' })}
			</Button>
		</div>
	);
};

export default PaymentStep;
