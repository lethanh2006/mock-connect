import { submitIdp } from '@/services/Idp';
import {
	IDP_PART_A_FIELDS,
	IDP_PART_A_MAX_LENGTH,
	IDP_PART_B_FIELDS,
	IDP_PART_B_MAX_LENGTH,
	IDP_STATUS_LABEL_KEY,
	IdpStatus,
} from '@/services/Idp/constant';
import { Idp } from '@/services/Idp/typing';
import rules from '@/utils/rules';
import { chuanHoaObject } from '@/utils/utils';
import { CheckOutlined } from '@ant-design/icons';
import { Alert, Button, Col, Descriptions, Form, Input, message, Modal, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import ActionPlanTable from './ActionPlanTable';
import IdpDetailView from './IdpDetailView';
import styles from './IdpForm.less';
import SectionHeader from './SectionHeader';

const { TextArea } = Input;

const STEP_TITLE_KEYS = [
	'idp.form.step.partA',
	'idp.form.step.partB',
	'idp.form.step.actionPlan',
	'idp.form.step.review',
];
const LAST_STEP = STEP_TITLE_KEYS.length - 1;

const buildPayload = (values: Idp.IFormRequest): Idp.IFormRequest => {
	const trimText = (s?: string) => (s ?? '').trim();
	return {
		whatILove: trimText(values.whatILove),
		whatIAmGoodAt: trimText(values.whatIAmGoodAt),
		whatTheWorldNeeds: trimText(values.whatTheWorldNeeds),
		whatICanBePaidFor: trimText(values.whatICanBePaidFor),
		shortTermGoals: trimText(values.shortTermGoals),
		longTermGoals: trimText(values.longTermGoals),
		strengths: trimText(values.strengths),
		areasForImprovement: trimText(values.areasForImprovement),
		actionPlan: values.actionPlan,
	};
};

const buildInitialValues = (content?: Idp.IFormRequest): Partial<Idp.IFormRequest> => ({
	whatILove: content?.whatILove ?? '',
	whatIAmGoodAt: content?.whatIAmGoodAt ?? '',
	whatTheWorldNeeds: content?.whatTheWorldNeeds ?? '',
	whatICanBePaidFor: content?.whatICanBePaidFor ?? '',
	shortTermGoals: content?.shortTermGoals ?? '',
	longTermGoals: content?.longTermGoals ?? '',
	strengths: content?.strengths ?? '',
	areasForImprovement: content?.areasForImprovement ?? '',
	actionPlan: content?.actionPlan?.length
		? content.actionPlan
		: [{ action: '', smartOutcome: '', timelineAndSupport: '', progressCheckpoint: null }],
});

type IdpFormProps = {
	onSuccess?: () => void;
	facultyAdvisorName?: string;
};

const IdpForm: React.FC<IdpFormProps> = ({ onSuccess, facultyAdvisorName }) => {
	const intl = useIntl();
	const [form] = Form.useForm<Idp.IFormRequest>();
	const { record, setVisibleForm, postService, putService, formSubmiting, setFormSubmiting } = useModel('idp.idp');
	const { record: sinhVien } = useModel('sinhvien.sinhvien');
	const [currentStep, setCurrentStep] = useState<number>(0);
	const [savingDraft, setSavingDraft] = useState(false);

	const isEditable = record?.status === IdpStatus.DRAFT || record?.status === IdpStatus.REVISION_REQUESTED;

	useEffect(() => {
		form.setFieldsValue(buildInitialValues(record?.content));
	}, [record, form]);

	useEffect(() => {
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			if (!form.isFieldsTouched()) return;
			e.preventDefault();
			e.returnValue = '';
		};
		window.addEventListener('beforeunload', handleBeforeUnload);

		return () => window.removeEventListener('beforeunload', handleBeforeUnload);
	}, [form]);

	const handleCancel = () => {
		if (!form.isFieldsTouched()) {
			setVisibleForm(false);
			return;
		}

		Modal.confirm({
			title: intl.formatMessage({ id: 'idp.form.leave.title' }),
			content: intl.formatMessage({ id: 'idp.form.leave.content' }),
			okText: intl.formatMessage({ id: 'idp.form.leave.ok' }),
			cancelText: intl.formatMessage({ id: 'idp.form.leave.cancel' }),
			onOk: () => setVisibleForm(false),
		});
	};

	const handleNext = async () => {
		try {
			if (currentStep === 0) await form.validateFields(IDP_PART_A_FIELDS);
			else if (currentStep === 1) await form.validateFields(IDP_PART_B_FIELDS);
			else if (currentStep === 2) {
				const actionPlan: Idp.IFormRequest['actionPlan'] = form.getFieldValue('actionPlan') ?? [];
				await form.validateFields(
					actionPlan.flatMap((_, index) => [
						['actionPlan', index, 'action'],
						['actionPlan', index, 'smartOutcome'],
						['actionPlan', index, 'timelineAndSupport'],
					]),
				);
			}
		} catch {
			return;
		}
		setCurrentStep((step) => Math.min(step + 1, LAST_STEP));
	};

	const handlePrevious = () => {
		setCurrentStep((step) => Math.max(step - 1, 0));
	};

	const saveContent = async (values: Idp.IFormRequest) => {
		const payload = buildPayload(values);
		return isEditable ? putService(record!._id, chuanHoaObject(payload)) : postService(chuanHoaObject(payload));
	};

	const handleSaveDraft = async () => {
		setSavingDraft(true);
		try {
			await saveContent(form.getFieldsValue(true));
			message.success(intl.formatMessage({ id: 'idp.form.saveDraftSuccess' }));
			setVisibleForm(false);
			onSuccess?.();
		} finally {
			setSavingDraft(false);
		}
	};

	const handleSubmit = (values: Idp.IFormRequest) => {
		Modal.confirm({
			title: intl.formatMessage({ id: 'idp.form.confirm.title' }),
			content: intl.formatMessage({ id: 'idp.form.confirm.content' }),
			okText: intl.formatMessage({ id: 'idp.form.confirm.ok' }),
			cancelText: intl.formatMessage({ id: 'idp.form.confirm.cancel' }),
			onOk: async () => {
				setFormSubmiting(true);
				try {
					const res = await saveContent(values);
					// BE trả id dưới key `_id`, có lúc lại không bọc `data` — dự phòng cả 2 dạng.
					const idpId: string | undefined = res.data?.data?._id ?? res.data?._id;
					if (!idpId) {
						message.error(intl.formatMessage({ id: 'idp.form.submitIdMissingError' }));
						return;
					}
					await submitIdp(idpId);
					message.success(intl.formatMessage({ id: 'idp.form.submitSuccess' }));
					setVisibleForm(false);
					onSuccess?.();
				} finally {
					setFormSubmiting(false);
				}
			},
		});
	};

	const showReviewAlert = record?.status === IdpStatus.REJECTED || record?.status === IdpStatus.REVISION_REQUESTED;

	const reviewValues: Idp.IFormRequest =
		currentStep === LAST_STEP ? form.getFieldsValue(true) : ({} as Idp.IFormRequest);

	return (
		<Form form={form} layout='vertical' onFinish={handleSubmit}>
			{showReviewAlert && record?.reviewComment && (
				<Alert
					style={{ marginBottom: 16 }}
					type='warning'
					showIcon
					message={intl.formatMessage(
						{ id: 'idp.form.reviewAlert' },
						{ status: intl.formatMessage({ id: IDP_STATUS_LABEL_KEY[record.status] }) },
					)}
					description={record.reviewComment}
				/>
			)}

			<div className={styles.container}>
				<div className={styles.stepper}>
					{STEP_TITLE_KEYS.map((titleKey, index) => {
						const isDone = index <= currentStep;
						// Chỉ cho nhảy lùi (tiến phải qua nút Tiếp theo để còn validate).
						const canJump = index < currentStep;
						return (
							<div
								key={titleKey}
								className={`${styles.stepperItem} ${isDone ? styles.completed : ''}`}
								style={canJump ? undefined : { cursor: 'default' }}
								onClick={() => canJump && setCurrentStep(index)}
							>
								<div className={`${styles.stepperCircle} ${isDone ? styles.active : ''}`}>
									{isDone ? <CheckOutlined /> : index + 1}
								</div>
								<div className={`${styles.stepperLabel} ${isDone ? styles.active : ''}`}>
									{intl.formatMessage({ id: titleKey })}
								</div>
							</div>
						);
					})}
				</div>

				{/* Step 1 — PART A */}
				<div style={{ display: currentStep === 0 ? 'block' : 'none' }}>
					<SectionHeader>{intl.formatMessage({ id: 'idp.form.section.studentInfo' })}</SectionHeader>
					<Descriptions
						bordered
						column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
						size='small'
						style={{ marginBottom: 24 }}
					>
						<Descriptions.Item label={intl.formatMessage({ id: 'idp.detail.studentName' })}>
							{sinhVien?.ten ?? '—'}
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'idp.detail.studentId' })}>
							{sinhVien?.ma ?? '—'}
						</Descriptions.Item>
						<Descriptions.Item label={intl.formatMessage({ id: 'idp.detail.program' })} span={2}>
							{sinhVien?.nganh?.ten ?? '—'}
						</Descriptions.Item>
					</Descriptions>

					<SectionHeader>{intl.formatMessage({ id: 'idp.form.step.partA' })}</SectionHeader>
					<Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
						<Col xs={24} md={12}>
							<Form.Item
								label={intl.formatMessage({ id: 'idp.form.label.whatILove' })}
								name='whatILove'
								rules={[...rules.required, ...rules.text, ...rules.length(IDP_PART_A_MAX_LENGTH)]}
							>
								<TextArea autoSize={{ minRows: 3, maxRows: 6 }} maxLength={IDP_PART_A_MAX_LENGTH} showCount />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item
								label={intl.formatMessage({ id: 'idp.form.label.whatIAmGoodAt' })}
								name='whatIAmGoodAt'
								rules={[...rules.required, ...rules.text, ...rules.length(IDP_PART_A_MAX_LENGTH)]}
							>
								<TextArea autoSize={{ minRows: 3, maxRows: 6 }} maxLength={IDP_PART_A_MAX_LENGTH} showCount />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item
								label={intl.formatMessage({ id: 'idp.form.label.whatTheWorldNeeds' })}
								name='whatTheWorldNeeds'
								rules={[...rules.required, ...rules.text, ...rules.length(IDP_PART_A_MAX_LENGTH)]}
							>
								<TextArea autoSize={{ minRows: 3, maxRows: 6 }} maxLength={IDP_PART_A_MAX_LENGTH} showCount />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item
								label={intl.formatMessage({ id: 'idp.form.label.whatICanBePaidFor' })}
								name='whatICanBePaidFor'
								rules={[...rules.required, ...rules.text, ...rules.length(IDP_PART_A_MAX_LENGTH)]}
							>
								<TextArea autoSize={{ minRows: 3, maxRows: 6 }} maxLength={IDP_PART_A_MAX_LENGTH} showCount />
							</Form.Item>
						</Col>
					</Row>
				</div>

				{/* Step 2 — PART B */}
				<div style={{ display: currentStep === 1 ? 'block' : 'none' }}>
					<SectionHeader>{intl.formatMessage({ id: 'idp.form.step.partB' })}</SectionHeader>
					<Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
						<Col xs={24} md={12}>
							<Form.Item
								label={intl.formatMessage({ id: 'idp.form.label.shortTermGoals' })}
								name='shortTermGoals'
								rules={[...rules.required, ...rules.text, ...rules.length(IDP_PART_B_MAX_LENGTH)]}
							>
								<TextArea autoSize={{ minRows: 3, maxRows: 6 }} maxLength={IDP_PART_B_MAX_LENGTH} showCount />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item
								label={intl.formatMessage({ id: 'idp.form.label.longTermGoals' })}
								name='longTermGoals'
								rules={[...rules.required, ...rules.text, ...rules.length(IDP_PART_B_MAX_LENGTH)]}
							>
								<TextArea autoSize={{ minRows: 3, maxRows: 6 }} maxLength={IDP_PART_B_MAX_LENGTH} showCount />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item
								label={intl.formatMessage({ id: 'idp.form.label.strengths' })}
								name='strengths'
								rules={[...rules.required, ...rules.text, ...rules.length(IDP_PART_B_MAX_LENGTH)]}
							>
								<TextArea autoSize={{ minRows: 3, maxRows: 6 }} maxLength={IDP_PART_B_MAX_LENGTH} showCount />
							</Form.Item>
						</Col>
						<Col xs={24} md={12}>
							<Form.Item
								label={intl.formatMessage({ id: 'idp.form.label.areasForImprovement' })}
								name='areasForImprovement'
								rules={[...rules.required, ...rules.text, ...rules.length(IDP_PART_B_MAX_LENGTH)]}
							>
								<TextArea autoSize={{ minRows: 3, maxRows: 6 }} maxLength={IDP_PART_B_MAX_LENGTH} showCount />
							</Form.Item>
						</Col>
					</Row>
				</div>

				{/* Step 3 — MY ACTION PLAN (SMART) */}
				<div style={{ display: currentStep === 2 ? 'block' : 'none' }}>
					<SectionHeader>{intl.formatMessage({ id: 'idp.form.step.actionPlan' })}</SectionHeader>
					<div style={{ marginBottom: 24 }}>
						<ActionPlanTable />
					</div>
				</div>

				{/* Step 4 — Endorsement & Review: xem lại toàn bộ nội dung theo bố cục canvas bản in */}
				<div style={{ display: currentStep === LAST_STEP ? 'block' : 'none' }}>
					<IdpDetailView
						content={reviewValues}
						studentName={sinhVien?.ten}
						studentCode={sinhVien?.ma}
						program={sinhVien?.nganh?.ten}
						facultyAdvisorName={facultyAdvisorName}
					/>
				</div>

				<div className={styles.footer}>
					{currentStep > 0 && (
						<Button className={`${styles.prevButton} ${styles.backButton}`} onClick={handlePrevious}>
							{intl.formatMessage({ id: 'idp.form.button.back' })}
						</Button>
					)}
					<Button className={styles.prevButton} onClick={handleCancel}>
						{intl.formatMessage({ id: 'idp.form.button.cancel' })}
					</Button>
					{currentStep < LAST_STEP && (
						<Button type='primary' className={styles.nextButton} onClick={handleNext}>
							{intl.formatMessage({ id: 'idp.form.button.next' })}
						</Button>
					)}
					{currentStep === LAST_STEP && (
						<Button
							className={styles.prevButton}
							onClick={handleSaveDraft}
							loading={savingDraft}
							disabled={formSubmiting}
						>
							{intl.formatMessage({ id: 'idp.form.button.saveDraft' })}
						</Button>
					)}
					{currentStep === LAST_STEP && (
						<Button
							type='primary'
							className={styles.nextButton}
							htmlType='submit'
							loading={formSubmiting}
							disabled={savingDraft}
						>
							{intl.formatMessage({ id: 'idp.form.button.submit' })}
						</Button>
					)}
				</div>
			</div>
		</Form>
	);
};

export default IdpForm;
