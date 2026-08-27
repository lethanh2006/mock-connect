import LocaleSwitch from '@/components/RightContent/LocaleSwitch';
import UploadFile from '@/components/Upload/UploadFile';
import { getTinhThanhPho } from '@/services/Core/DonViHanhChinh';
import type { DonViHanhChinh } from '@/services/Core/DonViHanhChinh/typing';
import { DANH_SACH_TINH_TP_TRUONG_THPT } from '@/services/Core/TruongThpt/tinhTp';
import type { DotNhapHoc } from '@/services/DaoTao/DotNhapHoc/typings';
import { putNhapHocStep1, putNhapHocStep2, putNhapHocStep3, putNhapHocStep4 } from '@/services/DaoTao/SinhVien';
import { EnrollmentStatus, ETrangThaiGiayToNhapHoc } from '@/services/DaoTao/SinhVien/constants';
import type { SinhVien } from '@/services/DaoTao/SinhVien/typings';
import { getMienKyTucXaMe, postMienKyTucXaMe } from '@/services/KyTucXa/MienKyTucXa';
import type { MienKyTucXa } from '@/services/KyTucXa/MienKyTucXa/typing';
import { getPublicAssetPath } from '@/utils/path';
import { CheckOutlined, CloseOutlined, InfoCircleFilled } from '@ant-design/icons';
import { Button, Form, message, Modal, Popover, Space } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { history, useIntl, useModel } from 'umi';
import AcademicInformationStep from './AcademicInformationStep';
import AdditionalServicesStep from './AdditionalServicesStep';
import { buildStep1InitialValues } from './buildStep1InitialValues';
import { buildGiayToPayload, buildStep1Payload } from './buildStep1Payload';
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

const PHOTO_REQUIREMENT_ITEMS = [
	'global.enrollmentDeclaration.photoReq.item1',
	'global.enrollmentDeclaration.photoReq.item2',
	'global.enrollmentDeclaration.photoReq.item3',
	'global.enrollmentDeclaration.photoReq.item4',
] as const;

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
	const [submitting, setSubmitting] = useState(false);
	const resumedRef = useRef(false);
	const contentRef = useRef<HTMLDivElement>(null);
	const bodyRef = useRef<HTMLDivElement>(null);
	const maNamHocRef = useRef(undefined);
<<<<<<< HEAD

	const additionalServicesComplete = Form.useWatch('additionalServicesComplete', form);
=======
	const additionalServicesComplete = Form.useWatch('additionalServicesComplete', form);

