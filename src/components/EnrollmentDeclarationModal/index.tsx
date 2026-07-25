import { getTinhThanhPho } from '@/services/Core/DonViHanhChinh';
import type { DonViHanhChinh } from '@/services/Core/DonViHanhChinh/typing';
import { getTinhTpTruongThpt } from '@/services/Core/TruongThpt';
import { getManyLoaiKhuyetTat } from '@/services/DaoTao/LoaiKhuyetTat';
import { putNhapHocStep1, putNhapHocStep2, putNhapHocStep3, putNhapHocStep4 } from '@/services/DaoTao/SinhVien';
import type { SinhVien } from '@/services/DaoTao/SinhVien/typings';
import { Avatar, Button, Form, Modal, message } from 'antd';
import { CheckOutlined, CloseOutlined, ClockCircleOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import { history, useIntl, useModel } from 'umi';
import LocaleSwitch from '@/components/RightContent/LocaleSwitch';
import AcademicInformationStep from './AcademicInformationStep';
import AdditionalServicesStep from './AdditionalServicesStep';
import { buildStep1InitialValues } from './buildStep1InitialValues';
import { buildStep1Payload } from './buildStep1Payload';
import { buildStep2InitialValues } from './buildStep2InitialValues';
import { buildStep2Payload } from './buildStep2Payload';
import { buildStep3InitialValues } from './buildStep3InitialValues';
import { buildStep3Payload } from './buildStep3Payload';
import { buildStep4InitialValues } from './buildStep4InitialValues';
import { buildStep4Payload } from './buildStep4Payload';
import GuardianConsentsStep from './GuardianConsentsStep';
import styles from './index.less';
import PaymentStep from './PaymentStep';
import PersonalInformationStep from './PersonalInformationStep';

const getStudentName = (sinhVien?: SinhVien.IRecord) =>
	sinhVien?.ten || [sinhVien?.firstName, sinhVien?.lastName].filter(Boolean).join(' ');

const getProgram = (sinhVien?: SinhVien.IRecord) =>
	sinhVien?.chuyenNganh?.ten || sinhVien?.nganh?.tenTiengAnh || sinhVien?.nganh?.ten;

type EnrollmentDeclarationModalProps = {
	open: boolean;
	onClose: () => void;
};

const EnrollmentDeclarationModal = ({ open, onClose }: EnrollmentDeclarationModalProps) => {
	const intl = useIntl();
	const { record: recSinhVien, getThongTinCuaToiModel } = useModel('sinhvien.sinhvien');
	const [form] = Form.useForm();
	const [currentStep, setCurrentStep] = useState(0);
	const [listTinh, setListTinh] = useState<DonViHanhChinh.IRecord[]>();
	const [listTinhTruongThpt, setListTinhTruongThpt] = useState<TruongThpt.ITinhTP[]>();
	const [listLoaiKhuyetTat, setListLoaiKhuyetTat] = useState<LoaiKhuyetTat.IRecord[]>();
	const [submitting, setSubmitting] = useState(false);
	const resumedRef = useRef(false);

	const stepTitles = [
		intl.formatMessage({ id: 'global.enrollmentDeclaration.stepTitle.0' }),
		intl.formatMessage({ id: 'global.enrollmentDeclaration.stepTitle.1' }),
		intl.formatMessage({ id: 'global.enrollmentDeclaration.stepTitle.2' }),
		intl.formatMessage({ id: 'global.enrollmentDeclaration.stepTitle.3' }),
		intl.formatMessage({ id: 'global.enrollmentDeclaration.stepTitle.4' }),
	];

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
		form.setFieldsValue({
			...buildStep1InitialValues(recSinhVien),
			...buildStep2InitialValues(recSinhVien),
			...buildStep3InitialValues(recSinhVien),
			...buildStep4InitialValues(recSinhVien),
		});
		setCurrentStep(Math.max((recSinhVien.enrollmentStep ?? 1) - 1, 0));
	}, [open, recSinhVien]);

	const lastStep = stepTitles.length - 1;

	const handleNext = async () => {
		if (currentStep > 3) {
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
			} else if (currentStep === 2) {
				const payload = buildStep3Payload(values);
				await putNhapHocStep3(payload);
			} else if (currentStep === 3) {
				const payload = await buildStep4Payload(values);
				await putNhapHocStep4(payload);
			}
			message.success(intl.formatMessage({ id: 'global.enrollmentDeclaration.saveSuccess' }));
			getThongTinCuaToiModel().catch(console.error);
			setCurrentStep((step) => Math.min(step + 1, lastStep));
		} catch (error) {
			console.error(error);
		} finally {
			setSubmitting(false);
		}
	};

	const handlePrevious = () => setCurrentStep((step) => Math.max(step - 1, 0));

	const handleGoToPayment = () => {
		onClose();
		history.push('/finance/tuition-billing');
	};

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
					<h1 className={styles.title}>
						{intl.formatMessage({ id: 'global.enrollmentDeclaration.title' })}
					</h1>
					<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
						<LocaleSwitch />
						<Button type='text' icon={<CloseOutlined />} className={styles.closeButton} onClick={onClose} />
					</div>
				</div>

				<div className={styles.body}>
					<div className={styles.sidebar}>
						<div className={styles.studentCard}>
							<Avatar size={80} icon={<UserOutlined />} src={recSinhVien?.anhDaiDienUrl} className={styles.avatar} />
							<div className={styles.studentName}>{getStudentName(recSinhVien)}</div>

							<div className={styles.studentInfoRow}>
								<span>{intl.formatMessage({ id: 'global.enrollmentDeclaration.studentId' })}</span>
								<span className={styles.studentInfoValue}>{recSinhVien?.ma}</span>
							</div>
							<div className={styles.studentInfoRow}>
								<span>{intl.formatMessage({ id: 'global.enrollmentDeclaration.program' })}</span>
								<span style={{ textAlign: 'right' }} className={styles.studentInfoValue}>{getProgram(recSinhVien)}</span>
							</div>
							<div className={styles.studentInfoRow}>
								<span>{intl.formatMessage({ id: 'global.enrollmentDeclaration.status' })}</span>
								<span className={styles.statusAdmitted}>{recSinhVien?.enrollmentStatus}</span>
							</div>
						</div>

						<div className={styles.sidebarSpacer} />

						<div className={styles.contactBox}>
							<div className={styles.contactTitle}>
								{intl.formatMessage({ id: 'global.enrollmentDeclaration.contact' })}
							</div>
							<div className={styles.contactOffice}>
								{intl.formatMessage({ id: 'global.enrollmentDeclaration.contactOffice' })}
							</div>
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
									{intl.formatMessage({ id: 'global.enrollmentDeclaration.contactHoursLine1' })}
									<br />
									{intl.formatMessage({ id: 'global.enrollmentDeclaration.contactHoursLine2' })}
									<br />
									{intl.formatMessage({ id: 'global.enrollmentDeclaration.contactHoursLine3' })}
								</span>
							</div>
						</div>
					</div>

					<div className={styles.main}>
						<div className={styles.stepper}>
							{stepTitles.map((title, index) => {
								const isDone = index <= currentStep;
								return (
									<div onClick={() => {
										setCurrentStep(index)
									}} key={title} className={`${styles.stepperItem} ${isDone ? styles.completed : ''}`}>
										<div className={`${styles.stepperCircle} ${isDone ? styles.active : ''}`}>
											{isDone ? <CheckOutlined /> : index + 1}
										</div>
										<div className={`${styles.stepperLabel} ${isDone ? styles.active : ''}`}>{title}</div>
									</div>
								);
							})}
						</div>

						<div className={styles.content}>
							{currentStep === lastStep ? (
								<PaymentStep onGoToPayment={handleGoToPayment} />
							) : (
								<Form form={form} layout='vertical' preserve>
									{currentStep === 0 && (
										<PersonalInformationStep form={form} listTinh={listTinh} listLoaiKhuyetTat={listLoaiKhuyetTat} />
									)}
									{currentStep === 1 && <AcademicInformationStep form={form} listTinhTruongThpt={listTinhTruongThpt} />}
									{currentStep === 2 && <GuardianConsentsStep form={form} listTinh={listTinh} />}
									{currentStep === 3 && <AdditionalServicesStep form={form} />}
								</Form>
							)}
						</div>

						{currentStep !== lastStep && (
							<div className={styles.footer}>
								{currentStep > 0 && (
									<Button className={styles.prevButton} onClick={handlePrevious}>
										{intl.formatMessage({ id: 'global.enrollmentDeclaration.previous' })}
									</Button>
								)}
								<Button type='primary' className={styles.nextButton} loading={submitting} onClick={handleNext}>
									{intl.formatMessage({ id: 'global.enrollmentDeclaration.nextStep' })}
								</Button>
							</div>
						)}
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default EnrollmentDeclarationModal;
