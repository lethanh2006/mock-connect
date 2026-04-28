import { ELoaiPhieuDkCtdt } from '@/services/DaoTao/PhieuDkyCTDT/constant';
import { ETrangThaiDangKyChuyenNganh } from '@/services/DaoTao/DangKyChuyenNganh/constant';
import { Breadcrumb, Button, Card, Col, Form, Modal, Row, Steps } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import { history, useIntl, useLocation, useModel } from 'umi';
import AlertBanners from '../History/components/AlertBanners';
// import SidebarRequirements from './components/SidebarRequirements';
import StepBasicInfo from './components/steps/StepBasicInfo';
import StepProgramDesign from './components/steps/StepProgramDesign';
import StepReviewSubmit from './components/steps/StepReviewSubmit';
import StepSelectAdvisor from './components/steps/StepSelectAdvisor';
import PageCard from '@/components/PageCard';

const IDMPage = () => {
	const intl = useIntl();
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const loai = searchParams.get('loai') || 'minor';

	const isMinor = loai.toLowerCase() === 'minor';
	const pageTitle = intl.formatMessage({
		id: isMinor ? 'minor.build.pageTitle.minor' : 'minor.build.pageTitle.concentration',
	});
	const breadcrumbTitle = intl.formatMessage({
		id: isMinor ? 'minor.build.pageTitle.minor' : 'minor.build.pageTitle.concentration',
	});
	const backToHistoryPath = isMinor ? '/hoc-tap/khac#dang-ky-chuyen-nganh-hep' : '/hoc-tap/khac';

	const [form] = Form.useForm();
	const {
		record: phieuDangKyHienTai,
		submitPhieuDangKy,
		fetchPhieuDangKyHienTai,
		updatePhieuDangKy,
	} = useModel('sinhvien.dangkychuyennganh.dangkychuyennganh');
	const { record: dotDangKy, fetchDotDangKy } = useModel('daotao.dotdkctdt');
	const formValues = Form.useWatch([], form);
	const [currentStep, setCurrentStep] = useState(0);
	const [hasInitializedStep, setHasInitializedStep] = useState(false);
	const [formData, setFormData] = useState<any>({});
	const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
	const [isSavingDraftBeforeLeave, setIsSavingDraftBeforeLeave] = useState(false);
	const [pendingLeavePath, setPendingLeavePath] = useState<string | null>(null);
	const bypassLeaveGuardRef = useRef(false);
	const unblockRef = useRef<(() => void) | null>(null);

	useEffect(() => {
		if (!dotDangKy?._id) fetchDotDangKy(loai as 'minor' | 'concentration');
	}, [loai]);

	useEffect(() => {
		if (dotDangKy?._id) fetchPhieuDangKyHienTai(dotDangKy?._id);
	}, [dotDangKy?._id]);

	useEffect(() => {
		if (phieuDangKyHienTai && !hasInitializedStep) {
			setFormData((prev: any) => ({
				...prev,
				...phieuDangKyHienTai,
				hasDiscussedWithAdvisor:
					phieuDangKyHienTai?.hasDiscussedWithAdvisor ?? !!phieuDangKyHienTai?.hoTenCoVanHocTapPhu,
			}));

			form.setFieldsValue({
				...phieuDangKyHienTai,
				hasDiscussedWithAdvisor:
					phieuDangKyHienTai?.hasDiscussedWithAdvisor ?? !!phieuDangKyHienTai?.hoTenCoVanHocTapPhu,
			});
		}
	}, [phieuDangKyHienTai, hasInitializedStep, form]);

	console.log(phieuDangKyHienTai, 'phieuDangKyHienTai');

	const steps = [
		intl.formatMessage({ id: 'minor.build.step.basicInfo' }),
		intl.formatMessage({ id: 'minor.build.step.selectAdvisor' }),
		intl.formatMessage({ id: 'minor.build.step.programDesign' }),
		intl.formatMessage({ id: 'minor.build.step.reviewSubmit' }),
	];

	useEffect(() => {
		if (formValues) {
			setFormData((prev: any) => ({
				...prev,
				...formValues,
			}));
		}
	}, [formValues]);

	useEffect(() => {
		if (phieuDangKyHienTai && !hasInitializedStep) {
			if (phieuDangKyHienTai?.khoiHpCtList?.length && phieuDangKyHienTai?.khoiHpCtList?.length > 0) {
				setCurrentStep(3);
			} else if (phieuDangKyHienTai?.maCoVanHocTapPhu && phieuDangKyHienTai?.maCoVanHocTapPhu !== '') {
				setCurrentStep(2);
			} else if (phieuDangKyHienTai?.soDienThoai && phieuDangKyHienTai?.soDienThoai !== '') {
				setCurrentStep(1);
			}
			setHasInitializedStep(true);
		}
	}, [phieuDangKyHienTai, hasInitializedStep]);

	const shouldGuardLeaving =
		phieuDangKyHienTai?.trangThai === ETrangThaiDangKyChuyenNganh.NHAP && !!phieuDangKyHienTai?._id;
	const hasUnsavedChanges = useMemo(() => form.isFieldsTouched(true), [formValues, form]);

	const getNextPath = (nextLocation: any) => {
		if (typeof nextLocation === 'string') return nextLocation;
		const pathname = nextLocation?.pathname ?? '';
		const search = nextLocation?.search ?? '';
		const hash = nextLocation?.hash ?? '';
		return `${pathname}${search}${hash}`;
	};

	const navigateWithBypass = (nextPath: string) => {
		if (!nextPath) return;
		bypassLeaveGuardRef.current = true;
		unblockRef.current?.();
		history.push(nextPath);
	};

	const saveDraft = async (force = false) => {
		if (!phieuDangKyHienTai?._id) return;
		if (!force && !hasUnsavedChanges) return;
		const currentFormValues = form.getFieldsValue(true);

		// Fallback logic for draft naming
		const tenChuongTrinh =
			currentFormValues.tenChuongTrinh ||
			intl.formatMessage({
				id: isMinor ? 'minor.idm.fallback.title.minor' : 'minor.idm.fallback.title.concentration',
			});
		const mucTieuLyDo = currentFormValues.mucTieuLyDo || intl.formatMessage({ id: 'minor.idm.fallback.rationale' });

		await updatePhieuDangKy(phieuDangKyHienTai._id, {
			...currentFormValues,
			tenChuongTrinh,
			mucTieuLyDo,
			loai: ELoaiPhieuDkCtdt.PERSONAL,
		});
	};

	const handleSaveDraft = async () => {
		await saveDraft(true);
		setIsLeaveModalOpen(false);
		setPendingLeavePath(null);
		navigateWithBypass(backToHistoryPath);
	};

	useEffect(() => {
		if (!shouldGuardLeaving) return;

		const handleBeforeUnload = (event: BeforeUnloadEvent) => {
			if (!hasUnsavedChanges || bypassLeaveGuardRef.current) return;
			event.preventDefault();
			event.returnValue = '';
		};

		window.addEventListener('beforeunload', handleBeforeUnload);
		return () => window.removeEventListener('beforeunload', handleBeforeUnload);
	}, [shouldGuardLeaving, hasUnsavedChanges]);

	useEffect(() => {
		if (!shouldGuardLeaving) return;

		const unblock = history.block((nextLocation: any) => {
			if (bypassLeaveGuardRef.current || !hasUnsavedChanges) return true;
			const nextPath = getNextPath(nextLocation);
			if (!nextPath) return true;
			setPendingLeavePath(nextPath);
			setIsLeaveModalOpen(true);
			return false;
		});

		unblockRef.current = unblock;
		return () => {
			unblock();
			unblockRef.current = null;
		};
	}, [shouldGuardLeaving, hasUnsavedChanges]);

	const onNext = async () => {
		await form.validateFields();

		const currentFormValues = form.getFieldsValue();
		let updatedFormData = {};

		updatedFormData = {
			...currentFormValues,
			loai: ELoaiPhieuDkCtdt.PERSONAL,
		};

		if (phieuDangKyHienTai?._id) await updatePhieuDangKy(phieuDangKyHienTai?._id, updatedFormData);

		setFormData(updatedFormData);
		setCurrentStep(currentStep + 1);
	};

	const onPrevious = () => {
		setCurrentStep(currentStep - 1);
	};

	const handleSubmit = async () => {
		try {
			await form.validateFields(['confirmCheckbox']);
			if (phieuDangKyHienTai?._id)
				await submitPhieuDangKy(
					phieuDangKyHienTai?._id,
					{
						loai: ELoaiPhieuDkCtdt.PERSONAL,
					},
					() => {
						navigateWithBypass(backToHistoryPath);
					},
				);
		} catch (error) {
			// Để Ant Design tự hiển thị lỗi đỏ tại các trường, không cần message.error chung chung gây nhiễu
		}
	};

	const handleLeaveWithSaveDraft = async () => {
		if (!pendingLeavePath) return;
		try {
			setIsSavingDraftBeforeLeave(true);
			await saveDraft(true);
			setIsLeaveModalOpen(false);
			setPendingLeavePath(null);
			navigateWithBypass(pendingLeavePath);
		} catch (error) {
			// updatePhieuDangKy đã xử lý thông báo lỗi
		} finally {
			setIsSavingDraftBeforeLeave(false);
		}
	};

	const handleLeaveWithoutSave = () => {
		if (!pendingLeavePath) return;
		setIsLeaveModalOpen(false);
		setPendingLeavePath(null);
		navigateWithBypass(pendingLeavePath);
	};

	const renderStepContent = () => {
		switch (currentStep) {
			case 0:
				return <StepBasicInfo onNext={onNext} onSaveDraft={handleSaveDraft} form={form} />;
			case 1:
				return (
					<StepSelectAdvisor
						isMinor={isMinor}
						onPrevious={onPrevious}
						onNext={onNext}
						onSaveDraft={handleSaveDraft}
						form={form}
					/>
				);
			case 2:
				return <StepProgramDesign onPrevious={onPrevious} onNext={onNext} onSaveDraft={handleSaveDraft} form={form} />;
			case 3:
				return (
					<StepReviewSubmit
						onPrevious={onPrevious}
						onSubmit={handleSubmit}
						onSaveDraft={handleSaveDraft}
						formData={formData}
					/>
				);
			default:
				return null;
		}
	};

	return (
		<PageCard
			hideInnerCard
			title={pageTitle}
			className='card-big-title'
			extra={
				<Breadcrumb
					items={[
						{ title: intl.formatMessage({ id: 'minor.build.breadcrumb.study' }) },
						{
							title: breadcrumbTitle,
							onClick: () => history.push('/hoc-tap/dang-ky-chuyen-nganh/register?loai=' + loai),
						},
						{ title: isMinor ? 'IDM' : 'IDC' },
					]}
				/>
			}
		>
			<Modal
				title={intl.formatMessage({ id: 'minor.build.leaveModal.title' })}
				open={isLeaveModalOpen}
				onCancel={() => {
					setIsLeaveModalOpen(false);
					setPendingLeavePath(null);
				}}
				maskClosable={false}
				closable={!isSavingDraftBeforeLeave}
				footer={[
					<Button
						key='stay'
						onClick={() => {
							setIsLeaveModalOpen(false);
							setPendingLeavePath(null);
						}}
						disabled={isSavingDraftBeforeLeave}
					>
						{intl.formatMessage({ id: 'minor.build.leaveModal.stay' })}
					</Button>,
					<Button key='leave' onClick={handleLeaveWithoutSave} disabled={isSavingDraftBeforeLeave}>
						{intl.formatMessage({ id: 'minor.build.leaveModal.leaveWithoutSave' })}
					</Button>,
					<Button key='save' type='primary' loading={isSavingDraftBeforeLeave} onClick={handleLeaveWithSaveDraft}>
						{intl.formatMessage({ id: 'minor.build.leaveModal.saveAndLeave' })}
					</Button>,
				]}
			>
				{intl.formatMessage({ id: 'minor.build.leaveModal.description' })}
			</Modal>
			<Row gutter={[16, 16]}>
				<Col xs={24} lg={24}>
					<Card variant='borderless' style={{ height: 'fit-content', marginBottom: 16 }}>
						<Row gutter={[0, 16]}>
							<Col span={24}>
								<AlertBanners type={loai as 'minor' | 'concentration'} buttonRegister={false} />
							</Col>
							<Steps
								labelPlacement='vertical'
								current={currentStep}
								onChange={(step) => {
									if (step <= currentStep) {
										setCurrentStep(step);
									}
								}}
							>
								{steps.map((step, index) => (
									<Steps.Step
										key={index}
										title={step}
										status={index < currentStep ? 'finish' : index === currentStep ? 'process' : 'wait'}
									/>
								))}
							</Steps>
						</Row>
					</Card>
					<Card title={steps[currentStep] ?? ''} style={{ height: 'fit-content' }}>
						<Form form={form} layout='vertical'>
							{renderStepContent()}
						</Form>
					</Card>
				</Col>
				{/* Bỏ theo yêu cầu của BA => lúc nào xóa hẳn thì xóa */}
				{/* <SidebarRequirements /> */}
			</Row>
		</PageCard>
	);
};

export default IDMPage;