>>>>>>> bb400ee4cb8b3298361673112d8e852a3281965b
	const isDocumentsRevision =
		recSinhVien?.enrollmentStatus === EnrollmentStatus.ENROLLED &&
		!!recSinhVien?.hoSoNhapHoc?.danhSachGiayToNhapHoc?.some(
			(item) => item.trangThai === ETrangThaiGiayToNhapHoc.KHONG_DUYET,
		);

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
	}, [open]);

	// Khôi phục dữ liệu đã lưu (nếu có) và tiếp tục ở bước dở dang khi mở lại modal.
	useEffect(() => {
		if (!open) {
			resumedRef.current = false;
			return;
		}
		if (!recSinhVien) return;

		if (isDocumentsRevision) {
			setCurrentStep(0);
			if (resumedRef.current) {
				if (recSinhVien.anhDaiDienUrl) {
					const current = form.getFieldValue('anhDaiDienUrl');
					const hasLocalFile = current?.fileList?.some((file: { originFileObj?: unknown }) => file.originFileObj);
					if (!hasLocalFile) form.setFieldsValue({ anhDaiDienUrl: recSinhVien.anhDaiDienUrl });
				}
				return;
			}
		} else if (resumedRef.current) return;

		resumedRef.current = true;
		form.setFieldsValue({
			...buildStep1InitialValues(recSinhVien),
			...buildStep2InitialValues(recSinhVien),
			...buildStep3InitialValues(recSinhVien),
			...buildStep4InitialValues(recSinhVien),
		});
		if (!isDocumentsRevision) setCurrentStep(Math.max((recSinhVien.enrollmentStep ?? 1) - 1, 0));
	}, [open, recSinhVien, isDocumentsRevision]);

	useEffect(() => {
		contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
		bodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
	}, [currentStep]);

	const isAvatarRequired = !isDocumentsRevision && currentStep === 0;

	const lastStep = stepTitles.length - 1;

	const handleNext = async () => {
		if (!isDocumentsRevision && currentStep > 3) {
			setCurrentStep((step) => Math.min(step + 1, lastStep));
			return;
		}

		let values: Record<string, any>;
		try {
			values = await form.validateFields();
		} catch (error) {
			const firstName = (error as { errorFields?: { name: (string | number)[] }[] })?.errorFields?.[0]?.name;
			if (firstName) {
				form.scrollToField(firstName, { behavior: 'smooth', block: 'center' });
			}
			window.setTimeout(() => {
				const errorNode =
					bodyRef.current?.querySelector('.ant-form-item-has-error') ??
					contentRef.current?.querySelector('.ant-form-item-has-error');
				errorNode?.scrollIntoView({ behavior: 'smooth', block: 'center' });
			}, 80);
			return;
		}

		try {
			setSubmitting(true);
			const documentRows = recSinhVien?.dotNhapHoc?.danhSachGiayToNhapHoc ?? [];

			if (isDocumentsRevision) {
				const hoSoById = new Map(
					(recSinhVien?.hoSoNhapHoc?.danhSachGiayToNhapHoc ?? []).map((item) => [item.id, item]),
				);
				const documentRowsToSubmit = documentRows.filter((row: DotNhapHoc.IGiayToCanNopNhapHoc) => {
					const trangThai = (row.id ? hoSoById.get(row.id)?.trangThai : undefined) ?? row.trangThai;
					return trangThai !== ETrangThaiGiayToNhapHoc.DA_DUYET;
				});
				const payload = await buildGiayToPayload(values, documentRowsToSubmit);
				// await putNhapHocGiayTo(payload);
				// message.success(intl.formatMessage({ id: 'global.enrollmentDeclaration.saveSuccess' }));
				onClose();
				return;
			}

			if (currentStep === 0) {
				const payload = await buildStep1Payload(values, documentRows);

				await putNhapHocStep1(payload);
				if (payload.coVanDeSucKhoe && payload.urlDinhKemVanDeSucKhoe && payload.isRegisterFreeDormitory === true) {
					const donMienKtxRes: any = await getMienKyTucXaMe().catch(() => undefined);
					const donMienKtxRaw = donMienKtxRes?.data?.data ?? donMienKtxRes?.data;

					// Chỉ coi là đã có đơn khi bản ghi thật sự tồn tại (API trả envelope { data: null } khi chưa có)
					const donMienKtxData: MienKyTucXa.IRecord | undefined = donMienKtxRaw?._id ? donMienKtxRaw : undefined;

					if (!donMienKtxData) {
						const mienKtxRes = await postMienKyTucXaMe({ urlMinhChung: payload.urlDinhKemVanDeSucKhoe });
						const mienKtxData = mienKtxRes?.data?.data ?? mienKtxRes?.data ?? undefined;
						maNamHocRef.current = mienKtxData?.maNamHoc;
					}
				}
			} else if (currentStep === 1) {
				const payload = await buildStep2Payload(values);
				await putNhapHocStep2(payload);
			} else if (currentStep === 2) {
				const payload = buildStep3Payload(values);
				await putNhapHocStep3(payload);
			} else if (currentStep === 3) {
				if (!form.getFieldValue('additionalServicesComplete')) {
					message.warning(intl.formatMessage({ id: 'global.enrollmentDeclaration.additional.mustRegisterBeforeNext' }));
					return;
				}
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
			width='80vw'
			styles={{ body: { padding: '0 16px 16px' } }}
			title={
				<Space align='center' style={{ display: 'flex', justifyContent: 'space-between' }}>
					<h1 className={styles.title}>{intl.formatMessage({ id: 'global.enrollmentDeclaration.title' })}</h1>
					<Space align='center' size={12}>
						<LocaleSwitch />
						<Button type='text' icon={<CloseOutlined />} className={styles.closeButton} onClick={onClose} />
					</Space>
				</Space>
			}
		>
			<Form form={form} layout='vertical' preserve scrollToFirstError={{ behavior: 'smooth', block: 'center' }}>
				<div className={styles.shell}>
					<div className={styles.body} ref={bodyRef}>
						<div className={styles.sidebar}>
							<div className={styles.studentCard}>
								<div className={styles.avatarUploadInner}>
									<Form.Item
										name='anhDaiDienUrl'
										className={styles.avatarUpload}
										extra={
											isAvatarRequired
												? intl.formatMessage({ id: 'global.enrollmentDeclaration.avatar.hoverHint' })
												: undefined
										}
										rules={
											isAvatarRequired
												? [
														{
															required: true,
															validator: (_, value) => {
																const hasUrl = typeof value === 'string' && !!value.trim();
																const hasFileList = !!value?.fileList?.length;
																if (hasUrl || hasFileList) return Promise.resolve();
																return Promise.reject(
																	new Error(intl.formatMessage({ id: 'global.enrollmentDeclaration.avatar.required' })),
																);
															},
														},
													]
												: [{ validator: () => Promise.resolve() }]
										}
									>
										<UploadFile
											isAvatar
											isPrivate
											maxCount={1}
											hasPreviewFile
											accept='image/*'
											placeholderSrc={getPublicAssetPath('/metadata.png')}
											disabled={isDocumentsRevision || currentStep !== 0}
										/>
									</Form.Item>
									{isAvatarRequired && (
										<Popover
											placement='rightTop'
											trigger='hover'
											title={intl.formatMessage({ id: 'global.enrollmentDeclaration.photoReq.title' })}
											content={
												<ul className={styles.photoRequirementsList}>
													{PHOTO_REQUIREMENT_ITEMS.map((id) => (
														<li key={id}>{intl.formatMessage({ id })}</li>
													))}
												</ul>
											}
										>
											<InfoCircleFilled className={styles.avatarPhotoHint} />
										</Popover>
									)}
								</div>
								<div className={styles.studentName}>{getStudentName(recSinhVien)}</div>

								<div className={styles.studentMeta}>
									<div className={styles.studentMetaRow}>
										<span className={styles.studentMetaLabel}>
											{intl.formatMessage({ id: 'global.enrollmentDeclaration.studentId' })}
										</span>
										<span className={styles.studentMetaValue}>{recSinhVien?.ma || '—'}</span>
									</div>
									<div className={styles.studentMetaRow}>
										<span className={styles.studentMetaLabel}>
											{intl.formatMessage({ id: 'global.enrollmentDeclaration.program' })}
										</span>
										<span className={styles.studentMetaValue}>{getProgram(recSinhVien) || '—'}</span>
									</div>
									<div className={styles.studentMetaRow}>
										<span className={styles.studentMetaLabel}>
											{intl.formatMessage({ id: 'global.enrollmentDeclaration.status' })}
										</span>
										<span className={`${styles.studentMetaValue} ${styles.statusAdmitted}`}>
											{recSinhVien?.enrollmentStatus || '—'}
										</span>
									</div>
								</div>
							</div>
						</div>

						<div className={styles.main}>
							{!isDocumentsRevision && (
								<div className={styles.stepper}>
									{stepTitles.map((title, index) => {
										const isDone = index <= currentStep;
										return (
											<div key={title} className={`${styles.stepperItem} ${isDone ? styles.completed : ''}`}>
												<div className={`${styles.stepperCircle} ${isDone ? styles.active : ''}`}>
													{isDone ? <CheckOutlined /> : index + 1}
												</div>
												<div className={`${styles.stepperLabel} ${isDone ? styles.active : ''}`}>{title}</div>
											</div>
										);
									})}
								</div>
							)}

							<div className={styles.content} ref={contentRef}>
								{!isDocumentsRevision && currentStep === lastStep ? (
									<PaymentStep onGoToPayment={handleGoToPayment} />
								) : (
									<>
										{(isDocumentsRevision || currentStep === 0) && (
											<PersonalInformationStep form={form} listTinh={listTinh} documentsOnly={isDocumentsRevision} />
										)}
										{!isDocumentsRevision && currentStep === 1 && (
											<AcademicInformationStep form={form} listTinhTruongThpt={DANH_SACH_TINH_TP_TRUONG_THPT} />
										)}
										{!isDocumentsRevision && currentStep === 2 && (
											<GuardianConsentsStep form={form} listTinh={listTinh} />
										)}
										{!isDocumentsRevision && currentStep === 3 && (
											<AdditionalServicesStep form={form} maNamHoc={maNamHocRef.current} />
										)}
									</>
								)}
							</div>

							{(isDocumentsRevision || currentStep !== lastStep) && (
								<div className='form-footer'>
									<Button
										type='primary'
										className={styles.nextButton}
										loading={submitting}
										disabled={!isDocumentsRevision && currentStep === 3 && !additionalServicesComplete}
										onClick={handleNext}
									>
										{intl.formatMessage({
											id: isDocumentsRevision
												? 'global.enrollmentDeclaration.save'
												: 'global.enrollmentDeclaration.nextStep',
										})}
									</Button>
									{!isDocumentsRevision && currentStep > 0 && (
										<Button className={styles.prevButton} onClick={handlePrevious}>
											{intl.formatMessage({ id: 'global.enrollmentDeclaration.previous' })}
										</Button>
									)}
								</div>
							)}
						</div>
					</div>
				</div>
			</Form>
		</Modal>
	);
};

export default EnrollmentDeclarationModal;
