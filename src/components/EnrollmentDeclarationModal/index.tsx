import { getTinhThanhPho } from '@/services/Core/DonViHanhChinh';
import type { DonViHanhChinh } from '@/services/Core/DonViHanhChinh/typing';
import { getTinhTpTruongThpt } from '@/services/Core/TruongThpt';
import { getManyLoaiKhuyetTat } from '@/services/DaoTao/LoaiKhuyetTat';
import { putNhapHocStep1, putNhapHocStep2, putNhapHocStep3 } from '@/services/DaoTao/SinhVien';
import type { SinhVien } from '@/services/DaoTao/SinhVien/typings';
import { Avatar, Button, Form, Modal, message } from 'antd';
import { CheckOutlined, CloseOutlined, ClockCircleOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import AcademicInformationStep from './AcademicInformationStep';
import { buildStep1InitialValues } from './buildStep1InitialValues';
import { buildStep1Payload } from './buildStep1Payload';
import { buildStep2Payload } from './buildStep2Payload';
import { buildStep3Payload } from './buildStep3Payload';
import GuardianConsentsStep from './GuardianConsentsStep';
import styles from './index.less';
import PersonalInformationStep from './PersonalInformationStep';

const STEP_TITLES = [
	'Personal Information',
	'Academic Information',
	'Guardian & Consents',
	'Additional Services',
	'Payment Information',
];

const getStudentName = (sinhVien?: SinhVien.IRecord) =>
	sinhVien?.ten || [sinhVien?.firstName, sinhVien?.lastName].filter(Boolean).join(' ');

const getProgram = (sinhVien?: SinhVien.IRecord) =>
	sinhVien?.chuyenNganh?.ten || sinhVien?.nganh?.tenTiengAnh || sinhVien?.nganh?.ten;

type EnrollmentDeclarationModalProps = {
	open: boolean;
	onClose: () => void;
};

const EnrollmentDeclarationModal = ({ open, onClose }: EnrollmentDeclarationModalProps) => {
	const { record: recSinhVien, getThongTinCuaToiModel } = useModel('sinhvien.sinhvien');
	const [form] = Form.useForm();
	const [currentStep, setCurrentStep] = useState(0);
	const [listTinh, setListTinh] = useState<DonViHanhChinh.IRecord[]>();
	const [listTinhTruongThpt, setListTinhTruongThpt] = useState<TruongThpt.ITinhTP[]>();
	const [listLoaiKhuyetTat, setListLoaiKhuyetTat] = useState<LoaiKhuyetTat.IRecord[]>();
	const [submitting, setSubmitting] = useState(false);
	const resumedRef = useRef(false);

	useEffect(() => {
		if (!open) return;
		getTinhThanhPho().then((data) => setListTinh(data.data.data));
		getTinhTpTruongThpt().then((data) => setListTinhTruongThpt(data.data.data));
		getManyLoaiKhuyetTat().then((data) => setListLoaiKhuyetTat(data.data.data));
	}, [open]);

	// Khôi phục dữ liệu đã lưu (nếu có) và tiếp tục ở bước dở dang khi mở lại modal.
	useEffect(() => {
		if (!open) {
			resumedRef.current = false;
			return;
		}
		if (resumedRef.current || !recSinhVien) return;
		resumedRef.current = true;
		form.setFieldsValue(buildStep1InitialValues(recSinhVien));
		setCurrentStep(Math.max((recSinhVien.enrollmentStep ?? 1) - 1, 0));
	}, [open, recSinhVien]);

	const lastStep = STEP_TITLES.length - 1;

	const handleNext = async () => {
		if (currentStep > 2) {
			setCurrentStep((step) => Math.min(step + 1, lastStep));
			return;
		}

		let values: Record<string, any>;
		try {
			values = await form.validateFields();
		} catch (error) {
			console.error(error);
			return;
		}

		try {
			setSubmitting(true);
			if (currentStep === 0) {
				const documentRows = recSinhVien?.dotNhapHoc?.danhSachGiayToNhapHoc ?? [];
				const payload = await buildStep1Payload(values, documentRows);
				await putNhapHocStep1(payload);
			} else if (currentStep === 1) {
				const payload = await buildStep2Payload(values);
				await putNhapHocStep2(payload);
			} else {
				const payload = buildStep3Payload(values);
				await putNhapHocStep3(payload);
			}
			message.success('Your information has been saved successfully.');
			getThongTinCuaToiModel().catch(console.error);
			setCurrentStep((step) => Math.min(step + 1, lastStep));
		} catch (error) {
			console.error(error);
		} finally {
			setSubmitting(false);
		}
	};

	const handlePrevious = () => setCurrentStep((step) => Math.max(step - 1, 0));

	return (
		<Modal
			open={open}
			onCancel={onClose}
			closable={false}
			footer={null}
			width={1400}
			centered
			className={styles.declarationModal}
		>
			<div className={styles.shell}>
				<div className={styles.header}>
					<h1 className={styles.title}>Enrollment Profile Declaration</h1>
					<Button type='text' icon={<CloseOutlined />} className={styles.closeButton} onClick={onClose} />
				</div>

				<div className={styles.body}>
					<div className={styles.sidebar}>
						<div className={styles.studentCard}>
							<Avatar size={80} icon={<UserOutlined />} src={recSinhVien?.anhDaiDienUrl} className={styles.avatar} />
							<div className={styles.studentName}>{getStudentName(recSinhVien)}</div>

							<div className={styles.studentInfoRow}>
								<span>Student ID</span>
								<span className={styles.studentInfoValue}>{recSinhVien?.ma}</span>
							</div>
							<div className={styles.studentInfoRow}>
								<span>Program</span>
								<span className={styles.studentInfoValue}>{getProgram(recSinhVien)}</span>
							</div>
							<div className={styles.studentInfoRow}>
								<span>Status</span>
								<span className={styles.statusAdmitted}>{recSinhVien?.enrollmentStatus}</span>
							</div>
						</div>

						<div className={styles.sidebarSpacer} />

						<div className={styles.contactBox}>
							<div className={styles.contactTitle}>Contact</div>
							<div className={styles.contactOffice}>The Registrar&apos;s Office</div>
							<div className={styles.contactLine}>
								<PhoneOutlined />
								<span>+84-2471 089 779 (ext. 9004)</span>
							</div>
							<div className={styles.contactLine}>
								<MailOutlined />
								<span>registrar@vinuni.edu.vn</span>
							</div>
							<div className={styles.contactLine}>
								<ClockCircleOutlined />
								<span>
									Monday – Friday:
									<br />
									Morning: 8.30AM - 12.30PM
									<br />
									Afternoon: 1.30PM - 5.30PM
								</span>
							</div>
						</div>
					</div>

					<div className={styles.main}>
						<div className={styles.stepper}>
							{STEP_TITLES.map((title, index) => {
								const isDone = index <= currentStep;
								return (
									<div onClick={() => { setCurrentStep(index) }} key={title} className={`${styles.stepperItem} ${isDone ? styles.completed : ''}`}>
										<div className={`${styles.stepperCircle} ${isDone ? styles.active : ''}`}>
											{isDone ? <CheckOutlined /> : index + 1}
										</div>
										<div className={`${styles.stepperLabel} ${isDone ? styles.active : ''}`}>{title}</div>
									</div>
								);
							})}
						</div>

						<div className={styles.content}>
							<Form form={form} layout='vertical' preserve>
								{currentStep === 0 && (
									<PersonalInformationStep form={form} listTinh={listTinh} listLoaiKhuyetTat={listLoaiKhuyetTat} />
								)}
								{currentStep === 1 && <AcademicInformationStep form={form} listTinhTruongThpt={listTinhTruongThpt} />}
								{currentStep === 2 && <GuardianConsentsStep form={form} listTinh={listTinh} />}
							</Form>
						</div>

						<div className={styles.footer}>
							{currentStep > 0 && <Button onClick={handlePrevious}>PREVIOUS</Button>}
							<Button type='primary' className={styles.nextButton} loading={submitting} onClick={handleNext}>
								NEXT STEP
							</Button>
						</div>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default EnrollmentDeclarationModal;
