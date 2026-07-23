import EnrollmentDeclarationModal from '@/components/EnrollmentDeclarationModal';
import { getPublicAssetPath } from '@/utils/path';
import { Button, Modal } from 'antd';
import { useState } from 'react';
import { useModel } from 'umi';
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
	const { record: recSinhVien } = useModel('sinhvien.sinhvien');
	const isAdmitted = recSinhVien?.enrollmentStatus === EnrollmentStatus.ADMITTED
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
				<div className={styles.content}>
					<img className={styles.logo} src={getPublicAssetPath('logo.png')} alt='VinUniversity' />
					<span className={styles.congratulations}>Chúc mừng!</span>
					<h1>
						Chào mừng bạn đến với
						<br />
						gia đình <span className={styles.brand}>VinUniversity</span>!
					</h1>
					<p className={styles.description}>
						Bạn đã chính thức trúng tuyển vào <strong>VinUniversity</strong>.
						<br />
						Đây là khởi đầu của một hành trình phi thường.
						<br />
						Chúng tôi tự hào vì có bạn đồng hành.
					</p>

					<div className={styles.divider} />
					<section className={styles.nextSteps}>
						<h2>NHỮNG VIỆC CẦN THỰC HIỆN</h2>
						<ol>
							<li>Hoàn tất xác nhận nhập học</li>
							<li>Thiết lập tài khoản gia đình</li>
							<li>Đăng ký các dịch vụ bổ sung</li>
						</ol>
					</section>

					<Button type='primary' size='large' block className={styles.startButton} onClick={handleStartEnrollment}>
						BẮT ĐẦU NHẬP HỌC
					</Button>
					<p className={styles.estimatedTime}>
						Thời gian hoàn thành dự kiến: <strong>15–20 phút</strong>
					</p>
				</div>
			</Modal>

			<EnrollmentDeclarationModal open={declarationOpen} onClose={() => setDeclarationOpen(false)} />
		</>
	);
};

export default EnrollmentPrompt;
