import { ETrangThaiDangKyChuyenNganh } from '@/services/DaoTao/DangKyChuyenNganh/constant';
import { ELoaiPhieuDkCtdt } from '@/services/DaoTao/PhieuDkyCTDT/constant';
import { Alert, Breadcrumb, Button, Card, Col, Form, message, Modal, Row, Space, Steps } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import { history, useIntl, useLocation, useModel } from 'umi';
import AlertBanners from '../History/components/AlertBanners';
// import SidebarRequirements from './components/SidebarRequirements';
import PageCard from '@/components/PageCard';
import StepBasicInfo from './components/steps/StepBasicInfo';
import StepProgramDesign from './components/steps/StepProgramDesign';
import StepReviewSubmit from './components/steps/StepReviewSubmit';
import StepSelectAdvisor from './components/steps/StepSelectAdvisor';

const IDMPage = () => {
	const intl = useIntl();
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const loai = searchParams.get('loai') || 'minor';
	const id = searchParams.get('id');

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
		fetchChiTietPhieuDangKy,
		updatePhieuDangKy,
		loading,
		formSubmiting,
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
		if (id) {
			fetchChiTietPhieuDangKy(id);
		} else if (dotDangKy?._id) {
			fetchPhieuDangKyHienTai(dotDangKy?._id);
		}
	}, [id, dotDangKy?._id]);

	useEffect(() => {
		if (phieuDangKyHienTai?._id && !hasInitializedStep) {
			const initialValues = {
				...phieuDangKyHienTai,
				loai: ELoaiPhieuDkCtdt.PERSONAL, // CustomBuild luôn là PERSONAL
				hasDiscussedWithAdvisor:
					phieuDangKyHienTai?.hasDiscussedWithAdvisor ?? !!phieuDangKyHienTai?.hoTenCoVanHocTapPhu,
				// Luôn yêu cầu user tự tick xác nhận mỗi lần chỉnh sửa
				confirmCheckbox: undefined,
			};

			setFormData((prev: any) => ({
				...prev,
				...initialValues,
			}));

			form.setFieldsValue(initialValues);

			// Nếu phiếu chưa đúng loại PERSONAL (vd: vừa init từ API với DEFAULT),
			// cập nhật ngay để đảm bảo loại đúng ngay cả khi user không thao tác gì
			if (phieuDangKyHienTai?.loai !== ELoaiPhieuDkCtdt.PERSONAL) {
				updatePhieuDangKy(phieuDangKyHienTai._id, {
					...phieuDangKyHienTai,
					loai: ELoaiPhieuDkCtdt.PERSONAL,
				});
			}

			// Xác định bước hiện tại dựa trên dữ liệu đã có
			if (phieuDangKyHienTai?.khoiHpCtList?.length && phieuDangKyHienTai?.khoiHpCtList?.length > 0) {
				setCurrentStep(3);
			} else if (phieuDangKyHienTai?.maCoVanHocTapPhu && phieuDangKyHienTai?.maCoVanHocTapPhu !== '') {
				setCurrentStep(2);
			} else if (phieuDangKyHienTai?.soDienThoai && phieuDangKyHienTai?.soDienThoai !== '') {
				setCurrentStep(1);
			}

			setHasInitializedStep(true);
		}
	}, [phieuDangKyHienTai?._id, hasInitializedStep, form]);

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

	const canEdit = useMemo(() => {
		if (!phieuDangKyHienTai) return true;
		const { trangThai, trangThaiDuyetCVHT, trangThaiDuyetKhoaBoMon, trangThaiDuyetQldt } = phieuDangKyHienTai;

		// 1. Các trạng thái mặc định được sửa
		if ([ETrangThaiDangKyChuyenNganh.NHAP, ETrangThaiDangKyChuyenNganh.YEU_CAU_CHINH_SUA].includes(trangThai as any)) {
			return true;
		}

		// 2. Trạng thái CHO_DUYET nhưng CHƯA AI duyệt
		if (trangThai === ETrangThaiDangKyChuyenNganh.CHO_DUYET) {
			return (
				trangThaiDuyetCVHT === ETrangThaiDangKyChuyenNganh.CHO_DUYET &&
				trangThaiDuyetKhoaBoMon === ETrangThaiDangKyChuyenNganh.CHO_DUYET &&
				trangThaiDuyetQldt === ETrangThaiDangKyChuyenNganh.CHO_DUYET
			);
		}

		return false;
	}, [phieuDangKyHienTai]);

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
		const phieuId = phieuDangKyHienTai?._id || id;
		if (!phieuId) return;
		if (!force && !hasUnsavedChanges) return;
		const currentFormValues = form.getFieldsValue(true);

		// Fallback logic for draft naming
		const tenChuongTrinh =
			currentFormValues.tenChuongTrinh ||
			intl.formatMessage({
				id: isMinor ? 'minor.idm.fallback.title.minor' : 'minor.idm.fallback.title.concentration',
			});
		const mucTieuLyDo = currentFormValues.mucTieuLyDo || intl.formatMessage({ id: 'minor.idm.fallback.rationale' });

		// bỏ đi các trường thông tin không cần thiêt, chỉ cấn id/ma sẽ populate được các thông tin khác
		const cleanFormValues = Object.fromEntries(Object.entries(currentFormValues).filter(([_, v]) => v !== undefined));

		const {
			idDonViPhuTrach: _,
			tenDonViPhuTrach: __,
			hoTenCoVanHocTapChinh: ___,
			emailCoVanHocTapChinh: ____,
			hoTenCoVanHocTapPhu: _____,
			emailCoVanHocTapPhu: ______,
			// ---
			...restValues
		} = cleanFormValues;

		const payload = {
			...phieuDangKyHienTai,
			...formData,
			...restValues,
			tenChuongTrinh,
			mucTieuLyDo,
			loai: ELoaiPhieuDkCtdt.PERSONAL,  // CustomBuild luôn là PERSONAL
		};
		await updatePhieuDangKy(phieuId, payload);
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

		const allValues = form.getFieldsValue(true);
		// Lọc bỏ các giá trị undefined để tránh ghi đè dữ liệu cũ khi field bị unmount
		const cleanValues = Object.fromEntries(Object.entries(allValues).filter(([_, v]) => v !== undefined));

		const updatedFormData = {
			...formData,
			...cleanValues,
			loai: ELoaiPhieuDkCtdt.PERSONAL,
		};

		// Nếu đang ở trạng thái Nháp, ta lưu trung gian.
		// Nếu đang Request Revision hoặc Pending, ta chỉ set state local, việc update sẽ dồn vào nút "Cập nhật/Gửi" ở bước cuối
		// để tránh tình trạng API trả về dữ liệu cũ và ghi đè state.
		const isDraft = phieuDangKyHienTai?.trangThai === ETrangThaiDangKyChuyenNganh.NHAP;

		if (phieuDangKyHienTai?._id && isDraft) {
			// bỏ đi các trường thông tin không cần thiêt, chỉ cấn id/ma sẽ populate được các thông tin khác
			const {
				idDonViPhuTrach: _,
				tenDonViPhuTrach: __,
				hoTenCoVanHocTapChinh: ___,
				emailCoVanHocTapChinh: ____,
				hoTenCoVanHocTapPhu: _____,
				emailCoVanHocTapPhu: ______,
				// ---
				...restUpdatedData
			} = updatedFormData;
			await updatePhieuDangKy(phieuDangKyHienTai?._id, restUpdatedData);
		}

		setFormData(updatedFormData);
		setCurrentStep(currentStep + 1);
	};

	const onPrevious = () => {
		const allValues = form.getFieldsValue(true);
		const cleanValues = Object.fromEntries(Object.entries(allValues).filter(([_, v]) => v !== undefined));

		const newFormData = { ...formData, ...cleanValues };
		setFormData(newFormData);
		form.setFieldsValue(newFormData);
		setCurrentStep(currentStep - 1);
	};

	const handleSubmit = async () => {
		try {
			try {
				await form.validateFields(['confirmCheckbox']);
			} catch (validationError) {
				message.error(intl.formatMessage({ id: 'minor.idm.review.confirmRequired' }));
				return;
			}

			const phieuId = phieuDangKyHienTai?._id || id;
			if (phieuId) {
				const allValues = form.getFieldsValue(true);
				// Loại bỏ các trường metadata không cần thiết hoặc trường chỉ dùng để hiển thị (Tên/Email) để payload gọn và đúng yêu cầu chỉ gửi 'Mã'
				const { updatedAt, dot, ctdt, chuyenNganh, ...cleanRecord } = phieuDangKyHienTai || {};
				const {
					idDonViPhuTrach: _,
					tenDonViPhuTrach: __,
					hoTenCoVanHocTapChinh: ___,
					emailCoVanHocTapChinh: ____,
					hoTenCoVanHocTapPhu: _____,
					emailCoVanHocTapPhu: ______,
					...restAllValues
				} = allValues;

				const payload = {
					...cleanRecord,
					...formData, // <-- Kết hợp formData để không mất dữ liệu các bước trước
					...restAllValues,
					loai: ELoaiPhieuDkCtdt.PERSONAL,
				};
				await submitPhieuDangKy(phieuId, payload, () => {
					navigateWithBypass(backToHistoryPath);
				});
			} else {
				message.error('Lỗi: Không tìm thấy ID phiếu đăng ký!');
			}
		} catch (error) {
			console.error('LỖI KHI XÁC NHẬN SUBMIT:', error);
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
		// Dùng formData?.trangThai để lấy trạng thái gốc khi vừa load trang
		// Tránh việc gọi API lưu trung gian ở các bước làm BE trả về trạng thái "Nháp" và hiện lại nút.
		const isPending = formData?.trangThai === ETrangThaiDangKyChuyenNganh.CHO_DUYET;
		const isRequestRevision = formData?.trangThai === ETrangThaiDangKyChuyenNganh.YEU_CAU_CHINH_SUA;
		const commonProps = {
			form,
			loading,
			submitLoading: formSubmiting,
			canEdit,
			onSaveDraft: (isPending || isRequestRevision) ? undefined : handleSaveDraft,
		};

		switch (currentStep) {
			case 0:
				return <StepBasicInfo {...commonProps} isMinor={isMinor} onNext={onNext} />;
			case 1:
				return <StepSelectAdvisor {...commonProps} isMinor={isMinor} onPrevious={onPrevious} onNext={onNext} />;
			case 2:
				return <StepProgramDesign {...commonProps} isMinor={isMinor} onPrevious={onPrevious} onNext={onNext} />;
			case 3:
				return (
					<StepReviewSubmit
						{...commonProps}
						trangThai={phieuDangKyHienTai?.trangThai}
						onPrevious={onPrevious}
						onSubmit={handleSubmit}
						formData={formData}
						isMinor={isMinor}
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

							{[
								ETrangThaiDangKyChuyenNganh.YEU_CAU_CHINH_SUA,
								ETrangThaiDangKyChuyenNganh.CHO_DUYET,
							].includes(phieuDangKyHienTai?.trangThai as any) && (
								<Col span={24}>
									<Space direction='vertical' style={{ width: '100%' }} size='small'>
										{phieuDangKyHienTai?.ghiChuCVHT && (
											<Alert
												message={intl.formatMessage({ id: 'minor.feedback.advisor' })}
												description={phieuDangKyHienTai.ghiChuCVHT}
												type='warning'
												showIcon
											/>
										)}
										{phieuDangKyHienTai?.ghiChuBoMon && (
											<Alert
												message={intl.formatMessage({ id: 'minor.feedback.department' })}
												description={phieuDangKyHienTai.ghiChuBoMon}
												type='warning'
												showIcon
											/>
										)}
										{phieuDangKyHienTai?.ghiChuQldt && (
											<Alert
												message={intl.formatMessage({ id: 'minor.feedback.admin' })}
												description={phieuDangKyHienTai.ghiChuQldt}
												type='warning'
												showIcon
											/>
										)}
									</Space>
								</Col>
							)}
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
						<Form form={form} layout='vertical' disabled={!canEdit} preserve>
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
