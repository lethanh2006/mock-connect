import EnrollmentDeclarationModal from '@/components/EnrollmentDeclarationModal';
import LocaleSwitch from '@/components/RightContent/LocaleSwitch';
import { getPublicAssetPath } from '@/utils/path';
import { Button, Modal } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import styles from './index.less';
import { EnrollmentStatus } from '@/services/DaoTao/SinhVien/constants';

type EnrollmentPromptProps = {
	onStartEnrollment?: () => void;
};

/**
 * Modal bắt buộc dành cho thí sinh đã được nhận học nhưng chưa hoàn tất nhập học.
 * `maskClosable`, `keyboard` và nút đóng đều được tắt để người dùng không thể bỏ qua.
 */
const EnrollmentPrompt = ({ onStartEnrollment }: EnrollmentPromptProps) => {
	const intl = useIntl();
	const { record: recSinhVien } = useModel('sinhvien.sinhvien');
	const isAdmitted = recSinhVien?.enrollmentStatus === EnrollmentStatus.ADMITTED;
	const [declarationOpen, setDeclarationOpen] = useState(false);

	const handleStartEnrollment = () => {
		setDeclarationOpen(true);
		onStartEnrollment?.();
	};

	return (
		<>
			<Modal
				open={isAdmitted && !declarationOpen}
				closable={false}
				maskClosable={false}
				keyboard={false}
				footer={null}
				width={430}
				centered
				className={styles.enrollmentPrompt}
			>
				<div className={styles.topBar} />
				<div className={styles.topHeader}>
					<LocaleSwitch />
				</div>
				<div className={styles.content}>
					<img className={styles.logo} src={getPublicAssetPath('logo.png')} alt='VinUniversity' />
					<span className={styles.congratulations}>
						{intl.formatMessage({ id: 'global.enrollmentPrompt.congratulations' })}
					</span>
					<h1>
						{intl.formatMessage({ id: 'global.enrollmentPrompt.welcomePrefix' })}
						<br />
						{intl.formatMessage(
							{ id: 'global.enrollmentPrompt.welcomeSuffix' },
							{ brand: <span className={styles.brand}>VinUniversity</span> },
						)}
					</h1>
					<p className={styles.description}>
						{intl.formatMessage(
							{ id: 'global.enrollmentPrompt.descriptionLine1' },
							{ brand: <strong>VinUniversity</strong> },
						)}
						<br />
						{intl.formatMessage({ id: 'global.enrollmentPrompt.descriptionLine2' })}
						<br />
						{intl.formatMessage({ id: 'global.enrollmentPrompt.descriptionLine3' })}
					</p>

					<div className={styles.divider} />
					<section className={styles.nextSteps}>
						<h2>{intl.formatMessage({ id: 'global.enrollmentPrompt.nextStepsTitle' })}</h2>
						<ol>
							<li>{intl.formatMessage({ id: 'global.enrollmentPrompt.step1' })}</li>
							<li>{intl.formatMessage({ id: 'global.enrollmentPrompt.step2' })}</li>
							<li>{intl.formatMessage({ id: 'global.enrollmentPrompt.step3' })}</li>
						</ol>
					</section>

					<Button type='primary' size='large' block className={styles.startButton} onClick={handleStartEnrollment}>
						{intl.formatMessage({ id: 'global.enrollmentPrompt.startButton' })}
					</Button>
					<p className={styles.estimatedTime}>
						{intl.formatMessage(
							{ id: 'global.enrollmentPrompt.estimatedTime' },
							{
								time: (
									<strong>
										{intl.formatMessage({ id: 'global.enrollmentPrompt.estimatedTimeValue' })}
									</strong>
								),
							},
						)}
					</p>
				</div>
			</Modal>

			<EnrollmentDeclarationModal open={declarationOpen} onClose={() => setDeclarationOpen(false)} />
		</>
	);
};

export default EnrollmentPrompt;
